
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, ArrowLeft, MessageSquare } from "lucide-react";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const products = [
    {
        id: "1",
        name: "Luna Lounge Sofa",
    },
    {
        id: "2",
        name: "Aria Accent Chair",
    },
    {
        id: "3",
        name: "Oslo Coffee Table",
    },
    {
        id: "4",
        name: "Mira Floor Lamp",
    },
    {
        id: "5",
        name: "Cove Side Table",
    },
    {
        id: "6",
        name: "Nora Dining Chair",
    },
    {
        id: "7",
        name: "Eden Bookshelf",
    },
    {
        id: "8",
        name: "Luxe Bedside Table",
    },
];

function Reviews() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const productId =
        searchParams.get("productId") || "1";

    const product =
        products.find(
            (item) =>
                item.id === String(productId)
        ) || products[0];

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_URL}/api/reviews/product/${product.id}`
            );

            setReviews(
                response.data.reviews || []
            );
        } catch (error) {
            console.error(
                "Fetch reviews error:",
                error
            );
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [product.id]);

    const averageRating =
        reviews.length > 0
            ? reviews.reduce(
                (sum, review) =>
                    sum +
                    Number(review.rating),
                0
            ) / reviews.length
            : 0;

    return (
        <div className="reviews-page">
            <div className="reviews-page-header">
                <button
                    className="reviews-back-btn"
                    onClick={() =>
                        navigate(
                            `/product/${product.id}`
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Product
                </button>

                <span>HOMEAURA REVIEWS</span>

                <h1>Customer Reviews</h1>

                <p>
                    What customers say about{" "}
                    <strong>
                        {product.name}
                    </strong>
                </p>
            </div>

            <div className="reviews-page-summary">
                <div className="reviews-big-rating">
                    <strong>
                        {averageRating.toFixed(1)}
                    </strong>

                    <div>
                        <div className="review-stars">
                            {[1, 2, 3, 4, 5].map(
                                (star) => (
                                    <Star
                                        key={star}
                                        size={18}
                                        fill={
                                            star <=
                                                Math.round(
                                                    averageRating
                                                )
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                )
                            )}
                        </div>

                        <span>
                            {reviews.length}{" "}
                            {reviews.length === 1
                                ? "review"
                                : "reviews"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="reviews-page-content">
                {loading ? (
                    <div className="reviews-loading">
                        Loading reviews...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="reviews-empty">
                        <MessageSquare
                            size={42}
                        />

                        <h3>
                            No reviews yet
                        </h3>

                        <p>
                            Be the first customer
                            to review this
                            product.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/product/${product.id}`
                                )
                            }
                        >
                            Write a Review
                        </button>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map(
                            (review) => (
                                <div
                                    className="review-card"
                                    key={
                                        review._id
                                    }
                                >
                                    <div className="review-card-top">
                                        <div>
                                            <strong>
                                                {
                                                    review.customerName
                                                }
                                            </strong>

                                            <div className="review-stars">
                                                {[
                                                    1,
                                                    2,
                                                    3,
                                                    4,
                                                    5,
                                                ].map(
                                                    (
                                                        star
                                                    ) => (
                                                        <Star
                                                            key={
                                                                star
                                                            }
                                                            size={
                                                                16
                                                            }
                                                            fill={
                                                                star <=
                                                                    Number(
                                                                        review.rating
                                                                    )
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <span>
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <p>
                                        {
                                            review.comment
                                        }
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reviews;
