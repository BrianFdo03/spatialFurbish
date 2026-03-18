import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  textures: any[];
}

export function ProductCard({ product, textures }: ProductCardProps) {
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  const imageUrl = product.images?.[0] || "/products/placeholder.png";

  const productTextures = textures.filter((texture) =>
    product.allowedTextures?.includes(String(texture._id))
  );

  // Use product colors if available, otherwise show dummy premium colors
  const colors = product.allowedColors && product.allowedColors.length > 0
    ? product.allowedColors
    : ["#E5E0D8", "#2C2B29", "#8C9A8B", "#C3A68F"];

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className={cn(
        "group cursor-pointer flex flex-col gap-5",
        isOutOfStock && "opacity-75 pointer-events-none"
      )}
    >
      {/* Visual Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F8F7F5] transition-all duration-500 ease-out group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
        <img
          src={imageUrl}
          alt={product.name}
          className={cn(
            "h-full w-full object-cover object-center transition-transform duration-700 ease-[0.33,1,0.68,1]",
            !isOutOfStock && "group-hover:scale-105",
            isOutOfStock && "grayscale opacity-80"
          )}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/products/placeholder.png";
          }}
        />

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex bg-white/95 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-900 rounded-full shadow-sm">
              {product.category}
            </span>
          </div>
        )}

        {/* Hover Action Overlay */}
        {!isOutOfStock && (
          <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-0 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 z-20">
            <span className="bg-white/95 backdrop-blur-md text-stone-900 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform transition-transform hover:scale-105">
              View Details
            </span>
          </div>
        )}

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-30 flex items-center justify-center">
            <span className="bg-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-red-600 shadow-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-lg text-stone-900 leading-tight group-hover:text-stone-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className="font-medium text-stone-900 tabular-nums bg-stone-50 px-2 py-0.5 rounded-md shadow-sm text-sm">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2 mt-1">
          <div
            className="flex -space-x-1.5 hover:space-x-1 transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {colors.slice(0, 4).map((color, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110 hover:z-10 cursor-pointer"
                style={{ backgroundColor: color }}
                title={`Color option ${idx + 1}`}
              />
            ))}
          </div>

          {colors.length > 4 && (
            <span className="text-[10px] text-stone-400 font-medium tracking-wide uppercase pl-1">
              + More
            </span>
          )}
        </div>

        {/* Texture Swatches */}
        {productTextures.length > 0 && (
          <div
            className="flex items-center gap-2 mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {productTextures.slice(0, 3).map((texture, idx) => (
              <img
                key={idx}
                src={texture.texture}
                alt={texture.name}
                className="w-6 h-6 rounded border border-stone-200 object-cover shadow-sm hover:scale-110 transition-transform"
                title={texture.name}
              />
            ))}
          </div>
        )}

        {/* Stock Warning */}
        {!isOutOfStock && product.stock <= 10 && (
          <span className="text-amber-700 text-[11px] font-semibold uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-sm mt-2 inline-block">
            Only {product.stock} Left
          </span>
        )}

        </div>
        </div>
        );
        }
