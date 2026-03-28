import { Layout } from "@/components/Dashboard/Layout";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { RecentOrders } from "@/components/Dashboard/RecentOrders";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "@/context/SocketContext";

export function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const refreshDashboard = () => {
      setRefreshKey((prev) => prev + 1);
    };

    // 🆕 New Order
    const handleNewOrder = (order: any) => {
      refreshDashboard();
      toast.success(`New Order: ${order.orderId}`, { icon: "🛍️" });
    };

    // 🆕 Order Status Update
    const handleOrderStatusUpdate = (order: any) => {
      refreshDashboard();
      toast.success(
        `Order Status Update: \nOrder: ${order.orderId} \nStatus: ${order.status}`,
        { icon: "🛍️" },
      );
    };

    // 👤 New User Signup
    const handleNewUser = (user: any) => {
      refreshDashboard();
      toast.success(`New User: ${user.fullName}`, { icon: "👤" });
    };

    const handleUserDelete = (user: any) => {
      refreshDashboard();
      toast.success(`Deleted User: ${user}`, { icon: "👤" });
    };

    // 📦 Product Created
    const handleProductCreated = (product: any) => {
      refreshDashboard();
      toast.success(`Product Added: ${product.name}`, { icon: "📦" });
    };

    // ✏️ Product Updated
    const handleProductUpdated = (product: any) => {
      refreshDashboard();
      toast.success(`Product Updated: ${product.name}`, { icon: "✏️" });
    };

    // 🗑️ Product Deleted
    const handleProductDeleted = (data: { _id: string }) => {
      const id = data._id;
      console.log("Deleted Product ID:", id);
      refreshDashboard();
      toast.success(`Product Deleted`, { icon: "🗑️" });
    };

    socket.on("new-order", handleNewOrder);
    socket.on("payment-status", handleOrderStatusUpdate);
    socket.on("new-user", handleNewUser);
    socket.on("user:deleted", handleUserDelete);
    socket.on("product:created", handleProductCreated);
    socket.on("product:updated", handleProductUpdated);
    socket.on("product:deleted", handleProductDeleted);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("payment-status", handleOrderStatusUpdate);
      socket.off("new-user", handleNewUser);
      socket.off("user:deleted", handleUserDelete);
      socket.off("product:created", handleProductCreated);
      socket.off("product:updated", handleProductUpdated);
      socket.off("product:deleted", handleProductDeleted);
    };
  }, [socket, isConnected]);

  return (
    <Layout title="Dashboard Overview">
      <DashboardStats refreshKey={refreshKey} />
      <RecentOrders refreshKey={refreshKey} />
    </Layout>
  );
}
