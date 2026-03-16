import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/User/Navbar";
import { Footer } from "../../components/User/Footer";
import { productAPI } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { ModelViewer } from "@/components/ui/ModelViewer";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Texture selection state
  const [selectedTexture, setSelectedTexture] = useState<any>(null);
  // Color selection state
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // View state: 'model' | 'image' (default to model if it exists)
  const [viewMode, setViewMode] = useState<'model' | 'image'>('image');
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await productAPI.getById(id);
        const data = response.data;
        setProduct(data);
        
        // Default to the first allowed texture if available
        if (data.allowedTextures && data.allowedTextures.length > 0) {
            setSelectedTexture(data.allowedTextures[0]);
        }

        // Default to the first allowed color if available
        if (data.allowedColors && data.allowedColors.length > 0) {
            const firstColor = data.allowedColors[0];
            setSelectedColor(firstColor);
            
            // Set initial image to color-mapped image if no model exists
            if (!data.productModel) {
               const colorMap = data.colorImages?.find((c: any) => c.color === firstColor);
               if (colorMap?.imageUrl) {
                  setViewMode('image');
                  setMainImage(colorMap.imageUrl);
               } else if (data.images && data.images.length > 0) {
                  setViewMode('image');
                  setMainImage(data.images[0]);
               }
            } else {
               setViewMode('model');
            }
        } else {
            // Set initial view mode and main image purely based on existence
            if (data.productModel) {
                setViewMode('model');
            } else if (data.images && data.images.length > 0) {
                setViewMode('image');
                setMainImage(data.images[0]);
            }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Could not load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    // We send only the required texture data to context
    const texturePayload = selectedTexture ? {
        name: selectedTexture.name,
        image: selectedTexture.texture || selectedTexture.image || selectedTexture.url // Map to whatever your schema has
    } : undefined;

    // We send color if selected
    const colorPayload = selectedColor || undefined;

    await addToCart(product, texturePayload, colorPayload);
    toast.success("Added to cart!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8]">
        <p className="text-stone-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8]">
        <p className="text-stone-600 mb-4">Product not found.</p>
        <button onClick={() => navigate("/Shop")} className="underline text-stone-800">Return to Shop</button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

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
      />

      <main className="bg-[#fcfaf8] min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => navigate("/Shop")} 
            className="flex items-center text-sm text-stone-500 hover:text-stone-800 transition-colors mb-12"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Shop
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* LEFT: MEDIA VIEWER & GALLERY */}
            <div className="flex flex-col gap-4">
                {/* Main View */}
                <div className="bg-white p-8 rounded-2xl shadow-sm flex items-center justify-center h-[500px]">
                    {viewMode === 'model' && product.productModel ? (
                        <div className="w-full h-full">
                            <ModelViewer 
                                url={product.productModel} 
                                textureUrl={selectedTexture?.texture || selectedTexture?.image || selectedTexture?.url} 
                            />
                        </div>
                    ) : (
                        <img
                            src={mainImage || "/products/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/products/placeholder.png";
                            }}
                        />
                    )}
                </div>

                {/* Thumbnail Gallery (Amazon/eBay style) */}
                <div className="flex flex-wrap gap-4 mt-2">
                    {/* Always show a 3D toggle thumbnail if a model exists */}
                    {product.productModel && (
                        <button
                            onClick={() => setViewMode('model')}
                            className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-xs uppercase transition-all
                                ${viewMode === 'model' ? 'border-2 border-stone-800 text-stone-900 bg-stone-100' : 'border border-stone-200 text-stone-500 bg-white hover:border-stone-400'}
                            `}
                        >
                            3D View
                        </button>
                    )}

                    {/* Image thumbnails */}
                    {product.images?.map((imgUrl: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setViewMode('image');
                                setMainImage(imgUrl);
                            }}
                            className={`w-20 h-20 rounded-xl overflow-hidden bg-white flex items-center justify-center transition-all
                                ${viewMode === 'image' && mainImage === imgUrl ? 'border-2 border-stone-800' : 'border border-stone-200 hover:border-stone-400'}
                            `}
                        >
                            <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: DETAILS & ACTIONS */}
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
                {product.category}
              </span>
              <h1 className="font-serif text-4xl text-stone-900 mb-4">{product.name}</h1>
              <p className="text-2xl font-light text-stone-800 mb-6">
                ${product.price.toFixed(2)}
              </p>
              
              {/* Product Dimensions */}
              {product.sizes && product.sizes.length > 0 && (
                 <div className="mb-6 flex flex-wrap gap-2">
                    {product.sizes.map((size: string, idx: number) => (
                       <span key={idx} className="bg-stone-100 text-stone-600 px-3 py-1 text-sm rounded-md tracking-wide">
                          Details: {size}
                       </span>
                    ))}
                 </div>
              )}
              
              <div className="prose prose-stone mb-10 text-stone-600">
                <p>{product.description}</p>
              </div>

              {/* TEXTURE CUSTOMIZATION */}
              {product.allowedTextures && product.allowedTextures.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-4">Select Texture</h3>
                    <div className="flex flex-wrap gap-4">
                        {product.allowedTextures.map((texture: any) => (
                            <button
                                key={texture._id}
                                onClick={() => setSelectedTexture(texture)}
                                className={`
                                    relative p-1 rounded-full border-2 transition-all group
                                    ${selectedTexture?._id === texture._id ? 'border-stone-800 scale-110' : 'border-transparent hover:border-stone-300'}
                                `}
                                title={texture.name}
                            >
                                <img 
                                    src={texture.texture || texture.image || texture.url} 
                                    alt={texture.name}
                                    className="w-12 h-12 rounded-full object-cover shadow-sm bg-stone-100"
                                />
                            </button>
                        ))}
                    </div>
                </div>
              )}

              {/* COLOR CUSTOMIZATION */}
              {product.allowedColors && product.allowedColors.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-4">
                        Select Color: <span className="text-stone-500 capitalize">{selectedColor}</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {product.allowedColors.map((color: string) => (
                            <button
                                key={color}
                                onClick={() => {
                                   setSelectedColor(color);
                                   // Dynamically update view based on color
                                   if (product.colorImages) {
                                      const mappedImage = product.colorImages.find((c: any) => c.color === color);
                                      if (mappedImage?.imageUrl) {
                                         setViewMode('image');
                                         setMainImage(mappedImage.imageUrl);
                                      }
                                   }
                                }}
                                className={`
                                    w-10 h-10 rounded-full border-2 transition-all group shadow-sm
                                    ${selectedColor === color 
                                        ? 'border-stone-800 scale-110' 
                                        : 'border-transparent ring-1 ring-stone-200 hover:scale-105'
                                    }
                                `}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
              )}

              {/* ACTION AREA */}
              <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm text-stone-500 mb-2">
                     <span className={isOutOfStock ? "text-red-500" : "text-emerald-600"}>
                        {isOutOfStock ? "Out of Stock" : "In Stock"}
                     </span>
                     {!isOutOfStock && <span>({product.stock} available)</span>}
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full md:w-auto px-8 py-4 bg-[#1c1917] hover:bg-[#44403c] disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-colors rounded-none"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to cart
                  </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer 
        brand="SpatialFurbish" 
        data={{
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
        }}
      />
    </>
  );
}
