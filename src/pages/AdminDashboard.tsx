import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TEDropdown,
  TEDropdownItem,
  TEDropdownMenu,
  TEDropdownToggle,
  TEModal,
  TEModalBody,
  TEModalContent,
  TEModalDialog,
  TEModalHeader,
  TERipple,
} from "tw-elements-react";
import ExportIcon from "../../public/static/img/icons/export-icon.svg";
import DotsIcon from "../../public/static/img/icons/three-dots.svg";
import SelectDownArrow from "../../public/static/img/icons/ic-select-dark.svg";
import ModalCloseIcon from "../../public/static/img/icons/ic-modal-close.svg";
import { useDispatch } from "react-redux";
import { initTWE, Modal, Ripple } from "tw-elements";
import Loader from "../components/loader";
import { getListings } from "../features/listings/listingsSlice";
import {
  getAllTemplates,
  saveProductTeamplate,
  SelectTemplates,
  tempalteStatus,
  templatesActions,
} from "../features/templates/teamplateSlice";
import { useAppSelector } from "../store/hooks";
import { AppDispatch } from "../store/store";
import { SingleProductType } from "../tsModels/Products";
import { SingleTemplate } from "../tsModels/Templates";
import {
  convertEuroToDollar,
  errorMsg,
  exportToXlsx,
  formatDate,
  paginateData,
} from "../utils/utilities";
const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const templates = useAppSelector(SelectTemplates);
  const teamplateLoader = useAppSelector(tempalteStatus);
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<SingleProductType[]>();
  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [products, setProducts] = useState<SingleProductType[]>();
  const [query, setQuery] = useState<string>("");
  const [showVerticalyCenteredModal, setShowVerticalyCenteredModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage, setProductsPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>();
  const [selectedTemplate, setSelectedTemplate] = useState<SingleTemplate | null>(null);
  const [oldSelectedTemplate, setOldSelectedTemplate] = useState<SingleTemplate | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  const handleFilterProduct = (type: string, action: "filter" | "sort") => {
    if (!products?.length) return;
    let updatedProducts = [...products];
    if (action === "filter") {
      setCurrentFilter(type);
      updatedProducts = products.filter(({ state }) => state === type);
    }
    if (action === "sort") {
      setCurrentFilter(type);
      const sortDirection = type === "asc" ? 1 : -1;
      updatedProducts.sort((a, b) => {
        const date1 = new Date(a.original_creation_timestamp).getTime();
        const date2 = new Date(b.original_creation_timestamp).getTime();
        return (date1 - date2) * sortDirection;
      });
    }
    const { paginatedData, totalPages } = paginateData(
      updatedProducts,
      currentPage,
      productsPerPage
    );
    setTotalPages(totalPages);
    setCurrentProduct(paginatedData);
  };
  const handleOpenSelectModal = (product: SingleProductType) => {
    setShowVerticalyCenteredModal(true);
    setSelectedProductId(product?.listing_id);
    setSelectedTemplate({} as SingleTemplate);
  };
  const handleSaveTempalte = () => {
    if (!selectedTemplate && !oldSelectedTemplate) {
      errorMsg("Please select at least one teamplate.");
      return;
    }
    dispatch(
      saveProductTeamplate({
        productId: selectedProductId,
        newTemplateId: selectedTemplate?._id ? selectedTemplate?._id : "",
        oldTemplateId: oldSelectedTemplate?._id,
      })
    );
  };
  // useEffect(() => {
  //   const handleTokenParams = () => {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const authToken = urlParams.get("etsy_auth_token");
  //     const refreshToken = urlParams.get("etsy_refresh_token");
  //     if (authToken && refreshToken) {
  //       const isProduction = import.meta.env.PROD;
  //       Cookies.set("etsy_auth_token", authToken, {
  //         secure: isProduction,
  //         sameSite: isProduction ? "none" : "lax",
  //         expires: 1,
  //       });
  //       Cookies.set("etsy_refresh_token", refreshToken, {
  //         secure: isProduction,
  //         sameSite: isProduction ? "none" : "lax",
  //         expires: 7,
  //       });
  //       navigate(window.location.pathname, { replace: true });
  //       setHasFetched(false);
  //     }
  //   };
  //   handleTokenParams();
  // }, [navigate]);
  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched) {
        try {
          setIsLoading(true);
          const resultAction = await dispatch(getListings());
          if (getListings.fulfilled.match(resultAction)) {
            const products = resultAction.payload.products;
            if (products?.length) {
              setProducts(products);
              setHasFetched(true);
            }
          }
          setIsLoading(false);
        } catch (error: any) {
          console.error("Error fetching listings:", error);
          setIsLoading(false);
          if (error.response?.status === 401) {
            navigate("/login");
          }
        }
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!products?.length) return;
    const filteredProducts = products.filter(
      (val) =>
        val.title.toLowerCase().includes(query.toLowerCase()) ||
        val.listing_id.toString().includes(query)
    );
    const { paginatedData, totalPages } = paginateData(
      filteredProducts,
      currentPage,
      productsPerPage
    );
    setTotalPages(totalPages);
    setCurrentProduct(paginatedData);
  }, [query, products, currentPage, productsPerPage]);
  useEffect(() => {
    if (selectedProductId) {
      const selectedTemplate = templates.find((template) => {
        return (
          Array.isArray(template.productId) &&
          template.productId.includes(selectedProductId?.toString())
        );
      });
      if (selectedTemplate) {
        setSelectedTemplate(selectedTemplate);
        setOldSelectedTemplate(selectedTemplate);
      } else {
        setSelectedTemplate(null);
        setOldSelectedTemplate(null);
      }
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (teamplateLoader === "succeeded") {
      dispatch(templatesActions.restTemplateState());
      setShowVerticalyCenteredModal(false);
      setSelectedProductId(0);
      setSelectedTemplate({} as SingleTemplate);
      dispatch(getAllTemplates());
    }
  }, [teamplateLoader]);
  useEffect(() => {
    dispatch(getAllTemplates());
  }, []);
  useEffect(() => {
    if (initTWE) {
      initTWE({ Modal, Ripple });
    }
  });
  if (isLoading) {
    return (
      <>
        <div className="w-[90%] xl:max-w-[1246px] mx-auto admin-loader">
          <Loader />
        </div>
      </>
    );
  }
  return (
    <>
      {/* Admin Table Section Start */}
      <section>
        <div className="table-header-main">
          <div className="grid md:grid-cols-2 px-5">
            <div className="flex items-center w-full sm:!w-3/4 mb-3 md:!mb-0">
              <input
                type="search"
                className="table-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                id="exampleSearch"
                placeholder="Search anything here..."
              />
            </div>

            <div className="!flex !justify-end sm:!flex-nowrap !flex-wrap items-center gap-4">
              <TEDropdown>
                <TERipple rippleColor="light">
                  <TEDropdownToggle className="filter-btn">
                    Filter
                    <span className="ml-2 [&>svg]:w-5 w-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </TEDropdownToggle>
                </TERipple>

                <TEDropdownMenu className="border p-2">
                  <TEDropdownItem preventCloseOnClick>
                    <h6 className="drop-headline mb-2">By Status</h6>
                  </TEDropdownItem>
                  <TEDropdownItem onClick={() => handleFilterProduct("active", "filter")}>
                    <span
                      className={`drop-values  hover:!bg-[#F8FAFB] ${currentFilter === "active" ? "!bg-[#F8FAFB]" : ""}`}
                    >
                      Active Products
                    </span>
                  </TEDropdownItem>
                  <TEDropdownItem onClick={() => handleFilterProduct("inactive", "filter")}>
                    <span
                      className={`drop-values  hover:!bg-[#F8FAFB] ${currentFilter === "inactive" ? "!bg-[#F8FAFB]" : ""}`}
                    >
                      Inactive Products
                    </span>
                  </TEDropdownItem>
                </TEDropdownMenu>
              </TEDropdown>

              <TEDropdown>
                <TERipple rippleColor="light">
                  <TEDropdownToggle className="sort-btn">
                    Sort
                    <span className="ml-2 [&>svg]:w-5 w-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </TEDropdownToggle>
                </TERipple>

                <TEDropdownMenu className="border p-2">
                  <TEDropdownItem preventCloseOnClick>
                    <h6 className="drop-headline !mb-2">By Date</h6>
                  </TEDropdownItem>
                  <TEDropdownItem
                    onClick={() => handleFilterProduct("desc", "sort")}
                    className={currentFilter === "desc" ? "active:bg-red-500" : ""}
                  >
                    <span
                      className={`drop-values  hover:!bg-[#F8FAFB] ${currentFilter === "desc" ? "!bg-[#F8FAFB]" : ""}`}
                    >
                      Descending
                    </span>
                  </TEDropdownItem>
                  <TEDropdownItem onClick={() => handleFilterProduct("asc", "sort")}>
                    <span
                      className={`drop-values  hover:!bg-[#F8FAFB] ${currentFilter === "asc" ? "!bg-[#F8FAFB]" : ""}`}
                    >
                      Ascending
                    </span>
                  </TEDropdownItem>
                </TEDropdownMenu>
              </TEDropdown>
              <button
                className="export-btn"
                disabled={products?.length === 0}
                onClick={(e) =>
                  products?.length !== 0 ? exportToXlsx(e, products, `EstyProducts`) : null
                }
              >
                <img src={ExportIcon} alt="Export Icon" /> Export
              </button>
            </div>
            <div></div>
          </div>

          <div className="flex flex-col mt-5">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left font-light">
                    <thead className="font-semibold text-base">
                      <tr>
                        <th scope="col" className="py-4 px-5">
                          Product ID
                        </th>
                        <th scope="col" className="py-4 px-5">
                          Name
                        </th>
                        <th scope="col" className="py-4 px-5">
                          Price
                        </th>
                        <th scope="col" className="py-4 px-5">
                          Discount Price
                        </th>
                        <th scope="col" className="py-4 px-5">
                          Date
                        </th>
                        <th scope="col" className="py-4 px-5">
                          Status
                        </th>
                        <th scope="col" className="py-4 px-5">
                          Template
                        </th>
                        <th scope="col" className="py-4 px-5">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProduct?.length !== 0 &&
                        currentProduct?.map((product, idx) => (
                          <tr key={idx}>
                            <td className="whitespace-nowrap py-4 px-5">
                              {product.listing_id ?? ""}
                            </td>
                            <td className="min-w-80 py-4 px-5">{product.title ?? ""}</td>
                            <td className="whitespace-nowrap py-4 px-5">
                              $
                              {convertEuroToDollar(product.price.amount / product.price.divisor) ??
                                0}
                            </td>
                            <td className="whitespace-nowrap py-4 px-5">$0</td>
                            <td className="whitespace-nowrap py-4 px-5">
                              {product?.created_timestamp
                                ? formatDate(product?.original_creation_timestamp)
                                : ""}
                            </td>
                            <td
                              className={`whitespace-nowrap py-4 px-5 ${
                                product.state === "active" ? "active" : "inactive"
                              }`}
                            >
                              <span></span>
                              {product?.state === "active" ? "Active" : "Inactive"}
                            </td>
                            <td
                            // onClick={() => {
                            //   setSelectedProductId(product?.listing_id);
                            //   setShowVerticalyCenteredModal2(true);
                            // }}
                            // data-twe-toggle="modal"
                            // data-twe-target="#previewDesign"
                            // data-twe-ripple-init
                            // data-twe-ripple-color="light"
                            // className="whitespace-nowrap py-4 px-5 view-template cursor-pointer"
                            >
                              <button
                                onClick={() => {
                                  setSelectedProductId(product?.listing_id);
                                }}
                                data-twe-toggle="modal"
                                data-twe-target="#previewDesign"
                                data-twe-ripple-init
                                data-twe-ripple-color="light"
                                className="whitespace-nowrap py-4 px-5 view-template cursor-pointer !bg-transparent !shadow-none"
                              >
                                <span className="text-[--lightblue-link-color]">View Template</span>
                              </button>
                            </td>
                            <td className="whitespace-nowrap py-4 px-5">
                              <TEDropdown>
                                <TERipple rippleColor="light">
                                  <TEDropdownToggle className="vt-link">
                                    <img src={DotsIcon} alt="Dots Icon" />
                                  </TEDropdownToggle>
                                </TERipple>

                                <TEDropdownMenu className="border py-3 px-3 data-list">
                                  <TEDropdownItem preventCloseOnClick>
                                    <Link
                                      to=""
                                      onClick={() => handleOpenSelectModal(product)}
                                      className="template-selection"
                                    >
                                      Select Template
                                    </Link>
                                  </TEDropdownItem>
                                </TEDropdownMenu>
                              </TEDropdown>
                            </td>
                          </tr>
                        ))}
                      {!currentProduct?.length && (
                        <tr>
                          <td colSpan={8} className="text-center">
                            No Product Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {currentProduct && currentProduct?.length !== 0 && (
            <div className="flex justify-between align-center mt-10 px-5">
              <div className="grid grid-cols sm:grid-cols-2 w-full gap-4 sm:gap-0 text-[0.875rem] font-semibold">
                <div className="flex justify-start items-center gap-3 w-fit me-auto">
                  <span>Page</span>
                  {/* <TEDropdown>
                  <TERipple rippleColor="light">
                    <TEDropdownToggle className="pages-pagi">
                      1
                      <span className="ml-2 [&>svg]:w-5 w-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </TEDropdownToggle>
                  </TERipple>

                  <TEDropdownMenu className="border p-2">
                    <TEDropdownItem preventCloseOnClick>
                      <Link to="" className="drop-values">
                        2
                      </Link>
                    </TEDropdownItem>
                    <TEDropdownItem>
                      <Link to="" className="drop-values">
                        3
                      </Link>
                    </TEDropdownItem>
                    <TEDropdownItem>
                      <Link to="" className="drop-values">
                        4
                      </Link>
                    </TEDropdownItem>
                  </TEDropdownMenu>
                </TEDropdown> */}
                  <div className="relative pagination-select">
                    <select
                      name="pageNo"
                      id="pageNo"
                      className="form-control appearance-none"
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                    >
                      {Array.from({ length: totalPages || 0 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="pageNo">
                      <img
                        src={SelectDownArrow}
                        alt="Select Down Arrow Icon"
                        className="ic-form-select"
                      />
                    </label>
                  </div>
                  <span>of {totalPages ? totalPages : 0}</span>
                </div>

                <div className="flex justify-end items-center gap-3 w-fit ms-auto">
                  <span>Rows Per Page</span>
                  <div className="relative pagination-select">
                    <select
                      name="rowNo"
                      id="rowNo"
                      className="form-control appearance-none"
                      value={productsPerPage}
                      onChange={(e) => setProductsPerPage(Number(e.target.value))}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                    </select>

                    <label htmlFor="rowNo">
                      <img
                        src={SelectDownArrow}
                        alt="Select Down Arrow Icon"
                        className="ic-form-select"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Select Template Modal Start */}
        <TEModal
          show={showVerticalyCenteredModal}
          setShow={setShowVerticalyCenteredModal}
          onHide={() => setSelectedProductId(0)}
          staticBackdrop
        >
          <TEModalDialog className="!mt-0 h-full mx-auto !w-[90%] lg:!w-100" size="lg" centered>
            <TEModalContent className="rounded-[1.25rem]">
              <TEModalHeader className="border-none gap-2 flex-wrap">
                <h5 className="text-xl font-semibold leading-normal text-black">Select Template</h5>
                <div className="flex justify-end items-center gap-3 flex-1">
                  <button
                    type="button"
                    className="light-btn-admin w-fit px-5"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Unselect
                  </button>
                  <button
                    type="button"
                    className="primary-btn w-fit px-5"
                    onClick={handleSaveTempalte}
                  >
                    Save
                  </button>
                </div>
              </TEModalHeader>
              <TEModalBody className="lg:max-h-[700px] max-h-[550px] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {teamplateLoader === "loading" ? (
                    <>
                      <div className="min-w-[800px] admin-loader">
                        <Loader />
                      </div>
                    </>
                  ) : templates.length !== 0 ? (
                    templates.map((template, idx) => {
                      return (
                        <div
                          key={idx}
                          className="relative overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedTemplate(template);
                          }}
                        >
                          <img
                            src={template?.backgroundUrl}
                            alt="Template 1"
                            className="w-full rounded-lg"
                          />
                          <div
                            className="absolute z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            id="scratch-sticker"
                          >
                            <img className="" src={template?.stickerUrl} alt="Heart Scratch" />
                          </div>
                          {selectedTemplate?._id && selectedTemplate._id === template._id && (
                            <span className="selected-template">Selected</span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <h6 className="text-center">No template found</h6>
                  )}
                </div>
              </TEModalBody>
            </TEModalContent>
          </TEModalDialog>
        </TEModal>
        {/* Select Template Modal End */}
      </section>
      {/* <TEModal
        show={showVerticalyCenteredModal2}
        setShow={setShowVerticalyCenteredModal2}
        onHide={() => setSelectedProductId(0)}
      >
        <TEModalDialog className="!mt-0 h-full mx-auto !w-[90%] lg:!w-100" size="lg" centered>
          <TEModalContent className="rounded-[1.25rem]">
            <TEModalHeader className="border-none gap-2 flex-wrap">
              <h5 className="text-xl font-semibold leading-normal text-black">Selected Template</h5>

              <button
                type="button"
                // onClick={() => setCurrentTemplate({} as SingleTemplate)}
                className="absolute sm:-top-4 sm:-right-4 -top-2.5 -right-2.5 bg-white rounded-full"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <img src={ModalCloseIcon} alt="Preview Image" className=" !w-10" />
              </button>
            </TEModalHeader>
            <TEModalBody className="">
              <div data-twe-modal-dialog-ref className="modal-centered-dialog opacity-100 !max-w-full">
                <div className="modal-content">
                  {selectedTemplate?._id ? (
                    <div className="modal-body p-0 relative">
                      <img
                        src={selectedTemplate?.backgroundUrl}
                        alt="Template 1"
                        className="w-full rounded-lg"
                      />
                      <div
                        className="absolute z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                        id="scratch-sticker"
                      >
                        <img className="" src={selectedTemplate?.stickerUrl} alt="Heart Scratch" />
                      </div>
                    </div>
                  ) : (
                    <h6 className="text-center my-5">No selected template</h6>
                  )}
                </div>
              </div>
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal> */}

      <div
        data-twe-modal-init
        className="modal"
        id="previewDesign"
        tabIndex={-1}
        aria-labelledby="previewDesignTitle"
        aria-modal="true"
        role="dialog"
        // show={showVerticalyCenteredModal2}
        // setShow={setShowVerticalyCenteredModal2}
        onClick={() => setSelectedProductId(0)}
      >
        <div data-twe-modal-dialog-ref className="modal-centered-dialog">
          <div className="modal-content p-5">
            <div className="modal-header mb-5">
              <h5 className="text-xl font-semibold leading-normal text-black">Select Template</h5>
              <button
                type="button"
                onClick={() => setSelectedProductId(0)}
                className="absolute sm:-top-4 sm:-right-4 -top-2.5 -right-2.5 bg-white rounded-full"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <img src={ModalCloseIcon} alt="Preview Image" className=" !w-10" />
              </button>
            </div>
            <div className="modal-body p-0 relative">
              {selectedTemplate?._id ? (
                <>
                  <img
                    src={selectedTemplate?.backgroundUrl}
                    alt="Background Image"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute z-10 top-0" id="scratch-sticker">
                    <img className="" src={selectedTemplate?.stickerUrl} alt="Sticker Image" />
                  </div>
                </>
              ) : (
                <h6 className="text-center my-5">No selected template</h6>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Admin Table Section End */}
    </>
  );
};

export default AdminDashboard;
