import { useNavigate } from "react-router-dom";
import PageNotFound from "../../public/static/img/404.png";

const NotFound = () => {
  const navigate = useNavigate();
  const handleAdminDashboard = () => {
    navigate("/");
  };
  return (
    <>
      {/* 404 Page Start */}
      <section className="main-container">
        <div className="text-center md:pt-20 sm:pt-14 pt-10 px-5">
          <img src={PageNotFound} alt="Page Not Found" className="w-fit mx-auto" />
          <h2 className="text404">
            <span className="text-[var(--primary-color)]">Oops!</span> Sorry, we could not find the
            page.
          </h2>

          <button
            type="button"
            className="primary-btn !w-fit px-10 md:mt-10 sm:mt-6 mt-4"
            onClick={handleAdminDashboard}
          >
            Back
          </button>
        </div>
      </section>
      {/* 404 Page End */}
    </>
  );
};

export default NotFound;
