/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// import Template1 from "../../public/static/img/templates/template1.png";
// import Sticker from "../../public/static/img/templates/stiker1.png";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { initTWE, Modal, Ripple } from "tw-elements";
import Loader from "../components/loader";
import {
  cardStatus,
  getScratchCard,
  selectCardError,
  selectScratchCard,
} from "../features/customizeCards/customizeCardSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
// interface MousePos {
//   x: number;
//   y: number;
// }

const CardView = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const templateId = params.id;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardData = useAppSelector(selectScratchCard);
  const status = useAppSelector(cardStatus);
  const error = useAppSelector(selectCardError);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [enableSecret, setEnableSecret] = useState<boolean>(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  const handleTryAgain = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    window.location.reload();
  };

  useEffect(() => {
    if (initTWE) {
      initTWE({ Modal, Ripple });
    }
  }, []);

  useEffect(() => {
    if (templateId) {
      dispatch(getScratchCard({ id: templateId }));
    }
  }, [templateId]);
  useEffect(() => {
    if (cardData?.templateInfo?.stickerUrl && canvasRef.current) {
      setTimeout(() => {
        hookCanvas(
          canvasRef.current,
          cardData.templateInfo.stickerUrl,
          () => {
            setIsLoaded(true);
          },
          setEnableSecret
        );
      }, 100);
    }
  }, [cardData, canvasRef.current]);
  // console.log(enableSecret);

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <section className="py-5">
        <h1 className="logo">Kreativ JSdesign</h1>
        {error || !cardData?.templateInfo ? (
          <h2 className="form-error-msg text-center text-lg">
            Error retrieving your card information. Please check the URL again or contact the
            seller.
          </h2>
        ) : (
          <div className="flex lg:flex-row flex-col xl:gap-x-14 gap-x-10 gap-y-10 md:mt-5 sm:mt-5 mt-5">
            <div className="2xl:!w-60 !w-40 xl:!block hidden"></div>
            <div className="max-w-lg mx-auto">
              <div>
                {cardData?.templateInfo?.backgroundUrl ? (
                  <div className="sticky top-5">
                    <div className="relative w-[350px] h-[477px] overflow-y-hidden">
                      {isLoaded ? (
                        <img
                          src={cardData?.templateInfo?.backgroundUrl}
                          alt="Template 1"
                          className="h-full"
                        />
                      ) : null}
                      <div className="h-full w-full absolute m-0 p-0 top-0">
                        <canvas className="h-full w-full z-20 relative" ref={canvasRef}></canvas>
                      </div>
                      <div className="absolute z-10 top-0 inset-x-0" id="scratch-sticker"></div>
                      {isLoaded && (
                        <>
                          <p
                            className={`text absolute sm:top-14 top-12 left-[12%] right-[12%] leading-tight break-words`}
                            style={{
                              fontSize: `${cardData?.customCardInfo?.cardHeader?.fontSize ?? ""}px`,
                              fontFamily: `${cardData?.customCardInfo?.cardHeader?.fontStyle ?? "sans-serif"}`,
                              fontWeight: `${cardData?.customCardInfo?.cardHeader?.fontWeight ?? ""}`,
                              color: `${cardData?.customCardInfo?.cardHeader?.fontColor ?? ""}`,
                              textAlign: `${cardData?.customCardInfo?.cardHeader?.textAlignment ?? "center"}`,
                            }}
                          >
                            {cardData?.customCardInfo?.cardHeader?.text}
                          </p>

                          <p
                            className={`absolute top-1/2 -translate-y-0 left-[12%] right-[12%] leading-snug break-words ${!canvasRef.current && enableSecret && "hidden"}`}
                            style={{
                              fontSize: `${cardData?.customCardInfo?.cardBody?.fontSize}px`,
                              fontFamily: `${cardData?.customCardInfo?.cardBody?.fontStyle ?? "sans-serif"}`,
                              fontWeight: `${cardData?.customCardInfo?.cardBody?.fontWeight ?? ""}`,
                              color: `${cardData?.customCardInfo?.cardBody?.fontColor}`,
                              textAlign: `${cardData?.customCardInfo?.cardBody?.textAlignment ?? "center"}`,
                            }}
                          >
                            {cardData?.customCardInfo?.cardBody?.text}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>loading</div>
                )}
              </div>
            </div>
            <div className="flex-grow px-4">
              <div className="light-border-boxes px-4">
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
                  <div className="relative inline-block">
                    <button type="button" className="primary-btn" onClick={handleCopy}>
                      Copy Link
                    </button>

                    {copied && (
                      <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-white bg-[--primary-color]  text-xs px-2 py-1 rounded">
                        Copied!
                      </span>
                    )}
                  </div>
                  <button type="button" className="light-btn" onClick={handleTryAgain}>
                    Try Again
                  </button>
                </div>
              </div>
              <div className="mt-10 light-border-boxes">
                <h4 className="get-card-heading">Click Link Below to Get Your Customizable Card</h4>
                <div className="sm:p-6 p-4">
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
    </>
  );
};
export default CardView;

function hookCanvas(
  canvasElement: HTMLCanvasElement | null,
  url: string | null,
  callback: () => void,
  setEnableSecret: (val: boolean) => void
) {
  if (!canvasElement) return;

  const canvas: any = canvasElement;
  const ctx: any = canvas.getContext("2d");
  if (!ctx) return;

  const container = canvas.parentElement;
  if (!container) return;

  let isDrawing = false;
  let lastPoint: { x: number; y: number } | null = null;
  const image = new Image();
  const brush = new Image();
  image.crossOrigin = "anonymous";
  image.src = url || "/images/default-shape.png";

  function adjustCanvasSize() {
    const canvasWidth = container?.offsetWidth;
    const canvasHeight = container?.offsetHeight || 400; // Fallback height

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Ensure the image is drawn after resizing
    if (image.complete) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
      setEnableSecret(true);
    }
  }

  // Observe container size changes
  const resizeObserver = new ResizeObserver(() => {
    adjustCanvasSize();
  });
  resizeObserver.observe(container);

  image.onload = function () {
    adjustCanvasSize(); // Draw the image after resizing
    callback();
  };

  brush.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAYAAADzun+cAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIzSURBVHgBvZRLa9VQFIX3aXJv683ttVREfKBSnAmKDwQnIo4UnCkoCE78Cf4XUQSHzgURnCmiUgXFmYgVim+r1l4bW2MerkVW4jFcq1LaDR85OTk5a++1T2K2OjEk6ghsZaMrcpCBws+kGS3gNOY1FK6xobOlYw3YqGsq8SqcX7ETbWXnlAT5AUbBuK5bNbfoJVV4e7GgtRLls+9gzEqHh5lI6IlSMAELmhvVfahsJ8BBsE5zV7WWz0Y0x/sN4BDYA+6BJ+AbiCXMoqwSLjRmNl91v6AsZ6209jzYDa6Au1pzSck91rMOuA1egs9gGjzz3MgqS+qKe73ecL/fL7wkxmXpCXAAHFXmzHoGnJUoNz4FdsqlTeACuKl1EZi331tRn+quc24sTdPZyrowDPfleX4G43MSphM3wDW9swXckoW0fxf4IKfYtlfgHfjYFPWFE4jOeVZAM2eWb8Ed0AcPwEVtvh9sB8fAZnDcysP2XImHWjeva94UHvRJDEVRtD6OY76AYdTFuKNNaPVpcFJVUXREidHWacFDdV/VpwM06h77UUBoUfZgGNOVrjZm//Zaebp5eKbANittnQRvtO6Rla35Y/jCgRxghnP26+gz69egp/mn4JM2vi5RVnwkCIIvWZY9lDP2r8JZ41ndb1bfbrcnkiShtTy5tPKyqmYbdnDcarUmIfzeyn4vGX/77VURKMnDVh6qKb3LytkWtoJfxIsBBSxLuLm+IzH+Evk5zdh/xk9lVrE9MEyR0gAAAABJRU5ErkJggg==";

  function getMouse(e: TouchEvent | MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e instanceof TouchEvent) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return { x, y };
  }
  function handleMouseUp() {
    isDrawing = false;
  }

  function handleMouseMove(e: TouchEvent | MouseEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const currentPoint = getMouse(e);
    if (!lastPoint) return;

    const dist = Math.sqrt(
      Math.pow(currentPoint.x - lastPoint.x, 2) + Math.pow(currentPoint.y - lastPoint.y, 2)
    );
    const angle = Math.atan2(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y);

    for (let i = 0; i < dist; i++) {
      const x = lastPoint.x + Math.sin(angle) * i - 10;
      const y = lastPoint.y + Math.cos(angle) * i - 10;

      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(brush, x, y);
    }

    lastPoint = currentPoint;
  }

  function handleMouseDown(e: TouchEvent | MouseEvent) {
    isDrawing = true;
    lastPoint = getMouse(e);
  }

  // Attach event listeners
  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("touchstart", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("touchmove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);
  canvas.addEventListener("touchend", handleMouseUp, false);

  return () => {
    resizeObserver.disconnect();
  };
}

// function distanceBetween(point1: MousePos, point2: MousePos) {
//   return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
// }

// function angleBetween(point1: MousePos, point2: MousePos) {
//   return Math.atan2(point2.x - point1.x, point2.y - point1.y);
// }
