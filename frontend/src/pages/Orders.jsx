import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    Package,
    Truck,
    MapPin,
    ChevronDown,
    ChevronUp,
    ShoppingBag,
    ArrowRight,
    Clock,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/orders"
            );

            setOrders(response.data.orders || []);
        } catch (err) {
            console.error("Fetch orders error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder((current) =>
            current === orderId ? null : orderId
        );
    };

    const getStatusLabel = (status) => {
        const labels = {
            placed: "Order Placed",
            processing: "Processing",
            shipped: "Shipped",
            delivered: "Delivered",
            cancelled: "Cancelled",
        };

        return labels[status] || "Order Placed";
    };

    const getStatusClass = (status) => {
        if (status === "delivered") return "delivered";
        if (status === "shipped") return "shipped";
        if (status === "processing") return "processing";
        if (status === "cancelled") return "cancelled";

        return "placed";
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="orders-page">
                <Navbar />

                <main className="orders-loading">
                    <div className="orders-loader"></div>
                    <p>Loading your orders...</p>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="orders-page">
            <Navbar />

            <main className="orders-main">
                {/* Header */}
                <section className="orders-header">
                    <div>
                        <span>YOUR HOMEAURA ACCOUNT</span>

                        <h1>
                            My
                            <br />
                            <em>Orders.</em>
                        </h1>
                    </div>

                    <div className="orders-header-right">
                        <p>
                            View your purchases, track deliveries and
                            revisit everything you've ordered from HomeAura.
                        </p>

                        <Link to="/shop" className="orders-shop-link">
                            Continue Shopping
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </section>

                {/* Error */}
                {error && (
                    <section className="orders-error">
                        <Package size={25} />

                        <div>
                            <strong>Unable to load orders</strong>
                            <p>{error}</p>
                        </div>

                        <button type="button" onClick={fetchOrders}>
                            Try Again
                        </button>
                    </section>
                )}

                {/* Empty */}
                {!error && orders.length === 0 && (
                    <section className="orders-empty">
                        <div className="orders-empty-icon">
                            <ShoppingBag size={34} />
                        </div>

                        <span>NO ORDERS YET</span>

                        <h2>
                            Your beautiful
                            <br />
                            <em>journey starts here.</em>
                        </h2>

                        <p>
                            Explore our furniture and decor collection
                            and find something you'll love.
                        </p>

                        <Link to="/shop" className="orders-empty-btn">
                            Explore Collection
                            <ArrowRight size={16} />
                        </Link>
                    </section>
                )}

                {/* Orders */}
                {!error && orders.length > 0 && (
                    <section className="orders-section">
                        <div className="orders-section-top">
                            <div>
                                <span>ORDER HISTORY</span>

                                <h2>
                                    {orders.length}{" "}
                                    {orders.length === 1 ? "Order" : "Orders"}
                                </h2>
                            </div>

                            <span className="orders-section-note">
                                HOMEAURA PURCHASES
                            </span>
                        </div>

                        <div className="orders-list">
                            {orders.map((order) => {
                                const isExpanded =
                                    expandedOrder === order.orderId;

                                const firstItem = order.items?.[0];

                                const remainingItems =
                                    order.items?.length > 1
                                        ? order.items.length - 1
                                        : 0;

                                return (
                                    <article
                                        className={`order-card ${isExpanded ? "expanded" : ""
                                            }`}
                                        key={order._id || order.orderId}
                                    >
                                        {/* Order Top */}
                                        <div className="order-card-top">
                                            <div className="order-card-number">
                                                <span>ORDER NUMBER</span>

                                                <strong>
                                                    #{order.orderId}
                                                </strong>

                                                <small>
                                                    {formatDate(order.createdAt)}
                                                    {" · "}
                                                    {formatTime(order.createdAt)}
                                                </small>
                                            </div>

                                            <div
                                                className={`order-status ${getStatusClass(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                <span></span>
                                                {getStatusLabel(order.orderStatus)}
                                            </div>
                                        </div>

                                        {/* Product Preview */}
                                        <div className="order-card-middle">
                                            <div className="order-products-preview">
                                                {order.items
                                                    ?.slice(0, 3)
                                                    .map((item) => (
                                                        <div
                                                            className="order-preview-image"
                                                            key={item.productId}
                                                        >
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                            />
                                                        </div>
                                                    ))}

                                                {remainingItems > 0 && (
                                                    <div className="order-more-items">
                                                        +{remainingItems}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="order-product-summary">
                                                <span>
                                                    {order.items?.length || 0}{" "}
                                                    {order.items?.length === 1
                                                        ? "ITEM"
                                                        : "ITEMS"}
                                                </span>

                                                <strong>
                                                    {firstItem?.name || "HomeAura Product"}
                                                </strong>

                                                {remainingItems > 0 && (
                                                    <p>
                                                        + {remainingItems} more{" "}
                                                        {remainingItems === 1
                                                            ? "item"
                                                            : "items"}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="order-total">
                                                <span>TOTAL</span>

                                                <strong>
                                                    ₹
                                                    {Number(order.total).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                                <small>
                                                    {order.paymentMethod === "online"
                                                        ? "Online Payment"
                                                        : "Cash on Delivery"}
                                                </small>
                                            </div>
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="order-delivery-row">
                                            <div>
                                                <MapPin size={15} />

                                                <span>
                                                    {order.customer?.city},{" "}
                                                    {order.customer?.state}
                                                </span>
                                            </div>

                                            <div>
                                                <Clock size={15} />

                                                <span>
                                                    {order.deliveryTime ||
                                                        "5–7 business days"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="order-card-actions">
                                            <button
                                                type="button"
                                                className="order-details-btn"
                                                onClick={() =>
                                                    toggleOrder(order.orderId)
                                                }
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        Hide Details
                                                        <ChevronUp size={15} />
                                                    </>
                                                ) : (
                                                    <>
                                                        View Details
                                                        <ChevronDown size={15} />
                                                    </>
                                                )}
                                            </button>

                                            <Link
                                                to={`/track-order/${order.orderId}`}
                                                className="order-track-btn"
                                            >
                                                <Truck size={15} />
                                                Track Order
                                            </Link>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="order-expanded">
                                                <div className="order-expanded-grid">
                                                    {/* Items */}
                                                    <div className="order-expanded-section">
                                                        <div className="order-expanded-heading">
                                                            <span>ORDER ITEMS</span>
                                                            <Package size={16} />
                                                        </div>

                                                        <div className="order-expanded-items">
                                                            {order.items?.map((item) => (
                                                                <div
                                                                    className="order-expanded-item"
                                                                    key={item.productId}
                                                                >
                                                                    <div className="order-expanded-image">
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <span>
                                                                            {item.category}
                                                                        </span>

                                                                        <strong>
                                                                            {item.name}
                                                                        </strong>

                                                                        <small>
                                                                            Qty: {item.quantity}
                                                                        </small>
                                                                    </div>

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
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Delivery */}
                                                    <div className="order-expanded-section">
                                                        <div className="order-expanded-heading">
                                                            <span>DELIVERY ADDRESS</span>
                                                            <MapPin size={16} />
                                                        </div>

                                                        <div className="order-address">
                                                            <strong>
                                                                {order.customer?.firstName}{" "}
                                                                {order.customer?.lastName}
                                                            </strong>

                                                            <p>
                                                                {order.customer?.address}
                                                                <br />
                                                                {order.customer?.city},{" "}
                                                                {order.customer?.state}{" "}
                                                                {order.customer?.pincode}
                                                            </p>

                                                            <span>
                                                                {order.customer?.phone}
                                                            </span>
                                                        </div>

                                                        <div className="order-mini-tracking">
                                                            <span>ORDER STATUS</span>

                                                            <strong>
                                                                {getStatusLabel(
                                                                    order.orderStatus
                                                                )}
                                                            </strong>

                                                            <div className="mini-track">
                                                                <div
                                                                    className={`mini-track-dot ${order.orderStatus
                                                                            ? "active"
                                                                            : ""
                                                                        }`}
                                                                >
                                                                    1
                                                                </div>

                                                                <div className="mini-track-line"></div>

                                                                <div className="mini-track-dot">
                                                                    2
                                                                </div>

                                                                <div className="mini-track-line"></div>

                                                                <div className="mini-track-dot">
                                                                    3
                                                                </div>

                                                                <div className="mini-track-line"></div>

                                                                <div className="mini-track-dot">
                                                                    4
                                                                </div>
                                                            </div>

                                                            <div className="mini-track-labels">
                                                                <span>Placed</span>
                                                                <span>Processing</span>
                                                                <span>Shipped</span>
                                                                <span>Delivered</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="order-expanded-bottom">
                                                    <div>
                                                        <span>SUBTOTAL</span>
                                                        <strong>
                                                            ₹
                                                            {Number(
                                                                order.subtotal
                                                            ).toLocaleString("en-IN")}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>DELIVERY</span>
                                                        <strong>
                                                            {order.delivery === 0
                                                                ? "FREE"
                                                                : `₹${order.delivery}`}
                                                        </strong>
                                                    </div>

                                                    <div className="expanded-total">
                                                        <span>TOTAL</span>
                                                        <strong>
                                                            ₹
                                                            {Number(
                                                                order.total
                                                            ).toLocaleString("en-IN")}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Orders;
