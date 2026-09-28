import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    Plus,
    Pencil,
    Trash2,
    RefreshCw,
    X,
    Search,
    Check,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxDiscount: "",
        startDate: "",
        expiryDate: "",
        usageLimit: "",
        isActive: true,
    });

    const token = localStorage.getItem("homeAuraAdminToken");

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
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
            active: true,
        },
        {
            label: "Reviews",
            icon: Star,
            path: "/admin/reviews",
        },
    ];

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/coupons`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch coupons"
                );
            }

            setCoupons(data.coupons || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const filteredCoupons = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) return coupons;

        return coupons.filter(
            (coupon) =>
                coupon.code?.toLowerCase().includes(value) ||
                coupon.description
                    ?.toLowerCase()
                    .includes(value)
        );
    }, [coupons, search]);

    const resetForm = () => {
        setForm({
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: "",
            minOrderAmount: "",
            maxDiscount: "",
            startDate: "",
            expiryDate: "",
            usageLimit: "",
            isActive: true,
        });
        setEditingCoupon(null);
        setError("");
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (coupon) => {
        setEditingCoupon(coupon);

        setForm({
            code: coupon.code || "",
            description: coupon.description || "",
            discountType: coupon.discountType || "percentage",
            discountValue: coupon.discountValue ?? "",
            minOrderAmount: coupon.minOrderAmount ?? "",
            maxDiscount: coupon.maxDiscount ?? "",
            startDate: coupon.startDate
                ? new Date(coupon.startDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
            expiryDate: coupon.expiryDate
                ? new Date(coupon.expiryDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
            usageLimit: coupon.usageLimit ?? "",
            isActive: coupon.isActive !== false,
        });

        setError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        resetForm();
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const payload = {
                code: form.code.trim().toUpperCase(),
                description: form.description.trim(),
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                minOrderAmount: Number(
                    form.minOrderAmount || 0
                ),
                maxDiscount:
                    form.maxDiscount === ""
                        ? null
                        : Number(form.maxDiscount),
                startDate: form.startDate,
                expiryDate: form.expiryDate,
                usageLimit: Number(
                    form.usageLimit || 0
                ),
                isActive: form.isActive,
            };

            const url = editingCoupon
                ? `${API_URL}/api/coupons/${editingCoupon._id}`
                : `${API_URL}/api/coupons`;

            const method = editingCoupon ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save coupon"
                );
            }

            setShowModal(false);
            resetForm();

            await fetchCoupons();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this coupon?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API_URL}/api/coupons/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete coupon"
                );
            }

            await fetchCoupons();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const getCouponStatus = (coupon) => {
        const now = new Date();
        const start = new Date(coupon.startDate);
        const expiry = new Date(coupon.expiryDate);

        if (!coupon.isActive) {
            return {
                label: "Inactive",
                className: "inactive",
            };
        }

        if (now < start) {
            return {
                label: "Scheduled",
                className: "scheduled",
            };
        }

        if (now > expiry) {
            return {
                label: "Expired",
                className: "expired",
            };
        }

        if (
            coupon.usageLimit > 0 &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            return {
                label: "Limit Reached",
                className: "expired",
            };
        }

        return {
            label: "Active",
            className: "active",
        };
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatDiscount = (coupon) => {
        if (coupon.discountType === "percentage") {
            return `${coupon.discountValue}% OFF`;
        }

        return `₹${Number(
            coupon.discountValue
        ).toLocaleString("en-IN")} OFF`;
    };

    const handleLogout = () => {
        localStorage.removeItem("homeAuraAdminToken");
        localStorage.removeItem("homeAuraAdmin");

        window.location.href = "/admin/login";
    };

    return (
        <div className="admin-coupons-page">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <div className="admin-sidebar-logo">
                        H
                    </div>

                    <div>
                        <strong>HOMEAURA</strong>
                        <span>ADMIN PANEL</span>
                    </div>
                </div>

                <div className="admin-sidebar-label">
                    MAIN MENU
                </div>

                <nav className="admin-sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={
                                    item.active
                                        ? "admin-nav-item active"
                                        : "admin-nav-item"
                                }
                            >
                                <Icon size={17} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-bottom">
                    <Link
                        to="/"
                        className="admin-store-link"
                    >
                        <ArrowRight size={15} />
                        View Store
                    </Link>

                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-coupons-main">
                <header className="admin-coupons-header">
                    <div>
                        <span>MARKETING & PROMOTIONS</span>
                        <h1>
                            Coupon
                            <br />
                            <em>Management.</em>
                        </h1>
                    </div>

                    <button
                        type="button"
                        className="admin-coupons-add-btn"
                        onClick={openCreateModal}
                    >
                        <Plus size={17} />
                        Add Coupon
                    </button>
                </header>

                <section className="admin-coupons-toolbar">
                    <div className="admin-coupons-search">
                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search coupons..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="admin-coupons-refresh"
                        onClick={fetchCoupons}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "admin-spin"
                                    : ""
                            }
                        />
                        Refresh
                    </button>
                </section>

                {error && (
                    <div className="admin-coupons-error">
                        {error}
                    </div>
                )}

                <section className="admin-coupons-summary">
                    <div>
                        <span>TOTAL COUPONS</span>
                        <strong>{coupons.length}</strong>
                    </div>

                    <div>
                        <span>ACTIVE</span>
                        <strong>
                            {
                                coupons.filter(
                                    (coupon) =>
                                        getCouponStatus(
                                            coupon
                                        ).label === "Active"
                                ).length
                            }
                        </strong>
                    </div>

                    <div>
                        <span>SEARCH RESULTS</span>
                        <strong>
                            {filteredCoupons.length}
                        </strong>
                    </div>
                </section>

                <section className="admin-coupons-grid">
                    {loading ? (
                        <div className="admin-coupons-empty">
                            Loading coupons...
                        </div>
                    ) : filteredCoupons.length === 0 ? (
                        <div className="admin-coupons-empty">
                            <TicketPercent size={32} />
                            <h3>No coupons found</h3>
                            <p>
                                Create your first HomeAura
                                discount coupon.
                            </p>

                            <button
                                type="button"
                                onClick={openCreateModal}
                            >
                                <Plus size={16} />
                                Create Coupon
                            </button>
                        </div>
                    ) : (
                        filteredCoupons.map((coupon) => {
                            const status =
                                getCouponStatus(coupon);

                            return (
                                <article
                                    className="admin-coupon-card"
                                    key={coupon._id}
                                >
                                    <div className="admin-coupon-card-top">
                                        <div>
                                            <div className="admin-coupon-code">
                                                <TicketPercent
                                                    size={18}
                                                />
                                                {coupon.code}
                                            </div>

                                            <p>
                                                {coupon.description ||
                                                    "HomeAura promotional coupon"}
                                            </p>
                                        </div>

                                        <span
                                            className={`admin-coupon-status ${status.className}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="admin-coupon-discount">
                                        <strong>
                                            {formatDiscount(
                                                coupon
                                            )}
                                        </strong>

                                        {coupon.discountType ===
                                            "percentage" &&
                                            coupon.maxDiscount && (
                                                <span>
                                                    Max discount ₹
                                                    {Number(
                                                        coupon.maxDiscount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>
                                            )}
                                    </div>

                                    <div className="admin-coupon-details">
                                        <div>
                                            <span>
                                                MIN. ORDER
                                            </span>
                                            <strong>
                                                ₹
                                                {Number(
                                                    coupon.minOrderAmount ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                VALID UNTIL
                                            </span>
                                            <strong>
                                                {formatDate(
                                                    coupon.expiryDate
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                USAGE
                                            </span>
                                            <strong>
                                                {coupon.usedCount || 0}
                                                {" / "}
                                                {coupon.usageLimit > 0
                                                    ? coupon.usageLimit
                                                    : "∞"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="admin-coupon-card-bottom">
                                        <span>
                                            {formatDate(
                                                coupon.startDate
                                            )}{" "}
                                            —{" "}
                                            {formatDate(
                                                coupon.expiryDate
                                            )}
                                        </span>

                                        <div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(
                                                        coupon
                                                    )
                                                }
                                                aria-label="Edit coupon"
                                            >
                                                <Pencil
                                                    size={15}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        coupon._id
                                                    )
                                                }
                                                aria-label="Delete coupon"
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </section>
            </main>

            {showModal && (
                <div
                    className="admin-coupon-modal"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >
                    <div className="admin-coupon-form-card">
                        <div className="admin-coupon-form-header">
                            <div>
                                <span>
                                    {editingCoupon
                                        ? "UPDATE COUPON"
                                        : "CREATE COUPON"}
                                </span>

                                <h2>
                                    {editingCoupon
                                        ? "Edit coupon"
                                        : "New coupon"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            className="admin-coupon-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="admin-coupon-form-grid">
                                <label>
                                    Coupon Code
                                    <input
                                        name="code"
                                        value={form.code}
                                        onChange={handleChange}
                                        placeholder="HOME20"
                                        required
                                    />
                                </label>

                                <label>
                                    Discount Type
                                    <select
                                        name="discountType"
                                        value={
                                            form.discountType
                                        }
                                        onChange={handleChange}
                                    >
                                        <option value="percentage">
                                            Percentage
                                        </option>
                                        <option value="flat">
                                            Flat Amount
                                        </option>
                                    </select>
                                </label>

                                <label>
                                    Discount Value
                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={
                                            form.discountValue
                                        }
                                        onChange={handleChange}
                                        placeholder={
                                            form.discountType ===
                                                "percentage"
                                                ? "20"
                                                : "500"
                                        }
                                        min="0"
                                        required
                                    />
                                </label>

                                <label>
                                    Minimum Order
                                    <input
                                        type="number"
                                        name="minOrderAmount"
                                        value={
                                            form.minOrderAmount
                                        }
                                        onChange={handleChange}
                                        placeholder="1999"
                                        min="0"
                                    />
                                </label>

                                <label>
                                    Maximum Discount
                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={
                                            form.maxDiscount
                                        }
                                        onChange={handleChange}
                                        placeholder="1000"
                                        min="0"
                                        disabled={
                                            form.discountType !==
                                            "percentage"
                                        }
                                    />
                                </label>

                                <label>
                                    Usage Limit
                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={
                                            form.usageLimit
                                        }
                                        onChange={handleChange}
                                        placeholder="100"
                                        min="0"
                                    />
                                </label>

                                <label>
                                    Start Date
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={
                                            form.startDate
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Expiry Date
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={
                                            form.expiryDate
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>

                            <label>
                                Description
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="20% discount on selected HomeAura orders"
                                    rows="3"
                                />
                            </label>

                            <label className="admin-coupon-checkbox">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />

                                <span>
                                    <Check size={14} />
                                </span>

                                Coupon is active
                            </label>

                            {error && (
                                <div className="admin-coupon-form-error">
                                    {error}
                                </div>
                            )}

                            <div className="admin-coupon-form-actions">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCoupon
                                            ? "Update Coupon"
                                            : "Create Coupon"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCoupons;
