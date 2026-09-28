import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    FolderTree,
    Plus,
    Search,
    Pencil,
    Trash2,
    ArrowLeft,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/admin/categories";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        image: "",
        isActive: true,
    });

    const token = localStorage.getItem("homeAuraAdminToken");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                API_URL,
                authConfig
            );

            setCategories(response.data.categories || []);
        } catch (err) {
            console.error("Fetch categories error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!query) return categories;

        return categories.filter(
            (category) =>
                category.name.toLowerCase().includes(query) ||
                category.description
                    ?.toLowerCase()
                    .includes(query)
        );
    }, [categories, search]);

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            image: "",
            isActive: true,
        });

        setEditingCategory(null);
    };

    const openAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (category) => {
        setEditingCategory(category);

        setForm({
            name: category.name || "",
            description: category.description || "",
            image: category.image || "",
            isActive: category.isActive !== false,
        });

        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await axios.put(
                    `${API_URL}/${editingCategory._id}`,
                    form,
                    authConfig
                );
            } else {
                await axios.post(
                    API_URL,
                    form,
                    authConfig
                );
            }

            setShowForm(false);
            resetForm();
            fetchCategories();
        } catch (err) {
            console.error("Save category error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to save category."
            );
        }
    };

    const handleDelete = async (category) => {
        const confirmed = window.confirm(
            `Delete "${category.name}"?`
        );

        if (!confirmed) return;

        try {
            await axios.delete(
                `${API_URL}/${category._id}`,
                authConfig
            );

            setCategories((current) =>
                current.filter(
                    (item) => item._id !== category._id
                )
            );
        } catch (err) {
            console.error("Delete category error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to delete category."
            );
        }
    };

    return (
        <div className="admin-categories-page">
            {/* SIDEBAR */}

            <aside className="admin-categories-sidebar">
                <div className="admin-categories-brand">
                    <div className="admin-categories-logo">
                        H
                    </div>

                    <div>
                        <strong>HOMEAURA</strong>
                        <span>ADMIN PANEL</span>
                    </div>
                </div>

                <nav className="admin-categories-nav">
                    <Link to="/admin/dashboard">
                        ← Dashboard
                    </Link>

                    <Link to="/admin/products">
                        Products
                    </Link>

                    <Link
                        to="/admin/categories"
                        className="active"
                    >
                        <FolderTree size={17} />
                        Categories
                    </Link>

                    <Link to="/admin/orders">
                        Orders
                    </Link>

                    <Link to="/admin/customers">
                        Customers
                    </Link>
                </nav>
            </aside>

            {/* MAIN */}

            <main className="admin-categories-main">
                <header className="admin-categories-header">
                    <div>
                        <Link
                            to="/admin/dashboard"
                            className="admin-categories-back"
                        >
                            <ArrowLeft size={14} />
                            Dashboard
                        </Link>

                        <span>HOMEAURA COLLECTION</span>

                        <h1>
                            Manage
                            <br />
                            <em>Categories.</em>
                        </h1>
                    </div>

                    <button
                        type="button"
                        className="admin-add-category-btn"
                        onClick={openAddForm}
                    >
                        <Plus size={17} />
                        Add Category
                    </button>
                </header>

                {/* TOOLBAR */}

                <section className="admin-categories-toolbar">
                    <div className="admin-categories-search">
                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="admin-categories-count">
                        {filteredCategories.length} CATEGORIES
                    </div>
                </section>

                {/* ERROR */}

                {error && (
                    <div className="admin-categories-error">
                        {error}

                        <button
                            type="button"
                            onClick={fetchCategories}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* LOADING */}

                {loading ? (
                    <div className="admin-categories-loading">
                        <div></div>
                        <p>Loading categories...</p>
                    </div>
                ) : (
                    <section className="admin-categories-grid">
                        {filteredCategories.map((category) => (
                            <article
                                className="admin-category-card"
                                key={category._id}
                            >
                                <div className="admin-category-image">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                    />

                                    <span
                                        className={
                                            category.isActive
                                                ? "active"
                                                : "inactive"
                                        }
                                    >
                                        {category.isActive
                                            ? "ACTIVE"
                                            : "INACTIVE"}
                                    </span>
                                </div>

                                <div className="admin-category-content">
                                    <div>
                                        <span className="admin-category-label">
                                            CATEGORY
                                        </span>

                                        <h2>{category.name}</h2>

                                        <p>
                                            {category.description ||
                                                "No description added."}
                                        </p>
                                    </div>

                                    <div className="admin-category-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditForm(category)
                                            }
                                            title="Edit category"
                                        >
                                            <Pencil size={15} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="delete"
                                            onClick={() =>
                                                handleDelete(category)
                                            }
                                            title="Delete category"
                                        >
                                            <Trash2 size={15} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {filteredCategories.length === 0 && (
                            <div className="admin-categories-empty">
                                <FolderTree size={32} />

                                <h3>No categories found</h3>

                                <p>
                                    Try another search or add a new
                                    category.
                                </p>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* MODAL */}

            {showForm && (
                <div
                    className="admin-category-modal"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="admin-category-form-card"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="admin-category-form-header">
                            <div>
                                <span>
                                    {editingCategory
                                        ? "EDIT CATEGORY"
                                        : "NEW CATEGORY"}
                                </span>

                                <h2>
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="admin-category-form-grid">
                                <div className="admin-category-field">
                                    <label>CATEGORY NAME</label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Furniture"
                                        required
                                    />
                                </div>

                                <div className="admin-category-field">
                                    <label>IMAGE URL</label>

                                    <input
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        required
                                    />
                                </div>

                                <div className="admin-category-field full">
                                    <label>DESCRIPTION</label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Beautiful furniture for every room..."
                                        rows="4"
                                    />
                                </div>

                                <label className="admin-category-active-toggle">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={form.isActive}
                                        onChange={handleChange}
                                    />

                                    Category is active
                                </label>
                            </div>

                            <div className="admin-category-form-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </button>

                                <button type="submit">
                                    {editingCategory
                                        ? "Update Category"
                                        : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;
