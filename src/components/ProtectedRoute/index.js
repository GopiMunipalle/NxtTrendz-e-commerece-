import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

function ProtectedRoute(props) {
  const token = Cookies.get("jwt_token");
  if (token === undefined) {
    return <Navigate to="/login" />;
  }
  return <Outlet {...props} />;
}
export default ProtectedRoute;
