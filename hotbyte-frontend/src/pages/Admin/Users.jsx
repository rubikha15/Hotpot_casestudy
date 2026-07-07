import { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import API from "../../api/api";
import Loader from "../../components/common/Loader";

function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/Admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <p className="tagline">Admin</p>
          <h1>User Management</h1>
          <p>View all registered users and admins.</p>
        </div>
      </div>

      <section className="table-card">
        <h2>
          <UsersIcon size={22} />
          All Users
        </h2>

        {users.map((u) => (
          <div className="data-row" key={u.id}>
            <div>
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <small>{u.address}</small>
            </div>

            <span>{u.role}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Users;