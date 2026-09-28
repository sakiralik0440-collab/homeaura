import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
    {
        number: "01",
        name: "Living Room",
        description: "Sofas, chairs, tables & more",
        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=90",
    },
    {
        number: "02",
        name: "Bedroom",
        description: "Beds & pieces for better rest",
        image:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=90",
    },
    {
        number: "03",
        name: "Lighting",
        description: "Light that changes the mood",
        image:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=90",
    },
    {
        number: "04",
        name: "Wall Decor",
        description: "Mirrors, art & beautiful details",
        image:
            "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=90",
    },
    {
        number: "05",
        name: "Kitchen & Dining",
        description: "Made for meals & memories",
        image:
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90",
    },
    {
        number: "06",
        name: "Home Accessories",
        description: "The finishing touches",
        image:
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=90",
    },
];

function Categories() {
    return (
        <div className="categories-page">

            <Navbar />

            {/* INTRO HERO */}
            <section className="categories-heading">

                <div className="categories-heading-left">
                    <div className="categories-eyebrow">
                        <Sparkles size={13} />
                        EXPLORE HOMEAURA
                    </div>

                    <h1>
                        Find pieces
                        <br />
                        <em>you'll love.</em>
                    </h1>
                </div>

                <div className="categories-heading-right">
                    <p>
                        Thoughtfully designed furniture and decor for
                        every room, every mood and every moment at home.
                    </p>

                    <Link to="/shop" className="categories-shop-link">
                        Shop All Products
                        <ArrowRight size={16} />
                    </Link>
                </div>

            </section>

            {/* CATEGORY LIST */}
            <section className="category-collection">

                {categories.map((category) => (
                    <Link
                        key={category.number}
                        to={`/shop?category=${encodeURIComponent(
                            category.name
                        )}`}
                        className="category-item"
                    >

                        <div className="category-item-number">
                            {category.number}
                        </div>

                        <div className="category-item-image">
                            <img
                                src={category.image}
                                alt={category.name}
                            />
                        </div>

                        <div className="category-item-info">

                            <div>
                                <span>{category.description}</span>

                                <h2>{category.name}</h2>
                            </div>

                            <div className="category-item-arrow">
                                <ArrowRight size={18} />
                            </div>

                        </div>

                    </Link>
                ))}

            </section>

            {/* BOTTOM MESSAGE */}
            <section className="categories-bottom">

                <span>THE HOMEAURA COLLECTION</span>

                <h2>
                    Beautiful homes begin
                    <br />
                    with <em>beautiful choices.</em>
                </h2>

                <Link to="/shop" className="categories-bottom-btn">
                    Explore Collection
                    <ArrowRight size={16} />
                </Link>

            </section>

            <Footer />

        </div>
    );
}

export default Categories;