import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    category: string;
    price: number;
    images: string[];
    stock?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const imageUrl = product.images?.[0] || "/products/placeholder.png";

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock !== undefined && product.stock <= 10;

  return (
    <Card className="group relative border-none bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* IMAGE */}
      <CardContent className="relative p-0 aspect-[4/5] bg-[#f5f5f0] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/products/placeholder.png";
          }}
        />

        {/* CATEGORY BADGE */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-700 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* ADD TO CART (HOVER SLIDE-UP) */}
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
      </CardContent>

      {/* CONTENT */}
      <CardFooter className="flex flex-col items-start gap-2 px-4 pt-4 pb-5">
        <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* PRICE + STOCK */}
        <div className="w-full flex items-center justify-between">
          <span className="text-lg font-semibold text-stone-900">
            {formatPrice(product.price)}
          </span>

          {product.stock !== undefined && (
            <span
              className={`text-xs font-medium ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                    ? "text-amber-600"
                    : "text-green-600"
              }`}
            >
              {isOutOfStock
                ? "Sold out"
                : isLowStock
                  ? `Only ${product.stock} left`
                  : "In stock"}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
