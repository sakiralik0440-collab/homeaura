import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AdminReviews() {
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError("");

            // Temporary product list
            const productIds = [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
            ];

            const allReviews = [];

            for (const productId of productIds) {
                try {
                    const response =
                        await axios.get(
                            `${API_URL}/api/reviews/product/${productId}`
                        );

                    if (
                        response.data.reviews
                    ) {
                        allReviews.push(
                            ...response.data
                                .reviews
                        );
                    }
                } catch (err) {
                    console.error(
                        `Failed to load reviews for product ${productId}`,
                        err
                    );
                }
            }

            allReviews.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

            setReviews(allReviews);
        } catch (err) {
            console.error(
                "Admin reviews error:",
                err
            );

            setError(
                "Failed to load reviews."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const deleteReview = async (reviewId) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this review?"
            );

        if (!confirmDelete) return;

        try {
            const token =
                localStorage.getItem(
                    "homeAuraAdminToken"
                );

            await axios.delete(
                `${API_URL}/api/admin/reviews/${reviewId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setReviews((prev) =>
                prev.filter(
                    (review) =>
                        review._id !==
                        reviewId
                )
            );
        } catch (error) {
            console.error(
                "Delete review error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Failed to delete review."
            );
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <button
                        onClick={() =>
                            navigate(
                                "/admin/dashboard"
                            )
                        }
                        className="admin-back-btn"
                    >
                        <ArrowLeft
                            size={18}
                        />
                        Dashboard
                    </button>

                    <h1>
                        Reviews & Ratings
                    </h1>

                    <p>
                        Manage customer reviews
                        and ratings.
                    </p>
                </div>

                <div className="admin-review-count">
                    {reviews.length} Reviews
                </div>
            </div>

            {loading ? (
                <div className="admin-empty-state">
                    Loading reviews...
                </div>
            ) : error ? (
                <div className="admin-empty-state">
                    {error}
                </div>
            ) : reviews.length === 0 ? (
                <div className="admin-empty-state">
                    <Star size={40} />

                    <h3>
                        No reviews yet
                    </h3>

                    <p>
                        Customer reviews will
                        appear here.
                    </p>
                </div>
            ) : (
                <div className="admin-reviews-list">
                    {reviews.map((review) => (
                        <div
                            className="admin-review-card"
                            key={review._id}
                        >
                            <div className="admin-review-top">
                                <div>
                                    <strong>
                                        {
                                            review.customerName
                                        }
                                    </strong>

                                    <div className="admin-review-stars">
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
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            <p>
                                {
                                    review.comment
                                }
                            </p>

                            <button
                                className="admin-delete-review"
                                onClick={() =>
                                    deleteReview(
                                        review._id
                                    )
                                }
                            >
                                <Trash2
                                    size={16}
                                />
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminReviews;
