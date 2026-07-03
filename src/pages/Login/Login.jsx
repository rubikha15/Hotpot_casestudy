import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Utensils } from "lucide-react";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submitLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/Auth/login", form);
      const token = res.data;

      if (!token || token === "Invalid credentials") {
        alert("Invalid email or password");
        return;
      }

      loginUser(token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else if (role === "Restaurant") {
        navigate("/restaurant/dashboard");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-left">
        <div className="auth-brand">
          <Utensils size={36} />
          <h1>HotByte</h1>
        </div>

        <h2>Fresh food, faster than your hunger.</h2>
        <p>
          Login as User, Admin, or Restaurant and continue your food delivery
          journey.
        </p>

        <div className="auth-offer-card">
          <h3>🍔 Today Special</h3>
          <p>Order your favourite dishes with real-time cart and order flow.</p>
        </div>
      </section>

      <section className="auth-right">
        <form className="auth-card" onSubmit={submitLogin}>
          <p className="tagline">Welcome Back</p>
          <h2>Login to HotByte</h2>
          

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

          <button className="primary-btn full">Login</button>

          <p className="auth-switch">
            New user? <Link to="/register">Create account</Link>
          </p>
          <p className="auth-switch">
  <Link to="/forgot-password">Forgot Password?</Link>
</p>
        </form>
      </section>
    </main>
  );
}

export default Login;