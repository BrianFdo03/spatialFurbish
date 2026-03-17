import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { ProductCard } from "../../components/Dashboard/ProductCard";
import { Button } from "@/components/ui/button";
import { Armchair, Utensils, BedDouble, Presentation, Wrench, ArrowRight } from "lucide-react";
import { productAPI } from "@/services/api";
import { useSocket } from "@/context/SocketContext";
const data = {
  brand: "SpatialFurbish",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/Shop" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  hero: {
    headline: "Visualizing Comfort,Precisely Modeled",
    subheadline:
      "Create immersive 2D and 3D room layouts for customers using real-time scaling and shading tools.",
    cta_primary: "Shop Collection",
    cta_secondary: "Our Story",
    image:
      "https://i.pinimg.com/736x/66/93/00/6693007955898bfed8b66b75bd3e6ea1.jpg",
  },
  ferniture_types: [
    { label: "Living Room", icon: "Armchair" },
    { label: "Dining Area", icon: "Utensils" },
    { label: "BedRoom Sets", icon: "BedDouble" },
    { label: "Office Space", icon: "Presentation" },
    { label: "Custom Layouts", icon: "Wrench" },
  ],
  best_sellers: {
    title: "Best Sellers",
    description: "Our most loved products, chosen by you.",
    view_all_text: "View all products",
  },
  categories: {
    title: "Shop by Category",
    items: [
      {
        label: "Kitchen",
        image:
          "https://www.ikea.com/global/en/media/PH_206388_d64074fbaa.jpg?f=xxxl",
      },
      {
        label: "Living Room",
        image:
          "https://static.ikea.pr/assets/bannerImages/card_163_es_pr_17248564861.jpeg",
      },
      {
        label: "Bed Room",
        image:
          "https://www.ikea.com/global/en/media/PH_199247_bbd59cc523.jpg?f=xxxl",
      },
      {
        label: "Child Room",
        image:
          "https://www.ikea.com/global/en/media/PH_199492_a4a56a60ed.jpg?f=xxxl",
      },
    ],
  },
  footer: {
    brand_description: "Visualizing Comfort, Precisely Modeled.",
    links: [
      { label: "All Products", href: "#" },
      { label: "Best Sellers", href: "#" },
      { label: "New Arrivals", href: "#" },
    ],
    contact: {
      email: "hello@spatialfurbish.com",
      phone: "+1 (555) 123-4567",
    },
    copyright: "© 2026 SpatialFurbish furnitures. All rights reserved.",
  },
};

// Map string icon names to actual components
const iconMap: Record<string, React.ElementType> = {
  Armchair,
  Utensils,
  BedDouble,
  Presentation,
  Wrench,
};

export function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { socket } = useSocket();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        // Store all products
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Listen for real-time product updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleProductUpdated = (updatedProduct: any) => {
      console.log("✏️ Product updated:", updatedProduct);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product,
        ),
      );
    };

    const handleProductCreated = (newProduct: any) => {
      console.log("🆕 Product created:", newProduct);
      setProducts((prev) => [newProduct, ...prev]);
    };

    const handleProductDeleted = (deleted: { _id: string }) => {
      console.log("🗑️ Product deleted:", deleted);
      setProducts((prev) =>
        prev.filter((product) => product._id !== deleted._id),
      );
    };

    socket.on("product:created", handleProductCreated);
    socket.on("product:updated", handleProductUpdated);
    socket.on("product:deleted", handleProductDeleted);

    return () => {
      socket.off("product:created", handleProductCreated);
      socket.off("product:updated", handleProductUpdated);
      socket.off("product:deleted", handleProductDeleted);
    };
  }, [socket]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter products based on search query
  const filteredProducts = searchQuery
    ? products.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      );
    })
    : products.slice(0, 4); // Show only first 4 if no search query

  return (
    <div className="min-h-screen bg-[#fcfaf8] font-sans text-stone-900 selection:bg-stone-200">
      <Navbar
        brand={data.brand}
        links={data.navigation}
        showSearch={true}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        products={products}
      />

      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-[#44403c]">
              {data.hero.headline.split(",").map((part, i) => (
                <span key={i} className="block">
                  {part}
                  {i === 0 && ","}
                </span>
              ))}
            </h1>
            <p className="text-lg text-stone-600 max-w-md leading-relaxed">
              {data.hero.subheadline}
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                className="bg-[#1c1917] text-white hover:bg-[#44403c] rounded-none px-8 py-6 h-auto text-base uppercase tracking-wide"
              >
                <a href="/Shop">{data.hero.cta_primary}</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#1c1917] text-[#1c1917] hover:bg-stone-100 rounded-none px-8 py-6 h-auto text-base uppercase tracking-wide"
              >
                <a href="/about">{data.hero.cta_secondary}</a>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="aspect-square bg-[#f5f5f0] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] -z-10 blur-3xl opacity-50" />
            <img
              src={data.hero.image}
              alt="Skincare Collection"
              className="w-full h-[500px] object-contain drop-shadow-2xl relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Skin Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {data.ferniture_types.map((type) => {
              const Icon = iconMap[type.icon] || Wrench;
              return (
                <div
                  key={type.label}
                  className="flex flex-col items-center space-y-4 group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-[#fcfaf8] flex items-center justify-center group-hover:bg-[#f5f5f0] transition-colors duration-300">
                    <Icon
                      className="w-8 h-8 text-stone-400 group-hover:text-stone-600 transition-colors"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="font-bold text-sm text-stone-800">
                    {type.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-[#fcfaf8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">
                {searchQuery ? "Search Results" : data.best_sellers.title}
              </h2>
              <p className="text-stone-500">
                {searchQuery
                  ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`
                  : data.best_sellers.description}
              </p>
            </div>
            {!searchQuery && (
              <a
                href="/Shop"
                className="hidden md:flex items-center text-sm font-bold uppercase tracking-wide text-stone-500 hover:text-stone-900 transition-colors"
              >
                {data.best_sellers.view_all_text}{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-stone-500">
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p>
                {searchQuery
                  ? "No products found matching your search."
                  : "No products available yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!searchQuery && (
            <div className="mt-8 text-center md:hidden">
              <a
                href="/Shop"
                className="inline-flex items-center text-sm font-bold uppercase tracking-wide text-stone-500 hover:text-stone-900 transition-colors"
              >
                {data.best_sellers.view_all_text}{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">
            {data.categories.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.categories.items.map((cat) => (
              <Link
                key={cat.label}
                to={`/Shop?category=${encodeURIComponent(cat.label)}`}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer block"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold">{cat.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer brand={data.brand} data={data.footer} />
    </div>
  );
}
