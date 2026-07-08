import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/api";
import { formReducer, resetInitialState } from "../../reducers/authReducer";

function ResetPassword() {
  const navigate = useNavigate();
  const [form, dispatch] = useReducer(formReducer, resetInitialState);

  const updateField = (field, value) => {
    dispatch({
      type: "UPDATE",
      field,
      value,
    });
  };

  const submitReset = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/Auth/reset-password", form);
      const message = String(res.data || "");

      if (message.toLowerCase().includes("user not found")) {
        toast.error("User not registered");
        return;
      }

      if (message.toLowerCase().includes("invalid reset token")) {
        toast.error("Invalid reset token");
        return;
      }

      if (message.toLowerCase().includes("expired")) {
        toast.error("Reset token expired");
        return;
      }

      toast.success("Password changed successfully 🔑");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.response?.data ||
        "Password reset failed";

      if (String(message).toLowerCase().includes("user not found")) {
        toast.error("User not registered");
      } else {
        toast.error(String(message));
      }
    }
  };

  return (
    <main className="auth-center-page">
      <form className="auth-card auth-center-card shadow-lg" onSubmit={submitReset}>
        <div className="text-center mb-4">
          <div className="auth-icon mx-auto">
            <Lock />
          </div>
          <p className="tagline mt-3">Reset Password</p>
          <h2>Create New Password</h2>
          <p className="text-muted">Use your reset token to update password.</p>
        </div>

        <div className="input-group-custom">
          <Mail size={18} />
          <input
            type="email"
            placeholder="Registered email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </div>

        <div className="input-group-custom">
          <KeyRound size={18} />
          <input
            placeholder="Reset token"
            value={form.token}
            onChange={(e) => updateField("token", e.target.value)}
            required
          />
        </div>

        <div className="input-group-custom">
          <Lock size={18} />
          <input
            type="password"
            placeholder="New password"
            value={form.newPassword}
            onChange={(e) => updateField("newPassword", e.target.value)}
            required
          />
        </div>

        <button className="primary-btn full mt-3">Reset Password</button>

        <p className="auth-switch mt-4">
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default ResetPassword;