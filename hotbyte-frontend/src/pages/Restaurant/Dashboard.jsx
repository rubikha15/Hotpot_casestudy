import { useEffect, useState } from "react";
import { ShoppingBag, Utensils, Clock, Store } from "lucide-react";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";
import DashboardCard from "../../components/cards/DashboardCard";
import Loader from "../../components/common/Loader";

function Dashboard() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [myMenu, setMyMenu] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadRestaurantDashboard = async () => {
    try {
      setLoading(true);

      const [menuRes, orderRes] = await Promise.all([
        API.get(`/restaurants/${user.restaurantId}/menu`),
        API.get("/Order"),
      ]);

      const restaurantOrders = orderRes.data.filter(
        (order) => Number(order.restaurantId) === Number(user.restaurantId)
      );

      setMyMenu(menuRes.data);
      setOrders(restaurantOrders);
    } catch (err) {
      console.log(err);
      alert("Unable to load restaurant dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurantId) {
      loadRestaurantDashboard();
    }
  }, [user]);

  if (loading) return <Loader />;

  const pendingOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== 4
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Restaurant Panel</p>
          <h1>Restaurant Dashboard</h1>
          <p>Manage your menu, monitor orders and track revenue.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          title="Menu Items"
          value={myMenu.length}
          icon={<Utensils />}
          subtitle="Total food items"
        />

        <DashboardCard
          title="Orders"
          value={orders.length}
          icon={<ShoppingBag />}
          subtitle="Orders received"
        />

        <DashboardCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock />}
          subtitle="Need action"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={<Store />}
          subtitle="Restaurant revenue"
        />
      </div>

      <div className="admin-section-grid">
        <section className="table-card">
          <h2>Recent Orders</h2>

          {orders.slice(0, 5).map((order) => (
            <div className="data-row" key={order.orderId}>
              <div>
                <h3>Order #{order.orderId}</h3>
                <p>₹{order.totalAmount}</p>
              </div>

              <span>{order.status}</span>
            </div>
          ))}
        </section>

        <section className="table-card">
          <h2>Recent Menu</h2>

          {myMenu.slice(0, 5).map((item) => (
            <div className="data-row" key={item.menuItemId}>
              <div>
                <h3>{item.itemName}</h3>
                <p>₹{item.discountPrice || item.price}</p>
              </div>

              <span>{item.isAvailable ? "Available" : "Unavailable"}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;