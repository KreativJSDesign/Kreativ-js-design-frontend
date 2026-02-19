import { Link } from "react-router-dom";
import HidePasswordIcon from "../../public/static/img/icons/ic-eye-closed.svg";
import ShowPasswordIcon from "../../public/static/img/icons/ic-eye-open.svg";
import { useState } from "react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  return (
    <>
      {/* Sign Up Section Start */}
      <section className="main-container">
        <div className="md:pt-20 sm:pt-14 pt-10 px-5">
          <form className="form-container">
            <h5 className="form-heading">Create your account</h5>

            <div className="mb-4">
              <label htmlFor="userName" className="form-label">
                User Name
              </label>
              <input
                type="text"
                id="userName"
                className="form-control"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control !pe-8"
                  placeholder="********"
                  required
                />
                <img
                  src={showPassword ? ShowPasswordIcon : HidePasswordIcon}
                  alt="Eye Icon"
                  className="ic-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                />
                {/* <img src={ShowPasswordIcon} alt="Eye Opened Icon" className="ic-show-password" /> */}
                {/* {error && <p className="form-error-msg">{error}</p>} */}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="form-control !pe-8"
                  placeholder="********"
                  required
                />
                <img
                  src={showConfirmPassword ? ShowPasswordIcon : HidePasswordIcon}
                  alt="Eye Icon"
                  className="ic-show-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                {/* <img src={ShowPasswordIcon} alt="Eye Opened Icon" className="ic-show-password" /> */}
                {/* {error && <p className="form-error-msg">{error}</p>} */}
              </div>
            </div>

            <button type="button" className="primary-btn sm:mt-10 mt-7">
              Sign Up
            </button>

            <div className="text-sm font-medium mt-3 text-center">
              Already have an account?&nbsp;
              <Link to={"/login"} className="text-[var(--primary-color)] underline">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </section>
      {/* Sign Up Section End */}
    </>
  );
};

export default SignUp;
