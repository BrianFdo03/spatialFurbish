import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { ProductCard } from "../../components/Dashboard/ProductCard";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Home as HomeIcon,
  Box,
  Maximize,
  Palette,
  Save,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { productAPI } from "@/services/api";
import { useSocket } from "@/context/SocketContext";
import { getTextures } from "@/services/textureService";

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
      "Powerful tools to envision furniture through intense design for any space.",
    cta_primary: "Explore",
    cta_secondary: "Pricing",
    image:
      "https://i.pinimg.com/736x/66/93/00/6693007955898bfed8b66b75bd3e6ea1.jpg",
  },
  best_sellers: {
    title: "Best Sellers",
    description: "Our most loved products, chosen by you.",
    view_all_text: "View all products",
  },
  features: {
    title: "Design with Precision",
    subtitle: "Powerful tools to envision Furniture through intense design for any space.",
    items: [
      {
        title: "Room Customization",
        description: "Explore rooms dimensions, layouts and colors for a realistic design.",
        icon: "home"
      },
      {
        title: "3D Visualization",
        description: "Experience 3D view fully designed to ensure everything fits and aligns.",
        icon: "box"
      },
      {
        title: "Perfect Scaling",
        description: "Auto Precision in every foot with perfectly ensuring accurate details.",
        icon: "maximize"
      },
      {
        title: "Furniture Customization",
        description: "Personalise colors, textures, and finishes for every space.",
        icon: "palette"
      },
      {
        title: "Save & Edit Designs",
        description: "Store your designs securely and edit anytime with ease.",
        icon: "save"
      },
      {
        title: "Designer Accounts",
        description: "Reliable access for designers to manage and create stunning layouts.",
        icon: "users"
      }
    ]
  },
  process: {
    title: "Streamlined Design Process",
    subtitle: "Transform your ideas into reality in four simple steps.",
    steps: [
      {
        number: 1,
        title: "Enter Room Details",
        description: "Input dimension, shapes, and colors to create your perfect layout.",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        number: 2,
        title: "Create 2D Design",
        description: "Arrange furniture from our catalog in an intuitive 2D interface.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1158&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        number: 3,
        title: "View in 3D",
        description: "Experience your room in realistic 3D view.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        number: 4,
        title: "Customize & Refine",
        description: "Tweak colors, textures, and scaling to perfect it as a perfect fit.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ]
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
  },
};


// Feature icon mapping
const featureIconMap: Record<string, LucideIcon> = {
  home: HomeIcon,
  box: Box,
  maximize: Maximize,
  palette: Palette,
  save: Save,
  users: Users,
};

export function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { socket } = useSocket();
  const [textures, setTextures] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productsRes, texturesRes] = await Promise.all([
          productAPI.getAll(),
          getTextures()
        ]);

        setProducts(productsRes.data || []);
        setTextures(texturesRes || []);
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
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-16 grid md:grid-cols-2 gap-12 items-center">
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
              className="w-full h-[400px] object-contain drop-shadow-2xl relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-white">
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
                <ProductCard
                  key={product._id}
                  product={product}
                  textures={textures}
                />
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

      {/* Features Section - Design with Precision */}
      <section className="py-24 bg-[#fcfaf8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-wide text-stone-500 mb-3">Features</p>
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">
              {data.features.title}
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {data.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {data.features.items.map((feature, index) => {
              const Icon = featureIconMap[feature.icon];
              if (!Icon) return null;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-[#FFFBEB] rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#B45309]" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Streamlined Design Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wide text-stone-500 mb-3">How it Works</p>
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">
              {data.process.title}
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {data.process.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.process.steps.map((step) => (
              <div key={step.number} className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-stone-600 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
                {/* Process step image */}
                <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#F7F0E6]">
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
