const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../models/Order");

/* -------------------------------------------------------
   ROUTE 1: CREATE HASH (Frontend calls this before payment)
-------------------------------------------------------- */
router.post("/create-hash", async (req, res) => {
  try {
    const { order_id, amount, currency } = req.body;

    const merchant_id = process.env.PAYHERE_MERCHANT_ID;
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchant_id || !merchant_secret) {
      return res.status(500).json({
        error: "PayHere credentials not configured",
      });
    }

    // PayHere requires amount formatted to 2 decimals
    const formattedAmount = Number(amount).toFixed(2);

    // Hash merchant secret
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchant_secret)
      .digest("hex")
      .toUpperCase();

    // Final hash string
    const hashString =
      merchant_id + order_id + formattedAmount + currency + hashedSecret;

    const hash = crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    return res.json({
      merchant_id,
      amount: formattedAmount,
      hash,
    });
  } catch (err) {
    console.error("❌ Hash generation failed:", err);
    res.status(500).json({ error: "Failed to generate hash" });
  }
});

/* -------------------------------------------------------
   ROUTE 2: PAYHERE NOTIFY URL (SERVER CALLBACK)
-------------------------------------------------------- */
router.post("/notify", async (req, res) => {
  console.log("🔥🔥🔥 PAYHERE NOTIFY HIT 🔥🔥🔥");
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  res.status(200).send("OK");

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("❌ Empty notify body");
      return;
    }

    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    /* -------------------------------
       VERIFY PAYHERE SIGNATURE
    -------------------------------- */
    const localMd5Secret = crypto
      .createHash("md5")
      .update(merchant_secret)
      .digest("hex")
      .toUpperCase();

    const verificationString =
      merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      localMd5Secret;

    const generatedSig = crypto
      .createHash("md5")
      .update(verificationString)
      .digest("hex")
      .toUpperCase();

    if (generatedSig !== md5sig) {
      console.error("⛔ PayHere signature mismatch");
      return;
    }

    /* -------------------------------
       FIND ORDER
    -------------------------------- */
    const order = await Order.findOne({ orderId: order_id });

    if (!order) {
      console.error("❌ Order not found:", order_id);
      return;
    }

    /* -------------------------------
       MAP STATUS CODES
       2  = Success
       0  = Pending
      -1  = Cancelled
      -2  = Failed
      -3  = Charged Back
    -------------------------------- */
    let socketStatus = "pending";

    if (Number(status_code) === 2) {
      order.paymentStatus = "Success";
      order.status = "Success";
      order.paymentId = payment_id;
      socketStatus = "success";
    } else if (Number(status_code) === 0) {
      order.paymentStatus = "Pending";
      socketStatus = "pending";
    } else if (Number(status_code) === -3) {
      order.paymentStatus = "Charged Back";
      order.status = "Cancelled";
      socketStatus = "failed";
    } else {
      order.paymentStatus = "Failed";
      order.status = "Cancelled";
      socketStatus = "failed";
    }

    await order.save();

    /* -------------------------------
       EMIT SOCKET EVENT
    -------------------------------- */
    const io = req.app.get("socketio");
    if (io) {
      io.emit("payment-status", {
        orderId: order.orderId,
        status: socketStatus,
      });
    }

    console.log(`✅ PayHere update: ${order.orderId} → ${order.paymentStatus}`);
  } catch (err) {
    console.error("🔥 PayHere notify error:", err);
  }
});

module.exports = router;
