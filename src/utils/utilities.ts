import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SingleProductType } from "../tsModels/Products";
import { toast } from "react-toastify";
export function convertEuroToDollar(euros: number, exchangeRate = 1.08) {
  return (euros * exchangeRate).toFixed(2);
}
export const formatDate = (val: number) => {
  const timestamp = val * 1000; // Convert seconds to milliseconds
  const date = new Date(timestamp);

  const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  return formattedDate;
};
export const downloadCSVFile = ({
  data,
  fileName,
  fileType,
}: {
  data: any;
  fileName: string;
  fileType: string;
}) => {
  const blob = new Blob([data], { type: fileType });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};
export const exportToXlsx = async (
  e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  products: SingleProductType[] | undefined,
  fileName: string
) => {
  e.preventDefault();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Products");
  const headers = ["Product ID", "Name", "Price", "Discount", "Date", "Status"];
  // Add headers to the sheet
  worksheet.addRow(headers);
  // Convert orders into an array of rows
  products?.forEach((product) => {
    worksheet.addRow([
      product?.listing_id.toString(),
      product?.title,
      `$${convertEuroToDollar(product.price.amount / product.price.divisor) ?? 0}`,
      `$0`,
      product?.created_timestamp ? formatDate(product.original_creation_timestamp) : "",
      product?.state === "active" ? "Active" : "Inactive",
    ]);
  });
  worksheet.columns = [
    { width: 15 },
    { width: 60 },
    { width: 10 },
    { width: 10 },
    { width: 15 },
    { width: 10 },
  ];
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (rowNumber === 1) {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F81BD" },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
export const successMsg = (message: string) => {
  toast.dismiss();
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const normalFailMsg = (message: string) => {
  toast.dismiss();
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const errorMsg = (message: string) => {
  toast.dismiss();
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const paginateData = (data: any[], currentPage: number, productsPerPage: number) => {
  if (!data?.length) return { paginatedData: [], totalPages: 0 };

  const totalPages = Math.ceil(data.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return { paginatedData, totalPages };
};
