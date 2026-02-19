import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { dashboardAPI } from "@/services/api";

interface Order {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: string;
  status: string;
  paymentStatus: string;
}

// Helper for payment status badge colors
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
      return "Payment Processing";
  }
};

export function RecentOrders({ refreshKey }: { refreshKey?: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, [refreshKey]);

  const fetchRecentOrders = async () => {
    try {
      const data = await dashboardAPI.getRecentOrders(5);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-stone-800">
          Recent Orders
        </CardTitle>
        <button className="text-sm text-stone-500 hover:text-stone-900 font-medium">
          View All
        </button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            No recent orders found
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-stone-50">
              <TableRow>
                <TableHead className="font-medium">Order ID</TableHead>
                <TableHead className="font-medium">Customer</TableHead>
                <TableHead className="font-medium">Product</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-b-stone-100 hover:bg-stone-50/50"
                >
                  <TableCell className="font-medium text-stone-800">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-stone-600">
                    {order.customer}
                  </TableCell>
                  <TableCell className="text-stone-600">
                    {order.product}
                  </TableCell>
                  <TableCell className="text-stone-500 text-sm">
                    {order.date}
                  </TableCell>
                  <TableCell className="font-medium text-stone-800">
                    {order.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`shadow-none font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
