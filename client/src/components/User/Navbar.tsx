import { Search, User, ShoppingBag, LogOut, LogIn, Trello } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  brand: string;
  links: { label: string; href: string }[];
  onSearch?: (query: string) => void;
  searchQuery?: string;
  showSearch?: boolean;
  products?: any[];
}

export function Navbar({
  brand,
  links,
  onSearch,
  searchQuery = "",
  showSearch = false,
  products = [],
}: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const { handleLogout, isLoading } = useLogout();
  const { user, loading } = useAuth();

  // Filter products based on search query for recommendations
  const recommendations = searchQuery
    ? products
        .filter((product) => {
          const searchLower = searchQuery.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower)
          );
        })
        .slice(0, 5) // Show max 5 recommendations
    : [];

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    if (isProfileOpen || isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isSearchOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fcfaf8]/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-serif font-bold text-stone-900 tracking-tight"
          >
            {brand}
          </Link>

          {/* NAV LINKS (JOURNAL REMOVED COMPLETELY) */}
          <div className="hidden md:flex items-center space-x-12">
            {links
              .filter((link) => link.label !== "Journal")
              .map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`text-sm font-medium transition-colors uppercase tracking-wide pb-1 border-b-2 ${
                      isActive
                        ? "text-stone-900 border-stone-900"
                        : "text-stone-600 hover:text-stone-900 border-transparent hover:border-stone-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </div>

          {/* ICONS */}
          <div className="flex items-center space-x-6">
            {showSearch && (
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-stone-200 rounded-sm shadow-lg overflow-hidden">
                    <div className="p-3">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-sm text-sm focus:outline-none focus:border-stone-900"
                        autoFocus
                      />
                    </div>

                    {/* Recommendations */}
                    {searchQuery && (
                      <div className="border-t border-stone-200 max-h-96 overflow-y-auto">
                        {recommendations.length > 0 ? (
                          <div>
                            <div className="px-3 py-2 text-xs text-stone-500 bg-stone-50">
                              Suggestions
                            </div>
                            {recommendations.map((product) => (
                              <Link
                                key={product._id}
                                to={`/Shop`}
                                className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0"
                                onClick={() => setIsSearchOpen(false)}
                              >
                                <div className="w-12 h-12 flex-shrink-0 bg-stone-100 rounded overflow-hidden">
                                  {product.images &&
                                  product.images.length > 0 ? (
                                    <img
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                                      <Search className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-stone-900 truncate">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-stone-500 truncate">
                                    {product.category}
                                  </div>
                                  <div className="text-sm font-bold text-stone-900 mt-1">
                                    ${product.price}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-stone-500">
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!loading &&
              (user?.role === "admin" ? (
                <Link
                  to="/dashboard"
                  className="text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wide"
                >
                  <Trello className="w-4 h-4" />
                </Link>
              ) : (
                <></>
              ))}

            {!loading &&
              (user?.role === "staff" ? (
                <Link
                  to="/products"
                  className="text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wide"
                >
                  <Trello className="w-4 h-4" />
                </Link>
              ) : (
                <></>
              ))}

            {/* User Profile Icon  - Ravindu*/}
            <Link to="/profile" className="text-stone-600 hover:text-stone-900 transition-colors">
              <User className="w-5 h-5" />
            </Link> 

            <Link
              to="/cart"
              className="relative text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-stone-900 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {!loading &&
              (user ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  disabled={isLoading}
                  className="relative text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wide"
                >
                  <LogIn className="w-4 h-4" />
                </Link>
              ))}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-80 p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-stone-900">
              Confirm Logout
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Are you sure you want to logout?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-sm text-stone-600 hover:text-stone-900"
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleLogout();
                  setShowLogoutConfirm(false);
                }}
                className="px-4 py-2 text-sm bg-stone-900 text-white hover:bg-stone-800"
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
