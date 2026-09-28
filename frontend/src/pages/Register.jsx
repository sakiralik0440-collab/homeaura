import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Home,
    Lock,
    Mail,
    Phone,
    User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ============================================
    // HANDLE INPUT
    // ============================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ============================================
    // REGISTER
    // ============================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const name = form.name.trim();
        const email = form.email.trim();
        const phone = form.phone.trim();

        if (!name || !email || !form.password) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        if (form.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            await register({
                name,
                email,
                phone,
                password: form.password,
            });

            setSuccess(
                "Account created successfully!"
            );

            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* =====================================
                LEFT SIDE
            ====================================== */}

            <div className="auth-visual">

                <div className="auth-visual-overlay" />

                <div className="auth-visual-content">

                    <Link
                        to="/"
                        className="auth-brand"
                    >
                        <Home size={20} />
                        HomeAura
                    </Link>

                    <div className="auth-quote">

                        <span>
                            MAKE SPACE
                        </span>

                        <h1>
                            Create a home
                            <br />
                            you love.
                        </h1>

                        <p>
                            Join HomeAura and discover
                            furniture and decor designed
                            for beautiful everyday living.
                        </p>

                    </div>

                </div>

            </div>

            {/* =====================================
                RIGHT SIDE
            ====================================== */}

            <div className="auth-form-section">

                <div className="auth-form-wrapper">

                    <Link
                        to="/"
                        className="auth-mobile-brand"
                    >
                        <Home size={19} />
                        HomeAura
                    </Link>

                    <div className="auth-heading">

                        <span>
                            WELCOME TO HOMEAURA
                        </span>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Start building a home
                            that feels like yours.
                        </p>

                    </div>

                    {/* =================================
                        ERROR
                    ================================== */}

                    {error && (
                        <div className="auth-message auth-error">
                            {error}
                        </div>
                    )}

                    {/* =================================
                        SUCCESS
                    ================================== */}

                    {success && (
                        <div className="auth-message auth-success">
                            {success}
                        </div>
                    )}

                    {/* =================================
                        FORM
                    ================================== */}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* NAME */}

                        <div className="auth-field">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <div className="auth-input">

                                <User size={18} />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />

                            </div>

                        </div>

                        {/* EMAIL */}

                        <div className="auth-field">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="auth-input">

                                <Mail size={18} />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />

                            </div>

                        </div>

                        {/* PHONE */}

                        <div className="auth-field">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <div className="auth-input">

                                <Phone size={18} />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div className="auth-field">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="auth-input">

                                <Lock size={18} />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Minimum 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* CONFIRM PASSWORD */}

                        <div className="auth-field">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="auth-input">

                                <Lock size={18} />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Re-enter your password"
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* TERMS */}

                        <p className="auth-terms">
                            By creating an account, you
                            agree to our Terms of Service
                            and Privacy Policy.
                        </p>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading ? (
                                "Creating Account..."
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} />
                                </>
                            )}

                        </button>

                    </form>

                    {/* LOGIN */}

                    <div className="auth-switch">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign In
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
