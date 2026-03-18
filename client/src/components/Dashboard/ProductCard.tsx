import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  allowedColors?: string[];
  allowedTextures?: string[];
}

interface ProductCardProps {
  product: Product;
  textures?: any[];
}

export function ProductCard({ product, textures }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const imageUrl = product.images?.[0] || "/products/placeholder.png";

const productTextures = (textures || []).filter((texture) =>
  product.allowedTextures?.includes(String(texture._id))
);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock !== undefined && product.stock <= 10;

  return (
    <Card 
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative border-none bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
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
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
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
        {/* COLORS + TEXTURES CONTAINER */}
        <div className="grid grid-cols-2 gap-4 w-full mt-2">

          {/* COLORS */}
          {product.allowedColors && product.allowedColors.length > 0 && (
            <div
              className="flex flex-col gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] uppercase tracking-wide text-stone-400 font-medium">
                Colors
              </span>

              <div className="flex flex-wrap gap-1 max-w-[80px]">
                {product.allowedColors.map((color, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-black/10 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TEXTURES */}
          {productTextures.length > 0 && (
            <div
              className="flex flex-col items-end gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] uppercase tracking-wide text-stone-400 font-medium">
                Textures
              </span>

              <div className="flex flex-wrap gap-1 max-w-[80px] justify-end">
                {productTextures.map((texture, idx) => (
                  <img
                    key={idx}
                    src={texture.texture}
                    alt={texture.name}
                    className="w-5 h-5 rounded border border-stone-200 object-cover hover:scale-110 transition-transform"
                    title={texture.name}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </CardFooter>
    </Card>
  );
}
