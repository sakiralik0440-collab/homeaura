import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Footer() {
    return (
        <footer>
            <div className="footer-main">

                {/* BRAND */}
                <div className="footer-brand">
                    <Link to="/" className="logo footer-logo">
                        <div className="logo-icon">H</div>

                        <div>
                            <strong>HOMEAURA</strong>
                            <small>FURNITURE & DECOR</small>
                        </div>
                    </Link>

                    <p>
                        Beautiful furniture and thoughtful decor for
                        spaces that feel like home.
                    </p>

                    <div className="socials">
                        <span>ig</span>
                        <span>f</span>
                        <span>x</span>
                    </div>
                </div>

                {/* SHOP */}
                <div className="footer-column">
                    <h4>SHOP</h4>

                    <Link to="/shop">All Products</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/shop">Best Sellers</Link>
                    <Link to="/shop">New Arrivals</Link>
                </div>

                {/* HELP */}
                <div className="footer-column">
                    <h4>HELP</h4>

                    <Link to="/login">My Account</Link>
                    <Link to="/cart">Shopping Cart</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/#about">About Us</Link>
                </div>

                {/* NEWSLETTER */}
                <div className="newsletter">
                    <h4>STAY INSPIRED</h4>

                    <p>
                        Get home decor ideas and exclusive offers
                        directly in your inbox.
                    </p>

                    <div className="subscribe">
                        <input
                            type="email"
                            placeholder="Your email address"
                        />

                        <button type="button" aria-label="Subscribe">
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

            </div>

            {/* FOOTER BOTTOM */}
            <div className="footer-bottom">
                <span>© 2026 HomeAura. All rights reserved.</span>

                <div>
                    <span>Privacy</span>
                    <span>Terms</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;