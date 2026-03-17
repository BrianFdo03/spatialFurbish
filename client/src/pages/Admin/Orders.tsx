import { Layout } from "@/components/Dashboard/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { orderAPI } from "@/services/api";
import toast from "react-hot-toast";
import { useSocket } from "@/context/SocketContext";

/* -----------------------------
   Payment Status Helpers
------------------------------ */
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Success":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Failed":
    case "Cancelled":
    case "Charged Back":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-stone-100 text-stone-600 border-stone-200";
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case "Success":
      return "Payment Success";
    case "Pending":
      return "Payment Processing";
    case "Failed":
    case "Cancelled":
    case "Charged Back":
      return "Payment Unsuccessful";
    default:
      return "Payment Processing"; // Default fallback
      return "Payment Processing";
  }
};

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { socket, isConnected } = useSocket();

  /* -----------------------------
     Initial Fetch
  ------------------------------ */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Socket Listeners
  ------------------------------ */
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewOrder = (newOrder: any) => {
      setOrders((prev) => [newOrder, ...prev]);
      toast.success(`New Order Received: ${newOrder.orderId}`, {
        icon: "🛍️",
        duration: 5000,
      });
    };

    const handlePaymentStatus = (data: {
      orderId: string;
      status: string;
    }) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === data.orderId
            ? {
              ...order,
              paymentStatus:
                data.status === "success"
                  ? "Success"
                  : data.status === "failed"
                    ? "Failed"
                    : data.status === "cancelled"
                      ? "Cancelled"
                      : data.status === "pending"
                        ? "Pending"
                        : order.paymentStatus,
            }
            : order
        )
      );

      if (data.status === "success") {
        toast.success(`Payment Success for ${data.orderId}`);
      } else if (data.status === "failed") {
        toast.error(`Payment Failed for ${data.orderId}`);
      }
    };

    socket.on("new-order", handleNewOrder);
    socket.on("payment-status", handlePaymentStatus);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("payment-status", handlePaymentStatus);
    };
  }, [socket, isConnected]);

  /* -----------------------------
     View Order (FIXED)
  ------------------------------ */
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <Layout title="Orders">
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-stone-50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      className={`border ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* -----------------------------
          Order Details Dialog
      ------------------------------ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View order information and status
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <p><b>Order ID:</b> {selectedOrder.orderId}</p>
              <p><b>Customer:</b> {selectedOrder.customer}</p>
              <p><b>Total:</b> {selectedOrder.total}</p>

              <div className="space-y-2">
                {selectedOrder.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-stone-50 p-3 rounded"
                  >
                    <div className="w-12 h-12 bg-white border rounded flex items-center justify-center">
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
                    <div className="flex-grow">
                      <p>{item.name}</p>
                      <p className="text-sm text-stone-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <p>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}