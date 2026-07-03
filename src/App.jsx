import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Menu from "./pages/User/Menu";
import Cart from "./pages/User/Cart";
import UserOrders from "./pages/User/Orders";

import AdminDashboard from "./pages/Admin/Dashboard";
import AdminRestaurants from "./pages/Admin/Restaurants";
import AdminCategories from "./pages/Admin/Categories";
import AdminMenuManagement from "./pages/Admin/MenuManagement";
import AdminOrders from "./pages/Admin/Orders";
import AdminUsers from "./pages/Admin/Users";
import AdminRevenue from "./pages/Admin/Revenue";

import RestaurantDashboard from "./pages/Restaurant/Dashboard";
import RestaurantMyMenu from "./pages/Restaurant/MyMenu";
import RestaurantOrders from "./pages/Restaurant/Orders";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRole="User">
              <Cart />
            </ProtectedRoute>
          }
        />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRole="User">
              <UserOrders />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminRestaurants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminMenuManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/revenue"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminRevenue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/dashboard"
          element={
            <ProtectedRoute allowedRole="Restaurant">
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/menu"
          element={
            <ProtectedRoute allowedRole="Restaurant">
              <RestaurantMyMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/orders"
          element={
            <ProtectedRoute allowedRole="Restaurant">
              <RestaurantOrders />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;