import { MapPin, Store } from "lucide-react";
import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-img">
        <Store size={52} />
      </div>

      <div className="restaurant-body">
        <h3>{restaurant.restaurantName}</h3>

        <p>
          <MapPin size={15} />
          {restaurant.location}
        </p>

        <span>{restaurant.contactNumber}</span>

        <Link
          to={`/menu?restaurantId=${restaurant.restaurantId}`}
          className="small-btn"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}

export default RestaurantCard;