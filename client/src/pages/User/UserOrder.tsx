import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { useEffect, useState } from "react";
import { orderAPI } from "@/services/api";
import { Package } from "lucide-react";

export function UserOrder() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch user orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-gray-500";
      case "Success":
        return "bg-green-500";
      case "Shipped":
        return "bg-purple-500";
      case "Delivered":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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
          <div className="flex items-center gap-2 mb-12">
            <h1 className="font-serif text-3xl text-stone-800 uppercase">
              My Orders
            </h1>
            <div className="h-px bg-stone-300 flex-grow max-w-[50px]"></div>
          </div>

          {loading ? (
            <p>Loading your orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-stone-500">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="border border-stone-100 rounded-lg p-6 hover:shadow-sm transition"
                >
                  <div className="flex justify-between items-start mb-6 border-b border-stone-50 pb-4">
                    <div>
                      <p className="text-sm text-stone-500 uppercase tracking-wide mb-1">
                        Order ID
                      </p>
                      <p className="font-medium text-stone-800">
                        {order.orderId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-500 uppercase tracking-wide mb-1">
                        Date
                      </p>
                      <p className="font-medium text-stone-800">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Display only the first few items or all items */}
                    {order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                      >
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-20 bg-[#f4f2ed] flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-stone-300" />
                            )}
                          </div>

                          <div>
                            <h3 className="font-serif text-lg text-stone-800 mb-1">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-stone-600 mb-2">
                              <span className="text-stone-800 font-medium">
                                ${item.price}
                              </span>
                              <span>Quantity: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-50">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${getStatusColor(order.status)}`}
                      ></div>
                      <span className="text-sm font-medium text-stone-600">
                        {order.status}
                      </span>
                    </div>
                    <p className="font-serif text-xl text-stone-800">
                      Total: {order.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
