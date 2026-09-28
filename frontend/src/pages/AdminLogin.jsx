import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ShieldCheck,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter admin email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/admin/login",
                {
                    email,
                    password,
                }
            );

            if (response.data.success) {
                localStorage.setItem(
                    "homeAuraAdminToken",
                    response.data.token
                );

                localStorage.setItem(
                    "homeAuraAdmin",
                    JSON.stringify(response.data.admin)
                );

                navigate("/admin/dashboard");
            }
        } catch (err) {
            console.error("Admin login error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-left">
                <div className="admin-brand">
                    <div className="admin-logo">H</div>

                    <div>
                        <strong>HOMEAURA</strong>
                        <span>FURNITURE & DECOR</span>
                    </div>
                </div>

                <div className="admin-login-content">
                    <span>ADMINISTRATION</span>

                    <h1>
                        Welcome back,
                        <br />
                        <em>Admin.</em>
                    </h1>

                    <p>
                        Manage products, orders, customers and everything
                        that keeps your HomeAura store running smoothly.
                    </p>
                </div>

                <div className="admin-login-footer">
                    <span>HOMEAURA ADMIN PANEL</span>
                    <span>© 2026</span>
                </div>
            </div>

            <div className="admin-login-right">
                <div className="admin-login-card">
                    <div className="admin-login-icon">
                        <ShieldCheck size={24} />
                    </div>

                    <div className="admin-card-heading">
                        <span>SECURE ACCESS</span>

                        <h2>Admin Login</h2>

                        <p>
                            Sign in to access your HomeAura dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-field">
                            <label>ADMIN EMAIL</label>

                            <input
                                type="email"
                                placeholder="admin@homeaura.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="admin-field">
                            <label>PASSWORD</label>

                            <div className="admin-password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label="Show password"
                                >
                                    {showPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="admin-login-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                "Signing In..."
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <Link to="/" className="admin-back-home">
                        ← Back to HomeAura
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
