import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Heart,
    ShoppingBag,
    Search,
    SlidersHorizontal,
    ChevronDown,
    Star,
    X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000";

function Shop() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [selectedCategory, setSelectedCategory] =
        useState(
            searchParams.get("category") || "All"
        );

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] =
        useState("featured");

    const [toast, setToast] = useState("");
    const [mobileFilters, setMobileFilters] =
        useState(false);

    const [allProducts, setAllProducts] =
        useState([]);

    const [loadingProducts, setLoadingProducts] =
        useState(true);

    const [productsError, setProductsError] =
        useState("");

    const { addToCart } = useCart();

    const {
        toggleWishlist,
        isWishlisted,
    } = useWishlist();

    const categories = [
        "All",
        "Living Room",
        "Bedroom",
        "Lighting",
        "Wall Decor",
        "Kitchen & Dining",
        "Home Accessories",
    ];

    /*
     * Convert backend relative image URL
     * into complete image URL.
     */
    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `${BACKEND_URL}${image}`;
        }

        return image;
    };

    /*
     * Fetch ONLY products from MongoDB.
     */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                setProductsError("");

                const response = await fetch(
                    `${API_URL}/api/products`
                );

                if (!response.ok) {
                    throw new Error(
                        `Server returned ${response.status}`
                    );
                }

                const data =
                    await response.json();

                if (
                    data.success &&
                    Array.isArray(data.products)
                ) {
                    const databaseProducts =
                        data.products
                            .filter(
                                (product) =>
                                    product.isActive !==
                                    false
                            )
                            .map((product) => ({
                                ...product,

                                id:
                                    product._id ||
                                    product.id,

                                image:
                                    getImageUrl(
                                        product.image
                                    ),
                            }));

                    setAllProducts(
                        databaseProducts
                    );
                } else {
                    setAllProducts([]);
                    setProductsError(
                        "No products found."
                    );
                }
            } catch (error) {
                console.error(
                    "Shop products error:",
                    error
                );

                setAllProducts([]);

                setProductsError(
                    "Unable to load products from server."
                );
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const matchesCategory = (
        product,
        category
    ) => {
        if (category === "All") {
            return true;
        }

        if (category === "Living Room") {
            return (
                product.room ===
                "Living Room"
            );
        }

        if (category === "Bedroom") {
            return (
                product.room === "Bedroom"
            );
        }

        if (category === "Lighting") {
            return (
                product.category ===
                "Lighting"
            );
        }

        if (category === "Wall Decor") {
            return (
                product.room ===
                "Wall Decor" ||
                product.category ===
                "Wall Decor" ||
                product.category ===
                "Mirror"
            );
        }

        if (
            category ===
            "Kitchen & Dining"
        ) {
            return (
                product.room ===
                "Kitchen" ||
                product.room ===
                "Dining"
            );
        }

        if (
            category ===
            "Home Accessories"
        ) {
            return (
                product.room === "Decor"
            );
        }

        return false;
    };

    const categoryCount = (
        category
    ) => {
        return allProducts.filter(
            (product) =>
                matchesCategory(
                    product,
                    category
                )
        ).length;
    };

    const filteredProducts = useMemo(() => {
        const query = search
            .toLowerCase()
            .trim();

        let result =
            allProducts.filter(
                (product) => {
                    const searchableText = `
                        ${product.name || ""}
                        ${product.category || ""}
                        ${product.room || ""}
                        ${product.material || ""}
                        ${product.color || ""}
                    `.toLowerCase();

                    return (
                        searchableText.includes(
                            query
                        ) &&
                        matchesCategory(
                            product,
                            selectedCategory
                        )
                    );
                }
            );

        if (
            sortBy === "price-low"
        ) {
            result = [...result].sort(
                (a, b) =>
                    Number(a.price || 0) -
                    Number(b.price || 0)
            );
        }

        if (
            sortBy === "price-high"
        ) {
            result = [...result].sort(
                (a, b) =>
                    Number(b.price || 0) -
                    Number(a.price || 0)
            );
        }

        if (sortBy === "rating") {
            result = [...result].sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
            );
        }

        if (sortBy === "newest") {
            result = [...result].sort(
                (a, b) => {
                    if (
                        a.createdAt &&
                        b.createdAt
                    ) {
                        return (
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                        );
                    }

                    if (
                        a.badge === "NEW" &&
                        b.badge !== "NEW"
                    ) {
                        return -1;
                    }

                    if (
                        b.badge === "NEW" &&
                        a.badge !== "NEW"
                    ) {
                        return 1;
                    }

                    return 0;
                }
            );
        }

        return result;
    }, [
        allProducts,
        search,
        selectedCategory,
        sortBy,
    ]);

    const changeCategory = (
        category
    ) => {
        setSelectedCategory(category);

        if (category === "All") {
            setSearchParams({});
        } else {
            setSearchParams({
                category,
            });
        }
    };

    const handleAddToCart = (
        product
    ) => {
        addToCart(product);

        setToast(
            `${product.name} added to cart`
        );

        setTimeout(() => {
            setToast("");
        }, 2200);
    };

    const handleWishlist = (
        product
    ) => {
        const productId =
            product.id ||
            product._id;

        const alreadyAdded =
            isWishlisted(productId);

        toggleWishlist(product);

        setToast(
            alreadyAdded
                ? `${product.name} removed from wishlist`
                : `${product.name} added to wishlist`
        );

        setTimeout(() => {
            setToast("");
        }, 2200);
    };

    return (
        <div className="shop-page">
            <Navbar />

            <section className="shop-intro">
                <div className="shop-intro-inner">
                    <div className="shop-intro-left">
                        <span>
                            THE HOMEAURA COLLECTION
                        </span>

                        <h1>
                            Designed for
                            <br />
                            <em>
                                beautiful living.
                            </em>
                        </h1>
                    </div>

                    <div className="shop-intro-right">
                        <p>
                            Discover furniture and
                            decor thoughtfully
                            selected to bring
                            comfort, warmth and
                            character to your home.
                        </p>

                        <div className="shop-intro-line">
                            <span>01</span>

                            <div></div>

                            <span>
                                {allProducts.length} PRODUCTS
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="shop-content">
                <button
                    className="shop-mobile-filter"
                    type="button"
                    onClick={() =>
                        setMobileFilters(
                            true
                        )
                    }
                >
                    <SlidersHorizontal
                        size={16}
                    />
                    FILTERS
                </button>

                <div className="shop-layout">
                    <aside className="shop-sidebar">
                        <div className="shop-sidebar-title">
                            <span>
                                FILTER BY
                            </span>

                            <small>
                                {
                                    filteredProducts.length
                                }{" "}
                                ITEMS
                            </small>
                        </div>

                        <div className="shop-filter-group">
                            <h3>
                                Category
                            </h3>

                            <div className="shop-category-list">
                                {categories.map(
                                    (
                                        category
                                    ) => (
                                        <button
                                            key={
                                                category
                                            }
                                            type="button"
                                            className={
                                                selectedCategory ===
                                                    category
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                changeCategory(
                                                    category
                                                )
                                            }
                                        >
                                            <span>
                                                {
                                                    category
                                                }
                                            </span>

                                            <small>
                                                {categoryCount(
                                                    category
                                                )}
                                            </small>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="shop-sidebar-note">
                            <span>
                                HOMEAURA
                            </span>

                            <p>
                                Pieces chosen to
                                make everyday
                                spaces feel a
                                little more
                                special.
                            </p>
                        </div>
                    </aside>

                    <main className="shop-products-area">
                        <div className="shop-products-header">
                            <div>
                                <span className="shop-products-label">
                                    COLLECTION
                                </span>

                                <h2>
                                    {selectedCategory ===
                                        "All"
                                        ? "All Products"
                                        : selectedCategory}
                                </h2>
                            </div>

                            <div className="shop-header-actions">
                                <div className="shop-search-box">
                                    <Search
                                        size={17}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={
                                            search
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setSearch(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSearch(
                                                    ""
                                                )
                                            }
                                        >
                                            <X
                                                size={
                                                    14
                                                }
                                            />
                                        </button>
                                    )}
                                </div>

                                <div className="shop-sort-box">
                                    <select
                                        value={
                                            sortBy
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setSortBy(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        <option value="featured">
                                            Featured
                                        </option>

                                        <option value="newest">
                                            Newest
                                        </option>

                                        <option value="price-low">
                                            Price: Low
                                            to High
                                        </option>

                                        <option value="price-high">
                                            Price: High
                                            to Low
                                        </option>

                                        <option value="rating">
                                            Highest
                                            Rated
                                        </option>
                                    </select>

                                    <ChevronDown
                                        size={14}
                                    />
                                </div>
                            </div>
                        </div>

                        {loadingProducts ? (
                            <div className="premium-empty">
                                <ShoppingBag
                                    size={30}
                                />

                                <h3>
                                    Loading products...
                                </h3>

                                <p>
                                    Please wait while
                                    we load the
                                    collection.
                                </p>
                            </div>
                        ) : productsError ? (
                            <div className="premium-empty">
                                <Search
                                    size={30}
                                />

                                <h3>
                                    Unable to load
                                    products
                                </h3>

                                <p>
                                    {productsError}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                >
                                    TRY AGAIN
                                </button>
                            </div>
                        ) : filteredProducts.length >
                            0 ? (
                            <div className="premium-product-grid">
                                {filteredProducts.map(
                                    (
                                        product
                                    ) => {
                                        const productId =
                                            product.id ||
                                            product._id;

                                        const wishlisted =
                                            isWishlisted(
                                                productId
                                            );

                                        const discount =
                                            product.oldPrice
                                                ? Math.round(
                                                    ((Number(
                                                        product.oldPrice
                                                    ) -
                                                        Number(
                                                            product.price
                                                        )) /
                                                        Number(
                                                            product.oldPrice
                                                        )) *
                                                    100
                                                )
                                                : 0;

                                        return (
                                            <article
                                                className="premium-product-card"
                                                key={
                                                    productId
                                                }
                                            >
                                                <div className="premium-product-image">
                                                    <Link
                                                        to={`/product/${productId}`}
                                                    >
                                                        <img
                                                            src={
                                                                product.image
                                                            }
                                                            alt={
                                                                product.name
                                                            }
                                                            onError={(
                                                                e
                                                            ) => {
                                                                e.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    </Link>

                                                    {product.badge && (
                                                        <span className="premium-badge">
                                                            {
                                                                product.badge
                                                            }
                                                        </span>
                                                    )}

                                                    {discount >
                                                        0 && (
                                                            <span className="premium-discount">
                                                                -
                                                                {
                                                                    discount
                                                                }
                                                                %
                                                            </span>
                                                        )}

                                                    <button
                                                        type="button"
                                                        className={`premium-wishlist ${wishlisted
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                        onClick={() =>
                                                            handleWishlist(
                                                                product
                                                            )
                                                        }
                                                        aria-label="Wishlist"
                                                    >
                                                        <Heart
                                                            size={
                                                                18
                                                            }
                                                            strokeWidth={
                                                                2
                                                            }
                                                            className={
                                                                wishlisted
                                                                    ? "heart-filled"
                                                                    : ""
                                                            }
                                                            fill={
                                                                wishlisted
                                                                    ? "#c94b4b"
                                                                    : "none"
                                                            }
                                                            color={
                                                                wishlisted
                                                                    ? "#c94b4b"
                                                                    : "currentColor"
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="premium-hover-cart"
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <ShoppingBag
                                                            size={
                                                                15
                                                            }
                                                        />
                                                        ADD TO CART
                                                    </button>
                                                </div>

                                                <div className="premium-product-info">
                                                    <div className="premium-product-top">
                                                        <span>
                                                            {
                                                                product.category
                                                            }
                                                        </span>

                                                        <div className="premium-rating">
                                                            <Star
                                                                size={
                                                                    12
                                                                }
                                                                fill="currentColor"
                                                            />

                                                            {
                                                                product.rating
                                                            }
                                                        </div>
                                                    </div>

                                                    <Link
                                                        to={`/product/${productId}`}
                                                        className="premium-product-name"
                                                    >
                                                        {
                                                            product.name
                                                        }
                                                    </Link>

                                                    <div className="premium-price">
                                                        <strong>
                                                            ₹
                                                            {Number(
                                                                product.price ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>

                                                        {product.oldPrice && (
                                                            <del>
                                                                ₹
                                                                {Number(
                                                                    product.oldPrice
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </del>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div className="premium-empty">
                                <Search
                                    size={30}
                                />

                                <h3>
                                    No pieces found
                                </h3>

                                <p>
                                    Try another
                                    search or
                                    category.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch(
                                            ""
                                        );
                                        changeCategory(
                                            "All"
                                        );
                                    }}
                                >
                                    VIEW ALL
                                    PRODUCTS
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </section>

            {mobileFilters && (
                <div
                    className="shop-filter-overlay"
                    onClick={() =>
                        setMobileFilters(
                            false
                        )
                    }
                >
                    <aside
                        className="shop-filter-drawer"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="shop-drawer-header">
                            <div>
                                <span>
                                    HOMEAURA
                                </span>

                                <h3>
                                    Filter Products
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileFilters(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={21}
                                />
                            </button>
                        </div>

                        <div className="shop-drawer-categories">
                            {categories.map(
                                (
                                    category
                                ) => (
                                    <button
                                        key={
                                            category
                                        }
                                        type="button"
                                        className={
                                            selectedCategory ===
                                                category
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() => {
                                            changeCategory(
                                                category
                                            );
                                            setMobileFilters(
                                                false
                                            );
                                        }}
                                    >
                                        <span>
                                            {
                                                category
                                            }
                                        </span>

                                        <small>
                                            {categoryCount(
                                                category
                                            )}
                                        </small>
                                    </button>
                                )
                            )}
                        </div>
                    </aside>
                </div>
            )}

            {toast && (
                <div className="shop-toast">
                    <ShoppingBag
                        size={16}
                    />
                    {toast}
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Shop;
