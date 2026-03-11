import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { useCart } from "@/context/CartContext";
import { orderAPI, paymentAPI } from "@/services/api";
import toast from "react-hot-toast";

export function PlaceOrder() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const { subtotal, shippingFee, total, cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [payHereData, setPayHereData] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Assuming fullName is "First Last" - simple split
        const names = user.fullName ? user.fullName.split(" ") : ["", ""];
        setFormData((prev) => ({
          ...prev,
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          email: user.email || "",
        }));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Basic Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.zipCode ||
      !formData.country ||
      !formData.phone
    ) {
      toast.error("Please fill in all delivery information.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // Check if user is logged in
      const userStr = localStorage.getItem("user");
      const isLoggedIn = !!userStr;

      // Prepare order data structure
      const customerName = `${formData.firstName} ${formData.lastName}`;

      // For PayHere, we need a unique temporary ID if creating order first
      // But ideally we create the order in DB to get the real ID
      const tempPaymentId = "PENDING_PAYHERE";

      let orderResponse;
      const orderPayload = {
        customer: customerName,
        email: formData.email,
        total: `$${total.toFixed(2)}`,
        paymentId: tempPaymentId,
        paymentMethod: "PayHere",
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      // 1. Create Order in Backend (Pending State)
      if (isLoggedIn) {
        orderResponse = await orderAPI.create(orderPayload);
      } else {
        orderResponse = await orderAPI.createGuest(orderPayload);
      }

      // Fix: Access the nested 'order' object from the response
      const newOrder =
        orderResponse.order || orderResponse.data || orderResponse;
      const orderId = newOrder.orderId || newOrder._id;

      if (!orderId) {
        throw new Error("Failed to retrieve Order ID from server");
      }

      // 2. Generate Hash for PayHere
      const hashResponse = await paymentAPI.createHash({
        order_id: orderId,
        amount: total,
        currency: "USD",
      });

      // 3. Populate Form Data
      setPayHereData({
        merchant_id: hashResponse.merchant_id,
        return_url: `${window.location.origin}/user-order`, // Success Page
        cancel_url: `${window.location.origin}/cart`, // Cancel Page
        notify_url: "https://api.lumierecosmetics.site/api/payment/notify",
        // "http://ec2-54-169-103-14.ap-southeast-1.compute.amazonaws.com:3000/api/payment/notify",
        order_id: orderId,
        items: "Lumiere Skincare Products",
        currency: "USD",
        amount: hashResponse.amount, // Use the EXACT string from server
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.street,
        city: formData.city,
        country: formData.country,
        hash: hashResponse.hash,
      });

      // 4. Submit Form (allow small delay for state update)
      toast.loading("Redirecting to PayHere...");
      setTimeout(() => {
        formRef.current?.submit();
      }, 100);
      // Don't clear cart yet, wait for success return
      return;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to place order.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        brand="LUMIÈRE"
        links={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "About", href: "/about" },
        ]}
      />

      <main className="bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* LEFT SIDE - DELIVERY INFORMATION */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <h2 className="font-serif text-2xl text-stone-800">
                  DELIVERY INFORMATION
                </h2>
                <div className="h-px bg-stone-300 flex-grow max-w-[50px]"></div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                />

                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                  />
                </div>

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-stone-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-stone-500"
                />
              </form>
            </div>

            {/* RIGHT SIDE - CART TOTALS & PAYMENT */}
            <div>
              {/* CART TOTALS */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="font-serif text-xl text-stone-800 uppercase">
                    Cart Totals
                  </h2>
                  <div className="h-px bg-stone-300 flex-grow max-w-[50px]"></div>
                </div>

                <div className="space-y-4 text-sm text-stone-600">
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <p>Subtotal</p>
                    <p className="text-stone-800">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <p>Shipping Fee</p>
                    <p className="text-stone-800">${shippingFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-bold text-base text-stone-800 pt-2">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-black text-white px-10 py-3 text-sm uppercase tracking-wider hover:bg-stone-800 transition disabled:bg-stone-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Hidden PayHere Form */}
        <form
          ref={formRef}
          method="post"
          action="https://sandbox.payhere.lk/pay/checkout"
          style={{ display: "none" }}
        >
          <input
            type="hidden"
            name="merchant_id"
            value={payHereData?.merchant_id || ""}
          />
          <input
            type="hidden"
            name="return_url"
            value={payHereData?.return_url || ""}
          />
          <input
            type="hidden"
            name="cancel_url"
            value={payHereData?.cancel_url || ""}
          />
          <input
            type="hidden"
            name="notify_url"
            value={payHereData?.notify_url || ""}
          />
          <input
            type="hidden"
            name="order_id"
            value={payHereData?.order_id || ""}
          />
          <input type="hidden" name="items" value={payHereData?.items || ""} />
          <input
            type="hidden"
            name="currency"
            value={payHereData?.currency || ""}
          />
          <input
            type="hidden"
            name="amount"
            value={payHereData?.amount || ""}
          />
          <input
            type="hidden"
            name="first_name"
            value={payHereData?.first_name || ""}
          />
          <input
            type="hidden"
            name="last_name"
            value={payHereData?.last_name || ""}
          />
          <input type="hidden" name="email" value={payHereData?.email || ""} />
          <input type="hidden" name="phone" value={payHereData?.phone || ""} />
          <input
            type="hidden"
            name="address"
            value={payHereData?.address || ""}
          />
          <input type="hidden" name="city" value={payHereData?.city || ""} />
          <input
            type="hidden"
            name="country"
            value={payHereData?.country || ""}
          />
          <input type="hidden" name="hash" value={payHereData?.hash || ""} />
        </form>
      </main>

      <Footer
        brand="SpatialFurbish"
        data={{
          brand_description: "Visualizing Comfort, Precisely Modeled",
          social_links: [
            { platform: "facebook", url: "#" },
            { platform: "instagram", url: "#" },
            { platform: "youtube", url: "#" }
          ],
          links: [
            { label: "Privacy", href: "#" },
            { label: "Trends", href: "#" },
            { label: "Contact", href: "#" }
          ],
          copyright: "© 2026 SpatialFurbish furnitures. All rights reserved.",
        }}
      />
    </>
  );
}
