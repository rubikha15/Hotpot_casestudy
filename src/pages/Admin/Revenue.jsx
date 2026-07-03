import { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react";
import API from "../../api/api";
import Loader from "../../components/common/Loader";

function Revenue() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);

  const loadRevenue = async () => {
    try {
      setLoading(true);
      const res = await API.get("/Admin/revenue");
      setRevenue(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load revenue. Check Admin role/token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Admin</p>
          <h1>Revenue Report</h1>
          <p>Total revenue calculated from orders.</p>
        </div>
      </div>

      <section className="revenue-card">
        <IndianRupee size={60} />
        <p>Total Revenue</p>
        <h1>₹{revenue}</h1>
      </section>
    </div>
  );
}

export default Revenue;