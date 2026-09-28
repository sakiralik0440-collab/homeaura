import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Home,
    Lock,
    Mail,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = formData.email.trim();
        const password = formData.password;

        if (!email || !password) {
            setError(
                "Please enter your email and password."
            );
            return;
        }

        if (!email.includes("@")) {
            setError(
                "Please enter a valid email address."
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            await login(email, password);

            // Successful login → Home
            navigate("/", {
                replace: true,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Unable to login. Please check your email and password.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* =====================================
                LEFT VISUAL
            ====================================== */}

            <section className="auth-visual">
                <div className="auth-visual-overlay" />

                <div className="auth-visual-content">

                    {/* NON-CLICKABLE BRAND */}
                    <div className="auth-brand">
                        <span className="auth-brand-icon">
                            <Home size={20} />
                        </span>

                        <span>
                            HomeAura
                        </span>
                    </div>

                    <div className="auth-quote">
                        <span className="auth-quote-line" />

                        <h2>
                            Welcome back
                            <br />
                            to your space.
                        </h2>

                        <p>
                            Sign in to continue exploring
                            beautiful furniture and
                            timeless home decor.
                        </p>
                    </div>

                </div>
            </section>


            {/* =====================================
                RIGHT LOGIN FORM
            ====================================== */}

            <section className="auth-form-section">
                <div className="auth-form-wrapper">

                    {/* MOBILE BRAND
                        NON-CLICKABLE */}
                    <div className="auth-mobile-brand">
                        <span className="auth-brand-icon">
                            <Home size={20} />
                        </span>

                        <span>
                            HomeAura
                        </span>
                    </div>


                    {/* HEADING */}

                    <div className="auth-heading">
                        <span className="auth-eyebrow">
                            Welcome back
                        </span>

                        <h1>
                            Sign in to HomeAura
                        </h1>

                        <p>
                            Access your account and
                            continue your home decor
                            journey.
                        </p>
                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="auth-message auth-error">
                            {error}
                        </div>
                    )}


                    {/* LOGIN FORM */}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className="auth-field">
                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="auth-input-wrapper">

                                <Mail
                                    size={18}
                                    className="auth-input-icon"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="email"
                                />

                            </div>
                        </div>


                        {/* PASSWORD */}

                        <div className="auth-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="auth-input-wrapper">

                                <Lock
                                    size={18}
                                    className="auth-input-icon"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={18}
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                        />
                                    )}
                                </button>

                            </div>
                        </div>


                        {/* SIGN IN BUTTON */}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                            {!loading && (
                                <ArrowRight
                                    size={19}
                                />
                            )}
                        </button>

                    </form>


                    {/* REGISTER LINK */}

                    <div className="auth-switch">
                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create Account
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default Login;
