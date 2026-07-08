import { useEffect, useState } from "react";
import { Store, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
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

      setRestaurants(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load restaurants");
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

      toast.success("Restaurant added successfully");

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
      toast.error("Unable to add restaurant");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Admin</p>
          <h1>Restaurant Management</h1>
          <p>Add restaurants and manage restaurant accounts.</p>
        </div>
      </div>

      {/* Add Restaurant */}

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
              setForm({
                ...form,
                restaurantName: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={(e) =>
              setForm({
                ...form,
                contactNumber: e.target.value,
              })
            }
            required
          />

          <input
            type="email"
            placeholder="Restaurant Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            required
          />

          <input
            type="password"
            placeholder="Restaurant Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            required
          />

          <button className="primary-btn">
            Add Restaurant
          </button>
        </form>
      </section>

      {/* Restaurant List */}

      <section className="table-card">
        <h2>
          <Store size={22} />
          All Restaurants
        </h2>

        {restaurants.length === 0 ? (
          <p className="text-muted">
            No restaurants available.
          </p>
        ) : (
          restaurants.map((restaurant) => (
            <div
              className="data-row"
              key={restaurant.restaurantId}
            >
              <h3>{restaurant.restaurantName}</h3>

              <strong>{restaurant.contactNumber}</strong>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Restaurants;