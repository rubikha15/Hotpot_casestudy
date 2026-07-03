import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";
import API from "../../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    gender: "",
    role: "User",
  });

  const submitRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/Auth/register", form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-left">
        <h1>Join HotByte</h1>
        <h2>Order food from restaurants near you.</h2>
        <p>
          Create your user account, browse menus, manage your cart and place
          orders easily.
        </p>

        <div className="auth-offer-card">
          <h3>🍕 Register Benefits</h3>
          <p>Search food, filter dishes, add to cart and checkout smoothly.</p>
        </div>
      </section>

      <section className="auth-right">
        <form className="auth-card" onSubmit={submitRegister}>
          <p className="tagline">Create Account</p>
          <h2>User Registration</h2>

          <div className="input-group">
            <User size={18} />
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="input-group">
            <Phone size={18} />
            <input
              placeholder="Contact number"
              value={form.contactNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  contactNumber: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              required
            />
          </div>

          <select
            value={form.gender}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value,
              })
            }
            required
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          <button className="primary-btn full">Register</button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;