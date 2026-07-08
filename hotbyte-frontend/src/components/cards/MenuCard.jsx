import { PlusCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MenuCard({ item, onAdd }) {
  const navigate = useNavigate();

  const reviews = JSON.parse(localStorage.getItem("hotbyte_reviews")) || [];

  const restaurantReviews = reviews.filter(
    (review) => Number(review.restaurantId) === Number(item.restaurantId)
  );

  const avgRating =
    restaurantReviews.length > 0
      ? (
          restaurantReviews.reduce(
            (sum, review) => sum + Number(review.rating),
            0
          ) / restaurantReviews.length
        ).toFixed(1)
      : null;

  const openDetails = () => {
    navigate(`/menu/${item.menuItemId}`, {
      state: { item },
    });
  };

  return (
    <div className="menu-card">
      <div className="menu-image" onClick={openDetails}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.itemName} />
        ) : (
          <span>🍽️</span>
        )}

        <span className={item.isVeg ? "food-badge veg" : "food-badge nonveg"}>
          {item.isVeg ? "Veg" : "Non-Veg"}
        </span>
      </div>

      <div className="menu-content">
        <h3 onClick={openDetails} style={{ cursor: "pointer" }}>
          {item.itemName}
        </h3>

        <div className="rating-row">
          {avgRating ? (
            <>
              <Star size={16} fill="#FC8019" color="#FC8019" />
              <strong>{avgRating}</strong>
              <span>
                ({restaurantReviews.length}{" "}
                {restaurantReviews.length === 1 ? "Review" : "Reviews"})
              </span>
            </>
          ) : (
            <span className="no-review">No reviews yet</span>
          )}
        </div>

        <div className="price-row">
          <div>
            <strong>₹{item.discountPrice || item.price}</strong>
            {item.discountPrice && <small>₹{item.price}</small>}
          </div>

          {onAdd && (
            <button
              className="add-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item);
              }}
              disabled={!item.isAvailable}
            >
              <PlusCircle size={18} />
              {item.isAvailable ? "Add" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;