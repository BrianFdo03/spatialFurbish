import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardAPI } from "@/services/api";

interface Stat {
  label: string;
  value: string;
  growth: string;
  icon: any;
}

export function DashboardStats({ refreshKey }: { refreshKey?: number }) {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Total Revenue",
      value: "$0.00",
      growth: "+0%",
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: "0",
      growth: "+0%",
      icon: ShoppingCart,
    },
    {
      label: "Total Users",
      value: "0",
      growth: "+0%",
      icon: Users,
    },
    {
      label: "Total Products",
      value: "0",
      growth: "+0%",
      icon: Package,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [refreshKey]);

  const fetchDashboardStats = async () => {
    try {
      const data = await dashboardAPI.getStats();

      const updatedStats = [
        {
          label: "Total Revenue",
          value: `$${data.totalRevenue.value.toFixed(2)}`,
          growth: data.totalRevenue.growth,
          icon: DollarSign,
        },
        {
          label: "Total Orders",
          value: data.totalOrders.value.toString(),
          growth: data.totalOrders.growth,
          icon: ShoppingCart,
        },
        {
          label: "Total Users",
          value: data.totalCustomers.value.toString(),
          growth: data.totalCustomers.growth,
          icon: Users,
        },
        {
          label: "Total Products",
          value: data.totalProducts.value.toString(),
          growth: data.totalProducts.growth,
          icon: Package,
        },
      ];

      setStats(updatedStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-stone-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-stone-600" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.growth}
              </span>
            </div>
            <p className="text-sm text-stone-500 font-medium mb-1">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-stone-800">{stat.value}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
