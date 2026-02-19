import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { cartAPI } from "@/services/api";

export interface CartItem {
    id: string; // Product ID
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    updateQuantity: (id: string, amount: number) => Promise<void>;
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
                quantity: item.quantity
            }));
            setCart(mappedItems);
        } catch (error) {
            console.error("Failed to fetch server cart", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product: any) => {
        if (isLoggedIn) {
            try {
                await cartAPI.add(product._id, 1);
                await fetchServerCart();
            } catch (error) {
                console.error("Add to cart failed", error);
            }
        } else {
            setCart((prev) => {
                const existingItem = prev.find((item) => item.id === product._id);
                if (existingItem) {
                    return prev.map((item) =>
                        item.id === product._id
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
                        quantity: 1,
                    },
                ];
            });
        }
    };

    const removeFromCart = async (id: string) => {
        if (isLoggedIn) {
            try {
                await cartAPI.remove(id);
                await fetchServerCart();
            } catch (error) {
                console.error("Remove from cart failed", error);
            }
        } else {
            setCart((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const updateQuantity = async (id: string, amount: number) => {
        if (isLoggedIn) {
            try {
                // Find current quantity to calculate new one
                const item = cart.find(i => i.id === id);
                if (item) {
                    const newQuantity = item.quantity + amount;
                    if (newQuantity > 0) {
                        await cartAPI.update(id, newQuantity);
                    } else {
                        await cartAPI.remove(id);
                    }
                    await fetchServerCart();
                }
            } catch (error) {
                console.error("Update cart failed", error);
            }
        } else {
            setCart((prev) =>
                prev.map((item) =>
                    item.id === id
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
