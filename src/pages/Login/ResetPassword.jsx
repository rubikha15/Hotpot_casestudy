import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    token: "",
    newPassword: "",
  });

  const submitReset = async (e) => {
    e.preventDefault();

    try {
      await API.post("/Auth/reset-password", form);
      alert("Password reset successful. Please login.");
      navigate("/login");
    } catch {
      alert("Password reset failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-right">
        <form className="auth-card" onSubmit={submitReset}>
          <p className="tagline">Reset Password</p>
          <h2>Create New Password</h2>

          <input
            type="email"
            placeholder="Registered email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            placeholder="Reset token"
            value={form.token}
            onChange={(e) => setForm({ ...form, token: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="New password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />

          <button className="primary-btn full">Reset Password</button>

          <p className="auth-switch">
            Back to <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default ResetPassword;