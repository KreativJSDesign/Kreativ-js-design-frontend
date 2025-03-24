import { useEffect, useState } from "react";
// import BackgroundImage from "../../public/static/img/templates/template1.png";
// import StickerImage from "../../public/static/img/templates/stiker1.png";
// import PreviewImage from "../../public/static/img/card.png";
import ViewCardIcon from "../../public/static/img/icons/ic-preview.svg";
import DeleteCardIcon from "../../public/static/img/icons/ic-delete.svg";

import { Modal, Ripple, initTWE } from "tw-elements";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteTemplate,
  getAllTemplates,
  SelectTemplates,
  tempalteStatus,
  templatesActions,
} from "../features/templates/teamplateSlice";
import { SingleTemplate } from "../tsModels/Templates";
import Loader from "../components/loader";
import ModalCloseIcon from "../../public/static/img/icons/ic-modal-close.svg";
import { useLocation, useNavigate } from "react-router-dom";

const ViewAllDesign = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const templates = useAppSelector(SelectTemplates);
  const status = useAppSelector(tempalteStatus);
  const navigate = useNavigate();
  const [currentTemplate, setCurrentTemplate] = useState<SingleTemplate>({} as SingleTemplate);
  const formatDateTime = (isoString: string) => {
    if (isoString) {
      const date = new Date(isoString);

      const optionsDate: any = {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", optionsDate).replace(",", "");

      const optionsTime: any = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      };
      const formattedTime = date.toLocaleTimeString("en-GB", optionsTime) + " GMT";

      return { formattedDate, formattedTime };
    }
    return { formattedDate: "", formattedTime: "" };
  };
  useEffect(() => {
    dispatch(getAllTemplates());
  }, []);
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(templatesActions.restTemplateState());
      dispatch(getAllTemplates());
    }
  }, [status]);
  useEffect(() => {
    if (initTWE) {
      initTWE({ Modal, Ripple });
    }
  });
  if (status === "loading") {
    return (
      <>
        <div className="max-w-[1400px] mx-auto px-6 admin-loader">
          <Loader />
        </div>
      </>
    );
  }
  return (
    <>
      {/* View All Design Section Start */}
      <section className="bg-white p-6 rounded-xl border border-[--light-border-color] grid lg:grid-cols-3 sm:grid-cols-2 gap-xl-8 gap-5 max-w-[1400px] mx-auto">
        {templates?.length !== 0 ? (
          templates.map((template) => {
            const { formattedDate, formattedTime } = formatDateTime(
              template.updatedAt ? template?.updatedAt : ""
            );

            return (
              <div
                className="rounded-xl border border-[--light-border-color] p-4"
                key={template._id}
              >
                <div className="grid grid-cols-2 gap-x-2.5 sm:gap-y-8 gap-y-5">
                  <img src={template?.backgroundUrl} alt="Background Image" />
                  <img src={template?.stickerUrl} alt="Sticker Image" />

                  <div className="col-span-2 flex sm:gap-8 gap-5 items-center">
                    {location.pathname === "/designs" ? (
                      <>
                        <button
                          type="button"
                          className="primary-btn"
                          onClick={() => navigate(`/customize-card/${template._id}`)}
                        >
                          Generate Card
                        </button>

                        <button
                          type="button"
                          data-twe-toggle="modal"
                          data-twe-target="#previewDesign"
                          data-twe-ripple-init
                          data-twe-ripple-color="light"
                          onClick={() => setCurrentTemplate(template)}
                        >
                          <img src={ViewCardIcon} alt="Preview Icon" />
                        </button>

                        <button
                          type="button"
                          onClick={() => dispatch(deleteTemplate({ id: template._id }))}
                        >
                          <img src={DeleteCardIcon} alt="Delete Icon" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-nowrap font-medium">{formattedDate}</p>
                          <p className="text-sm">{formattedTime}</p>
                        </div>

                        <button
                          type="button"
                          className="primary-btn"
                          data-twe-toggle="modal"
                          data-twe-target="#previewDesign"
                          data-twe-ripple-init
                          data-twe-ripple-color="light"
                          onClick={() => setCurrentTemplate(template)}
                        >
                          View
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h6>No template found</h6>
        )}

        {/* <div className="rounded-xl border border-[--light-border-color] p-4">
          <div className="grid grid-cols-2 gap-x-2.5 sm:gap-y-8 gap-y-5">
            <img src={BackgroundImage} alt="Background Image" />
            <img src={StickerImage} alt="Sticker Image" />

            <div className="col-span-2 flex sm:gap-8 gap-5 items-center">
              <button type="button" className="primary-btn">
                Generate Card
              </button>

              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#previewDesign"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={ViewCardIcon} alt="Preview Icon" />
              </button>

              <button type="button">
                <img src={DeleteCardIcon} alt="Delete Icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[--light-border-color] p-4">
          <div className="grid grid-cols-2 gap-x-2.5 sm:gap-y-8 gap-y-5">
            <img src={BackgroundImage} alt="Background Image" />
            <img src={StickerImage} alt="Sticker Image" />

            <div className="col-span-2 flex sm:gap-8 gap-5 items-center">
              <button type="button" className="primary-btn">
                Generate Card
              </button>

              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#previewDesign"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={ViewCardIcon} alt="Preview Icon" />
              </button>

              <button type="button">
                <img src={DeleteCardIcon} alt="Delete Icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[--light-border-color] p-4">
          <div className="grid grid-cols-2 gap-x-2.5 sm:gap-y-8 gap-y-5">
            <img src={BackgroundImage} alt="Background Image" />
            <img src={StickerImage} alt="Sticker Image" />

            <div className="col-span-2 flex sm:gap-8 gap-5 items-center">
              <button type="button" className="primary-btn">
                Generate Card
              </button>

              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#previewDesign"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={ViewCardIcon} alt="Preview Icon" />
              </button>

              <button type="button">
                <img src={DeleteCardIcon} alt="Delete Icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[--light-border-color] p-4">
          <div className="grid grid-cols-2 gap-x-2.5 sm:gap-y-8 gap-y-5">
            <img src={BackgroundImage} alt="Background Image" />
            <img src={StickerImage} alt="Sticker Image" />

            <div className="col-span-2 flex sm:gap-8 gap-5 items-center">
              <button type="button" className="primary-btn">
                Generate Card
              </button>

              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#previewDesign"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={ViewCardIcon} alt="Preview Icon" />
              </button>

              <button type="button">
                <img src={DeleteCardIcon} alt="Delete Icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[--light-border-color] p-4">
          <div className="grid grid-cols-2 gap-x-2.5 sm:gap-y-8 gap-y-5">
            <img src={BackgroundImage} alt="Background Image" />
            <img src={StickerImage} alt="Sticker Image" />

            <div className="col-span-2 flex sm:gap-8 gap-5 items-center">
              <button type="button" className="primary-btn">
                Generate Card
              </button>

              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#previewDesign"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={ViewCardIcon} alt="Preview Icon" />
              </button>

              <button type="button">
                <img src={DeleteCardIcon} alt="Delete Icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[--light-border-color] p-4">
          <div className="grid grid-cols-2 gap-x-2.5 sm:gap-y-8 gap-y-5">
            <img src={BackgroundImage} alt="Background Image" />
            <img src={StickerImage} alt="Sticker Image" />

            <div className="col-span-2 flex sm:gap-8 gap-5 items-center">
              <button type="button" className="primary-btn">
                Generate Card
              </button>

              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#previewDesign"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img src={ViewCardIcon} alt="Preview Icon" />
              </button>

              <button type="button">
                <img src={DeleteCardIcon} alt="Delete Icon" />
              </button>
            </div>
          </div>
        </div> */}
      </section>
      {/* Preview Design Modal Content Start */}
      <div
        data-twe-modal-init
        className="modal"
        id="previewDesign"
        tabIndex={-1}
        aria-labelledby="previewDesignTitle"
        aria-modal="true"
        role="dialog"
      >
        <div data-twe-modal-dialog-ref className="modal-centered-dialog">
          <div className="modal-content">
            <div className="modal-body p-0 relative">
              <img
                src={currentTemplate?.backgroundUrl}
                alt="Template 1"
                className="w-full rounded-lg"
              />
              <div className="absolute z-10 top-0" id="scratch-sticker">
                <img className="" src={currentTemplate?.stickerUrl} alt="Heart Scratch" />
              </div>

              <button
                type="button"
                onClick={() => setCurrentTemplate({} as SingleTemplate)}
                className="absolute sm:-top-4 sm:-right-4 -top-2.5 -right-2.5 bg-white rounded-full"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <img src={ModalCloseIcon} alt="Preview Image" className=" !w-10 z-20 relative" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Preview Design Modal Content End */}
      {/* View All Design Section End */}
    </>
  );
};

export default ViewAllDesign;
