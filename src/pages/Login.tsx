import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginAdmin, selectAuthError, selectAuthStatus } from "../features/auth/authSlice";
import { AppDispatch, RootState } from "../store/store";
import HidePasswordIcon from "../../public/static/img/icons/ic-eye-closed.svg";
import ShowPasswordIcon from "../../public/static/img/icons/ic-eye-open.svg";

import api from "../api";
import { useState } from "react";
export interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector(selectAuthError);
  const status = useSelector((state: RootState) => selectAuthStatus(state));
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginAdmin(data)).then(async (resultAction) => {
      if (loginAdmin.fulfilled.match(resultAction)) {
        const res = await api.get(`/etsy/auth`, {
          withCredentials: true,
        });

        window.location.href = res.data.url;
      }
    });
  };

  return (
    <>
      <section className="main-container">
        <div className="md:pt-20 sm:pt-14 pt-10 px-5">
          <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
            <div className="sm:!mb-5 !mb-3">
              <h5 className="form-heading mb-0">Sign in to your account</h5>
              {error && <p className="form-error-msg">{error}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                User Name
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                {...register("username", { required: "User name is required" })}
              />
              {errors.username && <p className="form-error-msg">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control !pe-8"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <img
                  src={showPassword ? ShowPasswordIcon : HidePasswordIcon}
                  alt="Eye Icon"
                  className="ic-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                />
                {errors.password && <p className="form-error-msg">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="primary-btn sm:mt-10 mt-7"
            >
              {status === "loading" ? "Logging in..." : "Log In"}
            </button>

            {/* <div className="text-sm font-medium mt-3 text-center">
              Don't have an account?&nbsp;
              <Link to={"/sign-up"} className="text-[var(--primary-color)] underline">
                Sign up
              </Link>
            </div> */}
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
