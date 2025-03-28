import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
import { initTWE, Modal, Ripple } from "tw-elements";
import ColorPickerIcon from "../../public/static/img/icons/ic-color-picker.svg";
import SelectDownArrow from "../../public/static/img/icons/ic-select.svg";
import Loader from "../components/loader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import fonts from "../utils/fonts.json";
import {
  cardStatus,
  customizeCardActions,
  getSingleCard,
  selectCardError,
  selectSingleCard,
  selectUpdatedCardId,
  updateSingleCard,
} from "../features/customizeCards/customizeCardSlice";
type TextAlign = "left" | "right" | "center" | "justify";
type FontWeight = "400" | "500" | "bold";
export interface CardFormTypes {
  fontStyle: string;
  fontSize: number;
  fontWeight: FontWeight;
  textAlignment: TextAlign;
  fontColor: string;
  showPicker: boolean;
  text: string;
}

const CustomizeCard = () => {
  const params = useParams();
  const templateId = params.id;
  // const imageRef = useRef(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const template = useAppSelector(selectSingleCard);
  const updatedCardId = useAppSelector(selectUpdatedCardId);
  const error = useAppSelector(selectCardError);
  const status = useAppSelector(cardStatus);
  const [headerState, setHeaderState] = useState<CardFormTypes>({
    fontStyle: "inter",
    fontSize: 16,
    fontWeight: "400" as FontWeight,
    textAlignment: "Center" as TextAlign,
    fontColor: "#000",
    showPicker: false,
    text: "YOUR HEADER HERE!",
  });

  const [bodyState, setBodyState] = useState<CardFormTypes>({
    fontStyle: "inter",
    fontSize: 16,
    fontWeight: "400" as FontWeight,
    textAlignment: "Center" as TextAlign,
    fontColor: "#000",
    showPicker: false,
    text: "YOUR MESSAGE HERE!",
  });
  const headerPickerRef = useRef<any>(null);
  const bodyPickerRef = useRef<any>(null);
  function min(a: number, b: number): number {
    return a > b ? b : a;
  }
  const handleTryAgain = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    setHeaderState({
      fontStyle: "inter",
      fontSize: 16,
      fontWeight: "400" as FontWeight,
      textAlignment: "Center" as TextAlign,
      fontColor: "#000",
      showPicker: false,
      text: "YOUR HEADER HERE!",
    });
    setBodyState({
      fontStyle: "inter",
      fontSize: 16,
      fontWeight: "400" as FontWeight,
      textAlignment: "Center" as TextAlign,
      fontColor: "#000",
      showPicker: false,
      text: "YOUR MESSAGE HERE!",
    });
  };
  const handleSaveTemplate = () => {
    const payload = {
      cardBody: bodyState,
      cardHeader: headerState,
      customCardId: templateId,
      listing_id: template?.productId[0],
      templateId: template?._id,
    };
    dispatch(updateSingleCard(payload));
  };

  useEffect(() => {
    initTWE({ Modal, Ripple });

    const handleClickOutside = (event: any) => {
      if (headerPickerRef.current && !headerPickerRef.current.contains(event.target)) {
        setHeaderState((prev) => ({ ...prev, showPicker: false }));
      }
      if (bodyPickerRef.current && !bodyPickerRef.current.contains(event.target)) {
        setBodyState((prev) => ({ ...prev, showPicker: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (template) {
      initTWE({ Modal, Ripple });
    }
  }, [template]);

  const handleHeaderPickerToggle = () => {
    setBodyState((prev) => ({ ...prev, showPicker: false }));
    setHeaderState((prev) => ({ ...prev, showPicker: !prev.showPicker }));
  };

  const handleBodyPickerToggle = () => {
    setHeaderState((prev) => ({ ...prev, showPicker: false }));
    setBodyState((prev) => ({ ...prev, showPicker: !prev.showPicker }));
  };
  useEffect(() => {
    if (templateId) {
      dispatch(getSingleCard({ id: templateId }));
    }
  }, [templateId]);
  useEffect(() => {
    if (status === "succeeded" && updatedCardId) {
      navigate(`/card-view/${updatedCardId}`);
      dispatch(customizeCardActions.restCardState());
    }
  }, [status, updatedCardId]);
  useEffect(() => {
    if (template.complete) {
      navigate(template.cardViewUrl);
    }
  }, [template]);

  if (status === "loading") {
    return <Loader />;
  }
  return (
    <>
      {/* Customization Interface Section Start */}
      <section className="py-5">
        <h1 className="logo">Kreativ JSdesign</h1>
        {error || !template?.backgroundUrl ? (
          <h2 className="form-error-msg text-center text-lg">
            Error retrieving your card information. This URL may have already been used, or the card
            customization period has expired. Please check the URL again or contact the seller.
          </h2>
        ) : (
          <div className="flex lg:flex-row flex-col xl:gap-x-14 gap-x-10 gap-y-10 md:mt-5 sm:mt-5 mt-5">
            <div className="2xl:!w-60 !w-40 xl:!block hidden"></div>
            <div>
              <div className="sticky top-5">
                <div className="relative sm:ms-auto mx-auto w-[350px] overflow-y-hidden">
                  {/* <img
                  src={ScratchCard}
                  alt="Scratch Card"
                  className="sm:w-full w-fit mx-auto sticky top-5"
                /> */}
                  <img
                    src={template?.backgroundUrl}
                    alt="Template 1"
                    className="w-full h-[477px]"
                  />
                  <div className="absolute z-10 top-0 inset-x-0" id="scratch-sticker">
                    <img src={template?.stickerUrl} alt="Template 1" />
                  </div>

                  <p
                    className="text absolute sm:top-14 top-12 left-[12%] right-[12%] leading-tight break-words"
                    style={{
                      fontSize: `${headerState.fontSize}px`,
                      fontFamily: `${headerState.fontStyle ?? "sans-serif"}`,
                      fontWeight: `${headerState.fontWeight ?? ""}`,
                      color: `${headerState.fontColor}`,
                      textAlign: `${headerState.textAlignment}`,
                    }}
                    translate="no"
                  >
                    {headerState.text}
                  </p>

                  <p
                    className="absolute top-1/2 -translate-y-0 left-[12%] right-[12%] z-40 leading-snug break-words"
                    style={{
                      fontSize: `${bodyState.fontSize}px`,
                      fontFamily: `${bodyState.fontStyle ?? "sans-serif"}`,
                      fontWeight: `${bodyState.fontWeight ?? ""}`,
                      color: `${bodyState.fontColor}`,
                      textAlign: `${bodyState.textAlignment}`,
                    }}
                    translate="no"
                  >
                    {bodyState.text}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-grow px-4">
              <div className="light-border-boxes">
                <h4 className="scratch-card-heading">Customize Your Scratch Card</h4>

                <div className="px-4 my-4">
                  <form>
                    <div className="light-border-boxes p-4">
                      <h5 className="text-xl font-medium mb-5">Header</h5>

                      <div className="mb-1.5">
                        <label htmlFor="message" className="form-label">
                          Message
                        </label>
                        <textarea
                          name="message"
                          id="message"
                          className="form-control sm:py-2.5 py-1.5"
                          placeholder="Your Header Here"
                          value={headerState.text}
                          onChange={(val) =>
                            setHeaderState((prev) => ({
                              ...prev,
                              text: val.target.value,
                            }))
                          }
                          onBlur={() =>
                            setHeaderState((prev) => ({
                              ...prev,
                              text: prev.text.endsWith(" ") ? prev.text : prev.text + " ",
                            }))
                          }
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="fontStyle" className="form-label">
                          Font Style
                        </label>
                        <div className="relative">
                          <select
                            name="fontStyle"
                            id="fontStyle"
                            className="form-control appearance-none"
                            value={headerState.fontStyle}
                            onChange={(val) =>
                              setHeaderState((prev) => ({
                                ...prev,
                                fontStyle: val.target.value,
                              }))
                            }
                          >
                            {fonts.map((font: string) => (
                              <option key={font} value={font}>
                                {font}
                              </option>
                            ))}
                          </select>

                          <img
                            src={SelectDownArrow}
                            alt="Select Down Arrow Icon"
                            className="ic-form-select"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="fontSize" className="form-label">
                          Font Size
                        </label>
                        <input
                          type="number"
                          id="fontSize"
                          className="form-control"
                          placeholder="16"
                          value={headerState.fontSize}
                          onChange={(val) =>
                            setHeaderState((prev) => ({
                              ...prev,
                              fontSize: min(parseInt(val.target.value), 60),
                            }))
                          }
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                        <div className="mb-3">
                          <label htmlFor="fontWeight" className="form-label">
                            Font Weight
                          </label>
                          <div className="relative">
                            <select
                              name="fontWeight"
                              id="fontWeight"
                              className="form-control appearance-none"
                              value={headerState.fontWeight}
                              onChange={(val) =>
                                setHeaderState((prev) => ({
                                  ...prev,
                                  fontWeight: val.target.value as FontWeight,
                                }))
                              }
                            >
                              {/* <option selected>Select</option> */}
                              <option value={"400"}>Regular</option>
                              <option value={"500"}>Medium</option>
                              <option value={"Bold"}>Bold</option>
                            </select>

                            <img
                              src={SelectDownArrow}
                              alt="Select Down Arrow Icon"
                              className="ic-form-select"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="textAlign" className="form-label">
                            Text Alignment
                          </label>
                          <div className="relative">
                            <select
                              name="textAlign"
                              id="textAlign"
                              className="form-control appearance-none"
                              value={headerState.textAlignment}
                              onChange={(val) =>
                                setHeaderState((prev) => ({
                                  ...prev,
                                  textAlignment: val.target.value as TextAlign,
                                }))
                              }
                            >
                              <option value={"Left"}>Left</option>
                              <option value={"Center"}>Center</option>
                              <option value={"Right"}>Right</option>
                            </select>

                            <img
                              src={SelectDownArrow}
                              alt="Select Down Arrow Icon"
                              className="ic-form-select"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label htmlFor="fontClr" className="form-label">
                          Font Color
                        </label>
                        <div className="relative" ref={headerPickerRef}>
                          <input
                            type="text"
                            id="fontClr"
                            className="form-control"
                            value={headerState.fontColor}
                            onChange={(val) =>
                              setHeaderState((prev) => ({
                                ...prev,
                                fontColor: val.target.value,
                              }))
                            }
                          />
                          <img
                            src={ColorPickerIcon}
                            alt="Color Picker Icon"
                            className="cursor-pointer absolute right-3 sm:top-5 top-4"
                            onClick={handleHeaderPickerToggle}
                          />
                          {headerState.showPicker && (
                            <div className="absolute z-10 right-3 bottom-11">
                              <ChromePicker
                                color={headerState.fontColor}
                                onChangeComplete={(color) =>
                                  // setHeaderFontColor(color.hex)
                                  setHeaderState((prev) => ({
                                    ...prev,
                                    fontColor: color.hex,
                                  }))
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="light-border-boxes p-4 sm:mt-10 mt-7">
                      <h5 className="text-xl font-medium mb-5">Body</h5>

                      <div className="mb-1.5">
                        <label htmlFor="messageBody" className="form-label">
                          Message
                        </label>
                        <textarea
                          name="message"
                          id="messageBody"
                          className="form-control sm:py-2.5 py-1.5"
                          placeholder="Your Header Here"
                          value={bodyState.text}
                          onChange={(val) =>
                            setBodyState((prev) => ({
                              ...prev,
                              text: val.target.value,
                            }))
                          }
                          onBlur={() =>
                            setBodyState((prev) => ({
                              ...prev,
                              text: prev.text.endsWith(" ") ? prev.text : prev.text + " ",
                            }))
                          }
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="fontStyleBody" className="form-label">
                          Font Style
                        </label>
                        <div className="relative">
                          <select
                            name="fontStyle"
                            id="fontStyleBody"
                            className="form-control appearance-none"
                            value={bodyState.fontStyle}
                            onChange={(val) =>
                              setBodyState((prev) => ({
                                ...prev,
                                fontStyle: val.target.value,
                              }))
                            }
                          >
                            {fonts.map((font: string) => (
                              <option key={font} value={font}>
                                {font}
                              </option>
                            ))}
                          </select>

                          <img
                            src={SelectDownArrow}
                            alt="Select Down Arrow Icon"
                            className="ic-form-select"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="fontSizeBody" className="form-label">
                          Font Size
                        </label>
                        <input
                          type="number"
                          id="fontSizeBody"
                          className="form-control"
                          placeholder="16"
                          value={bodyState.fontSize}
                          onChange={(val) =>
                            setBodyState((prev) => ({
                              ...prev,
                              fontSize: min(parseInt(val.target.value), 60),
                            }))
                          }
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                        <div className="mb-3">
                          <label htmlFor="fontWeightBody" className="form-label">
                            Font Weight
                          </label>
                          <div className="relative">
                            <select
                              name="fontWeight"
                              id="fontWeightBody"
                              className="form-control appearance-none"
                              value={bodyState.fontWeight}
                              onChange={(val) =>
                                setBodyState((prev) => ({
                                  ...prev,
                                  fontWeight: val.target.value as FontWeight,
                                }))
                              }
                            >
                              {/* <option selected>Select</option> */}
                              <option value={"400"}>Regular</option>
                              <option value={"500"}>Medium</option>
                              <option value={"Bold"}>Bold</option>
                            </select>

                            <img
                              src={SelectDownArrow}
                              alt="Select Down Arrow Icon"
                              className="ic-form-select"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="textAlignBody" className="form-label">
                            Text Alignment
                          </label>
                          <div className="relative">
                            <select
                              name="textAlign"
                              id="textAlignBody"
                              className="form-control appearance-none"
                              value={bodyState.textAlignment}
                              onChange={(val) =>
                                setBodyState((prev) => ({
                                  ...prev,
                                  textAlignment: val.target.value as TextAlign,
                                }))
                              }
                            >
                              <option value={"Left"}>Left</option>
                              <option value={"Center"}>Center</option>
                              <option value={"Right"}>Right</option>
                            </select>

                            <img
                              src={SelectDownArrow}
                              alt="Select Down Arrow Icon"
                              className="ic-form-select"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label htmlFor="fontClrBody" className="form-label">
                          Font Color
                        </label>
                        <div className="relative" ref={bodyPickerRef}>
                          <input
                            type="text"
                            id="fontClrBody"
                            className="form-control"
                            value={bodyState.fontColor}
                            onChange={(val) =>
                              setBodyState((prev) => ({
                                ...prev,
                                fontColor: val.target.value,
                              }))
                            }
                          />
                          <img
                            src={ColorPickerIcon}
                            alt="Color Picker Icon"
                            className="cursor-pointer absolute right-3 sm:top-5 top-4"
                            onClick={handleBodyPickerToggle}
                          />
                          {bodyState.showPicker && (
                            <div className="absolute z-10 right-3 bottom-11">
                              <ChromePicker
                                color={bodyState.fontColor}
                                onChangeComplete={(color) =>
                                  // setBodyFontColor(color.hex)
                                  setBodyState((prev) => ({
                                    ...prev,
                                    fontColor: color.hex,
                                  }))
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ height: "auto", margin: "0 auto", maxWidth: 180, width: "100%" }}
                      className="sm:pt-10 pt-7"
                    >
                      <QRCode
                        size={400}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={window.location.href}
                        viewBox={`0 0 256 256`}
                      />
                    </div>

                    <div className="sm:mt-10 mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                      <button type="button" className="light-btn" onClick={handleTryAgain}>
                        Try Again
                      </button>

                      <button
                        type="button"
                        className="primary-btn"
                        data-twe-toggle="modal"
                        data-twe-target="#completeCustomization"
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                      >
                        Complete
                      </button>

                      {/* Complete Customization Modal Content Start */}
                      <div
                        data-twe-modal-init
                        className="modal"
                        id="completeCustomization"
                        tabIndex={-1}
                        aria-labelledby="completeCustomizationTitle"
                        aria-modal="true"
                        role="dialog"
                      >
                        <div data-twe-modal-dialog-ref className="modal-centered-dialog">
                          <div className="modal-content">
                            <div className="modal-body">
                              <h5 className="font-bold text-xl tracking-wide mb-2">
                                Complete Customization ?
                              </h5>
                              <p className="leading-6 text-[--darkgrey-btn-bg]">
                                Are you sure you are done customizing this card? Once Done, you
                                won’t be able to make any further changes.
                              </p>
                            </div>

                            <div className="modal-footer">
                              <button
                                type="button"
                                className="light-btn"
                                data-twe-modal-dismiss
                                data-twe-ripple-init
                                data-twe-ripple-color="light"
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                className="primary-btn"
                                data-twe-modal-dismiss
                                onClick={() => handleSaveTemplate()}
                              >
                                Yes, Done
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Complete Customization Modal Content End */}
                    </div>
                  </form>
                </div>
              </div>
              <div className="mt-10 light-border-boxes">
                <h4 className="get-card-heading">Click Link Below to Get Your Customizable Card</h4>
                <div className="p-6">
                  <a href="https://www.etsy.com/de/shop/kreativjsdesign" target="_blank">
                    <button type="button" className="get-cards-btn">
                      Go to Kreative JS Design shop
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Customization Interface Section End */}
    </>
  );
};

export default CustomizeCard;
