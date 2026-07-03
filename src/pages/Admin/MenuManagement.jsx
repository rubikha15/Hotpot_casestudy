import { useEffect, useState } from "react";
import { Utensils, Trash2, Pencil } from "lucide-react";
import API from "../../api/api";
import Loader from "../../components/common/Loader";

function MenuManagement() {
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const res = await API.get("/Menu", {
        params: { pageNumber: 1, pageSize: 100 },
      });
      setMenus(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const startEdit = (menu) => {
    setEditingId(menu.menuItemId);
    setEditForm({
      itemName: menu.itemName,
      description: menu.description,
      restaurantId: menu.restaurantId,
      price: menu.price,
      discountPrice: menu.discountPrice,
      imageUrl: menu.imageUrl,
      tasteInfo: menu.tasteInfo,
      nutritionalInfo: menu.nutritionalInfo,
      availabilityTime: menu.availabilityTime,
      isVeg: menu.isVeg,
      isAvailable: menu.isAvailable,
      categoryId: menu.categoryId,
    });
  };

  const updateMenu = async () => {
    try {
      await API.put(`/Menu/${editingId}`, editForm);
      alert("Menu updated");
      setEditingId(null);
      setEditForm(null);
      loadMenus();
    } catch (err) {
      console.log(err);
      alert("Unable to update menu");
    }
  };

  const deleteMenu = async (id) => {
    if (!confirm("Delete this menu item?")) return;

    try {
      await API.delete(`/Menu/${id}`);
      alert("Menu deleted");
      loadMenus();
    } catch (err) {
      console.log(err);
      alert("Unable to delete menu");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Admin</p>
          <h1>Menu Management</h1>
          <p>View, update and delete all menu items.</p>
        </div>
      </div>

      <section className="table-card">
        <h2>
          <Utensils size={22} />
          All Menu Items
        </h2>

        {menus.map((m) => (
          <div className="data-row vertical" key={m.menuItemId}>
            {editingId === m.menuItemId ? (
              <div className="edit-form">
                <input
                  value={editForm.itemName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, itemName: e.target.value })
                  }
                />

                <input
                  value={editForm.price}
                  type="number"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      price: Number(e.target.value),
                    })
                  }
                />

                <input
                  value={editForm.discountPrice}
                  type="number"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      discountPrice: Number(e.target.value),
                    })
                  }
                />

                <select
                  value={editForm.isVeg}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isVeg: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Veg</option>
                  <option value="false">Non-Veg</option>
                </select>

                <select
                  value={editForm.isAvailable}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isAvailable: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>

                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                />

                <div className="row-actions">
                  <button className="primary-btn" onClick={updateMenu}>
                    Save
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setEditingId(null);
                      setEditForm(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3>{m.itemName}</h3>
                  <p>
                    ₹{m.discountPrice || m.price} •{" "}
                    {m.isVeg ? "Veg" : "Non-Veg"} •{" "}
                    {m.isAvailable ? "Available" : "Not Available"}
                  </p>
                  <small>
                    Restaurant ID: {m.restaurantId} | Category ID: {m.categoryId}
                  </small>
                </div>

                <div className="row-actions">
                  <button className="icon-btn" onClick={() => startEdit(m)}>
                    <Pencil size={18} />
                  </button>

                  <button
                    className="icon-danger"
                    onClick={() => deleteMenu(m.menuItemId)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default MenuManagement;