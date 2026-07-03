import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import API from "../../api/api";
import Loader from "../../components/common/Loader";

function Orders() {
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

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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
          <p className="tagline">Admin</p>
          <h1>Order Management</h1>
          <p>View all orders and update order status.</p>
        </div>
      </div>

      <section className="table-card">
        <h2>
          <ShoppingBag size={22} />
          All Orders
        </h2>

        {orders.map((order) => (
          <div className="data-row" key={order.orderId}>
            <div>
              <h3>Order #{order.orderId}</h3>
              <p>Amount: ₹{order.totalAmount}</p>
              <small>
                User ID: {order.userId} | Restaurant ID: {order.restaurantId}
              </small>
            </div>

            <div className="row-actions">
              <select
                value={getStatusNumber(order.status)}
                onChange={(e) => updateStatus(order.orderId, e.target.value)}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Orders;