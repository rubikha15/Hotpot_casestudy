import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Utensils, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });

  const submitLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/Auth/login", form);
      const token = res.data;

      if (!token || token === "Invalid credentials") {
        toast.error("Invalid email or password");
        return;
      }

      loginUser(token);
      toast.success("Welcome back 👋");

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Admin") navigate("/admin/dashboard");
      else if (role === "Restaurant") navigate("/restaurant/dashboard");
      else navigate("/menu");
    } catch (err) {
      console.log(err);
      toast.error("Login failed");
    }
  };

  return (
    <main className="auth-page premium-auth">
      <section className="auth-left premium-auth-left">
        <div className="auth-brand">
          <Utensils size={38} />
          <h1>HotByte</h1>
        </div>

        <p className="auth-pill">
          <Sparkles size={16} />
          Fresh • Fast • Flavourful
        </p>

        <h2>Welcome back to HotByte</h2>

        <p>
          Search for delicious food, order from your favourite restaurants,
          track your meals live, and enjoy a smooth food delivery experience.
        </p>

        <div className="auth-feature-row">
          <div>
            <Truck />
            <span>Fast Delivery</span>
          </div>
          <div>
            <ShieldCheck />
            <span>Secure Orders</span>
          </div>
        </div>
      </section>

      <section className="auth-right premium-auth-right">
        <form className="auth-card premium-login-card" onSubmit={submitLogin}>
          <p className="tagline">Login</p>
          <h2>Order something delicious</h2>
          <p className="auth-muted">Login as User, Restaurant, or Admin to continue.</p>

          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="primary-btn full">Login</button>

          <p className="auth-switch">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          <p className="auth-switch">
            New user? <Link to="/register">Create account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;