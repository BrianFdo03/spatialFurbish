const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../models/Order");

/* -------------------------------------------------------
   ROUTE 2: PAYHERE NOTIFY URL (SERVER CALLBACK)
-------------------------------------------------------- */
router.post("/notify", async (req, res) => {
  console.log("🔥🔥🔥 PAYHERE NOTIFY HIT 🔥🔥🔥");
  // console.log("BODY:", req.body);

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("❌ Empty notify body");
      return;
    }

    const { order_id, status_code, payment_id } = req.body;

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
    res.status(200).send("OK");
  } catch (err) {
    console.error("🔥 PayHere notify error:", err);
  }
});

module.exports = router;
