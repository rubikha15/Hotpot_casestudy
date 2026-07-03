import { useEffect, useState } from "react";
import { PackageCheck } from "lucide-react";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function UserOrders() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get("/Order");
      const allOrders = Array.isArray(res.data) ? res.data : [];

      const myOrders = allOrders.filter(
        (o) => Number(o.userId) === Number(user.id)
      );

      setOrders(myOrders);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Unable to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadOrders();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <main className="page">
      <div className="cart-banner">
        <div>
          <p className="tagline">Order Tracking</p>
          <h1>My Orders</h1>
          <p>Track your order status here.</p>
        </div>

        <PackageCheck size={70} />
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No orders found" text="Place an order first." />
      ) : (
        <section className="table-card">
          {orders.map((order) => (
            <div className="data-row" key={order.orderId}>
              <div>
                <h3>Order #{order.orderId}</h3>
                <p>Amount: ₹{order.totalAmount}</p>
                <small>
                  Restaurant ID: {order.restaurantId} | Payment:{" "}
                  {order.paymentMethod}
                </small>
              </div>

              <span className="status good">{order.status}</span>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default UserOrders;