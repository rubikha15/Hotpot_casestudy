import { useEffect, useState } from "react";
import { Store, Users, Tags, IndianRupee } from "lucide-react";
import API from "../../api/api";
import DashboardCard from "../../components/cards/DashboardCard";
import Loader from "../../components/common/Loader";

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [usersRes, restaurantsRes, categoriesRes, revenueRes] =
        await Promise.all([
          API.get("/Admin/users"),
          API.get("/Admin/restaurants"),
          API.get("/Admin/categories"),
          API.get("/Admin/revenue"),
        ]);

      setUsers(usersRes.data);
      setRestaurants(restaurantsRes.data);
      setCategories(categoriesRes.data);
      setRevenue(revenueRes.data);
    } catch (err) {
      console.log(err);
      alert("Admin data loading failed. Check Admin role/token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Admin Panel</p>
          <h1>HotByte Admin Dashboard</h1>
          <p>Manage users, restaurants, categories, menus and revenue.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          title="Total Users"
          value={users.length}
          icon={<Users />}
          subtitle="Registered users"
        />

        <DashboardCard
          title="Restaurants"
          value={restaurants.length}
          icon={<Store />}
          subtitle="Active restaurants"
        />

        <DashboardCard
          title="Categories"
          value={categories.length}
          icon={<Tags />}
          subtitle="Food categories"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${revenue}`}
          icon={<IndianRupee />}
          subtitle="Total revenue"
        />
      </div>

      <div className="admin-section-grid">
        <section className="table-card">
          <h2>Recent Users</h2>

          {users.slice(0, 5).map((u) => (
            <div className="data-row" key={u.id}>
              <div>
                <h3>{u.name}</h3>
                <p>{u.email}</p>
              </div>

              <span>{u.role}</span>
            </div>
          ))}
        </section>

        <section className="table-card">
          <h2>Restaurants</h2>

          {restaurants.slice(0, 5).map((r) => (
            <div className="data-row" key={r.restaurantId}>
              <div>
                <h3>{r.restaurantName}</h3>
                <p>{r.location}</p>
              </div>

              <span>{r.contactNumber}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;