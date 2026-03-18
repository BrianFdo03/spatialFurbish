import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { useCart } from "@/context/CartContext";
import { orderAPI, paymentAPI } from "@/services/api";
import toast from "react-hot-toast";

export function PlaceOrder() {
  const { subtotal, shippingFee, total, cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

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
      const tempPaymentId = "PAYHERE";

      let orderResponse;
      const orderPayload = {
        customer: customerName,
        email: formData.email,
        total: `$${total.toFixed(2)}`,
        paymentId: tempPaymentId,
        paymentMethod: "PayHere",
        status: "Success", // mark order success immediately
        paymentStatus: "Success",
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

      if (!orderId) throw new Error("Failed to get order ID");

      // Call /notify to simulate payment and trigger socket
      await paymentAPI.notify({
        merchant_id: tempPaymentId,
        order_id: orderId,
        payment_id: tempPaymentId,
        payhere_amount: total.toFixed(2),
        payhere_currency: "USD",
        status_code: 2, // 2 = Success
      });

      // Clear cart (using your CartContext)
      await clearCart();

      // Redirect to user orders page
      window.location.href = "/user-order";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to place order.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        brand="SpatialFurbish"
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
      </main>

      <Footer
        brand="SpatialFurbish"
        data={{
          brand_description:
            "Natural skincare designed for balance, simplicity, and care.",
          links: [
            { label: "All Products", href: "/shop" },
            { label: "Best Sellers", href: "/shop" },
            { label: "New Arrivals", href: "/shop" },
          ],
          contact: {
            email: "hello@spatialfurbish.com",
            phone: "+1 (555) 123-4567",
          },
          copyright: "© 2025 SpatialFurbish. All rights reserved.",
        }}
      />
    </>
  );
}
