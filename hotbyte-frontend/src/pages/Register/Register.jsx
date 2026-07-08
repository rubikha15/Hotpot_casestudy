import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Utensils,
  BadgeCheck,
} from "lucide-react";
import { toast } from "react-toastify";
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!phoneRegex.test(form.contactNumber)) {
      toast.error("Contact number must contain exactly 10 digits");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!form.address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    if (!form.gender) {
      toast.error("Please select gender");
      return;
    }

    try {
      const res = await API.post("/Auth/register", form);
      const message = String(res.data || "");

      if (message.toLowerCase().includes("already exists")) {
        toast.error("User already exists");
        return;
      }

      toast.success("🎉 Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.response?.data ||
        "Registration failed";

      toast.error(String(message));
    }
  };

  return (
    <main className="auth-page premium-auth">
      <section className="auth-left premium-auth-left register-visual">
        <div className="auth-brand">
          <Utensils size={38} />
          <h1>HotByte</h1>
        </div>

        <p className="auth-pill">
          <BadgeCheck size={16} />
          Join the taste journey
        </p>

        <h2>Cravings meet convenience</h2>

        <p>
          Create your HotByte account and discover fresh meals, trending
          restaurants, exciting offers, smooth checkout, and live order tracking.
        </p>

        <div className="auth-feature-row">
          <div>🍔 Easy Ordering</div>
          <div>⭐ Trusted Restaurants</div>
        </div>
      </section>

      <section className="auth-right premium-auth-right">
        <form className="auth-card premium-login-card" onSubmit={submitRegister}>
          <p className="tagline">Register</p>
          <h2>Create your account</h2>
          <p className="auth-muted">
            Start ordering delicious food with HotByte.
          </p>

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
              type="tel"
              placeholder="Contact number"
              maxLength={10}
              value={form.contactNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setForm({
                  ...form,
                  contactNumber: value,
                });
              }}
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

          <button className="primary-btn full mt-3">Create Account</button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;