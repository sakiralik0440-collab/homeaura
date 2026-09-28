import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const savedWishlist =
                localStorage.getItem("homeAuraWishlist");

            return savedWishlist
                ? JSON.parse(savedWishlist)
                : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            "homeAuraWishlist",
            JSON.stringify(wishlistItems)
        );
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems((currentItems) => {
            const exists = currentItems.some(
                (item) => item.id === product.id
            );

            if (exists) {
                return currentItems;
            }

            return [...currentItems, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlistItems((currentItems) =>
            currentItems.filter((item) => item.id !== id)
        );
    };

    const toggleWishlist = (product) => {
        setWishlistItems((currentItems) => {
            const exists = currentItems.some(
                (item) => item.id === product.id
            );

            if (exists) {
                return currentItems.filter(
                    (item) => item.id !== product.id
                );
            }

            return [...currentItems, product];
        });
    };

    const isWishlisted = (id) => {
        return wishlistItems.some(
            (item) => item.id === id
        );
    };

    const wishlistCount = wishlistItems.length;

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                wishlistCount,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isWishlisted,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}