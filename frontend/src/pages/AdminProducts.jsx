import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Package,
    Plus,
    Search,
    Pencil,
    Trash2,
    ArrowLeft,
    X,
    RefreshCw,
    Image as ImageIcon,
    Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/admin/products";

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000";

const UPLOAD_URL =
    `${BACKEND_URL}/api/uploads/product-image`;

const emptyForm = {
    name: "",
    category: "",
    room: "",
    price: "",
    oldPrice: "",
    badge: "",
    material: "",
    color: "",
    dimensions: "",
    image: "",
    description: "",
    stock: 10,
    isActive: true,
};

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] =
        useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState(null);

    const [form, setForm] = useState(emptyForm);

    const getAuthConfig = () => {
        const token =
            localStorage.getItem(
                "homeAuraAdminToken"
            );

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                API_URL,
                getAuthConfig()
            );

            setProducts(
                response.data.products || []
            );
        } catch (err) {
            console.error(
                "Fetch products error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(
                products
                    .map(
                        (product) =>
                            product.category
                    )
                    .filter(Boolean)
            ),
        ];

        return ["All", ...uniqueCategories];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = search
            .toLowerCase()
            .trim();

        return products.filter((product) => {
            const name =
                product.name?.toLowerCase() || "";

            const productCategory =
                product.category?.toLowerCase() ||
                "";

            const room =
                product.room?.toLowerCase() || "";

            const matchesSearch =
                name.includes(query) ||
                productCategory.includes(query) ||
                room.includes(query);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            const matchesStatus =
                status === "All" ||
                (status === "Active" &&
                    product.isActive) ||
                (status === "Inactive" &&
                    !product.isActive);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }, [
        products,
        search,
        category,
        status,
    ]);

    const totalProducts = products.length;

    const activeProducts = products.filter(
        (product) => product.isActive
    ).length;

    const inactiveProducts =
        products.filter(
            (product) => !product.isActive
        ).length;

    const outOfStockProducts =
        products.filter(
            (product) =>
                Number(product.stock || 0) === 0
        ).length;

    const resetForm = () => {
        setForm({
            ...emptyForm,
        });

        setEditingProduct(null);
    };

    const openAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);

        setForm({
            name: product.name || "",
            category: product.category || "",
            room: product.room || "",
            price: product.price ?? "",
            oldPrice: product.oldPrice ?? "",
            badge: product.badge || "",
            material: product.material || "",
            color: product.color || "",
            dimensions:
                product.dimensions || "",
            image: product.image || "",
            description:
                product.description || "",
            stock: product.stock ?? 10,
            isActive:
                product.isActive !== false,
        });

        setShowForm(true);
    };

    const closeForm = () => {
        if (saving || uploadingImage) return;

        setShowForm(false);
        resetForm();
    };

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // IMAGE UPLOAD
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(
                "Image size must be less than 5 MB."
            );

            e.target.value = "";
            return;
        }

        try {
            setUploadingImage(true);

            const formData = new FormData();

            formData.append("image", file);

            const response = await axios.post(
                UPLOAD_URL,
                formData,
                {
                    headers: {
                        ...getAuthConfig().headers,
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            if (
                response.data.success &&
                response.data.imageUrl
            ) {
                const uploadedUrl =
                    response.data.imageUrl;

                const finalImageUrl =
                    uploadedUrl.startsWith("http")
                        ? uploadedUrl
                        : `${BACKEND_URL}${uploadedUrl}`;

                setForm((current) => ({
                    ...current,
                    image: finalImageUrl,
                }));

                alert(
                    "Product image uploaded successfully."
                );
            } else {
                throw new Error(
                    "Image upload failed."
                );
            }
        } catch (err) {
            console.error(
                "Image upload error:",
                err
            );

            alert(
                err.response?.data?.message ||
                err.message ||
                "Failed to upload image."
            );
        } finally {
            setUploadingImage(false);

            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Please enter product name.");
            return;
        }

        if (!form.category.trim()) {
            alert(
                "Please enter product category."
            );
            return;
        }

        if (!form.room.trim()) {
            alert("Please enter room type.");
            return;
        }

        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {
            alert("Please enter a valid price.");
            return;
        }

        if (
            form.stock === "" ||
            Number(form.stock) < 0
        ) {
            alert("Please enter valid stock.");
            return;
        }

        if (!form.image.trim()) {
            alert(
                "Please upload a product image or enter an image URL."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...form,
                name: form.name.trim(),
                category: form.category.trim(),
                room: form.room.trim(),
                price: Number(form.price),
                oldPrice:
                    form.oldPrice === ""
                        ? null
                        : Number(form.oldPrice),
                stock: Number(form.stock),
            };

            if (editingProduct) {
                await axios.put(
                    `${API_URL}/${editingProduct._id}`,
                    payload,
                    getAuthConfig()
                );
            } else {
                await axios.post(
                    API_URL,
                    payload,
                    getAuthConfig()
                );
            }

            setShowForm(false);
            resetForm();

            await fetchProducts();
        } catch (err) {
            console.error(
                "Save product error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to save product."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        const confirmed =
            window.confirm(
                `Delete "${product.name}"?\n\nThis action cannot be undone.`
            );

        if (!confirmed) return;

        try {
            setDeletingId(product._id);

            await axios.delete(
                `${API_URL}/${product._id}`,
                getAuthConfig()
            );

            setProducts((current) =>
                current.filter(
                    (item) =>
                        item._id !==
                        product._id
                )
            );
        } catch (err) {
            console.error(
                "Delete product error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to delete product."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const getStockClass = (stock) => {
        const value = Number(stock || 0);

        if (value === 0) {
            return "admin-stock out";
        }

        if (value <= 5) {
            return "admin-stock low";
        }

        return "admin-stock";
    };

    const getStockLabel = (stock) => {
        const value = Number(stock || 0);

        if (value === 0) return "Out of stock";
        if (value <= 5) return "Low stock";

        return "In stock";
    };

    return (
        <div className="admin-products-page">
            {/* SIDEBAR */}
            <aside className="admin-products-sidebar">
                <div className="admin-products-brand">
                    <div className="admin-products-logo">
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

                <nav className="admin-products-nav">
                    <Link to="/admin/dashboard">
                        ← Dashboard
                    </Link>

                    <Link
                        to="/admin/products"
                        className="active"
                    >
                        <Package size={17} />
                        Products
                    </Link>

                    <Link to="/admin/categories">
                        Categories
                    </Link>

                    <Link to="/admin/orders">
                        Orders
                    </Link>

                    <Link to="/admin/customers">
                        Customers
                    </Link>

                    <Link to="/admin/coupons">
                        Coupons
                    </Link>
                </nav>
            </aside>

            {/* MAIN */}
            <main className="admin-products-main">
                {/* HEADER */}
                <header className="admin-products-header">
                    <div>
                        <Link
                            to="/admin/dashboard"
                            className="admin-products-back"
                        >
                            <ArrowLeft
                                size={14}
                            />
                            Dashboard
                        </Link>

                        <span>
                            HOMEAURA INVENTORY
                        </span>

                        <h1>
                            Manage
                            <br />
                            <em>Products.</em>
                        </h1>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems:
                                "center",
                        }}
                    >
                        <button
                            type="button"
                            className="admin-refresh-button"
                            onClick={
                                fetchProducts
                            }
                            title="Refresh products"
                            disabled={loading}
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "admin-refresh-spin"
                                        : ""
                                }
                            />
                        </button>

                        <button
                            type="button"
                            className="admin-add-product-btn"
                            onClick={
                                openAddForm
                            }
                        >
                            <Plus size={17} />
                            Add Product
                        </button>
                    </div>
                </header>

                {/* SUMMARY CARDS */}
                <section
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, 1fr)",
                        gap: "14px",
                        marginBottom:
                            "22px",
                    }}
                >
                    <div className="admin-product-summary-card">
                        <span>
                            TOTAL PRODUCTS
                        </span>

                        <strong>
                            {totalProducts}
                        </strong>
                    </div>

                    <div className="admin-product-summary-card">
                        <span>ACTIVE</span>

                        <strong>
                            {activeProducts}
                        </strong>
                    </div>

                    <div className="admin-product-summary-card">
                        <span>INACTIVE</span>

                        <strong>
                            {inactiveProducts}
                        </strong>
                    </div>

                    <div className="admin-product-summary-card">
                        <span>
                            OUT OF STOCK
                        </span>

                        <strong>
                            {
                                outOfStockProducts
                            }
                        </strong>
                    </div>
                </section>

                {/* TOOLBAR */}
                <section className="admin-products-toolbar">
                    <div className="admin-products-search">
                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search by product, category or room..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
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
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    cursor:
                                        "pointer",
                                    display:
                                        "flex",
                                }}
                                title="Clear search"
                            >
                                <X
                                    size={15}
                                />
                            </button>
                        )}
                    </div>

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                    >
                        {categories.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item ===
                                        "All"
                                        ? "All Categories"
                                        : item}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>
                    </select>

                    <div className="admin-products-count">
                        {
                            filteredProducts.length
                        }{" "}
                        PRODUCTS
                    </div>
                </section>

                {/* ERROR */}
                {error && (
                    <div className="admin-products-error">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={
                                fetchProducts
                            }
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="admin-products-loading">
                        <div></div>

                        <p>
                            Loading products...
                        </p>
                    </div>
                ) : (
                    <section className="admin-products-table-card">
                        <div className="admin-products-table-head">
                            <span>
                                PRODUCT
                            </span>

                            <span>
                                CATEGORY
                            </span>

                            <span>
                                PRICE
                            </span>

                            <span>
                                STOCK
                            </span>

                            <span>
                                STATUS
                            </span>

                            <span>
                                ACTIONS
                            </span>
                        </div>

                        {filteredProducts.map(
                            (product) => (
                                <div
                                    className="admin-product-row"
                                    key={
                                        product._id
                                    }
                                >
                                    {/* PRODUCT */}
                                    <div className="admin-product-cell">
                                        <div className="admin-product-image">
                                            {product.image ? (
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

                                                        e.currentTarget.parentElement.classList.add(
                                                            "image-error"
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <ImageIcon
                                                    size={
                                                        22
                                                    }
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <strong>
                                                {
                                                    product.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    product.room
                                                }
                                            </span>

                                            {product.badge && (
                                                <small
                                                    style={{
                                                        marginTop:
                                                            "4px",
                                                        display:
                                                            "inline-block",
                                                        fontSize:
                                                            "10px",
                                                        letterSpacing:
                                                            "0.08em",
                                                        fontWeight:
                                                            700,
                                                        color:
                                                            "#8b6348",
                                                    }}
                                                >
                                                    {
                                                        product.badge
                                                    }
                                                </small>
                                            )}
                                        </div>
                                    </div>

                                    {/* CATEGORY */}
                                    <div className="admin-product-category">
                                        {
                                            product.category
                                        }
                                    </div>

                                    {/* PRICE */}
                                    <div className="admin-product-price">
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
                                            <small
                                                style={{
                                                    display:
                                                        "block",
                                                    textDecoration:
                                                        "line-through",
                                                    opacity:
                                                        0.5,
                                                    fontSize:
                                                        "11px",
                                                }}
                                            >
                                                ₹
                                                {Number(
                                                    product.oldPrice
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </small>
                                        )}
                                    </div>

                                    {/* STOCK */}
                                    <div>
                                        <div
                                            className={getStockClass(
                                                product.stock
                                            )}
                                        >
                                            {Number(
                                                product.stock ||
                                                0
                                            )}
                                        </div>

                                        <small
                                            style={{
                                                fontSize:
                                                    "10px",
                                                opacity:
                                                    0.55,
                                                display:
                                                    "block",
                                                marginTop:
                                                    "3px",
                                            }}
                                        >
                                            {getStockLabel(
                                                product.stock
                                            )}
                                        </small>
                                    </div>

                                    {/* STATUS */}
                                    <div>
                                        <span
                                            className={
                                                product.isActive
                                                    ? "admin-product-status active"
                                                    : "admin-product-status inactive"
                                            }
                                        >
                                            {product.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="admin-product-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditForm(
                                                    product
                                                )
                                            }
                                            title="Edit product"
                                        >
                                            <Pencil
                                                size={
                                                    15
                                                }
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            className="delete"
                                            onClick={() =>
                                                handleDelete(
                                                    product
                                                )
                                            }
                                            title="Delete product"
                                            disabled={
                                                deletingId ===
                                                product._id
                                            }
                                        >
                                            {deletingId ===
                                                product._id ? (
                                                <RefreshCw
                                                    size={
                                                        15
                                                    }
                                                    className="admin-refresh-spin"
                                                />
                                            ) : (
                                                <Trash2
                                                    size={
                                                        15
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        )}

                        {filteredProducts.length ===
                            0 && (
                                <div className="admin-products-empty">
                                    <Package
                                        size={30}
                                    />

                                    <h3>
                                        No products
                                        found
                                    </h3>

                                    <p>
                                        Try another
                                        search,
                                        category or
                                        status.
                                    </p>

                                    {(search ||
                                        category !==
                                        "All" ||
                                        status !==
                                        "All") && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearch(
                                                        ""
                                                    );

                                                    setCategory(
                                                        "All"
                                                    );

                                                    setStatus(
                                                        "All"
                                                    );
                                                }}
                                                style={{
                                                    marginTop:
                                                        "10px",
                                                    border: "none",
                                                    background:
                                                        "#8b6348",
                                                    color:
                                                        "#fff",
                                                    padding:
                                                        "9px 15px",
                                                    borderRadius:
                                                        "7px",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                </div>
                            )}
                    </section>
                )}
            </main>

            {/* ADD / EDIT MODAL */}
            {showForm && (
                <div
                    className="admin-product-modal"
                    onClick={closeForm}
                >
                    <div
                        className="admin-product-form-card"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="admin-product-form-header">
                            <div>
                                <span>
                                    {editingProduct
                                        ? "EDIT PRODUCT"
                                        : "NEW PRODUCT"}
                                </span>

                                <h2>
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                disabled={
                                    saving ||
                                    uploadingImage
                                }
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <div className="admin-form-grid">
                                {/* NAME */}
                                <div className="admin-form-field full">
                                    <label>
                                        PRODUCT NAME
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Luna Lounge Sofa"
                                        required
                                    />
                                </div>

                                {/* CATEGORY */}
                                <div className="admin-form-field">
                                    <label>
                                        CATEGORY
                                    </label>

                                    <input
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Furniture"
                                        required
                                    />
                                </div>

                                {/* ROOM */}
                                <div className="admin-form-field">
                                    <label>
                                        ROOM
                                    </label>

                                    <input
                                        name="room"
                                        value={
                                            form.room
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Living Room"
                                        required
                                    />
                                </div>

                                {/* PRICE */}
                                <div className="admin-form-field">
                                    <label>
                                        PRICE (₹)
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            form.price
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="32999"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* OLD PRICE */}
                                <div className="admin-form-field">
                                    <label>
                                        OLD PRICE (₹)
                                    </label>

                                    <input
                                        type="number"
                                        name="oldPrice"
                                        value={
                                            form.oldPrice
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="39999"
                                        min="0"
                                    />
                                </div>

                                {/* STOCK */}
                                <div className="admin-form-field">
                                    <label>
                                        STOCK
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={
                                            form.stock
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* BADGE */}
                                <div className="admin-form-field">
                                    <label>
                                        BADGE
                                    </label>

                                    <input
                                        name="badge"
                                        value={
                                            form.badge
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="BESTSELLER"
                                    />
                                </div>

                                {/* MATERIAL */}
                                <div className="admin-form-field">
                                    <label>
                                        MATERIAL
                                    </label>

                                    <input
                                        name="material"
                                        value={
                                            form.material
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Premium Fabric"
                                    />
                                </div>

                                {/* COLOR */}
                                <div className="admin-form-field">
                                    <label>
                                        COLOR
                                    </label>

                                    <input
                                        name="color"
                                        value={
                                            form.color
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Beige"
                                    />
                                </div>

                                {/* DIMENSIONS */}
                                <div className="admin-form-field">
                                    <label>
                                        DIMENSIONS
                                    </label>

                                    <input
                                        name="dimensions"
                                        value={
                                            form.dimensions
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="220 × 90 × 85 cm"
                                    />
                                </div>

                                {/* IMAGE */}
                                <div className="admin-form-field full">
                                    <label>
                                        PRODUCT IMAGE
                                    </label>

                                    {/* UPLOAD BUTTON */}
                                    <label
                                        htmlFor="product-image-upload"
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            gap: "8px",
                                            width: "100%",
                                            minHeight:
                                                "48px",
                                            padding:
                                                "12px 16px",
                                            border: "1px dashed #8b6348",
                                            borderRadius:
                                                "8px",
                                            background:
                                                "#f8f3ee",
                                            color:
                                                "#8b6348",
                                            fontWeight:
                                                600,
                                            fontSize:
                                                "13px",
                                            cursor:
                                                uploadingImage
                                                    ? "not-allowed"
                                                    : "pointer",
                                            opacity:
                                                uploadingImage
                                                    ? 0.6
                                                    : 1,
                                        }}
                                    >
                                        {uploadingImage ? (
                                            <>
                                                <RefreshCw
                                                    size={
                                                        17
                                                    }
                                                    className="admin-refresh-spin"
                                                />

                                                Uploading
                                                image...
                                            </>
                                        ) : (
                                            <>
                                                <Upload
                                                    size={
                                                        17
                                                    }
                                                />

                                                Choose
                                                Product
                                                Image
                                            </>
                                        )}
                                    </label>

                                    <input
                                        id="product-image-upload"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={
                                            handleImageUpload
                                        }
                                        disabled={
                                            uploadingImage ||
                                            saving
                                        }
                                        style={{
                                            display:
                                                "none",
                                        }}
                                    />

                                    <p
                                        style={{
                                            margin:
                                                "8px 0 0",
                                            fontSize:
                                                "11px",
                                            opacity:
                                                0.55,
                                        }}
                                    >
                                        JPG, JPEG, PNG
                                        or WEBP •
                                        Maximum 5 MB
                                    </p>

                                    {/* IMAGE URL */}
                                    <div
                                        style={{
                                            marginTop:
                                                "14px",
                                        }}
                                    >
                                        <label
                                            style={{
                                                display:
                                                    "block",
                                                marginBottom:
                                                    "7px",
                                            }}
                                        >
                                            IMAGE URL
                                            <span
                                                style={{
                                                    fontWeight:
                                                        400,
                                                    opacity:
                                                        0.55,
                                                    marginLeft:
                                                        "5px",
                                                }}
                                            >
                                                (optional)
                                            </span>
                                        </label>

                                        <input
                                            name="image"
                                            value={
                                                form.image
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="https://example.com/product.jpg"
                                        />
                                    </div>

                                    {/* IMAGE PREVIEW */}
                                    {form.image && (
                                        <div
                                            style={{
                                                marginTop:
                                                    "10px",
                                                height:
                                                    "130px",
                                                borderRadius:
                                                    "8px",
                                                overflow:
                                                    "hidden",
                                                border:
                                                    "1px solid rgba(139,99,72,0.15)",
                                                background:
                                                    "#f4efe8",
                                                position:
                                                    "relative",
                                            }}
                                        >
                                            <img
                                                src={
                                                    form.image
                                                }
                                                alt="Product Preview"
                                                style={{
                                                    width:
                                                        "100%",
                                                    height:
                                                        "100%",
                                                    objectFit:
                                                        "cover",
                                                }}
                                                onError={(
                                                    e
                                                ) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />

                                            <span
                                                style={{
                                                    position:
                                                        "absolute",
                                                    left:
                                                        "10px",
                                                    bottom:
                                                        "10px",
                                                    padding:
                                                        "5px 8px",
                                                    background:
                                                        "rgba(32,28,24,0.75)",
                                                    color:
                                                        "#fff",
                                                    borderRadius:
                                                        "5px",
                                                    fontSize:
                                                        "10px",
                                                }}
                                            >
                                                Image
                                                Preview
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* DESCRIPTION */}
                                <div className="admin-form-field full">
                                    <label>
                                        DESCRIPTION
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Write a detailed product description..."
                                        rows="4"
                                    />
                                </div>

                                {/* ACTIVE */}
                                <label className="admin-active-toggle">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={
                                            form.isActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <span>
                                        Product is
                                        active and
                                        visible in
                                        store
                                    </span>
                                </label>
                            </div>

                            <div className="admin-product-form-actions">
                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={
                                        saving ||
                                        uploadingImage
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        uploadingImage
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                            ? "Update Product"
                                            : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;

