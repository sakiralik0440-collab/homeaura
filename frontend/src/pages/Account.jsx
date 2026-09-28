import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Mail,
    Phone,
    User,
    LogOut,
    ShoppingBag,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Account() {
    const navigate = useNavigate();

    const {
        customer,
        logout,
    } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", {
            replace: true,
        });
    };

    return (
        <div className="account-page">

            {/* HEADER */}

            <div className="account-header">
                <div className="account-header-inner">

                    <Link
                        to="/"
                        className="account-back"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <h1>
                        My Account
                    </h1>

                    <p>
                        Manage your HomeAura account
                        and personal details.
                    </p>

                </div>
            </div>


            {/* CONTENT */}

            <main className="account-content">

                {/* PROFILE CARD */}

                <section className="account-card">

                    <div className="account-profile-top">

                        <div className="account-avatar">
                            <User size={30} />
                        </div>

                        <div>
                            <span className="account-label">
                                Welcome back
                            </span>

                            <h2>
                                {customer?.name ||
                                    "Customer"}
                            </h2>

                            <p>
                                HomeAura Customer
                            </p>
                        </div>

                    </div>


                    {/* DETAILS */}

                    <div className="account-details">

                        <div className="account-detail">

                            <div className="account-detail-icon">
                                <Mail size={19} />
                            </div>

                            <div>
                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {customer?.email ||
                                        "Not available"}
                                </strong>
                            </div>

                        </div>


                        <div className="account-detail">

                            <div className="account-detail-icon">
                                <Phone size={19} />
                            </div>

                            <div>
                                <span>
                                    Phone Number
                                </span>

                                <strong>
                                    {customer?.phone ||
                                        "Not added"}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="account-card">

                    <h3>
                        Quick Actions
                    </h3>

                    <div className="account-actions">

                        <Link
                            to="/orders"
                            className="account-action"
                        >
                            <ShoppingBag size={20} />

                            <div>
                                <strong>
                                    My Orders
                                </strong>

                                <span>
                                    View your orders
                                    and order history
                                </span>
                            </div>
                        </Link>

                    </div>

                </section>


                {/* LOGOUT */}

                <button
                    className="account-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={19} />
                    Logout
                </button>

            </main>

        </div>
    );
}

export default Account;
