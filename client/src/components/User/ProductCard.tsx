import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const imageUrl = product.images?.[0] || "/products/placeholder.png";

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-xl bg-white transition-all duration-300",
        "shadow-sm hover:shadow-xl hover:-translate-y-1",
        isOutOfStock && "pointer-events-none opacity-80",
      )}
    >
      {/* IMAGE AREA */}
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] bg-[#f4f2ed] flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              !isOutOfStock && "group-hover:scale-105",
              isOutOfStock && "blur-sm",
            )}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/products/placeholder.png";
            }}
          />

          {/* CATEGORY BADGE */}
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-700 rounded-full shadow-sm">
            {product.category}
          </span>

          {/* ADD TO CART (only if in stock) */}
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-[#1c1917] hover:bg-[#44403c] text-white text-xs py-3 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to cart
              </button>
            </div>
          )}

          {/* OUT OF STOCK OVERLAY */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Out of stock
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* DETAILS */}
      <CardFooter className="flex flex-col items-start px-4 pt-6 pb-5 space-y-1 text-xs">
        <h3 className="font-serif text-sm">{product.name}</h3>

        <p className="text-stone-600 line-clamp-2">{product.description}</p>

        {product.category && (
          <p className="text-stone-500">{product.category}</p>
        )}

        <p className="pt-2 font-medium">{formatPrice(product.price)}</p>

        {!isOutOfStock && product.stock <= 10 && (
          <p className="text-amber-600">Only {product.stock} left!</p>
        )}
      </CardFooter>
    </Card>
  );
}
