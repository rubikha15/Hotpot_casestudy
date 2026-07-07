import { NavLink } from "react-router-dom";
import { Star } from "lucide-react";
import {
  LayoutDashboard,
  Store,
  Tags,
  Utensils,
  ShoppingBag,
  Users,
  IndianRupee,
  LogOut,
} from "lucide-react";
import { useUser } from "../../context/UserContext";

function Sidebar() {
  const { user, logoutUser } = useUser();

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard /> },
    { name: "Restaurants", path: "/admin/restaurants", icon: <Store /> },
    { name: "Categories", path: "/admin/categories", icon: <Tags /> },
    { name: "Menu", path: "/admin/menu", icon: <Utensils /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag /> },
    { name: "Users", path: "/admin/users", icon: <Users /> },
    { name: "Revenue", path: "/admin/revenue", icon: <IndianRupee /> },
  ];

  const restaurantLinks = [
    { name: "Dashboard", path: "/restaurant/dashboard", icon: <LayoutDashboard /> },
    { name: "My Menu", path: "/restaurant/menu", icon: <Utensils /> },
    { name: "Orders", path: "/restaurant/orders", icon: <ShoppingBag /> },
    { name: "Reviews", path: "/restaurant/reviews", icon: <Star /> },
  ];

  const links = user?.role === "Admin" ? adminLinks : restaurantLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Store />
        <span>{user?.role} Panel</span>
      </div>

      <div className="sidebar-links">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "side-link active-side" : "side-link"
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>

      <button className="side-logout" onClick={logoutUser}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;