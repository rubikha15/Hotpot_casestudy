import { PlusCircle } from "lucide-react";

function MenuCard({ item, onAdd }) {
  return (
    <div className="menu-card">
      <div className="menu-image">
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
        <h3>{item.itemName}</h3>

        <p className="menu-desc">
          {item.description || "Delicious food item from HotByte."}
        </p>

        <div className="chips">
          <span>{item.categoryName || "Food"}</span>
          <span>{item.tasteInfo || "Classic"}</span>
          <span>{item.availabilityTime || "All Day"}</span>
        </div>

        <div className="price-row">
          <div>
            <strong>₹{item.discountPrice || item.price}</strong>
            {item.discountPrice && <small>₹{item.price}</small>}
          </div>

          {onAdd && (
            <button className="add-btn" onClick={() => onAdd(item)}>
              <PlusCircle size={18} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuCard;