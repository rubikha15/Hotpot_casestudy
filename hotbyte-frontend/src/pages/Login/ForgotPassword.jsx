import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/api";
import { formReducer, forgotInitialState } from "../../reducers/authReducer";

function ForgotPassword() {
  const [form, dispatch] = useReducer(formReducer, forgotInitialState);
  const [token, setToken] = useState("");

  const submitForgot = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/Auth/forgot-password", form);
      setToken(res.data);
      toast.success("Reset token sent successfully 📧");
    } catch {
      toast.error("Unable to generate reset token");
    }
  };

  return (
    <main className="auth-center-page">
      <form className="auth-card auth-center-card shadow-lg" onSubmit={submitForgot}>
        <div className="text-center mb-4">
          <div className="auth-icon mx-auto">
            <KeyRound />
          </div>
          <p className="tagline mt-3">Forgot Password</p>
          <h2>Generate Reset Token</h2>
          <p className="text-muted">Enter your registered email address.</p>
        </div>

        <div className="input-group-custom">
          <Mail size={18} />
          <input
            type="email"
            placeholder="Registered email"
            value={form.email}
            onChange={(e) =>
              dispatch({ type: "UPDATE", field: "email", value: e.target.value })
            }
            required
          />
        </div>

        <button className="primary-btn full mt-3">Generate Token</button>

        {token && (
          <div className="token-box mt-4">
            <h5>Reset Token</h5>
            <p>{token}</p>
          </div>
        )}

        <p className="auth-switch mt-4">
          Already have token? <Link to="/reset-password">Reset Password</Link>
        </p>

        <p className="auth-switch">
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default ForgotPassword;