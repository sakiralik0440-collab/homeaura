
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CreditCard,
    Package,
    ShieldCheck,
    TicketPercent,
    Truck,
    X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000";

// =====================================================
// LOAD RAZORPAY CHECKOUT SCRIPT
// =====================================================

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

        if (existingScript) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => resolve(true);

        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};

// =====================================================
// CHECKOUT COMPONENT
// =====================================================

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        cartItems,
        cartSubtotal,
        clearCart,
    } = useCart();

    // =====================================================
    // RAZORPAY SUCCESS REF
    // =====================================================

    const razorpayPaymentSuccessRef = useRef(false);

    // =====================================================
    // COUPON STATE
    // =====================================================

    const [coupon, setCoupon] = useState(
        location.state?.coupon?.code || ""
    );

    const [appliedCoupon, setAppliedCoupon] = useState(
        location.state?.coupon || null
    );

    const [couponDiscount, setCouponDiscount] = useState(
        Number(location.state?.couponDiscount || 0)
    );

    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");

    // =====================================================
    // PAYMENT STATE
    // =====================================================

    const [paymentMethod, setPaymentMethod] = useState("cod");

    // =====================================================
    // FORM STATE
    // =====================================================

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    // =====================================================
    // ORDER STATE
    // =====================================================

    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState("");

    // =====================================================
    // EMPTY CART CHECK
    // =====================================================

    useEffect(() => {
        if (!cartItems.length && !placingOrder) {
            navigate("/cart", { replace: true });
        }
    }, [
        cartItems.length,
        placingOrder,
        navigate,
    ]);

    // =====================================================
    // DELIVERY
    // =====================================================

    const delivery =
        cartSubtotal >= 999 ? 0 : 99;

    // =====================================================
    // DISCOUNT
    // =====================================================

    const discount = Math.min(
        Number(couponDiscount || 0),
        Number(cartSubtotal || 0)
    );

    // =====================================================
    // FINAL TOTAL
    // =====================================================

    const total = Math.max(
        0,
        Number(cartSubtotal || 0) -
        discount +
        delivery
    );

    // =====================================================
    // HANDLE FORM CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    // =====================================================
    // APPLY COUPON
    // =====================================================

    const handleApplyCoupon = async () => {
        const code =
            coupon.trim().toUpperCase();

        console.log(
            "🔥 CHECKOUT APPLY COUPON CLICKED:",
            code
        );

        if (!code) {
            setCouponError(
                "Please enter a coupon code."
            );

            setCouponSuccess("");

            return;
        }

        if (
            !cartSubtotal ||
            cartSubtotal <= 0
        ) {
            setCouponError(
                "Your cart is empty."
            );

            setCouponSuccess("");

            return;
        }

        try {
            setCouponLoading(true);

            setCouponError("");
            setCouponSuccess("");

            const response =
                await axios.post(
                    `${API_URL}/api/coupons/validate`,
                    {
                        code,
                        orderAmount:
                            Number(
                                cartSubtotal
                            ),
                    }
                );

            console.log(
                "✅ COUPON RESPONSE:",
                response.data
            );

            if (
                !response.data?.success
            ) {
                throw new Error(
                    response.data?.message ||
                    "Invalid coupon"
                );
            }

            const discountAmount =
                Number(
                    response.data.discount ||
                    0
                );

            setAppliedCoupon(
                response.data.coupon
            );

            setCouponDiscount(
                discountAmount
            );

            setCoupon(
                response.data.coupon?.code ||
                code
            );

            setCouponSuccess(
                `Coupon applied successfully. You saved ₹${discountAmount.toLocaleString(
                    "en-IN"
                )}.`
            );

            setCouponError("");
        } catch (error) {
            console.error(
                "❌ CHECKOUT COUPON ERROR:",
                error
            );

            setAppliedCoupon(null);

            setCouponDiscount(0);

            setCouponError(
                error.response?.data
                    ?.message ||
                error.message ||
                "Unable to apply coupon."
            );

            setCouponSuccess("");
        } finally {
            setCouponLoading(false);
        }
    };

    // =====================================================
    // REMOVE COUPON
    // =====================================================

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);

        setCoupon("");

        setCouponDiscount(0);

        setCouponError("");

        setCouponSuccess("");
    };

    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async (
        event
    ) => {
        event.preventDefault();

        setOrderError("");

        // -------------------------------------------------
        // VALIDATE DELIVERY DETAILS
        // -------------------------------------------------

        if (
            !form.firstName.trim() ||
            !form.lastName.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.address.trim() ||
            !form.city.trim() ||
            !form.state.trim() ||
            !form.pincode.trim()
        ) {
            setOrderError(
                "Please fill in all delivery details."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        // -------------------------------------------------
        // CART CHECK
        // -------------------------------------------------

        if (!cartItems.length) {
            setOrderError(
                "Your cart is empty."
            );

            return;
        }

        try {
            // IMPORTANT:
            // Reset Razorpay success flag
            // before starting a new payment.
            razorpayPaymentSuccessRef.current = false;

            setPlacingOrder(true);

            // -------------------------------------------------
            // ORDER DATA
            // -------------------------------------------------

            const orderData = {
                customer: {
                    firstName:
                        form.firstName.trim(),

                    lastName:
                        form.lastName.trim(),

                    name: `${form.firstName.trim()} ${form.lastName.trim()}`,

                    email:
                        form.email.trim(),

                    phone:
                        form.phone.trim(),

                    address:
                        form.address.trim(),

                    city:
                        form.city.trim(),

                    state:
                        form.state.trim(),

                    pincode:
                        form.pincode.trim(),
                },

                items: cartItems.map(
                    (item) => ({
                        productId:
                            item.id,

                        name:
                            item.name,

                        image:
                            item.image,

                        price: Number(
                            item.price
                        ),

                        quantity:
                            Number(
                                item.quantity
                            ),
                    })
                ),

                subtotal:
                    Number(
                        cartSubtotal
                    ),

                delivery:
                    Number(delivery),

                couponCode:
                    appliedCoupon?.code ||
                    null,

                discount:
                    Number(discount),

                total:
                    Number(total),

                paymentMethod,

                deliveryTime:
                    "5–7 business days",
            };

            console.log(
                "🛒 ORDER DATA:",
                orderData
            );

            // =================================================
            // COD PAYMENT
            // =================================================

            if (
                paymentMethod === "cod"
            ) {
                console.log(
                    "💵 CREATING COD ORDER"
                );

                const response =
                    await axios.post(
                        `${API_URL}/api/orders`,
                        orderData
                    );

                console.log(
                    "✅ COD ORDER CREATED:",
                    response.data
                );

                if (
                    !response.data?.success
                ) {
                    throw new Error(
                        response.data
                            ?.message ||
                        "Failed to create order."
                    );
                }

                const createdOrder =
                    response.data.order;

                clearCart();

                navigate(
                    "/order-success",
                    {
                        state: {
                            order:
                                createdOrder,
                        },
                        replace: true,
                    }
                );

                return;
            }

            // =================================================
            // ONLINE PAYMENT - RAZORPAY
            // =================================================

            if (
                paymentMethod ===
                "online"
            ) {
                console.log(
                    "💳 STARTING RAZORPAY PAYMENT"
                );

                // ---------------------------------------------
                // LOAD RAZORPAY
                // ---------------------------------------------

                const razorpayLoaded =
                    await loadRazorpayScript();

                if (!razorpayLoaded) {
                    throw new Error(
                        "Unable to load Razorpay. Please check your internet connection."
                    );
                }

                // ---------------------------------------------
                // CREATE RAZORPAY ORDER
                // ---------------------------------------------

                const razorpayResponse =
                    await axios.post(
                        `${API_URL}/api/payments/create-order`,
                        {
                            amount:
                                Number(
                                    total
                                ),

                            customer: {
                                name: `${form.firstName.trim()} ${form.lastName.trim()}`,

                                email:
                                    form.email.trim(),

                                phone:
                                    form.phone.trim(),
                            },
                        }
                    );

                console.log(
                    "✅ RAZORPAY ORDER RESPONSE:",
                    razorpayResponse.data
                );

                if (
                    !razorpayResponse
                        .data
                        ?.success
                ) {
                    throw new Error(
                        razorpayResponse
                            .data
                            ?.message ||
                        "Unable to create Razorpay order."
                    );
                }

                const razorpayOrder =
                    razorpayResponse
                        .data
                        .razorpayOrder;

                const razorpayKey =
                    razorpayResponse
                        .data
                        .keyId;

                if (
                    !razorpayOrder?.id ||
                    !razorpayKey
                ) {
                    throw new Error(
                        "Invalid Razorpay order response."
                    );
                }

                // ---------------------------------------------
                // RAZORPAY CHECKOUT OPTIONS
                // ---------------------------------------------

                const options = {
                    key: razorpayKey,

                    amount:
                        razorpayOrder.amount,

                    currency:
                        razorpayOrder.currency,

                    name:
                        "HomeAura",

                    description:
                        "Home & Furniture Order",

                    order_id:
                        razorpayOrder.id,

                    prefill: {
                        name: `${form.firstName.trim()} ${form.lastName.trim()}`,

                        email:
                            form.email.trim(),

                        contact:
                            form.phone.trim(),
                    },

                    notes: {
                        address:
                            form.address.trim(),

                        city:
                            form.city.trim(),

                        state:
                            form.state.trim(),

                        pincode:
                            form.pincode.trim(),
                    },

                    theme: {
                        color:
                            "#8b6348",
                    },

                    // -----------------------------------------
                    // IMPORTANT:
                    // DO NOT RESET ORDER STATE AFTER SUCCESS
                    // -----------------------------------------

                    modal: {
                        ondismiss:
                            () => {
                                console.log(
                                    "⚠️ RAZORPAY CHECKOUT CLOSED"
                                );

                                if (
                                    !razorpayPaymentSuccessRef.current
                                ) {
                                    console.log(
                                        "ℹ️ PAYMENT WAS NOT COMPLETED"
                                    );

                                    setPlacingOrder(
                                        false
                                    );
                                } else {
                                    console.log(
                                        "✅ PAYMENT SUCCESS ALREADY RECEIVED - IGNORING DISMISS"
                                    );
                                }
                            },
                    },

                    // -----------------------------------------
                    // PAYMENT SUCCESS
                    // -----------------------------------------

                    handler:
                        async function (
                            razorpayPaymentResponse
                        ) {
                            try {
                                console.log(
                                    "✅ RAZORPAY PAYMENT SUCCESS:",
                                    razorpayPaymentResponse
                                );

                                // VERY IMPORTANT:
                                // Set this immediately so ondismiss
                                // cannot reset checkout state.
                                razorpayPaymentSuccessRef.current = true;

                                // ---------------------------------
                                // VERIFY PAYMENT
                                // ---------------------------------

                                console.log(
                                    "🔐 VERIFYING RAZORPAY PAYMENT..."
                                );

                                const verifyResponse =
                                    await axios.post(
                                        `${API_URL}/api/payments/verify`,
                                        {
                                            razorpay_order_id:
                                                razorpayPaymentResponse.razorpay_order_id,

                                            razorpay_payment_id:
                                                razorpayPaymentResponse.razorpay_payment_id,

                                            razorpay_signature:
                                                razorpayPaymentResponse.razorpay_signature,

                                            orderData,
                                        }
                                    );

                                console.log(
                                    "✅ PAYMENT VERIFICATION RESPONSE:",
                                    verifyResponse.data
                                );

                                if (
                                    !verifyResponse
                                        .data
                                        ?.success
                                ) {
                                    throw new Error(
                                        verifyResponse
                                            .data
                                            ?.message ||
                                        "Payment verification failed."
                                    );
                                }

                                const createdOrder =
                                    verifyResponse
                                        .data
                                        .order;

                                console.log(
                                    "✅ HOMEAURA ORDER CREATED:",
                                    createdOrder
                                );

                                // ---------------------------------
                                // CLEAR CART
                                // ---------------------------------

                                clearCart();

                                console.log(
                                    "🛒 CART CLEARED"
                                );

                                // ---------------------------------
                                // ORDER SUCCESS
                                // ---------------------------------

                                console.log(
                                    "➡️ REDIRECTING TO ORDER SUCCESS"
                                );

                                navigate(
                                    "/order-success",
                                    {
                                        state: {
                                            order:
                                                createdOrder,
                                        },
                                        replace: true,
                                    }
                                );
                            } catch (
                            error
                            ) {
                                console.error(
                                    "❌ PAYMENT VERIFICATION ERROR:",
                                    error
                                );

                                // Payment succeeded at Razorpay,
                                // but verification/order creation failed.
                                razorpayPaymentSuccessRef.current = false;

                                setOrderError(
                                    error
                                        .response
                                        ?.data
                                        ?.message ||
                                    error.message ||
                                    "Payment verification failed. Please contact support."
                                );

                                setPlacingOrder(
                                    false
                                );

                                window.scrollTo(
                                    {
                                        top: 0,
                                        behavior:
                                            "smooth",
                                    }
                                );
                            }
                        },
                };

                // ---------------------------------------------
                // CREATE RAZORPAY INSTANCE
                // ---------------------------------------------

                if (
                    !window.Razorpay
                ) {
                    throw new Error(
                        "Razorpay Checkout is not available."
                    );
                }

                const razorpay =
                    new window.Razorpay(
                        options
                    );

                // ---------------------------------------------
                // PAYMENT FAILED EVENT
                // ---------------------------------------------

                razorpay.on(
                    "payment.failed",
                    (
                        response
                    ) => {
                        console.error(
                            "❌ RAZORPAY PAYMENT FAILED:",
                            response
                        );

                        razorpayPaymentSuccessRef.current = false;

                        setOrderError(
                            response
                                .error
                                ?.description ||
                            "Payment failed. Please try again."
                        );

                        setPlacingOrder(
                            false
                        );

                        window.scrollTo(
                            {
                                top: 0,
                                behavior:
                                    "smooth",
                            }
                        );
                    }
                );

                // ---------------------------------------------
                // OPEN RAZORPAY CHECKOUT
                // ---------------------------------------------

                console.log(
                    "🚀 OPENING RAZORPAY CHECKOUT"
                );

                razorpay.open();

                return;
            }

            throw new Error(
                "Invalid payment method selected."
            );
        } catch (error) {
            console.error(
                "❌ PLACE ORDER ERROR:",
                error
            );

            razorpayPaymentSuccessRef.current = false;

            setOrderError(
                error.response?.data
                    ?.message ||
                error.message ||
                "Failed to place order. Please try again."
            );

            setPlacingOrder(false);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    // =====================================================
    // EMPTY CART UI
    // =====================================================

    if (!cartItems.length) {
        return null;
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="checkout-page">

            <Navbar />

            <main className="checkout-main">

                {/* =========================================
                    HEADER
                ========================================== */}

                <section className="checkout-header">

                    <button
                        type="button"
                        className="checkout-back"
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        <ArrowLeft size={16} />

                        Back to Cart
                    </button>

                    <div>

                        <span>
                            HOMEAURA CHECKOUT
                        </span>

                        <h1>
                            Complete your
                            <br />
                            <em>order.</em>
                        </h1>

                    </div>

                </section>

                {/* =========================================
                    ORDER ERROR
                ========================================== */}

                {orderError && (
                    <div className="checkout-order-error">
                        {orderError}
                    </div>
                )}

                {/* =========================================
                    CHECKOUT FORM
                ========================================== */}

                <form
                    className="checkout-layout"
                    onSubmit={
                        handlePlaceOrder
                    }
                >

                    {/* =====================================
                        LEFT SIDE
                    ====================================== */}

                    <div className="checkout-left">

                        {/* =================================
                            DELIVERY DETAILS
                        ================================== */}

                        <section className="checkout-section">

                            <div className="checkout-section-heading">

                                <div className="checkout-step-number">
                                    01
                                </div>

                                <div>

                                    <span>
                                        DELIVERY
                                    </span>

                                    <h2>
                                        Shipping details
                                    </h2>

                                </div>

                            </div>

                            <div className="checkout-form-grid">

                                {/* FIRST NAME */}

                                <label>

                                    <span>
                                        First Name
                                    </span>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={
                                            form.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="First name"
                                        required
                                    />

                                </label>

                                {/* LAST NAME */}

                                <label>

                                    <span>
                                        Last Name
                                    </span>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={
                                            form.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Last name"
                                        required
                                    />

                                </label>

                                {/* EMAIL */}

                                <label>

                                    <span>
                                        Email Address
                                    </span>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="you@example.com"
                                        required
                                    />

                                </label>

                                {/* PHONE */}

                                <label>

                                    <span>
                                        Phone Number
                                    </span>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="10-digit mobile number"
                                        required
                                    />

                                </label>

                                {/* ADDRESS */}

                                <label className="checkout-full-field">

                                    <span>
                                        Address
                                    </span>

                                    <textarea
                                        name="address"
                                        value={
                                            form.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="House / Flat / Street / Area"
                                        rows="3"
                                        required
                                    />

                                </label>

                                {/* CITY */}

                                <label>

                                    <span>
                                        City
                                    </span>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            form.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="City"
                                        required
                                    />

                                </label>

                                {/* STATE */}

                                <label>

                                    <span>
                                        State
                                    </span>

                                    <input
                                        type="text"
                                        name="state"
                                        value={
                                            form.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="State"
                                        required
                                    />

                                </label>

                                {/* PINCODE */}

                                <label>

                                    <span>
                                        Pincode
                                    </span>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={
                                            form.pincode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Pincode"
                                        required
                                    />

                                </label>

                            </div>

                        </section>

                        {/* =================================
                            COUPON
                        ================================== */}

                        <section className="checkout-section">

                            <div className="checkout-section-heading">

                                <div className="checkout-step-number">
                                    02
                                </div>

                                <div>

                                    <span>
                                        OFFER
                                    </span>

                                    <h2>
                                        Apply coupon
                                    </h2>

                                </div>

                            </div>

                            <div className="checkout-coupon">

                                <div className="checkout-coupon-title">

                                    <TicketPercent
                                        size={18}
                                    />

                                    <div>

                                        <strong>
                                            Have a coupon?
                                        </strong>

                                        <span>
                                            Apply your promotional code
                                        </span>

                                    </div>

                                </div>

                                {appliedCoupon ? (

                                    <div className="checkout-applied-coupon">

                                        <div>

                                            <strong>
                                                {
                                                    appliedCoupon.code
                                                }
                                            </strong>

                                            <span>
                                                Coupon applied — ₹
                                                {Number(
                                                    couponDiscount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}{" "}
                                                off
                                            </span>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveCoupon
                                            }
                                            aria-label="Remove coupon"
                                        >
                                            <X size={15} />
                                        </button>

                                    </div>

                                ) : (

                                    <div className="checkout-coupon-input">

                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={
                                                coupon
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                setCoupon(
                                                    event.target.value.toUpperCase()
                                                );

                                                setCouponError(
                                                    ""
                                                );

                                                setCouponSuccess(
                                                    ""
                                                );
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleApplyCoupon
                                            }
                                            disabled={
                                                couponLoading
                                            }
                                        >
                                            {couponLoading
                                                ? "..."
                                                : "Apply"}
                                        </button>

                                    </div>

                                )}

                                {couponError && (
                                    <p className="checkout-coupon-error">
                                        {
                                            couponError
                                        }
                                    </p>
                                )}

                                {couponSuccess && (
                                    <p className="checkout-coupon-success">
                                        {
                                            couponSuccess
                                        }
                                    </p>
                                )}

                            </div>

                        </section>

                        {/* =================================
                            PAYMENT
                        ================================== */}

                        <section className="checkout-section">

                            <div className="checkout-section-heading">

                                <div className="checkout-step-number">
                                    03
                                </div>

                                <div>

                                    <span>
                                        PAYMENT
                                    </span>

                                    <h2>
                                        Payment method
                                    </h2>

                                </div>

                            </div>

                            <div className="checkout-payment-options">

                                {/* COD */}

                                <label
                                    className={
                                        paymentMethod ===
                                            "cod"
                                            ? "checkout-payment-option active"
                                            : "checkout-payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={
                                            paymentMethod ===
                                            "cod"
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPaymentMethod(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <div className="checkout-payment-icon">

                                        <Truck
                                            size={19}
                                        />

                                    </div>

                                    <div>

                                        <strong>
                                            Cash on Delivery
                                        </strong>

                                        <span>
                                            Pay when your order arrives
                                        </span>

                                    </div>

                                    <Check
                                        size={17}
                                        className="checkout-payment-check"
                                    />

                                </label>

                                {/* ONLINE */}

                                <label
                                    className={
                                        paymentMethod ===
                                            "online"
                                            ? "checkout-payment-option active"
                                            : "checkout-payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={
                                            paymentMethod ===
                                            "online"
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPaymentMethod(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <div className="checkout-payment-icon">

                                        <CreditCard
                                            size={19}
                                        />

                                    </div>

                                    <div>

                                        <strong>
                                            Online Payment
                                        </strong>

                                        <span>
                                            Secure online payment
                                        </span>

                                    </div>

                                    <Check
                                        size={17}
                                        className="checkout-payment-check"
                                    />

                                </label>

                            </div>

                        </section>

                    </div>

                    {/* =====================================
                        RIGHT SIDE
                    ====================================== */}

                    <aside className="checkout-summary">

                        <div className="checkout-summary-top">

                            <span>
                                YOUR ORDER
                            </span>

                            <h2>
                                Order summary
                            </h2>

                        </div>

                        {/* =================================
                            PRODUCTS
                        ================================== */}

                        <div className="checkout-products">

                            {cartItems.map(
                                (item) => (
                                    <div
                                        className="checkout-product"
                                        key={
                                            item.id
                                        }
                                    >

                                        <div className="checkout-product-image">

                                            <img
                                                src={
                                                    item.image
                                                }
                                                alt={
                                                    item.name
                                                }
                                            />

                                        </div>

                                        <div className="checkout-product-info">

                                            <strong>
                                                {
                                                    item.name
                                                }
                                            </strong>

                                            <span>
                                                Qty:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </span>

                                            <b>
                                                ₹
                                                {(
                                                    Number(
                                                        item.price
                                                    ) *
                                                    Number(
                                                        item.quantity
                                                    )
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </b>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                        {/* =================================
                            COUPON STATUS
                        ================================== */}

                        {appliedCoupon && (
                            <div className="checkout-summary-coupon">

                                <div>

                                    <TicketPercent
                                        size={15}
                                    />

                                    <span>
                                        {
                                            appliedCoupon.code
                                        }
                                    </span>

                                </div>

                                <strong>
                                    -₹
                                    {discount.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>
                        )}

                        {/* =================================
                            TOTALS
                        ================================== */}

                        <div className="checkout-summary-totals">

                            <div>

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        cartSubtotal
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                            {discount > 0 && (
                                <div className="checkout-discount-row">

                                    <span>
                                        Coupon Discount
                                    </span>

                                    <strong>
                                        -₹
                                        {discount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>
                            )}

                            <div>

                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    {delivery ===
                                        0
                                        ? "FREE"
                                        : `₹${delivery}`}
                                </strong>

                            </div>

                            <div className="checkout-total-row">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        total
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                        </div>

                        {/* =================================
                            PLACE ORDER
                        ================================== */}

                        <button
                            type="submit"
                            className="checkout-place-order"
                            disabled={
                                placingOrder
                            }
                        >

                            {placingOrder
                                ? paymentMethod ===
                                    "online"
                                    ? "Processing Payment..."
                                    : "Placing Order..."
                                : "Place Order"}

                            {!placingOrder && (
                                <ArrowRight
                                    size={17}
                                />
                            )}

                        </button>

                        {/* =================================
                            TRUST
                        ================================== */}

                        <div className="checkout-trust">

                            <div>

                                <ShieldCheck
                                    size={17}
                                />

                                <span>
                                    Secure checkout
                                </span>

                            </div>

                            <div>

                                <Truck
                                    size={17}
                                />

                                <span>
                                    Free shipping above ₹999
                                </span>

                            </div>

                            <div>

                                <Package
                                    size={17}
                                />

                                <span>
                                    7-day easy returns
                                </span>

                            </div>

                        </div>

                    </aside>

                </form>

            </main>

            <Footer />

        </div>
    );
}

export default Checkout;
