import { useEffect, useState } from "react";
import { Store, PlusCircle, Trash2 } from "lucide-react";
import API from "../../api/api";
import Loader from "../../components/common/Loader";

function Restaurants() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  const [form, setForm] = useState({
    restaurantName: "",
    location: "",
    contactNumber: "",
    email: "",
    password: "",
  });

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await API.get("/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const addRestaurant = async (e) => {
    e.preventDefault();

    try {
      await API.post("/restaurants", form);

      alert("Restaurant added successfully");

      setForm({
        restaurantName: "",
        location: "",
        contactNumber: "",
        email: "",
        password: "",
      });

      loadRestaurants();
    } catch (err) {
      console.log(err);
      alert("Unable to add restaurant");
    }
  };

  const deleteRestaurant = async (id) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      await API.delete(`/restaurants/${id}`);
      alert("Restaurant deleted");
      loadRestaurants();
    } catch (err) {
      console.log(err);
      alert("Unable to delete restaurant");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Admin</p>
          <h1>Restaurant Management</h1>
          <p>Add, view and delete restaurants.</p>
        </div>
      </div>

      <section className="form-card">
        <h2>
          <PlusCircle size={22} />
          Add Restaurant
        </h2>

        <form className="form-grid" onSubmit={addRestaurant}>
          <input
            placeholder="Restaurant Name"
            value={form.restaurantName}
            onChange={(e) =>
              setForm({ ...form, restaurantName: e.target.value })
            }
            required
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            required
          />

          <input
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={(e) =>
              setForm({ ...form, contactNumber: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Restaurant Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Restaurant Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="primary-btn">Add Restaurant</button>
        </form>
      </section>

      <section className="table-card">
        <h2>
          <Store size={22} />
          All Restaurants
        </h2>

        {restaurants.map((r) => (
          <div className="data-row" key={r.restaurantId}>
            <div>
              <h3>{r.restaurantName}</h3>
              <p>{r.location}</p>
              <small>{r.email}</small>
            </div>

            <div className="row-actions">
              <span>{r.contactNumber}</span>

              <button
                className="icon-danger"
                onClick={() => deleteRestaurant(r.restaurantId)}
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

export default Restaurants;