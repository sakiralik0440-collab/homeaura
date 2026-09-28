import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCoupons from "./pages/AdminCoupons";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";


import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Reviews from "./pages/Reviews";
import AdminReviews from "./pages/AdminReviews";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* MAIN URL */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Home />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/shop" element={<Shop />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/account" element={<Account />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/coupons" element={<AdminCoupons />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/orders" element={<Orders />} />
      <Route
        path="/track-order/:orderId"
        element={<OrderTracking />}
      />

      {/* ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />
        <Route
          path="/admin/categories"
          element={<AdminCategories />}
        />
        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />
      </Route>
    </Routes>
  );
}

export default App;

