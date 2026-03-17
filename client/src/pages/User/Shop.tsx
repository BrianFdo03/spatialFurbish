import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { ProductGrid } from "../../components/User/ProductGrid";
import { productAPI } from "@/services/api";

const data = {
  hero: {
    image:
      "https://i.pinimg.com/736x/66/93/00/6693007955898bfed8b66b75bd3e6ea1.jpg",
  },
  brand: "SpatialFurbish",
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

export function Shop() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [products, setProducts] = useState<any[]>([]);

  // Get category and search query from URL query parameters
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) {
      setCategoryFilter(category);
    }
    if (search) {
      setSearchQuery(search);
    }

    // Scroll to the products section when a category is selected
    if (category) {
      const productsSection = document.querySelector("main section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, [searchParams]);

  // Fetch products for navbar recommendations
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar
        brand="SpatialFurbish"
        links={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/Shop" },
          { label: "About", href: "/about" },
          { label: "Contact Us", href: "/contact" },
        ]}
        showSearch={true}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        products={products}
      />

      {/* HERO */}
      <section className="relative h-[460px] mt-20">
        <img
          src={data.hero.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-md text-white">
            <h1 className="font-serif text-4xl mb-4">Shop Collection</h1>
            <p className="text-sm leading-relaxed">
              expolere our complete range of precision furniture
              models.Engieered to help you visualize,scale and perfect evry room
              layout with ease.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <main className="bg-[#fcfaf8]">
        <section className="max-w-7xl mx-auto px-6 py-24">
          <span className="text-xs uppercase tracking-wide text-stone-500">
            Revered Formulations
          </span>

          <ProductGrid
            searchQuery={searchQuery}
            initialCategory={categoryFilter}
          />
        </section>
      </main>

      <Footer brand={data.brand} data={data.footer} />
    </>
  );
}
