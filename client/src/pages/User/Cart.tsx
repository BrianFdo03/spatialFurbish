import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, subtotal, shippingFee, total } = useCart();

  return (
    <>
      <Navbar
        brand="LUMIÈRE"
        links={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/Shop" },
          { label: "About", href: "/about" },
        ]}
      />

      <main className="bg-[#fcfaf8] min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-serif text-3xl mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-8">
              {cart.length === 0 && (
                <p className="text-stone-500">Your cart is empty.</p>
              )}

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-6"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-[#f4f2ed] flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full"
                      />
                    </div>

                    <div>
                      <h3 className="font-serif text-lg">{item.name}</h3>
                      <p className="text-sm text-stone-600">
                        ${item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="border px-2 py-1"
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="border px-2 py-1"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm flex items-center gap-1 mt-2"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-xl p-8 shadow-sm h-fit">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>

              <div className="flex justify-between text-sm mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm mb-6">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? "text-stone-600" : ""}>
                  {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between font-medium text-lg mb-8">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button onClick={() => navigate('/place-order')} className="w-full bg-[#8a9b82] text-white py-4 text-sm uppercase tracking-wide hover:opacity-90 transition">
                Checkout →
              </button>

              <p className="text-xs text-center text-stone-500 mt-4">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
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
