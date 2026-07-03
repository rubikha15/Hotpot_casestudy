import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Utensils, LogOut, LayoutDashboard, PackageCheck } from "lucide-react";
import { useUser } from "../../context/UserContext";

function Navbar() {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "Admin"
      ? "/admin/dashboard"
      : user?.role === "Restaurant"
      ? "/restaurant/dashboard"
      : "/menu";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <Utensils size={28} />
        <span>HotByte</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>

        {user && (
          <Link to={dashboardPath} className="nav-icon-link">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        )}

        {user?.role === "User" && (
          <>
            <Link to="/cart" className="cart-link">
              <ShoppingCart size={18} />
              Cart
            </Link>

            <Link to="/orders" className="cart-link">
              <PackageCheck size={18} />
              My Orders
            </Link>
          </>
        )}

        {!user ? (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;