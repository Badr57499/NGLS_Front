import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from '../context/authcontext'

const ProtectRoutes = ({ allowedRoles }) => {
    const { user, isloading } = useAuth()

    if (isloading) {
        return <div>Loading please wait...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
};

export default ProtectRoutes;