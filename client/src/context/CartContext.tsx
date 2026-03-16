import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { cartAPI } from "@/services/api";

export interface CartItem {
    id: string; // Product ID
    name: string;
    price: number;
    image: string;
    texture?: {
        name: string;
        image: string;
    };
    color?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, texture?: any, color?: string) => Promise<void>;
    removeFromCart: (id: string, textureName?: string, color?: string) => Promise<void>;
    updateQuantity: (id: string, amount: number, textureName?: string, color?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    subtotal: number;
    shippingFee: number;
    total: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Check if user is logged in
    const getUser = () => {
        const userStr = localStorage.getItem("user");
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    };

    const isLoggedIn = !!getUser();

    // Load Cart Intially
    useEffect(() => {
        if (isLoggedIn) {
            fetchServerCart();
        } else {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }, [isLoggedIn]); // Re-run if login status changes (might need manual trigger if relying only on localStorage modification)

    // Sync Local Cart to Storage (only if guest)
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isLoggedIn]);

    const fetchServerCart = async () => {
        try {
            setIsLoading(true);
            const serverCart = await cartAPI.get();
            // Map server items to frontend format
            const mappedItems = serverCart.items.map((item: any) => ({
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                texture: item.texture || undefined,
                color: item.color || undefined,
                quantity: item.quantity
            }));
            setCart(mappedItems);
        } catch (error) {
            console.error("Failed to fetch server cart", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product: any, texture?: any, color?: string) => {
        if (isLoggedIn) {
            try {
                await fetch(`http://localhost:3000/api/cart/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token auth
                    },
                    body: JSON.stringify({ productId: product._id, quantity: 1, texture, color })
                });
                // await cartAPI.add(product._id, 1); // cartAPI doesn't directly support texture in current signature out of the box so bypassing or creating a new method
                await fetchServerCart();
            } catch (error) {
                console.error("Add to cart failed", error);
            }
        } else {
            setCart((prev) => {
                const existingItem = prev.find((item) => 
                    item.id === product._id && 
                    (texture ? (item.texture && item.texture.name === texture.name) : !item.texture) &&
                    (color ? item.color === color : !item.color)
                );
                
                if (existingItem) {
                    return prev.map((item) =>
                        item.id === product._id && 
                        (texture ? (item.texture && item.texture.name === texture.name) : !item.texture) &&
                        (color ? item.color === color : !item.color)
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [
                    ...prev,
                    {
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images?.[0] || "/products/placeholder.png",
                        texture: texture || undefined,
                        color: color || undefined,
                        quantity: 1,
                    },
                ];
            });
        }
    };

    const removeFromCart = async (id: string, textureName?: string, color?: string) => {
        if (isLoggedIn) {
            try {
                await fetch(`http://localhost:3000/api/cart/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ textureName, color })
                });
                await fetchServerCart();
            } catch (error) {
                console.error("Remove from cart failed", error);
            }
        } else {
            setCart((prev) => prev.filter((item) => {
                if (item.id !== id) return true;
                if (textureName && item.texture?.name !== textureName) return true;
                if (color && item.color !== color) return true;
                return false;
            }));
        }
    };

    const updateQuantity = async (id: string, amount: number, textureName?: string, color?: string) => {
        if (isLoggedIn) {
            try {
                // Find current quantity to calculate new one
                const item = cart.find(i => 
                    i.id === id && 
                    (textureName ? (i.texture && i.texture.name === textureName) : !i.texture) &&
                    (color ? i.color === color : !i.color)
                );
                
                if (item) {
                    const newQuantity = item.quantity + amount;
                    if (newQuantity > 0) {
                        await fetch(`http://localhost:3000/api/cart/update`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify({ productId: id, quantity: newQuantity, texture: item.texture, color: item.color })
                        });
                    } else {
                        await removeFromCart(id, textureName, color);
                    }
                    await fetchServerCart();
                }
            } catch (error) {
                console.error("Update cart failed", error);
            }
        } else {
            setCart((prev) =>
                prev.map((item) =>
                    item.id === id && 
                    (textureName ? (item.texture && item.texture.name === textureName) : !item.texture) &&
                    (color ? item.color === color : !item.color)
                        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                        : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (isLoggedIn) {
            try {
                await cartAPI.clear();
                setCart([]);
            } catch (error) {
                console.error("Clear cart failed", error);
            }
        } else {
            setCart([]);
        }
    };

    const refreshCart = async () => {
        if (isLoggedIn) await fetchServerCart();
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shippingFee = subtotal > 50 ? 0 : 5;
    const total = subtotal + shippingFee;

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                refreshCart,
                subtotal,
                shippingFee,
                total,
                isLoading
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
