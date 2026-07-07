import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Pencil, Utensils } from "lucide-react";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";
import Loader from "../../components/common/Loader";

function MyMenu() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getEmptyForm = () => ({
    itemName: "",
    description: "",
    restaurantId: Number(user?.restaurantId || 0),
    price: "",
    discountPrice: "",
    imageUrl: "",
    tasteInfo: "",
    nutritionalInfo: "",
    availabilityTime: "",
    isVeg: true,
    isAvailable: true,
    categoryId: "",
  });

  const [form, setForm] = useState(getEmptyForm());

  const loadData = async () => {
    try {
      setLoading(true);

      const [menuRes, categoryRes] = await Promise.all([
        API.get(`/restaurants/${user.restaurantId}/menu`),
        API.get("/Category"),
      ]);

      setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);

      const menuData = Array.isArray(menuRes.data) ? menuRes.data : [];

      setMenus(
        menuData.map((m) => ({
          ...m,
          categoryId: m.categoryId || m.category?.categoryId || "",
        }))
      );
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Unable to load restaurant menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurantId) {
      setForm(getEmptyForm());
      loadData();
    }
  }, [user?.restaurantId]);

  const buildPayload = (data) => ({
    itemName: data.itemName || "",
    description: data.description || "",
    restaurantId: Number(data.restaurantId || user.restaurantId),
    price: Number(data.price || 0),
    discountPrice: Number(data.discountPrice || 0),
    imageUrl: data.imageUrl || "",
    tasteInfo: data.tasteInfo || "",
    nutritionalInfo: data.nutritionalInfo || "",
    availabilityTime: data.availabilityTime || "",
    isVeg: data.isVeg === true || data.isVeg === "true",
    isAvailable: data.isAvailable === true || data.isAvailable === "true",
    categoryId: Number(data.categoryId || form.categoryId || categories[0]?.categoryId || 1),
  });

  const resetForm = () => {
    setEditingId(null);
    setForm(getEmptyForm());
  };

  const submitMenu = async (e) => {
    e.preventDefault();

    const payload = buildPayload(form);

    try {
      if (editingId) {
        await API.put(`/Menu/${editingId}`, payload);
        alert("Menu updated successfully");
      } else {
        await API.post("/Menu", payload);
        alert("Menu added successfully");
      }

      resetForm();
      loadData();
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data || "Unable to save menu");
    }
  };

  const editMenu = (menu) => {
    setEditingId(menu.menuItemId);

    setForm({
      itemName: menu.itemName || "",
      description: menu.description || "",
      restaurantId: Number(menu.restaurantId || user.restaurantId),
      price: menu.price ?? "",
      discountPrice: menu.discountPrice ?? "",
      imageUrl: menu.imageUrl || "",
      tasteInfo: menu.tasteInfo || "",
      nutritionalInfo: menu.nutritionalInfo || "",
      availabilityTime: menu.availabilityTime || "",
      isVeg: Boolean(menu.isVeg),
      isAvailable: Boolean(menu.isAvailable),
      categoryId: menu.categoryId || categories[0]?.categoryId || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMenu = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await API.delete(`/Menu/${id}`);
      alert("Menu deleted successfully");
      loadData();
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data || "Unable to delete menu");
    }
  };

  const toggleAvailability = async (menu) => {
    const nextAvailability = !Boolean(menu.isAvailable);

    const payload = buildPayload({
      ...menu,
      restaurantId: Number(menu.restaurantId || user.restaurantId),
      categoryId: menu.categoryId || categories[0]?.categoryId || 1,
      isAvailable: nextAvailability,
    });

    try {
      await API.put(`/Menu/${menu.menuItemId}`, payload);

      setMenus((prev) =>
        prev.map((m) =>
          m.menuItemId === menu.menuItemId
            ? { ...m, isAvailable: nextAvailability }
            : m
        )
      );

      alert(
        nextAvailability
          ? "Menu item marked as Available"
          : "Menu item marked as Unavailable"
      );
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data || "Unable to change availability");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Restaurant</p>
          <h1>My Menu</h1>
          <p>Add, update, delete and manage availability of your food items.</p>
        </div>
      </div>

      <section className="form-card">
        <h2>
          <PlusCircle size={22} />
          {editingId ? "Update Menu Item" : "Add Menu Item"}
        </h2>

        <form className="menu-form" onSubmit={submitMenu}>
          <input
            placeholder="Item Name"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            required
          />

          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Discount Price"
            value={form.discountPrice}
            onChange={(e) =>
              setForm({ ...form, discountPrice: e.target.value })
            }
            required
          />

          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <input
            placeholder="Taste Info"
            value={form.tasteInfo}
            onChange={(e) => setForm({ ...form, tasteInfo: e.target.value })}
          />

          <input
            placeholder="Nutritional Info"
            value={form.nutritionalInfo}
            onChange={(e) =>
              setForm({ ...form, nutritionalInfo: e.target.value })
            }
          />

          <input
            placeholder="Availability Time"
            value={form.availabilityTime}
            onChange={(e) =>
              setForm({ ...form, availabilityTime: e.target.value })
            }
          />

          <select
            value={String(form.isVeg)}
            onChange={(e) =>
              setForm({ ...form, isVeg: e.target.value === "true" })
            }
          >
            <option value="true">Veg</option>
            <option value="false">Non-Veg</option>
          </select>

          <select
            value={String(form.isAvailable)}
            onChange={(e) =>
              setForm({ ...form, isAvailable: e.target.value === "true" })
            }
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>

          <textarea
            placeholder="Description / Ingredients"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="form-actions">
            <button className="primary-btn">
              {editingId ? "Update Menu" : "Add Menu"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="table-card">
        <h2>
          <Utensils size={22} />
          Your Menu Items
        </h2>

        {menus.map((menu) => (
          <div className="data-row menu-row" key={menu.menuItemId}>
            <div className="menu-small-img">
              {menu.imageUrl ? (
                <img src={menu.imageUrl} alt={menu.itemName} />
              ) : (
                "🍽️"
              )}
            </div>

            <div>
              <h3>{menu.itemName}</h3>
              <p>
                ₹{menu.discountPrice || menu.price} •{" "}
                {menu.isVeg ? "Veg" : "Non-Veg"}
              </p>
              <small>
                Category ID: {menu.categoryId || "N/A"} •{" "}
                {menu.availabilityTime}
              </small>
            </div>

            <span className={menu.isAvailable ? "status good" : "status bad"}>
              {menu.isAvailable ? "Available" : "Unavailable"}
            </span>

            <div className="row-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => toggleAvailability(menu)}
              >
                {menu.isAvailable ? "Mark Unavailable" : "Mark Available"}
              </button>

              <button
                type="button"
                className="icon-btn"
                onClick={() => editMenu(menu)}
              >
                <Pencil size={18} />
              </button>

              <button
                type="button"
                className="icon-danger"
                onClick={() => deleteMenu(menu.menuItemId)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default MyMenu;