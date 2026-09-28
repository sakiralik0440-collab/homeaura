import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Search,
    Users,
    Eye,
    X,
    ArrowLeft,
    RefreshCw,
    ShoppingBag,
    Mail,
    Phone,
    Calendar,
    IndianRupee,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
    "http://localhost:5000/api/admin/customers";

function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] =
        useState(null);

    const token = localStorage.getItem(
        "homeAuraAdminToken"
    );

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                API_URL,
                authConfig
            );

            setCustomers(
                response.data.customers || []
            );
        } catch (err) {
            console.error(
                "Fetch customers error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load customers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        const query = search
            .toLowerCase()
            .trim();

        if (!query) return customers;

        return customers.filter((customer) => {
            return (
                customer.name
                    ?.toLowerCase()
                    .includes(query) ||
                customer.email
                    ?.toLowerCase()
                    .includes(query) ||
                customer.phone
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [customers, search]);

    const formatPrice = (price) => {
        return `₹${Number(
            price || 0
        ).toLocaleString("en-IN")}`;
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

    const getInitials = (name) => {
        if (!name) return "C";

        return name
            .split(" ")
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="admin-customers-page">

            <aside className="admin-customers-sidebar">

                <div className="admin-customers-brand">

                    <div className="admin-customers-logo">
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

                <nav className="admin-customers-nav">

                    <Link to="/admin/dashboard">
                        ← Dashboard
                    </Link>

                    <Link to="/admin/products">
                        Products
                    </Link>

                    <Link to="/admin/categories">
                        Categories
                    </Link>

                    <Link to="/admin/orders">
                        Orders
                    </Link>

                    <Link
                        to="/admin/customers"
                        className="active"
                    >
                        <Users size={17} />
                        Customers
                    </Link>

                </nav>

            </aside>

            <main className="admin-customers-main">

                <header className="admin-customers-header">

                    <div>

                        <Link
                            to="/admin/dashboard"
                            className="admin-customers-back"
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
                            <em>Customers.</em>
                        </h1>

                    </div>

                    <button
                        type="button"
                        className="admin-customers-refresh"
                        onClick={fetchCustomers}
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

                <section className="admin-customers-toolbar">

                    <div className="admin-customers-search">

                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search name, email or phone..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="admin-customers-count">
                        {filteredCustomers.length} CUSTOMERS
                    </div>

                </section>

                {error && (
                    <div className="admin-customers-error">

                        {error}

                        <button
                            type="button"
                            onClick={fetchCustomers}
                        >
                            Retry
                        </button>

                    </div>
                )}

                {loading ? (

                    <div className="admin-customers-loading">

                        <div></div>

                        <p>
                            Loading customers...
                        </p>

                    </div>

                ) : (

                    <section className="admin-customers-table-card">

                        <div className="admin-customers-table-header">

                            <span>
                                CUSTOMER
                            </span>

                            <span>
                                CONTACT
                            </span>

                            <span>
                                ORDERS
                            </span>

                            <span>
                                TOTAL SPENT
                            </span>

                            <span>
                                LAST ORDER
                            </span>

                            <span>
                                ACTION
                            </span>

                        </div>

                        {filteredCustomers.length ===
                            0 ? (

                            <div className="admin-customers-empty">

                                <Users size={36} />

                                <h3>
                                    No customers found
                                </h3>

                                <p>
                                    Customers will appear
                                    here after orders are
                                    placed.
                                </p>

                            </div>

                        ) : (

                            filteredCustomers.map(
                                (customer) => (

                                    <div
                                        className="admin-customer-row"
                                        key={customer.id}
                                    >

                                        <div className="admin-customer-profile">

                                            <div className="admin-customer-avatar">
                                                {getInitials(
                                                    customer.name
                                                )}
                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        customer.name
                                                    }
                                                </strong>

                                                <small>
                                                    Customer
                                                </small>

                                            </div>

                                        </div>

                                        <div className="admin-customer-contact">

                                            {customer.email && (
                                                <span>
                                                    <Mail
                                                        size={14}
                                                    />
                                                    {
                                                        customer.email
                                                    }
                                                </span>
                                            )}

                                            {customer.phone && (
                                                <span>
                                                    <Phone
                                                        size={14}
                                                    />
                                                    {
                                                        customer.phone
                                                    }
                                                </span>
                                            )}

                                            {!customer.email &&
                                                !customer.phone && (
                                                    <small>
                                                        Contact
                                                        details
                                                        unavailable
                                                    </small>
                                                )}

                                        </div>

                                        <div className="admin-customer-orders">

                                            <ShoppingBag
                                                size={15}
                                            />

                                            {
                                                customer.ordersCount
                                            }

                                        </div>

                                        <div className="admin-customer-spent">

                                            {formatPrice(
                                                customer.totalSpent
                                            )}

                                        </div>

                                        <div className="admin-customer-date">

                                            <Calendar
                                                size={14}
                                            />

                                            {formatDate(
                                                customer.lastOrder
                                            )}

                                        </div>

                                        <div className="admin-customer-action">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCustomer(
                                                        customer
                                                    )
                                                }
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

            {selectedCustomer && (

                <div
                    className="admin-customer-modal"
                    onClick={() =>
                        setSelectedCustomer(null)
                    }
                >

                    <div
                        className="admin-customer-details-card"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <header className="admin-customer-details-header">

                            <div>

                                <span>
                                    CUSTOMER DETAILS
                                </span>

                                <h2>
                                    {
                                        selectedCustomer.name
                                    }
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCustomer(
                                        null
                                    )
                                }
                            >
                                <X size={20} />
                            </button>

                        </header>

                        <div className="admin-customer-details-content">

                            <div className="admin-customer-summary">

                                <div className="admin-customer-large-avatar">
                                    {getInitials(
                                        selectedCustomer.name
                                    )}
                                </div>

                                <div>

                                    <h3>
                                        {
                                            selectedCustomer.name
                                        }
                                    </h3>

                                    <p>
                                        HomeAura Customer
                                    </p>

                                </div>

                            </div>

                            <div className="admin-customer-info-grid">

                                <div>

                                    <span>
                                        EMAIL
                                    </span>

                                    <strong>
                                        {selectedCustomer.email ||
                                            "Not available"}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        PHONE
                                    </span>

                                    <strong>
                                        {selectedCustomer.phone ||
                                            "Not available"}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        TOTAL ORDERS
                                    </span>

                                    <strong>
                                        {
                                            selectedCustomer.ordersCount
                                        }
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        TOTAL SPENT
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            selectedCustomer.totalSpent
                                        )}
                                    </strong>

                                </div>

                            </div>

                            <div className="admin-customer-order-section">

                                <div className="admin-customer-section-title">

                                    <span>
                                        ORDER HISTORY
                                    </span>

                                    <strong>
                                        {
                                            selectedCustomer.orders
                                                ?.length || 0
                                        }{" "}
                                        orders
                                    </strong>

                                </div>

                                <div className="admin-customer-order-list">

                                    {selectedCustomer.orders?.map(
                                        (order) => (

                                            <div
                                                className="admin-customer-order-item"
                                                key={
                                                    order.orderId
                                                }
                                            >

                                                <div>

                                                    <strong>
                                                        #
                                                        {
                                                            order.orderId
                                                        }
                                                    </strong>

                                                    <small>
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </small>

                                                </div>

                                                <span
                                                    className={`customer-status customer-status-${order.status}`}
                                                >
                                                    {order.status
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase() +
                                                        order.status?.slice(
                                                            1
                                                        )}
                                                </span>

                                                <strong>
                                                    {formatPrice(
                                                        order.total
                                                    )}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminCustomers;