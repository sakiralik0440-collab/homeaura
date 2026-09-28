import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Search,
    Package,
    Eye,
    X,
    ChevronDown,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/orders";

const STATUS_OPTIONS = [
    "placed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingOrder, setUpdatingOrder] = useState("");

    const token = localStorage.getItem(
        "homeAuraAdminToken"
    );

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // =====================================================
    // FETCH ORDERS
    // =====================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                API_URL,
                authConfig
            );

            setOrders(response.data.orders || []);
        } catch (err) {
            console.error(
                "Fetch admin orders error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // =====================================================
    // FILTER ORDERS
    // =====================================================

    const filteredOrders = useMemo(() => {
        const query = search
            .toLowerCase()
            .trim();

        return orders.filter((order) => {
            const customerText =
                typeof order.customer === "object"
                    ? JSON.stringify(order.customer)
                    : String(order.customer || "");

            const matchesSearch =
                !query ||
                order.orderId
                    ?.toLowerCase()
                    .includes(query) ||
                customerText
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                order.orderStatus === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [orders, search, statusFilter]);

    // =====================================================
    // FORMAT HELPERS
    // =====================================================

    const formatPrice = (price) => {
        return `₹${Number(price || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getCustomerName = (customer) => {
        if (!customer) return "Guest Customer";

        if (typeof customer === "string") {
            return customer;
        }

        return (
            customer.name ||
            customer.fullName ||
            customer.email ||
            "Guest Customer"
        );
    };

    const getCustomerEmail = (customer) => {
        if (!customer) return "";

        if (typeof customer === "string") {
            return "";
        }

        return customer.email || "";
    };

    const getStatusLabel = (status) => {
        if (!status) return "Placed";

        return status
            .charAt(0)
            .toUpperCase() +
            status.slice(1);
    };

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const updateStatus = async (
        orderId,
        newStatus
    ) => {
        try {
            setUpdatingOrder(orderId);

            const response = await axios.put(
                `${API_URL}/${orderId}/status`,
                {
                    orderStatus: newStatus,
                },
                authConfig
            );

            const updatedOrder =
                response.data.order;

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.orderId === orderId
                        ? updatedOrder
                        : order
                )
            );

            setSelectedOrder((current) =>
                current?.orderId === orderId
                    ? updatedOrder
                    : current
            );
        } catch (err) {
            console.error(
                "Update order status error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to update order status."
            );
        } finally {
            setUpdatingOrder("");
        }
    };

    // =====================================================
    // ORDER DETAILS
    // =====================================================

    const openOrderDetails = async (order) => {
        try {
            const response = await axios.get(
                `${API_URL}/${order.orderId}`
            );

            setSelectedOrder(
                response.data.order || order
            );
        } catch (err) {
            console.error(
                "Fetch order details error:",
                err
            );

            setSelectedOrder(order);
        }
    };

    return (
        <div className="admin-orders-page">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-orders-sidebar">

                <div className="admin-orders-brand">
                    <div className="admin-orders-logo">
                        H
                    </div>

                    <div>
                        <strong>
                            HOMEAURA
                        </strong>
                        <span>
                            ADMIN PANEL
                        </span>
                    </div>
                </div>

                <nav className="admin-orders-nav">

                    <Link to="/admin/dashboard">
                        ← Dashboard
                    </Link>

                    <Link to="/admin/products">
                        Products
                    </Link>

                    <Link to="/admin/categories">
                        Categories
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="active"
                    >
                        <Package size={17} />
                        Orders
                    </Link>

                    <Link to="/admin/customers">
                        Customers
                    </Link>

                </nav>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="admin-orders-main">

                <header className="admin-orders-header">

                    <div>

                        <Link
                            to="/admin/dashboard"
                            className="admin-orders-back"
                        >
                            <ArrowLeft size={14} />
                            Dashboard
                        </Link>

                        <span>
                            HOMEAURA COMMERCE
                        </span>

                        <h1>
                            Manage
                            <br />
                            <em>Orders.</em>
                        </h1>

                    </div>

                    <button
                        type="button"
                        className="admin-orders-refresh"
                        onClick={fetchOrders}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "spinning"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </header>


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <section className="admin-orders-toolbar">

                    <div className="admin-orders-search">

                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search order ID or customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="admin-orders-filter">

                        <ChevronDown
                            size={16}
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="all">
                                All Status
                            </option>

                            {STATUS_OPTIONS.map(
                                (status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {getStatusLabel(
                                            status
                                        )}
                                    </option>
                                )
                            )}
                        </select>

                    </div>


                    <div className="admin-orders-count">
                        {filteredOrders.length} ORDERS
                    </div>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="admin-orders-error">
                        {error}

                        <button
                            type="button"
                            onClick={fetchOrders}
                        >
                            Retry
                        </button>
                    </div>
                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (
                    <div className="admin-orders-loading">

                        <div></div>

                        <p>
                            Loading orders...
                        </p>

                    </div>
                ) : (

                    /* =================================================
                       ORDERS TABLE
                    ================================================= */

                    <section className="admin-orders-table-card">

                        <div className="admin-orders-table-header">

                            <span>
                                ORDER
                            </span>

                            <span>
                                CUSTOMER
                            </span>

                            <span>
                                DATE
                            </span>

                            <span>
                                TOTAL
                            </span>

                            <span>
                                PAYMENT
                            </span>

                            <span>
                                STATUS
                            </span>

                            <span>
                                ACTION
                            </span>

                        </div>


                        {filteredOrders.length === 0 ? (

                            <div className="admin-orders-empty">

                                <Package size={34} />

                                <h3>
                                    No orders found
                                </h3>

                                <p>
                                    Try changing your
                                    search or status filter.
                                </p>

                            </div>

                        ) : (

                            filteredOrders.map(
                                (order) => (

                                    <div
                                        className="admin-order-row"
                                        key={
                                            order._id ||
                                            order.orderId
                                        }
                                    >

                                        <div className="admin-order-id">

                                            <strong>
                                                #
                                                {
                                                    order.orderId
                                                }
                                            </strong>

                                            <small>
                                                {order.items
                                                    ?.length ||
                                                    0}{" "}
                                                item(s)
                                            </small>

                                        </div>


                                        <div className="admin-order-customer">

                                            <strong>
                                                {getCustomerName(
                                                    order.customer
                                                )}
                                            </strong>

                                            <small>
                                                {getCustomerEmail(
                                                    order.customer
                                                )}
                                            </small>

                                        </div>


                                        <div className="admin-order-date">
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </div>


                                        <div className="admin-order-total">
                                            {formatPrice(
                                                order.total
                                            )}
                                        </div>


                                        <div className="admin-order-payment">

                                            <strong>
                                                {String(
                                                    order.paymentMethod ||
                                                    "COD"
                                                ).toUpperCase()}
                                            </strong>

                                            <small>
                                                {order.paymentStatus ||
                                                    "pending"}
                                            </small>

                                        </div>


                                        <div className="admin-order-status">

                                            <select
                                                value={
                                                    order.orderStatus ||
                                                    "placed"
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateStatus(
                                                        order.orderId,
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                disabled={
                                                    updatingOrder ===
                                                    order.orderId
                                                }
                                                className={`status-${order.orderStatus || "placed"}`}
                                            >

                                                {STATUS_OPTIONS.map(
                                                    (
                                                        status
                                                    ) => (
                                                        <option
                                                            key={
                                                                status
                                                            }
                                                            value={
                                                                status
                                                            }
                                                        >
                                                            {getStatusLabel(
                                                                status
                                                            )}
                                                        </option>
                                                    )
                                                )}

                                            </select>

                                        </div>


                                        <div className="admin-order-action">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openOrderDetails(
                                                        order
                                                    )
                                                }
                                                title="View order"
                                            >
                                                <Eye
                                                    size={16}
                                                />

                                                View
                                            </button>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </section>

                )}

            </main>


            {/* =================================================
                ORDER DETAILS MODAL
            ================================================= */}

            {selectedOrder && (

                <div
                    className="admin-order-modal"
                    onClick={() =>
                        setSelectedOrder(
                            null
                        )
                    }
                >

                    <div
                        className="admin-order-details-card"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <header className="admin-order-details-header">

                            <div>

                                <span>
                                    ORDER DETAILS
                                </span>

                                <h2>
                                    #
                                    {
                                        selectedOrder.orderId
                                    }
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                            >
                                <X size={20} />
                            </button>

                        </header>


                        <div className="admin-order-details-content">

                            <div className="admin-order-detail-block">

                                <span>
                                    CUSTOMER
                                </span>

                                <strong>
                                    {getCustomerName(
                                        selectedOrder.customer
                                    )}
                                </strong>

                                <small>
                                    {getCustomerEmail(
                                        selectedOrder.customer
                                    )}
                                </small>

                            </div>


                            <div className="admin-order-detail-block">

                                <span>
                                    ORDER STATUS
                                </span>

                                <select
                                    value={
                                        selectedOrder.orderStatus ||
                                        "placed"
                                    }
                                    onChange={(e) =>
                                        updateStatus(
                                            selectedOrder.orderId,
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        updatingOrder ===
                                        selectedOrder.orderId
                                    }
                                >

                                    {STATUS_OPTIONS.map(
                                        (status) => (
                                            <option
                                                key={
                                                    status
                                                }
                                                value={
                                                    status
                                                }
                                            >
                                                {getStatusLabel(
                                                    status
                                                )}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            <div className="admin-order-detail-block">

                                <span>
                                    ITEMS
                                </span>

                                <div className="admin-order-items">

                                    {selectedOrder.items?.map(
                                        (item, index) => (

                                            <div
                                                className="admin-order-item"
                                                key={
                                                    item._id ||
                                                    index
                                                }
                                            >

                                                <img
                                                    src={
                                                        item.image
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                />

                                                <div>

                                                    <strong>
                                                        {
                                                            item.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        Qty:{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </small>

                                                </div>

                                                <span>
                                                    {formatPrice(
                                                        Number(
                                                            item.price
                                                        ) *
                                                        Number(
                                                            item.quantity ||
                                                            1
                                                        )
                                                    )}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>


                            <div className="admin-order-summary">

                                <div>
                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            selectedOrder.subtotal
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Delivery
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            selectedOrder.delivery
                                        )}
                                    </strong>
                                </div>

                                <div className="grand-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            selectedOrder.total
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )
            }

        </div >
    );
}

export default AdminOrders;
