import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Minus,
    Plus,
    Trash2,
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    Truck,
    TicketPercent,
    X,
} from "lucide-react";

import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

function Cart() {
    const navigate = useNavigate();

    const {
        cartItems,
        cartSubtotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = useCart();

    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");

    const delivery = cartSubtotal >= 999 ? 0 : 99;

    const total = Math.max(
        0,
        cartSubtotal - couponDiscount + delivery
    );

    /* =====================================================
       COUPON INPUT
    ===================================================== */

    const handleCouponChange = (e) => {
        const value = e.target.value.toUpperCase();

        setCoupon(value);
        setCouponError("");
        setCouponSuccess("");
    };

    /* =====================================================
       APPLY COUPON
    ===================================================== */

    const applyCoupon = async () => {
        console.log("🔥 CART APPLY COUPON CLICKED:", coupon);

        setCouponError("");
        setCouponSuccess("");

        const code = coupon.trim().toUpperCase();

        if (!code) {
            setCouponError("Please enter a coupon code.");
            return;
        }

        try {
            setCouponLoading(true);

            console.log("📤 Sending cart coupon:", {
                code,
                orderAmount: cartSubtotal,
            });

            const response = await axios.post(
                "http://localhost:5000/api/coupons/validate",
                {
                    code,
                    orderAmount: Number(cartSubtotal),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(
                "📥 Cart coupon response:",
                response.data
            );

            if (!response.data.success) {
                setAppliedCoupon(null);
                setCouponDiscount(0);

                setCouponError(
                    response.data.message ||
                    "Invalid coupon code."
                );

                return;
            }

            const couponData = response.data.coupon;

            const discount = Number(
                response.data.discount || 0
            );

            if (!couponData) {
                setAppliedCoupon(null);
                setCouponDiscount(0);

                setCouponError(
                    "Coupon information was not returned by server."
                );

                return;
            }

            setAppliedCoupon(couponData);
            setCouponDiscount(discount);

            setCouponSuccess(
                `${couponData.code} applied successfully! You saved ₹${discount.toLocaleString(
                    "en-IN"
                )}.`
            );

            console.log(
                "✅ CART COUPON APPLIED:",
                couponData.code
            );

            console.log(
                "💰 CART DISCOUNT:",
                discount
            );
        } catch (error) {
            console.error(
                "❌ Cart coupon validation error:",
                error
            );

            setAppliedCoupon(null);
            setCouponDiscount(0);

            if (error.response) {
                setCouponError(
                    error.response.data?.message ||
                    `Server error (${error.response.status})`
                );
            } else if (error.request) {
                setCouponError(
                    "Backend server is not responding. Please make sure backend is running on port 5000."
                );
            } else {
                setCouponError(
                    error.message ||
                    "Unable to apply coupon."
                );
            }
        } finally {
            setCouponLoading(false);
        }
    };

    /* =====================================================
       REMOVE COUPON
    ===================================================== */

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCoupon("");
        setCouponError("");
        setCouponSuccess("");

        console.log("🗑️ CART COUPON REMOVED");
    };

    /* =====================================================
       CHECKOUT
    ===================================================== */

    const handleCheckout = () => {
        navigate("/checkout", {
            state: {
                coupon: appliedCoupon,
                couponDiscount,
            },
        });
    };

    return (
        <div className="cart-page">
            <Navbar />

            <section className="cart-header">
                <div>
                    <span>YOUR HOMEAURA BAG</span>

                    <h1>
                        Shopping
                        <br />
                        <em>Cart.</em>
                    </h1>
                </div>

                <p>
                    Review your selected pieces before
                    moving to checkout.
                </p>
            </section>

            <section className="cart-section">
                {cartItems.length > 0 ? (
                    <div className="cart-layout">

                        {/* =================================================
                            CART ITEMS
                        ================================================= */}

                        <div className="cart-items-section">

                            <div className="cart-items-heading">
                                <span>PRODUCT</span>

                                <span>
                                    {cartItems.length}{" "}
                                    {cartItems.length === 1
                                        ? "ITEM"
                                        : "ITEMS"}
                                </span>
                            </div>

                            {cartItems.map((item) => (
                                <div
                                    className="cart-item"
                                    key={item.id}
                                >
                                    <Link
                                        to={`/product/${item.id}`}
                                        className="cart-item-image"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                        />
                                    </Link>

                                    <div className="cart-item-details">

                                        <span className="cart-item-category">
                                            {item.category}
                                        </span>

                                        <Link
                                            to={`/product/${item.id}`}
                                            className="cart-item-name"
                                        >
                                            {item.name}
                                        </Link>

                                        <span className="cart-item-price mobile-price">
                                            ₹
                                            {item.price.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                        <div className="cart-item-bottom">

                                            <div className="quantity-control">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={13} />
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={13} />
                                                </button>

                                            </div>

                                            <button
                                                type="button"
                                                className="remove-item"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id
                                                    )
                                                }
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>

                                        </div>
                                    </div>

                                    <div className="cart-item-right">
                                        <strong>
                                            ₹
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            ))}

                            <Link
                                to="/shop"
                                className="continue-shopping"
                            >
                                <ArrowRight
                                    size={16}
                                    style={{
                                        transform:
                                            "rotate(180deg)",
                                    }}
                                />
                                Continue Shopping
                            </Link>
                        </div>

                        {/* =================================================
                            CART SUMMARY
                        ================================================= */}

                        <aside className="cart-summary">

                            <div className="cart-summary-heading">
                                <span>SUMMARY</span>
                                <h2>Order Total</h2>
                            </div>

                            {/* SUBTOTAL */}

                            <div className="summary-row">
                                <span>Subtotal</span>

                                <strong>
                                    ₹
                                    {cartSubtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            {/* DISCOUNT */}

                            {couponDiscount > 0 && (
                                <div className="summary-row discount-row">

                                    <span>
                                        Discount
                                    </span>

                                    <strong>
                                        -₹
                                        {couponDiscount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>
                            )}

                            {/* DELIVERY */}

                            <div className="summary-row">
                                <span>Delivery</span>

                                <strong>
                                    {delivery === 0
                                        ? "FREE"
                                        : `₹${delivery}`}
                                </strong>
                            </div>

                            <div className="summary-divider"></div>

                            {/* TOTAL */}

                            <div className="summary-total">
                                <span>Total</span>

                                <strong>
                                    ₹
                                    {total.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            {/* =================================================
                                COUPON
                            ================================================= */}

                            <div className="cart-coupon">

                                {!appliedCoupon ? (
                                    <>
                                        <div className="cart-coupon-title">
                                            <TicketPercent
                                                size={16}
                                            />

                                            <label>
                                                HAVE A COUPON?
                                            </label>
                                        </div>

                                        <div className="coupon-input">

                                            <input
                                                type="text"
                                                placeholder="Enter coupon"
                                                value={coupon}
                                                onChange={
                                                    handleCouponChange
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key ===
                                                        "Enter"
                                                    ) {
                                                        e.preventDefault();
                                                        applyCoupon();
                                                    }
                                                }}
                                                autoComplete="off"
                                            />

                                            <button
                                                type="button"
                                                onClick={
                                                    applyCoupon
                                                }
                                                disabled={
                                                    couponLoading
                                                }
                                            >
                                                {couponLoading
                                                    ? "..."
                                                    : "APPLY"}
                                            </button>

                                        </div>

                                        {couponError && (
                                            <p className="coupon-error">
                                                {couponError}
                                            </p>
                                        )}

                                        {couponSuccess && (
                                            <p className="coupon-success">
                                                {couponSuccess}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="cart-applied-coupon">

                                            <div>
                                                <span>
                                                    COUPON APPLIED
                                                </span>

                                                <strong>
                                                    {
                                                        appliedCoupon.code
                                                    }
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    removeCoupon
                                                }
                                                aria-label="Remove coupon"
                                            >
                                                <X size={15} />
                                            </button>

                                        </div>

                                        <p className="coupon-success">
                                            ✓{" "}
                                            {
                                                appliedCoupon.code
                                            }{" "}
                                            applied — You saved ₹
                                            {couponDiscount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </>
                                )}

                            </div>

                            {/* CHECKOUT */}

                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                                <ArrowRight size={17} />
                            </button>

                            <div className="secure-checkout">
                                <ShieldCheck size={15} />
                                Secure checkout
                            </div>

                        </aside>
                    </div>
                ) : (
                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            <ShoppingBag size={34} />
                        </div>

                        <span>
                            YOUR BAG IS EMPTY
                        </span>

                        <h2>
                            Nothing here
                            <br />
                            <em>yet.</em>
                        </h2>

                        <p>
                            Discover beautiful furniture and
                            decor for your home.
                        </p>

                        <Link
                            to="/shop"
                            className="empty-cart-btn"
                        >
                            Explore Collection
                            <ArrowRight size={16} />
                        </Link>

                    </div>
                )}
            </section>

            {/* =====================================================
                BENEFITS
            ===================================================== */}

            <section className="cart-benefits">

                <div>
                    <Truck size={21} />

                    <div>
                        <strong>
                            Free Delivery
                        </strong>

                        <span>
                            Orders above ₹999
                        </span>
                    </div>
                </div>

                <div>
                    <ShieldCheck size={21} />

                    <div>
                        <strong>
                            Secure Payment
                        </strong>

                        <span>
                            100% protected checkout
                        </span>
                    </div>
                </div>

                <div>
                    <ShoppingBag size={21} />

                    <div>
                        <strong>
                            Easy Returns
                        </strong>

                        <span>
                            7-day return policy
                        </span>
                    </div>
                </div>

            </section>

            <Footer />
        </div>
    );
}

export default Cart;