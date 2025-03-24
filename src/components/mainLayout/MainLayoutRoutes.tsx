import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../features/auth/authSlice";
import ProtectedRoute from "../ProtectedRoute";
import Home from "../../pages/Home";
import AdminDashboard from "../../pages/AdminDashboard";
import AddNewDesign from "../../pages/addNewDesign";
import ViewAllDesign from "../../pages/viewAllDesign";
// import ViewAllCards from "../../pages/viewAllCards";
import Cookies from "js-cookie";
import { useEffect } from "react";

const MainLayoutRoutes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" });
    });
    dispatch(logoutAdmin());
    navigate("/login");
  };
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/designs");
    }
  }, [location.pathname]);
  return (
    <section className="main-dash">
      <div className="max-w-7xl mx-auto pt-5 pb-8">
        <h1 className="font-medium text-[40px] text-black text-center">Welcome Admin</h1>

        <div className="flex justify-center flex-wrap gap-3 mt-6 btn-grp">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/new-design")}>Add New Design</button>
          {location.pathname === "/designs" ? (
            <button onClick={() => navigate("/cards")}>View All Cards</button>
          ) : (
            <button onClick={() => navigate("/designs")}>View All Designs</button>
          )}

          <button onClick={() => navigate("/products")}>Product List</button>
        </div>
      </div>
      <div className="px-5">
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<AdminDashboard />} />
              <Route path="/new-design" element={<AddNewDesign />} />
              <Route path="/designs" element={<ViewAllDesign />} />
              <Route path="/cards" element={<ViewAllDesign />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
        </Routes>
      </div>
    </section>
  );
};

export default MainLayoutRoutes;
