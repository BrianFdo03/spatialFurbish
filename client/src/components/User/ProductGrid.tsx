import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { productAPI, categoryAPI } from "@/services/api";
import { useSocket } from "@/context/SocketContext";

interface ProductGridProps {
  searchQuery?: string;
  initialCategory?: string;
}

export function ProductGrid({ searchQuery = '', initialCategory }: ProductGridProps) {
  const [active, setActive] = useState(initialCategory || "Shop All");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll()
        ]);

        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Listen for real-time product updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleProductCreated = (newProduct: any) => {
      console.log('🆕 New product created:', newProduct);
      setProducts((prev) => [newProduct, ...prev]);
    };

    const handleProductUpdated = (updatedProduct: any) => {
      console.log('✏️ Product updated:', updatedProduct);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
    };

    const handleProductDeleted = (deletedProduct: any) => {
      console.log('🗑️ Product deleted:', deletedProduct);
      setProducts((prev) =>
        prev.filter((product) => product._id !== deletedProduct._id)
      );
    };

    socket.on('product:created', handleProductCreated);
    socket.on('product:updated', handleProductUpdated);
    socket.on('product:deleted', handleProductDeleted);

    return () => {
      socket.off('product:created', handleProductCreated);
      socket.off('product:updated', handleProductUpdated);
      socket.off('product:deleted', handleProductDeleted);
    };
  }, [socket]);

  // Update active category when initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setActive(initialCategory);
    }
  }, [initialCategory]);

  // Filter by category
  let filtered = active === "Shop All"
    ? products
    : products.filter((p) => p.category === active);

  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      );
    });
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">Loading products...</p>
      </div>
    );
  }

  return (
    <>
      {/* CATEGORY BAR */}
      <div className="border-b mb-20">
        <div className="flex gap-8 text-sm overflow-x-auto pb-4">
          <button
            onClick={() => setActive("Shop All")}
            className={`pb-1 whitespace-nowrap border-b transition-colors ${active === "Shop All"
              ? "border-black text-black"
              : "border-transparent text-stone-600 hover:text-black"
              }`}
          >
            Shop All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActive(cat.name)}
              className={`pb-1 whitespace-nowrap border-b transition-colors ${active === cat.name
                ? "border-black text-black"
                : "border-transparent text-stone-600 hover:text-black"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-600">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-24">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
