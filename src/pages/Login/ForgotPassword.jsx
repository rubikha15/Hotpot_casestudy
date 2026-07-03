import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const submitForgot = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/Auth/forgot-password", { email });
      setToken(res.data);
      alert("Reset token generated. Copy it and reset password.");
    } catch {
      alert("Unable to generate reset token");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-right">
        <form className="auth-card" onSubmit={submitForgot}>
          <p className="tagline">Forgot Password</p>
          <h2>Generate Reset Token</h2>

          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="primary-btn full">Generate Token</button>

          {token && (
            <div className="payment-box">
              <h3>Your Reset Token</h3>
              <p>{token}</p>
            </div>
          )}

          <p className="auth-switch">
            Already have token? <Link to="/reset-password">Reset Password</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default ForgotPassword;