import { useEffect, useMemo, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import axios from "axios";

import {
    ArrowRight,
    Heart,
    Minus,
    Plus,
    ShoppingBag,
    Star,
    Truck,
    ShieldCheck,
    RotateCcw,
    Check,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // =====================================================
    // CONTEXTS
    // =====================================================

    const {
        addToCart,
    } = useCart();

    const {
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
    } = useWishlist();

    // =====================================================
    // API URL
    // =====================================================

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";

    // =====================================================
    // PRODUCT STATES
    // =====================================================

    const [product, setProduct] = useState(null);

    const [allProducts, setAllProducts] = useState([]);

    const [productLoading, setProductLoading] =
        useState(true);

    const [productError, setProductError] =
        useState("");

    // =====================================================
    // LOCAL STATES
    // =====================================================

    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // =====================================================
    // REVIEWS STATES
    // =====================================================

    const [reviews, setReviews] = useState([]);

    const [averageRating, setAverageRating] =
        useState(0);

    const [totalReviews, setTotalReviews] =
        useState(0);

    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");

    const [reviewLoading, setReviewLoading] =
        useState(false);

    const [reviewSubmitting, setReviewSubmitting] =
        useState(false);

    const [reviewError, setReviewError] =
        useState("");

    const [reviewSuccess, setReviewSuccess] =
        useState("");

    // =====================================================
    // IMAGE URL HELPER
    // =====================================================

    const getImageUrl = (image) => {
        if (!image) return "";

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `${BACKEND_URL}${image.startsWith("/")
            ? image
            : `/${image}`
            }`;
    };

    // =====================================================
    // LOAD PRODUCT + ALL PRODUCTS
    // =====================================================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductLoading(true);
                setProductError("");

                // Fetch selected product
                const productResponse =
                    await axios.get(
                        `${API_URL}/api/products/${id}`
                    );

                if (
                    !productResponse.data.success ||
                    !productResponse.data.product
                ) {
                    setProductError(
                        "Product not found."
                    );
                    setProduct(null);
                    return;
                }

                const backendProduct =
                    productResponse.data.product;

                const normalizedProduct = {
                    ...backendProduct,

                    // Keep id for Cart/Wishlist/Reviews
                    id:
                        backendProduct._id ||
                        backendProduct.id,

                    image: getImageUrl(
                        backendProduct.image
                    ),
                };

                setProduct(
                    normalizedProduct
                );

                setAverageRating(
                    Number(
                        backendProduct.rating || 0
                    )
                );

                setTotalReviews(
                    Number(
                        backendProduct.reviews || 0
                    )
                );

                // Fetch all products for related products
                try {
                    const allResponse =
                        await axios.get(
                            `${API_URL}/api/products`
                        );

                    const backendProducts =
                        allResponse.data.products ||
                        [];

                    const normalizedProducts =
                        backendProducts
                            .filter(
                                (item) =>
                                    item.isActive !== false
                            )
                            .map((item) => ({
                                ...item,
                                id:
                                    item._id ||
                                    item.id,
                                image:
                                    getImageUrl(
                                        item.image
                                    ),
                            }));

                    setAllProducts(
                        normalizedProducts
                    );
                } catch (error) {
                    console.error(
                        "Fetch all products error:",
                        error
                    );

                    setAllProducts([]);
                }
            } catch (error) {
                console.error(
                    "Fetch product error:",
                    error
                );

                setProduct(null);

                setProductError(
                    error.response?.data?.message ||
                    "Failed to load product."
                );
            } finally {
                setProductLoading(false);
            }
        };

        if (id) {
            fetchProducts();
        }
    }, [id]);

    // =====================================================
    // WISHLIST STATE
    // =====================================================

    const wishlist = product
        ? isWishlisted(product.id)
        : false;

    // =====================================================
    // RELATED PRODUCTS
    // =====================================================

    const relatedProducts = useMemo(() => {
        if (!product) return [];

        return allProducts
            .filter(
                (item) =>
                    String(item.id) !==
                    String(product.id) &&
                    (
                        item.room === product.room ||
                        item.category ===
                        product.category
                    )
            )
            .slice(0, 3);
    }, [allProducts, product]);

    // =====================================================
    // LOAD REVIEWS
    // =====================================================

    useEffect(() => {
        if (!product) return;

        const fetchReviews = async () => {
            try {
                setReviewLoading(true);

                const response = await axios.get(
                    `${API_URL}/api/reviews/product/${product.id}`
                );

                setReviews(
                    response.data.reviews || []
                );

                setAverageRating(
                    response.data.averageRating ??
                    product.rating ??
                    0
                );

                setTotalReviews(
                    response.data.totalReviews ??
                    product.reviews ??
                    0
                );
            } catch (error) {
                console.error(
                    "Fetch reviews error:",
                    error
                );
            } finally {
                setReviewLoading(false);
            }
        };

        fetchReviews();
    }, [product]);

    // =====================================================
    // PRODUCT LOADING
    // =====================================================

    if (productLoading) {
        return (
            <div className="product-not-found">
                <Navbar />

                <div className="product-not-found-content">
                    <span>
                        LOADING PRODUCT
                    </span>

                    <h1>
                        Please wait...
                    </h1>

                    <Link to="/shop">
                        Back to Shop
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <Footer />
            </div>
        );
    }

    // =====================================================
    // PRODUCT NOT FOUND
    // =====================================================

    if (!product) {
        return (
            <div className="product-not-found">

                <Navbar />

                <div className="product-not-found-content">

                    <span>
                        PRODUCT NOT FOUND
                    </span>

                    <h1>
                        {productError ||
                            "We couldn't find that piece."}
                    </h1>

                    <Link to="/shop">
                        Back to Shop
                        <ArrowRight size={16} />
                    </Link>

                </div>

                <Footer />

            </div>
        );
    }

    // =====================================================
    // DISCOUNT
    // =====================================================

    const discount =
        product.oldPrice &&
            product.oldPrice > product.price
            ? Math.round(
                (
                    (product.oldPrice -
                        product.price) /
                    product.oldPrice
                ) * 100
            )
            : 0;

    // =====================================================
    // ADD TO CART
    // =====================================================

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2200);
    };

    // =====================================================
    // WISHLIST
    // =====================================================

    const handleWishlist = () => {
        if (wishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    // =====================================================
    // SUBMIT REVIEW
    // =====================================================

    const handleSubmitReview = async (event) => {
        event.preventDefault();

        setReviewError("");
        setReviewSuccess("");

        const token =
            localStorage.getItem(
                "homeAuraToken"
            );

        if (!token) {
            navigate("/login");
            return;
        }

        if (!reviewComment.trim()) {
            setReviewError(
                "Please write a review comment."
            );
            return;
        }

        if (reviewComment.trim().length < 5) {
            setReviewError(
                "Review must contain at least 5 characters."
            );
            return;
        }

        try {
            setReviewSubmitting(true);

            const response = await axios.post(
                `${API_URL}/api/reviews`,
                {
                    productId: String(
                        product.id
                    ),
                    rating: reviewRating,
                    comment:
                        reviewComment.trim(),
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const newReview =
                response.data.review;

            const updatedReviews = [
                newReview,
                ...reviews,
            ];

            setReviews(
                updatedReviews
            );

            const newTotal =
                updatedReviews.length;

            const newAverage =
                updatedReviews.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.rating),
                    0
                ) / newTotal;

            setTotalReviews(
                newTotal
            );

            setAverageRating(
                Math.round(
                    newAverage * 10
                ) / 10
            );

            setReviewComment("");
            setReviewRating(5);

            setReviewSuccess(
                "Your review has been submitted successfully."
            );
        } catch (error) {
            console.error(
                "Submit review error:",
                error
            );

            setReviewError(
                error.response?.data?.message ||
                "Failed to submit review. Please try again."
            );
        } finally {
            setReviewSubmitting(false);
        }
    };

    // =====================================================
    // BUY NOW
    // =====================================================

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        navigate("/checkout");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="product-page">

            <Navbar />

            <main>

                {/* =========================================
                    BREADCRUMB
                ========================================== */}

                <div className="product-breadcrumb">

                    <Link to="/">
                        Home
                    </Link>

                    <span>/</span>

                    <Link to="/shop">
                        Shop
                    </Link>

                    <span>/</span>

                    <span>
                        {product.name}
                    </span>

                </div>

                {/* =========================================
                    PRODUCT MAIN
                ========================================== */}

                <section className="product-main">

                    {/* =====================================
                        IMAGE
                    ====================================== */}

                    <div className="product-gallery">

                        {product.badge && (
                            <div className="product-badge">
                                {product.badge}
                            </div>
                        )}

                        <button
                            type="button"
                            className={`product-gallery-wishlist ${wishlist
                                ? "active"
                                : ""
                                }`}
                            onClick={
                                handleWishlist
                            }
                            aria-label={
                                wishlist
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                        >

                            <Heart
                                size={20}
                                fill={
                                    wishlist
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                        </button>

                        <img
                            src={product.image}
                            alt={product.name}
                        />

                    </div>

                    {/* =====================================
                        DETAILS
                    ====================================== */}

                    <div className="product-info">

                        <span className="product-category">
                            {product.room} /{" "}
                            {product.category}
                        </span>

                        <h1>
                            {product.name}
                        </h1>

                        {/* RATING */}

                        <div className="product-rating">

                            <div className="stars">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <Star
                                            key={star}
                                            size={16}
                                            fill={
                                                star <=
                                                    Math.round(
                                                        averageRating
                                                    )
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    )
                                )}

                            </div>

                            <strong>
                                {Number(
                                    averageRating
                                ).toFixed(1)}
                            </strong>

                            <span>
                                ({totalReviews} reviews)
                            </span>

                        </div>

                        {/* PRICE */}

                        <div className="product-price-row">

                            <strong>
                                ₹
                                {Number(
                                    product.price
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

                            {discount > 0 && (
                                <span>
                                    {discount}% OFF
                                </span>
                            )}

                        </div>

                        {/* DESCRIPTION */}

                        <p className="product-description">
                            {product.description}
                        </p>

                        {/* =================================
                            PRODUCT OPTIONS
                        ================================== */}

                        <div className="product-option">

                            <div className="option-heading">

                                <span>
                                    Color
                                </span>

                                <strong>
                                    {product.color ||
                                        "Standard"}
                                </strong>

                            </div>

                            <div className="color-option selected">

                                <span />

                                {product.color ||
                                    "Standard"}

                                <Check size={14} />

                            </div>

                        </div>

                        {/* =================================
                            QUANTITY
                        ================================== */}

                        <div className="quantity-section">

                            <span>
                                Quantity
                            </span>

                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            (value) =>
                                                Math.max(
                                                    1,
                                                    value - 1
                                                )
                                        )
                                    }
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={16} />
                                </button>

                                <strong>
                                    {quantity}
                                </strong>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            (value) =>
                                                value + 1
                                        )
                                    }
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={16} />
                                </button>

                            </div>

                        </div>

                        {/* =================================
                            ACTIONS
                        ================================== */}

                        <div className="product-actions">

                            {/* ADD TO CART */}

                            <button
                                type="button"
                                className={`add-cart-btn ${added
                                    ? "added"
                                    : ""
                                    }`}
                                onClick={
                                    handleAddToCart
                                }
                            >

                                {added ? (
                                    <>
                                        <Check size={18} />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag
                                            size={18}
                                        />
                                        Add to Cart
                                    </>
                                )}

                            </button>

                            {/* BUY NOW */}

                            <button
                                type="button"
                                className="buy-now-btn"
                                onClick={
                                    handleBuyNow
                                }
                            >

                                Buy It Now

                                <ArrowRight
                                    size={18}
                                />

                            </button>

                        </div>

                        {/* =================================
                            DELIVERY BENEFITS
                        ================================== */}

                        <div className="product-benefits">

                            <div>

                                <Truck size={21} />

                                <div>

                                    <strong>
                                        Free Delivery
                                    </strong>

                                    <span>
                                        On orders above ₹999
                                    </span>

                                </div>

                            </div>

                            <div>

                                <RotateCcw size={21} />

                                <div>

                                    <strong>
                                        7-Day Returns
                                    </strong>

                                    <span>
                                        Easy return policy
                                    </span>

                                </div>

                            </div>

                            <div>

                                <ShieldCheck
                                    size={21}
                                />

                                <div>

                                    <strong>
                                        Secure Payment
                                    </strong>

                                    <span>
                                        100% secure checkout
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =========================================
                    SPECIFICATIONS
                ========================================== */}

                <section className="product-spec-section">

                    <div className="product-spec-intro">

                        <span>
                            DETAILS
                        </span>

                        <h2>
                            Made for beautiful living.
                        </h2>

                        <p>
                            Every HomeAura piece is selected
                            to bring comfort, character and
                            lasting style into your home.
                        </p>

                    </div>

                    <div className="product-specs">

                        <div>

                            <span>
                                Material
                            </span>

                            <strong>
                                {product.material ||
                                    "Premium quality"}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Dimensions
                            </span>

                            <strong>
                                {product.dimensions ||
                                    "Not specified"}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Color
                            </span>

                            <strong>
                                {product.color ||
                                    "Standard"}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Collection
                            </span>

                            <strong>
                                HomeAura Collection
                            </strong>

                        </div>

                    </div>

                </section>

                {/* =========================================
                    CUSTOMER REVIEWS
                ========================================== */}

                <section className="product-reviews-section">

                    <div className="reviews-heading">

                        <div>

                            <span>
                                CUSTOMER REVIEWS
                            </span>

                            <h2>
                                What our customers say.
                            </h2>

                        </div>

                        <div className="reviews-summary">

                            <strong>
                                {Number(
                                    averageRating
                                ).toFixed(1)}
                            </strong>

                            <div className="reviews-summary-stars">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <Star
                                            key={star}
                                            size={17}
                                            fill={
                                                star <=
                                                    Math.round(
                                                        averageRating
                                                    )
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    )
                                )}

                            </div>

                            <span>
                                {totalReviews} reviews
                            </span>

                        </div>

                    </div>

                    {/* REVIEW FORM */}

                    <div className="review-form-card">

                        <h3>
                            Write a Review
                        </h3>

                        <p>
                            Share your experience with
                            this product.
                        </p>

                        <form
                            onSubmit={
                                handleSubmitReview
                            }
                        >

                            <div className="review-rating-input">

                                <span>
                                    Your Rating
                                </span>

                                <div>

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    setReviewRating(
                                                        star
                                                    )
                                                }
                                                className={
                                                    star <=
                                                        reviewRating
                                                        ? "active"
                                                        : ""
                                                }
                                                aria-label={`Rate ${star} stars`}
                                            >

                                                <Star
                                                    size={22}
                                                    fill={
                                                        star <=
                                                            reviewRating
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />

                                            </button>
                                        )
                                    )}

                                </div>

                            </div>

                            <textarea
                                value={
                                    reviewComment
                                }
                                onChange={(event) =>
                                    setReviewComment(
                                        event.target.value
                                    )
                                }
                                placeholder="Write your review..."
                                maxLength={1000}
                                rows={5}
                            />

                            {reviewError && (
                                <div className="review-message error">
                                    {reviewError}
                                </div>
                            )}

                            {reviewSuccess && (
                                <div className="review-message success">
                                    {reviewSuccess}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="submit-review-btn"
                                disabled={
                                    reviewSubmitting
                                }
                            >
                                {reviewSubmitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>

                        </form>

                    </div>

                    {/* REVIEW LIST */}

                    <div className="reviews-list">

                        {reviewLoading ? (
                            <div className="reviews-empty">
                                Loading reviews...
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="reviews-empty">

                                <Star size={24} />

                                <h3>
                                    No reviews yet
                                </h3>

                                <p>
                                    Be the first to review
                                    this product.
                                </p>

                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div
                                    className="review-card"
                                    key={review._id}
                                >

                                    <div className="review-card-top">

                                        <div>

                                            <strong>
                                                {
                                                    review.customerName
                                                }
                                            </strong>

                                            <div className="review-stars">

                                                {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                        <Star
                                                            key={
                                                                star
                                                            }
                                                            size={
                                                                15
                                                            }
                                                            fill={
                                                                star <=
                                                                    review.rating
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />
                                                    )
                                                )}

                                            </div>

                                        </div>

                                        <span>
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>

                                    </div>

                                    <p>
                                        {
                                            review.comment
                                        }
                                    </p>

                                </div>
                            ))
                        )}

                    </div>

                </section>

                {/* =========================================
                    RELATED PRODUCTS
                ========================================== */}

                {relatedProducts.length > 0 && (
                    <section className="related-products">

                        <div className="related-heading">

                            <div>

                                <span>
                                    YOU MAY ALSO LIKE
                                </span>

                                <h2>
                                    Complete the look.
                                </h2>

                            </div>

                            <Link to="/shop">

                                View All

                                <ArrowRight
                                    size={16}
                                />

                            </Link>

                        </div>

                        <div className="related-grid">

                            {relatedProducts.map(
                                (item) => (
                                    <Link
                                        to={`/product/${item.id}`}
                                        className="related-card"
                                        key={item.id}
                                    >

                                        <div className="related-image">

                                            <img
                                                src={
                                                    item.image
                                                }
                                                alt={
                                                    item.name
                                                }
                                            />

                                            {item.badge && (
                                                <span>
                                                    {
                                                        item.badge
                                                    }
                                                </span>
                                            )}

                                        </div>

                                        <div className="related-card-info">

                                            <small>
                                                {
                                                    item.category
                                                }
                                            </small>

                                            <h3>
                                                {
                                                    item.name
                                                }
                                            </h3>

                                            <div>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                                {item.oldPrice && (
                                                    <del>
                                                        ₹
                                                        {Number(
                                                            item.oldPrice
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </del>
                                                )}

                                            </div>

                                        </div>

                                    </Link>
                                )
                            )}

                        </div>

                    </section>
                )}

            </main>

            <Footer />

        </div>
    );
}

export default ProductDetails;
