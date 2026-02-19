import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { ProductGrid } from "../../components/User/ProductGrid";
import { JournalGrid } from "../../components/User/JournalGrid";
import heroImage from "../../assets/hero.jpg";
import { productAPI } from "@/services/api";


export function Shop() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [products, setProducts] = useState<any[]>([]);

  // Get category and search query from URL query parameters
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      setCategoryFilter(category);
    }
    if (search) {
      setSearchQuery(search);
    }
    
    // Scroll to the products section when a category is selected
    if (category) {
      const productsSection = document.querySelector('main section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'instant', block: 'start' });
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
        brand="LUMIÈRE"
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
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-md text-white">
            <h1 className="font-serif text-4xl mb-4">
              Skin Care
            </h1>
            <p className="text-sm leading-relaxed">
              Thoughtfully formulated skincare for everyday rituals.
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

          <h2 className="font-serif text-3xl mt-2 mb-12">
            Essentials For Every Skincare
          </h2>

          <ProductGrid searchQuery={searchQuery} initialCategory={categoryFilter} />
        </section>
      </main>

      {/* JOURNAL */}
      <JournalGrid />

      <Footer
        brand="LUMIÈRE"
        data={{
          brand_description: "Natural skincare for the modern lifestyle.",
          links: [
            { label: "All Products", href: "/Shop" },
            { label: "Best Sellers", href: "/Shop" },
            { label: "New Arrivals", href: "/Shop" }
          ],
          contact: {
            email: "hello@lumiere.com",
            phone: "+1 (555) 123-4567"
          },
          copyright: "© 2023 Lumière Skincare. All rights reserved.",
        }}
      />
    </>
  );
}
