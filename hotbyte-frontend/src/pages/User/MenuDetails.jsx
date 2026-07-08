import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PlusCircle, Star } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";
import Loader from "../../components/common/Loader";

function MenuDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const [item, setItem] = useState(state?.item || null);
  const [loading, setLoading] = useState(!state?.item);

  useEffect(() => {
    const loadItem = async () => {
      if (state?.item) return;

      try {
        setLoading(true);
        const res = await API.get(`/Menu/${id}`);
        setItem(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Menu item not found");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, state]);

  if (loading) return <Loader />;

  if (!item) {
    return (
      <main className="page">
        <button className="secondary-btn" onClick={() => navigate("/menu")}>
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <h2>Menu item not found</h2>
      </main>
    );
  }

  const reviews = JSON.parse(localStorage.getItem("hotbyte_reviews")) || [];

  const restaurantReviews = reviews.filter(
    (r) => Number(r.restaurantId) === Number(item.restaurantId)
  );

  const avgRating =
    restaurantReviews.length > 0
      ? (
          restaurantReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          restaurantReviews.length
        ).toFixed(1)
      : null;

  const addToCart = async () => {
    if (!user) {
      toast.warning("Please login first");
      return;
    }

    if (user.role !== "User") {
      toast.warning("Only users can add items to cart");
      return;
    }

    try {
      await API.post(`/Cart/${user.id}`, {
        menuItemId: item.menuItemId,
        quantity: 1,
      });

      toast.success(`${item.itemName} added to cart 🛒`);
    } catch {
      toast.error("Unable to add item to cart");
    }
  };

  return (
    <main className="page">
      <button className="secondary-btn" onClick={() => navigate("/menu")}>
        <ArrowLeft size={18} />
        Back to Menu
      </button>

      <section className="menu-detail-page">
        <div className="menu-detail-img">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.itemName} />
          ) : (
            <span>🍽️</span>
          )}
        </div>

        <div className="menu-detail-content">
          <span className={item.isVeg ? "food-badge veg" : "food-badge nonveg"}>
            {item.isVeg ? "Veg" : "Non-Veg"}
          </span>

          <h1>{item.itemName}</h1>

          <p className="restaurant-name">
            {item.restaurantName || "HotByte Restaurant"}
          </p>

          <div className="rating-row">
            {avgRating ? (
              <>
                <Star size={18} fill="#fc8019" color="#fc8019" />
                <strong>{avgRating}</strong>
                <span>({restaurantReviews.length} reviews)</span>
              </>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>

          <p className="menu-detail-desc">
            {item.description || "Delicious food item from HotByte."}
          </p>

          <div className="modal-info-grid">
            <div>
              <span>Category</span>
              <strong>{item.categoryName || "Food"}</strong>
            </div>

            <div>
              <span>Taste</span>
              <strong>{item.tasteInfo || "Classic"}</strong>
            </div>

            <div>
              <span>Available</span>
              <strong>{item.availabilityTime || "All Day"}</strong>
            </div>

            <div>
              <span>Nutrition</span>
              <strong>{item.nutritionalInfo || "Not mentioned"}</strong>
            </div>
          </div>

          <div className="menu-detail-bottom">
            <div>
              <span>Price</span>
              <h2>₹{item.discountPrice || item.price}</h2>
              {item.discountPrice && <small>₹{item.price}</small>}
            </div>

            <button className="primary-btn" onClick={addToCart}>
              <PlusCircle size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MenuDetails;