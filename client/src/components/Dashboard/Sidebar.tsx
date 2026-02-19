// src/components/Sidebar.tsx
import { useLogout } from "@/hooks/useLogout";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Home,
  LogOut,
  //  Star (star is an icon for reviews,when needed uncomment it)
} from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Import these

export function Sidebar() {
  const location = useLocation(); // Gets the current URL path
  const { handleLogout, isLoading } = useLogout();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: FolderOpen, label: "Categories", path: "/categories" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Users, label: "Users", path: "/customers" },
    // discussed not to add reviews page now
    //  { icon: Star, label: "Reviews", path: "/reviews" },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#F3EFE0] p-6 flex flex-col justify-between border-r border-stone-200">
      <div>
        <h1 className="text-xl font-serif font-bold text-stone-800 mb-8 tracking-wide">
          SPATIALFURBISH ADMIN
        </h1>

        <nav className="space-y-2">
          {navItems.map((item) => {
            // Check if this item is active
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path} // This is the React Router link prop
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-600 hover:bg-stone-200/50"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 mt-auto">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Store
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
