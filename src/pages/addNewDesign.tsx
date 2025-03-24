import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  tempalteStatus,
  templatesActions,
  uploadTemplate,
} from "../features/templates/teamplateSlice";
import { useNavigate } from "react-router-dom";

const AddNewDesign = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(tempalteStatus);
  const [files, setFiles] = useState<{ background: File | null; sticker: File | null }>({
    background: null,
    sticker: null,
  });
  const [errors, setErrors] = useState({ background: "", sticker: "" });
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "background" | "sticker"
  ) => {
    const file = e?.target.files?.[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          [type]: "Invalid file type. Please upload an image in .jpg, .jpeg, .png, .svg format.",
        });
        return;
      }
      setErrors({ ...errors, [type]: "" });
      if (allowedTypes.includes(file.type)) {
        setFiles({ ...files, [type]: file });
      }
    }
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    if (!files.background) {
      setErrors((prev) => ({ ...prev, background: "Background is required." }));
      isValid = false;
    }
    if (!files.sticker) {
      setErrors((prev) => ({ ...prev, sticker: "Sticker is required." }));
      isValid = false;
    }
    if (isValid) {
      const formData = new FormData();
      if (files.background instanceof File) {
        formData.append("background", files.background);
      } else {
        return;
      }
      if (files.sticker instanceof File) {
        formData.append("sticker", files.sticker);
      } else {
        return;
      }
      dispatch(uploadTemplate(formData));
    }
  };
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(templatesActions.restTemplateState());
      navigate("/designs");
      setFiles({
        background: null,
        sticker: null,
      });
    }
  }, [status]);

  return (
    <>
      {/* Add New Design Section Start */}
      <div>
        <form className="form-container !max-w-[585px]">
          <h5 className="form-heading">Upload design</h5>

          {/* <div className="mb-4">
            <label htmlFor="bg" className="form-label">
              Background
            </label>
            <input
              type="file"
              id="bg"
              accept=".jpg,.jpeg,.png,.svg"
              className="form-file-control"
              onChange={(e) => handleFileChange(e, "background")}
            />
            {errors.background && <p className="form-error-msg">{errors.background}</p>}
          </div> */}
          <div className="mb-4">
            <label htmlFor="bg" className="form-label cursor-pointer">
              Background
            </label>
            <div className="flex items-center form-file-control">
              <input
                type="file"
                id="bg"
                accept=".jpg,.jpeg,.png,.svg"
                className="form-file-control hidden"
                onChange={(e) => handleFileChange(e, "background")}
              />
              <label htmlFor="bg" className="form-file-label">
                Choose File
              </label>
              <span className="ms-3 truncate">
                {files?.background?.name ? files?.background?.name : "No file chosen"}
              </span>
            </div>
            {errors.background && <p className="form-error-msg">{errors.background}</p>}
          </div>
          <div>
            <label htmlFor="sticker" className="form-label cursor-pointer">
              Sticker
            </label>
            <div className="flex items-center form-file-control">
              <input
                type="file"
                id="sticker"
                accept=".jpg,.jpeg,.png,.svg"
                className="form-file-control hidden"
                onChange={(e) => handleFileChange(e, "sticker")}
              />
              <label htmlFor="sticker" className="form-file-label">
                Choose File
              </label>
              <span className="ms-3 truncate">
                {files?.sticker?.name ? files?.sticker?.name : "No file chosen"}
              </span>
            </div>
            {errors.sticker && <p className="form-error-msg">{errors.sticker}</p>}
          </div>

          <button
            type="button"
            className="primary-btn sm:mt-10 mt-7"
            onClick={handleSubmit}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
      {/* Add New Design Section End */}
    </>
  );
};

export default AddNewDesign;
