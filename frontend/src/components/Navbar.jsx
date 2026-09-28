import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    Search,
    Heart,
    ShoppingBag,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
    const [mobileMenu, setMobileMenu] = useState(false);

    const navigate = useNavigate();

    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();

    const {
        customer,
        isAuthenticated,
        logout,
    } = useAuth();

    const closeMenu = () => {
        setMobileMenu(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate("/login", {
            replace: true,
        });
    };

    return (
        <>
            {/* =========================
                TOP BAR
            ========================= */}

            <div className="topbar">
                <p>
                    Free Shipping on Orders Above{" "}
                    <span>₹999</span>
                </p>

                <p>|</p>

                <p>
                    Easy <span>7-Day Returns</span>
                </p>
            </div>


            {/* =========================
                NAVBAR
            ========================= */}

            <header className="navbar">

                {/* LOGO */}

                <div className="nav-left">
                    <Link
                        to="/"
                        className="logo"
                        onClick={closeMenu}
                    >
                        <div className="logo-icon">
                            H
                        </div>

                        <div>
                            <strong>
                                HOMEAURA
                            </strong>

                            <small>
                                FURNITURE & DECOR
                            </small>
                        </div>
                    </Link>
                </div>


                {/* =========================
                    MAIN NAVIGATION
                ========================= */}

                <nav
                    className={`main-nav ${mobileMenu
                            ? "show-menu"
                            : ""
                        }`}
                >

                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>

                    <Link
                        to="/shop"
                        onClick={closeMenu}
                    >
                        Shop
                    </Link>

                    <Link
                        to="/categories"
                        onClick={closeMenu}
                    >
                        Categories
                        <ChevronDown size={13} />
                    </Link>

                    <Link
                        to="/shop"
                        onClick={closeMenu}
                    >
                        Best Sellers
                    </Link>

                    <Link
                        to="/#about"
                        onClick={closeMenu}
                    >
                        About
                    </Link>


                    {/* =========================
                        MOBILE AUTH
                    ========================= */}

                    <div className="mobile-auth-links">

                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="mobile-user-name">
                                    Hi,{" "}
                                    {customer?.name ||
                                        "Customer"}
                                </span>

                                <Link
                                    to="/account"
                                    onClick={closeMenu}
                                >
                                    My Account
                                </Link>

                                <Link
                                    to="/orders"
                                    onClick={closeMenu}
                                >
                                    My Orders
                                </Link>

                                <button
                                    onClick={
                                        handleLogout
                                    }
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>

                </nav>


                {/* =========================
                    NAV ACTIONS
                ========================= */}

                <div className="nav-actions">

                    {/* SEARCH */}

                    <Link
                        to="/shop"
                        className="nav-icon"
                        aria-label="Search"
                        title="Search"
                    >
                        <Search size={19} />
                    </Link>


                    {/* WISHLIST */}

                    <Link
                        to="/wishlist"
                        className="nav-icon wishlist-icon"
                        aria-label="Wishlist"
                        title="Wishlist"
                    >
                        <Heart
                            size={19}
                            fill={
                                wishlistCount > 0
                                    ? "#c94b4b"
                                    : "none"
                            }
                            color={
                                wishlistCount > 0
                                    ? "#c94b4b"
                                    : "currentColor"
                            }
                            strokeWidth={2}
                        />

                        {wishlistCount > 0 && (
                            <span>
                                {wishlistCount}
                            </span>
                        )}
                    </Link>


                    {/* CART */}

                    <Link
                        to="/cart"
                        className="nav-icon cart-icon"
                        aria-label="Cart"
                        title="Cart"
                    >
                        <ShoppingBag size={19} />

                        {cartCount > 0 && (
                            <span>
                                {cartCount}
                            </span>
                        )}
                    </Link>


                    {/* =========================
                        ACCOUNT
                    ========================= */}

                    {isAuthenticated ? (
                        <div className="nav-account">

                            {/* ACCOUNT → /account */}

                            <Link
                                to="/account"
                                className="nav-icon account-icon"
                                aria-label="Account"
                                title={
                                    customer?.name ||
                                    "My Account"
                                }
                            >
                                <User size={19} />
                            </Link>


                            {/* LOGOUT */}

                            <button
                                className="nav-logout-btn"
                                onClick={
                                    handleLogout
                                }
                                title="Logout"
                                aria-label="Logout"
                            >
                                <LogOut size={18} />
                            </button>

                        </div>
                    ) : (

                        /* LOGGED OUT */

                        <Link
                            to="/login"
                            className="nav-icon account-icon"
                            aria-label="Login"
                            title="Login"
                        >
                            <User size={19} />
                        </Link>

                    )}


                    {/* MOBILE MENU */}

                    <button
                        className="mobile-menu-btn"
                        onClick={() =>
                            setMobileMenu(
                                !mobileMenu
                            )
                        }
                        aria-label="Menu"
                    >
                        {mobileMenu ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>

                </div>

            </header>
        </>
    );
}

export default Navbar;
