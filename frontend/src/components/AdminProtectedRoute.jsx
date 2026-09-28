
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
    const token = localStorage.getItem("homeAuraAdminToken");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}

export default AdminProtectedRoute;
