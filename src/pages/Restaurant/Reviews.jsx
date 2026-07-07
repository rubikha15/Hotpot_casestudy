import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import EmptyState from "../../components/common/EmptyState";

function Reviews() {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem("hotbyte_reviews")) || [];

    const myReviews = allReviews.filter(
      (r) => Number(r.restaurantId) === Number(user.restaurantId)
    );

    setReviews(myReviews);
  }, [user]);

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const showNoReviewsToast = () => {
    if (reviews.length === 0) {
      toast.info("No customer reviews yet");
    }
  };

  useEffect(() => {
    showNoReviewsToast();
  }, [reviews.length]);

  return (
    <div>
      <div className="dashboard-head">
        <p className="tagline">Restaurant</p>
        <h1>Customer Reviews</h1>
        <p>Reviews given by users after delivered orders.</p>
      </div>

      <section className="review-summary">
        <h1>{avg}</h1>

        <div>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={24}
              fill={s <= Math.round(avg) ? "#fc8019" : "none"}
              color="#fc8019"
            />
          ))}
        </div>

        <p>{reviews.length} Reviews</p>
      </section>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          text="Customer reviews will appear here after delivery."
        />
      ) : (
        <section className="table-card">
          {reviews.map((r) => (
            <div className="data-row vertical" key={r.id}>
              <div className="review-header">
                <div>
                  <h3>{r.userEmail}</h3>
                  <small>
                    Order #{r.orderId} • {r.createdAt}
                  </small>
                </div>

                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      fill={s <= r.rating ? "#fc8019" : "none"}
                      color="#fc8019"
                    />
                  ))}
                </div>
              </div>

              <p>{r.comment}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Reviews;