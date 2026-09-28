import { Link } from "react-router-dom";
import {
    ArrowRight,
    Heart,
    Star,
    Truck,
    ShieldCheck,
    RotateCcw,
    Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
    {
        title: "Living Room",
        subtitle: "Sofas & Seating",
        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85",
    },
    {
        title: "Bedroom",
        subtitle: "Beds & Essentials",
        image:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85",
    },
    {
        title: "Lighting",
        subtitle: "Lamps & Lights",
        image:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
    },
    {
        title: "Decor",
        subtitle: "Details That Matter",
        image:
            "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=85",
    },
];

const products = [
    {
        id: 1,
        name: "Luna Lounge Sofa",
        category: "Living Room",
        price: "₹32,999",
        oldPrice: "₹39,999",
        rating: "4.9",
        reviews: 124,
        tag: "BESTSELLER",
        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 2,
        name: "Aster Accent Chair",
        category: "Furniture",
        price: "₹12,499",
        oldPrice: "₹15,999",
        rating: "4.8",
        reviews: 86,
        tag: "NEW",
        image:
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 3,
        name: "Nordic Oak Table",
        category: "Dining",
        price: "₹18,999",
        oldPrice: "₹22,999",
        rating: "4.7",
        reviews: 64,
        tag: "POPULAR",
        image:
            "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 4,
        name: "Cloudline Bed",
        category: "Bedroom",
        price: "₹42,999",
        oldPrice: "₹49,999",
        rating: "4.9",
        reviews: 97,
        tag: "PREMIUM",
        image:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
    },
];

function Home() {
    return (
        <div className="home-page">
            <Navbar />

            {/* HERO */}
            <section className="hero">
                <div
                    className="hero-bg"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90)",
                    }}
                />

                <div className="hero-overlay" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        CURATED FOR MODERN LIVING
                    </div>

                    <h1>
                        Make Room For
                        <br />
                        <em>Beautiful Living.</em>
                    </h1>

                    <p className="hero-text">
                        Discover furniture and decor thoughtfully selected
                        to turn everyday spaces into places you'll love.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/shop" className="shop-btn">
                            Shop Collection
                            <ArrowRight size={17} />
                        </Link>

                        <Link to="/categories" className="outline-btn">
                            Explore Categories
                        </Link>
                    </div>
                </div>

                <div className="hero-bottom">
                    <div className="hero-scroll">
                        <span>SCROLL TO EXPLORE</span>
                        <div className="hero-line" />
                    </div>

                    <span>01 / 04</span>
                </div>
            </section>

            {/* TRUST */}
            <section className="trust-strip">
                <div>
                    <Truck size={21} />
                    <div>
                        <strong>Free Delivery</strong>
                        <span>On orders above ₹999</span>
                    </div>
                </div>

                <div>
                    <ShieldCheck size={21} />
                    <div>
                        <strong>Secure Checkout</strong>
                        <span>Safe & protected payments</span>
                    </div>
                </div>

                <div>
                    <RotateCcw size={21} />
                    <div>
                        <strong>Easy Returns</strong>
                        <span>7-day return policy</span>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="categories">
                <div className="section-title">
                    <div>
                        <span>SHOP BY CATEGORY</span>
                        <h2>
                            Find Your <em>Style</em>
                        </h2>
                    </div>

                    <Link to="/categories" className="section-link">
                        View All
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="category-grid">
                    {categories.map((category) => (
                        <Link
                            to="/categories"
                            className="category-card"
                            key={category.title}
                        >
                            <img src={category.image} alt={category.title} />

                            <div className="category-content">
                                <div>
                                    <span>{category.subtitle}</span>
                                    <h3>{category.title}</h3>
                                </div>

                                <div className="category-arrow">
                                    <ArrowRight size={17} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PRODUCTS */}
            <section className="products">
                <div className="section-title">
                    <div>
                        <span>OUR EDIT</span>
                        <h2>
                            Customer <em>Favourites</em>
                        </h2>
                    </div>

                    <Link to="/shop" className="section-link">
                        Shop All
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="product-grid">
                    {products.map((product) => (
                        <article className="product-card" key={product.id}>
                            <div className="product-image">
                                <Link to={`/product/${product.id}`}>
                                    <img src={product.image} alt={product.name} />
                                </Link>

                                <span className="product-tag">{product.tag}</span>

                                <button
                                    className="product-heart"
                                    type="button"
                                    aria-label={`Add ${product.name} to wishlist`}
                                >
                                    <Heart size={18} />
                                </button>

                                <Link
                                    to={`/product/${product.id}`}
                                    className="quick-add"
                                >
                                    View Product
                                    <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div className="product-details">
                                <span className="product-category">
                                    {product.category}
                                </span>

                                <Link to={`/product/${product.id}`}>
                                    <h3>{product.name}</h3>
                                </Link>

                                <div className="product-meta">
                                    <div className="rating">
                                        <Star size={13} fill="currentColor" />
                                        <span>
                                            {product.rating} ({product.reviews})
                                        </span>
                                    </div>

                                    <div className="product-price">
                                        <strong>{product.price}</strong>
                                        <del>{product.oldPrice}</del>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* AI DESIGN */}
            <section className="room-banner">
                <div
                    className="room-overlay"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=90)",
                    }}
                />

                <div className="room-content">
                    <div className="ai-label">
                        <Sparkles size={15} />
                        HOMEAURA AI
                    </div>

                    <h2>
                        Your Room.
                        <br />
                        <em>Reimagined.</em>
                    </h2>

                    <p>
                        Upload a photo of your room and discover a new
                        look with AI-powered furniture and decor ideas.
                    </p>

                    <Link to="/design-room" className="dark-btn">
                        Design My Room
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            {/* OFFER */}
            <section className="offer">
                <div className="offer-content">
                    <div className="offer-copy">
                        <span>WELCOME OFFER</span>

                        <h2>
                            A Little More
                            <br />
                            <em>Beautiful.</em>
                        </h2>

                        <p>
                            Get <strong>20% OFF</strong> your first order.
                            Use code <strong>HOME20</strong> at checkout.
                        </p>

                        <Link to="/shop" className="dark-btn">
                            Shop Now
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="offer-number">
                        <span>UP TO</span>
                        20<small>%</small>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="about-home">
                <div className="about-inner">
                    <span>THE HOMEAURA PHILOSOPHY</span>

                    <h2>
                        Designed for the way
                        <br />
                        you <em>live.</em>
                    </h2>

                    <p>
                        From statement furniture to the smallest finishing
                        touch, we believe beautiful homes are created through
                        thoughtful choices. HomeAura brings together comfort,
                        quality and timeless design in one place.
                    </p>

                    <Link to="/categories" className="text-button">
                        Discover HomeAura
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;