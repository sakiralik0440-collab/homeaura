import { Link } from "react-router-dom";
import {
    Heart,
    ShoppingBag,
    Trash2,
    ArrowRight,
    Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
    const {
        wishlistItems,
        removeFromWishlist,
    } = useWishlist();

    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    return (
        <div className="wishlist-page">
            <Navbar />

            <section className="wishlist-header">
                <div>
                    <span>YOUR HOMEAURA COLLECTION</span>

                    <h1>
                        Your
                        <br />
                        <em>Wishlist.</em>
                    </h1>
                </div>

                <p>
                    Keep the pieces you love close and
                    come back to them whenever you're ready.
                </p>
            </section>

            <section className="wishlist-section">
                {wishlistItems.length > 0 ? (
                    <>
                        <div className="wishlist-top">
                            <span>
                                {wishlistItems.length}{" "}
                                {wishlistItems.length === 1
                                    ? "PIECE"
                                    : "PIECES"}{" "}
                                SAVED
                            </span>

                            <span>HOMEAURA FAVOURITES</span>
                        </div>

                        <div className="wishlist-grid">
                            {wishlistItems.map((product) => {
                                const discount = product.oldPrice
                                    ? Math.round(
                                        ((product.oldPrice -
                                            product.price) /
                                            product.oldPrice) *
                                        100
                                    )
                                    : 0;

                                return (
                                    <article
                                        className="wishlist-card"
                                        key={product.id}
                                    >
                                        <div className="wishlist-image">
                                            <Link
                                                to={`/product/${product.id}`}
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                />
                                            </Link>

                                            {product.badge && (
                                                <span className="wishlist-badge">
                                                    {product.badge}
                                                </span>
                                            )}

                                            {discount > 0 && (
                                                <span className="wishlist-discount">
                                                    -{discount}%
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                className="wishlist-remove"
                                                onClick={() =>
                                                    removeFromWishlist(
                                                        product.id
                                                    )
                                                }
                                                aria-label="Remove from wishlist"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="wishlist-info">
                                            <div className="wishlist-meta">
                                                <span>
                                                    {product.category}
                                                </span>

                                                <span className="wishlist-rating">
                                                    <Star
                                                        size={12}
                                                        fill="currentColor"
                                                    />
                                                    {product.rating}
                                                </span>
                                            </div>

                                            <Link
                                                to={`/product/${product.id}`}
                                                className="wishlist-name"
                                            >
                                                {product.name}
                                            </Link>

                                            <div className="wishlist-price">
                                                <strong>
                                                    ₹
                                                    {product.price.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                                {product.oldPrice && (
                                                    <del>
                                                        ₹
                                                        {product.oldPrice.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </del>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className="wishlist-cart-btn"
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                            >
                                                <ShoppingBag size={15} />
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="empty-wishlist">
                        <div className="empty-wishlist-icon">
                            <Heart size={34} />
                        </div>

                        <span>YOUR WISHLIST IS EMPTY</span>

                        <h2>
                            Save what
                            <br />
                            <em>you love.</em>
                        </h2>

                        <p>
                            Tap the heart on any product to save
                            it here for later.
                        </p>

                        <Link
                            to="/shop"
                            className="empty-wishlist-btn"
                        >
                            Explore Collection
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default Wishlist;