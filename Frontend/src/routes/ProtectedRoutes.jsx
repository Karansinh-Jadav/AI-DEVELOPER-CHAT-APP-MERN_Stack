import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../config/axios";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        axios.get("/users/profile")
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading/>;

    return isAuth ? children : <Navigate to="/NotLoggedIn" replace />;
};

export default ProtectedRoute;