import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function RestaurantOrders() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const statusOptions = [
    { value: 0, label: "Placed" },
    { value: 1, label: "Confirmed" },
    { value: 2, label: "Preparing" },
    { value: 3, label: "Out for Delivery" },
    { value: 4, label: "Delivered" },
    { value: 5, label: "Cancelled" },
  ];

  const getStatusNumber = (status) => {
    if (typeof status === "number") return status;

    const map = {
      Placed: 0,
      Processing: 0,
      Confirmed: 1,
      Preparing: 2,
      OutForDelivery: 3,
      "Out for Delivery": 3,
      Delivered: 4,
      Cancelled: 5,
    };

    return map[status] ?? 0;
  };

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get("/Order");
      const allOrders = Array.isArray(res.data) ? res.data : [];

      const myOrders = allOrders.filter(
        (o) => Number(o.restaurantId) === Number(user.restaurantId)
      );

      setOrders(myOrders);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Unable to load restaurant orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurantId) loadOrders();
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/Order/${orderId}/status`, {
        status: Number(status),
      });

      alert("Order status updated");
      loadOrders();
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data || "Unable to update order status");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Restaurant</p>
          <h1>Order Management</h1>
          <p>View your restaurant orders and update status.</p>
        </div>
      </div>

      <section className="table-card">
        <h2>
          <ShoppingBag size={22} />
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            text="Orders for your restaurant will appear here."
          />
        ) : (
          orders.map((order) => (
            <div className="data-row" key={order.orderId}>
              <div>
                <h3>Order #{order.orderId}</h3>
                <p>Amount: ₹{order.totalAmount}</p>
                <small>
                  User ID: {order.userId} | Payment: {order.paymentMethod}
                </small>
              </div>

              <div className="row-actions">
                <select
                  value={getStatusNumber(order.status)}
                  onChange={(e) =>
                    updateStatus(order.orderId, e.target.value)
                  }
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default RestaurantOrders;