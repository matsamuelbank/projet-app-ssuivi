import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

export function UserPrivateRoute({ element }) {
    const userInfo = useSelector((store) => store.USERINFO.userInfo);

    return userInfo.isAuthenticated ? element : <Navigate to="/login" />;
}
