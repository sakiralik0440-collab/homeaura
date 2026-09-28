import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingBag,
    Users,
    TicketPercent,
    Star,
    LogOut,
    ArrowRight,
    IndianRupee,
    RefreshCw,
} from "lucide-react";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AdminDashboard() {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        products: 0,
        orders: 0,
        customers: 0,
        revenue: 0,
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const adminData = JSON.parse(
        localStorage.getItem("homeAuraAdmin") || "{}"
    );

    const adminName =
        adminData.name || "HomeAura Admin";

    const handleLogout = () => {
        localStorage.removeItem(
            "homeAuraAdminToken"
        );

        localStorage.removeItem(
            "homeAuraAdmin"
        );

        navigate("/admin/login");
    };

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            active: true,
            path: "/admin/dashboard",
        },
        {
            label: "Products",
            icon: Package,
            path: "/admin/products",
        },
        {
            label: "Categories",
            icon: FolderTree,
            path: "/admin/categories",
        },
        {
            label: "Orders",
            icon: ShoppingBag,
            path: "/admin/orders",
        },
        {
            label: "Customers",
            icon: Users,
            path: "/admin/customers",
        },
        {
            label: "Coupons",
            icon: TicketPercent,
            path: "/admin/coupons",
        },
        {
            label: "Reviews",
            icon: Star,
            path: "/admin/reviews",
        },
    ];

    const fetchDashboardData = async (
        showRefresh = false
    ) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const token =
                localStorage.getItem(
                    "homeAuraAdminToken"
                );

            const headers = {
                "Content-Type":
                    "application/json",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const [
                productsResponse,
                ordersResponse,
                customersResponse,
            ] = await Promise.all([
                fetch(
                    `${API_URL}/api/admin/products`,
                    {
                        headers,
                    }
                ),

                fetch(
                    `${API_URL}/api/orders`,
                    {
                        headers,
                    }
                ),

                fetch(
                    `${API_URL}/api/admin/customers`,
                    {
                        headers,
                    }
                ),
            ]);

            const productsData =
                await productsResponse.json();

            const ordersData =
                await ordersResponse.json();

            const customersData =
                await customersResponse.json();

            if (
                !productsResponse.ok ||
                !ordersResponse.ok ||
                !customersResponse.ok
            ) {
                throw new Error(
                    "Unable to load dashboard data."
                );
            }

            const products =
                productsData.products ||
                productsData.data ||
                [];

            const orders =
                ordersData.orders ||
                ordersData.data ||
                [];

            const customers =
                customersData.customers ||
                customersData.data ||
                [];

            const revenue = orders.reduce(
                (sum, order) => {
                    const status =
                        String(
                            order.orderStatus ||
                            order.status ||
                            ""
                        ).toLowerCase();

                    if (
                        status === "cancelled" ||
                        status === "canceled"
                    ) {
                        return sum;
                    }

                    return (
                        sum +
                        Number(
                            order.total || 0
                        )
                    );
                },
                0
            );

            setDashboardData({
                products: products.length,
                orders: orders.length,
                customers: customers.length,
                revenue,
            });
        } catch (err) {
            console.error(
                "Dashboard error:",
                err
            );

            setError(
                err.message ||
                "Unable to load dashboard."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const stats = [
        {
            label: "TOTAL PRODUCTS",
            value: loading
                ? "..."
                : dashboardData.products,
            change: "Active products",
            icon: Package,
        },
        {
            label: "TOTAL ORDERS",
            value: loading
                ? "..."
                : dashboardData.orders,
            change: "Orders received",
            icon: ShoppingBag,
        },
        {
            label: "CUSTOMERS",
            value: loading
                ? "..."
                : dashboardData.customers,
            change: "Registered customers",
            icon: Users,
        },
        {
            label: "REVENUE",
            value: loading
                ? "..."
                : `₹${dashboardData.revenue.toLocaleString(
                    "en-IN"
                )}`,
            change: "Current revenue",
            icon: IndianRupee,
        },
    ];

    return (
        <div className="admin-dashboard-page">

            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <div className="admin-sidebar-logo">
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

                <div className="admin-sidebar-label">
                    MAIN MENU
                </div>

                <nav className="admin-sidebar-nav">
                    {menuItems.map(
                        (item) => {
                            const Icon =
                                item.icon;

                            return (
                                <Link
                                    key={
                                        item.label
                                    }
                                    to={
                                        item.path
                                    }
                                    className={
                                        item.active
                                            ? "admin-nav-item active"
                                            : "admin-nav-item"
                                    }
                                >
                                    <Icon
                                        size={
                                            17
                                        }
                                    />

                                    <span>
                                        {
                                            item.label
                                        }
                                    </span>
                                </Link>
                            );
                        }
                    )}
                </nav>

                <div className="admin-sidebar-bottom">
                    <Link
                        to="/"
                        className="admin-store-link"
                    >
                        <ArrowRight
                            size={15}
                        />
                        View Store
                    </Link>

                    <button
                        type="button"
                        className="admin-logout"
                        onClick={
                            handleLogout
                        }
                    >
                        <LogOut
                            size={16}
                        />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="admin-dashboard-main">

                {/* Header */}
                <header className="admin-dashboard-header">
                    <div>
                        <span>
                            HOMEAURA
                            ADMINISTRATION
                        </span>

                        <h1>
                            Welcome back,
                            <br />
                            <em>
                                {
                                    adminName
                                }
                                .
                            </em>
                        </h1>
                    </div>

                    <div className="admin-header-profile">
                        <div className="admin-profile-avatar">
                            H
                        </div>

                        <div>
                            <strong>
                                {
                                    adminName
                                }
                            </strong>

                            <span>
                                Administrator
                            </span>
                        </div>
                    </div>
                </header>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            marginBottom:
                                "20px",
                            padding:
                                "14px 18px",
                            borderRadius:
                                "10px",
                            background:
                                "#fff1f1",
                            color:
                                "#b42318",
                            border:
                                "1px solid #f5c2c0",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Stats */}
                <section className="admin-stats-grid">
                    {stats.map(
                        (stat) => {
                            const Icon =
                                stat.icon;

                            return (
                                <div
                                    className="admin-stat-card"
                                    key={
                                        stat.label
                                    }
                                >
                                    <div className="admin-stat-top">
                                        <span>
                                            {
                                                stat.label
                                            }
                                        </span>

                                        <div className="admin-stat-icon">
                                            <Icon
                                                size={
                                                    17
                                                }
                                            />
                                        </div>
                                    </div>

                                    <strong>
                                        {
                                            stat.value
                                        }
                                    </strong>

                                    <small>
                                        {
                                            stat.change
                                        }
                                    </small>
                                </div>
                            );
                        }
                    )}
                </section>

                {/* Quick Actions */}
                <section className="admin-dashboard-section">
                    <div className="admin-section-heading">
                        <div>
                            <span>
                                STORE
                                OVERVIEW
                            </span>

                            <h2>
                                Quick actions
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                fetchDashboardData(
                                    true
                                )
                            }
                            className="admin-refresh-button"
                            title="Refresh dashboard"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    refreshing
                                        ? "admin-refresh-spin"
                                        : ""
                                }
                            />
                        </button>
                    </div>

                    <div className="admin-quick-grid">

                        <Link
                            to="/admin/products"
                            className="admin-quick-card"
                        >
                            <Package
                                size={22}
                            />

                            <div>
                                <strong>
                                    Manage
                                    Products
                                </strong>

                                <span>
                                    Add, edit and
                                    remove
                                    products
                                </span>
                            </div>

                            <ArrowRight
                                size={16}
                            />
                        </Link>

                        <Link
                            to="/admin/orders"
                            className="admin-quick-card"
                        >
                            <ShoppingBag
                                size={22}
                            />

                            <div>
                                <strong>
                                    Manage
                                    Orders
                                </strong>

                                <span>
                                    View and
                                    update
                                    customer
                                    orders
                                </span>
                            </div>

                            <ArrowRight
                                size={16}
                            />
                        </Link>

                        <Link
                            to="/admin/categories"
                            className="admin-quick-card"
                        >
                            <FolderTree
                                size={22}
                            />

                            <div>
                                <strong>
                                    Manage
                                    Categories
                                </strong>

                                <span>
                                    Organize
                                    your
                                    product
                                    collection
                                </span>
                            </div>

                            <ArrowRight
                                size={16}
                            />
                        </Link>

                        <Link
                            to="/admin/customers"
                            className="admin-quick-card"
                        >
                            <Users
                                size={22}
                            />

                            <div>
                                <strong>
                                    Customers
                                </strong>

                                <span>
                                    View
                                    registered
                                    customers
                                </span>
                            </div>

                            <ArrowRight
                                size={16}
                            />
                        </Link>
                    </div>
                </section>

                {/* Store Status */}
                <section className="admin-dashboard-section">
                    <div className="admin-section-heading">
                        <div>
                            <span>
                                STORE
                                STATUS
                            </span>

                            <h2>
                                HomeAura is
                                ready
                            </h2>
                        </div>

                        <div className="admin-online-status">
                            <span></span>
                            System Online
                        </div>
                    </div>

                    <div className="admin-status-card">
                        <div>
                            <Package
                                size={22}
                            />

                            <div>
                                <strong>
                                    {
                                        dashboardData.products
                                    }{" "}
                                    products
                                    available
                                </strong>

                                <span>
                                    Your product
                                    collection
                                    is connected
                                    and ready to
                                    manage.
                                </span>
                            </div>
                        </div>

                        <Link to="/admin/products">
                            View Products
                            <ArrowRight
                                size={15}
                            />
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}

export default AdminDashboard;
