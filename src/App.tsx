import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "tw-elements/css/tw-elements.min.css";
import Loader from "./components/loader";
import MainLayoutRoutes from "./components/mainLayout/MainLayoutRoutes";
import CardView from "./pages/cardView";
import CustomizeCard from "./pages/customizeCard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import { loadFonts } from "./utils/fontLoader";

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  if (!fontsLoaded) {
    return <Loader />;
  }
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
        className="alert-msg"
      />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/card-view/:id" element={<CardView />} />
          <Route path="/customize-card/:id" element={<CustomizeCard />} />
          <Route path="*" element={<MainLayoutRoutes />} />
          <Route path="/page-not-found" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
