import { useEffect, useState } from "react";
import {
  PackageCheck,
  ShoppingBag,
  ChefHat,
  Bike,
  Home,
  CheckCircle,
  RefreshCw,
  Star,
  Timer,
} from "lucide-react";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function UserOrders() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const [review, setReview] = useState({
    orderId: null,
    restaurantId: null,
    rating: 5,
    comment: "",
  });

  const steps = [
    { key: "Placed", label: "Placed", icon: <ShoppingBag size={18} /> },
    { key: "Confirmed", label: "Confirmed", icon: <CheckCircle size={18} /> },
    { key: "Preparing", label: "Preparing", icon: <ChefHat size={18} /> },
    { key: "OutForDelivery", label: "On the Way", icon: <Bike size={18} /> },
    { key: "Delivered", label: "Delivered", icon: <Home size={18} /> },
  ];

  const statusMap = {
    Placed: 0,
    Processing: 0,
    Confirmed: 1,
    Preparing: 2,
    OutForDelivery: 3,
    "Out for Delivery": 3,
    Delivered: 4,
    Cancelled: -1,
  };

  const statusToPosition = (status) => {
    switch (status) {
      case "Placed":
      case "Processing":
        return 10;
      case "Confirmed":
        return 28;
      case "Preparing":
        return 48;
      case "OutForDelivery":
      case "Out for Delivery":
        return 70;
      case "Delivered":
        return 86;
      default:
        return 10;
    }
  };

  const statusMessage = (status) => {
    switch (status) {
      case "Placed":
      case "Processing":
        return "Your order has been placed successfully.";
      case "Confirmed":
        return "Restaurant accepted your order.";
      case "Preparing":
        return "Chef is preparing your delicious food.";
      case "OutForDelivery":
      case "Out for Delivery":
        return "Delivery partner is on the way.";
      case "Delivered":
        return "Order delivered. Enjoy your meal!";
      case "Cancelled":
        return "Your order has been cancelled.";
      default:
        return "Tracking your order status.";
    }
  };

  const getEstimatedTime = (status) => {
    switch (status) {
      case "Placed":
      case "Processing":
        return "30 - 35 mins";
      case "Confirmed":
        return "20 - 25 mins";
      case "Preparing":
        return "12 - 15 mins";
      case "OutForDelivery":
      case "Out for Delivery":
        return "5 - 8 mins";
      case "Delivered":
        return "Delivered";
      case "Cancelled":
        return "Cancelled";
      default:
        return "30 mins";
    }
  };

  const loadOrders = async () => {
    try {
      const res = await API.get("/Order/my-orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Unable to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadOrders();
      const interval = setInterval(loadOrders, 6000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const hasReviewed = (orderId) => {
    const reviews = JSON.parse(localStorage.getItem("hotbyte_reviews")) || [];
    return reviews.some((r) => Number(r.orderId) === Number(orderId));
  };

  const saveReview = () => {
    if (!review.comment.trim()) {
      alert("Please enter review comment");
      return;
    }

    const oldReviews = JSON.parse(localStorage.getItem("hotbyte_reviews")) || [];

    const newReview = {
      id: Date.now(),
      userId: user.id,
      userEmail: user.email,
      orderId: review.orderId,
      restaurantId: review.restaurantId,
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "hotbyte_reviews",
      JSON.stringify([...oldReviews, newReview])
    );

    alert("Review submitted successfully");

    setReview({
      orderId: null,
      restaurantId: null,
      rating: 5,
      comment: "",
    });
  };

  if (loading) return <Loader />;

  return (
    <main className="page">
      <div className="cart-banner tracking-hero">
        <div>
          <p className="tagline">Live Order Tracking</p>
          <h1>Track Your Food Journey</h1>
          <p>
            Follow your order from restaurant confirmation to doorstep delivery.
          </p>
        </div>

        <PackageCheck size={78} />
      </div>

      <button className="secondary-btn refresh-btn" onClick={loadOrders}>
        <RefreshCw size={16} />
        Refresh Orders
      </button>

      <br />
      <br />

      {orders.length === 0 ? (
        <EmptyState title="No orders found" text="Place an order first." />
      ) : (
        <div className="tracking-list">
          {orders.map((order) => {
            const currentStep = statusMap[order.status] ?? 0;
            const isCancelled = order.status === "Cancelled";

            return (
              <section className="tracking-card" key={order.orderId}>
                <div className="tracking-card-head">
                  <div>
                    <h2>Order #{order.orderId}</h2>
                    <p>
                      Restaurant ID: {order.restaurantId} • Payment:{" "}
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="tracking-amount">
                    <span>Amount</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                </div>

                {isCancelled ? (
                  <div className="cancelled-box">
                    Your order has been cancelled.
                  </div>
                ) : (
                  <div className="map-track-card">
                    <div className="fake-map">
                      <div className="map-road"></div>

                      <div className="map-pin restaurant-pin">
                        🍽️
                        <small>Restaurant</small>
                      </div>

                      <div
                        className="map-bike"
                        style={{
                          left: `${statusToPosition(order.status)}%`,
                        }}
                      >
                        🛵
                      </div>

                      <div className="map-pin home-pin">
                        🏠
                        <small>You</small>
                      </div>
                    </div>

                    <p className="tracking-message">
                      {statusMessage(order.status)}
                    </p>

                    <div className="timeline-steps premium-timeline">
                      {steps.map((step, index) => (
                        <div
                          key={step.key}
                          className={
                            index <= currentStep
                              ? "timeline-step active"
                              : "timeline-step"
                          }
                        >
                          <div className="timeline-dot">{step.icon}</div>
                          <span>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="tracking-footer">
                  <span className={isCancelled ? "status bad" : "status good"}>
                    Current Status: {order.status}
                  </span>

                  <div className="eta-card">
                    <Timer size={18} />
                    <div>
                      <span>Estimated Delivery</span>
                      <h3>{getEstimatedTime(order.status)}</h3>
                    </div>
                  </div>

                  {order.status === "Delivered" && !hasReviewed(order.orderId) && (
                    <button
                      className="secondary-btn"
                      onClick={() =>
                        setReview({
                          orderId: order.orderId,
                          restaurantId: order.restaurantId,
                          rating: 5,
                          comment: "",
                        })
                      }
                    >
                      Write Review
                    </button>
                  )}

                  {hasReviewed(order.orderId) && (
                    <span className="status good">Review Submitted</span>
                  )}
                </div>

                {review.orderId === order.orderId && (
                  <div className="review-box">
                    <h3>How was your food?</h3>

                    <div className="star-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={
                            star <= review.rating
                              ? "star active-star"
                              : "star"
                          }
                          onClick={() =>
                            setReview({
                              ...review,
                              rating: star,
                            })
                          }
                        >
                          <Star size={27} fill="currentColor" />
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Write your review..."
                      value={review.comment}
                      onChange={(e) =>
                        setReview({
                          ...review,
                          comment: e.target.value,
                        })
                      }
                    />

                    <div className="form-actions">
                      <button className="primary-btn" onClick={saveReview}>
                        Submit Review
                      </button>

                      <button
                        className="secondary-btn"
                        onClick={() =>
                          setReview({
                            orderId: null,
                            restaurantId: null,
                            rating: 5,
                            comment: "",
                          })
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default UserOrders;