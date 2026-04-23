import { useState } from "react";
import API from "../services/api";
import baseUrl from "../services/baseUrl";
import toast from "react-hot-toast";

function AddProduct() {
  // Detect Mobile Device
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  const [product, setProduct] = useState({
    name: "",
    barcode: "",
    category: "",
    subCategory: "",
    brand: "",
    costPrice: "",
    sellingPrice: "",
    discount: "",
    finalPrice: "",
    stockQuantity: "",
    expiryDate: "",
    description: "",
    unit: 1,
    lowStockAlert: 5,
  });

  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeOnly, setBarcodeOnly] = useState("");
  const [showBarcodeOnly, setShowBarcodeOnly] = useState(false);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateBarcode = () => {
    if (!product.barcode) {
      alert("Enter barcode first");
      return;
    }
    setShowBarcode(true);
  };

  const generateBarcodeOnly = () => {
    if (!barcodeOnly) {
      alert("Enter barcode number");
      return;
    }
    setShowBarcodeOnly(true);
  };

  // Universal Print Function for Mobile & Laptop
const printBarcodeUniversal = (name, barcode) => {
  const safeName = (name || "").substring(0, 20);

  if (isMobile) {
    // ✅ Mobile Print (Label Style Fixed, Image Only)
    const barcodeHTML = `
    <html>
    <head>
      <title>Barcode Label</title>
      <style>
        @page {
          size: 58mm 40mm landscape;
          margin: 0;
        }
        body {
          width: 58mm;
          height: 40mm;
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .name {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 4mm;
        }
        .barcode {
          display: block;
          margin: 0 auto;
          width: 48mm;
          height: 18mm;
          max-width: 48mm;
          max-height: 18mm;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <div class="name">${name}</div>
      <img
        class="barcode"
        src="${baseUrl}/product/generateBarcode/${barcode}"
        alt="barcode"
      />
      <script>
        window.onload = function () {
          window.print();
          window.onafterprint = () => window.close();
        };
      </script>
    </body>
    </html>
    `;

    const win = window.open("", "", "width=600,height=350");
    win.document.write(barcodeHTML);
    win.document.close();
    win.focus();
  } else {
    // ✅ Laptop Print (Label Style Fixed)
    const barcodeHTML = `
    <html>
    <head>
      <title>Barcode Label</title>
      <style>
        @page {
          size: 58mm 40mm landscape;
          margin: 0;
        }
        body {
          width: 58mm;
          height: 40mm;
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .name {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 4mm;
        }
        .barcode {
          display: block;
          margin: 0 auto;
          width: 48mm;
          height: 18mm;
          max-width: 48mm;
          max-height: 18mm;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <div class="name">${name}</div>
      <img
        class="barcode"
        src="${baseUrl}/product/generateBarcode/${barcode}"
        alt="barcode"
      />
      <script>
        window.onload = function () {
          window.print();
          window.onafterprint = () => window.close();
        };
      </script>
    </body>
    </html>
    `;

    const win = window.open("", "", "width=600,height=350");
    win.document.write(barcodeHTML);
    win.document.close();
    win.focus();
  }
};

  const printBarcode = () => {
    printBarcodeUniversal(product.name, product.barcode);
  };

  const printBarcodeOnly = () => {
    printBarcodeUniversal("", barcodeOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalPrice =
        product.sellingPrice - (product.sellingPrice * product.discount) / 100;

      const payload = {
        ...product,
        finalPrice,
      };

      await API.post("/product/addProduct", payload);

      toast.success("Product Added Successfully");

      setProduct({
        name: "",
        barcode: "",
        category: "",
        subCategory: "",
        brand: "",
        costPrice: "",
        sellingPrice: "",
        discount: "",
        finalPrice: "",
        stockQuantity: "",
        expiryDate: "",
        description: "",
        unit: 1,
        lowStockAlert: 5,
      });

      setShowBarcode(false);
    } catch (err) {
      toast.error("Error adding product");
      console.log(err);
    }
  };

  return (
    <div className="p-2 md:p-6 lg:p-8 bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Add Product</h1>

      {/* Barcode Only Generator */}
      <div className="bg-white p-2 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Generate Barcode Only</h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Enter Barcode Number"
            value={barcodeOnly}
            onChange={(e) => setBarcodeOnly(e.target.value)}
            className="input"
          />

          <button
            onClick={generateBarcodeOnly}
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Generate
          </button>
        </div>

        {showBarcodeOnly && (
          <div className="mt-6 text-center">
            <img
              src={`${baseUrl}/product/generateBarcode/${barcodeOnly}`}
              alt="barcode"
              className="mx-auto"
            />
            <p>{barcodeOnly}</p>
            <button
              onClick={printBarcodeOnly}
              className="mt-3 bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
            >
              Print Barcode
            </button>
          </div>
        )}
      </div>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Product Name<span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Barcode<span className="text-red-500">*</span>
          </label>
          <input
            name="barcode"
            value={product.barcode}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-sm font-medium">Category</label>
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Sub Category */}
        <div>
          <label className="block mb-1 text-sm font-medium">Sub Category</label>
          <input
            name="subCategory"
            value={product.subCategory}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block mb-1 text-sm font-medium">Brand</label>
          <input
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Cost Price */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Cost Price<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="costPrice"
            value={product.costPrice}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Selling Price */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Selling Price<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="sellingPrice"
            value={product.sellingPrice}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-1 text-sm font-medium">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={product.discount}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Stock Quantity<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Expiry */}
        <div>
          <label className="block mb-1 text-sm font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={product.expiryDate}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Low Stock */}
        <div>
          <label className="block mb-1 text-sm font-medium">Low Stock Alert</label>
          <input
            type="number"
            name="lowStockAlert"
            value={product.lowStockAlert}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Description */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="input h-24"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleGenerateBarcode}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full sm:w-auto cursor-pointer"
          >
            Generate Barcode
          </button>

          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 w-full sm:w-auto cursor-pointer"
          >
            Add Product
          </button>
        </div>
      </form>

      {/* Barcode Preview */}
      {showBarcode && (
        <div className="mt-8 bg-white p-6 shadow rounded text-center">
          <h3 className="font-semibold mb-3">Generated Barcode</h3>
          <p className="font-medium">{product.name}</p>
          <img
            src={`${baseUrl}/product/generateBarcode/${product.barcode}`}
            alt="barcode"
            className="mx-auto"
          />
          <p>{product.barcode}</p>
          <button
            onClick={printBarcode}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Print Barcode
          </button>
        </div>
      )}
    </div>
  );
}

export default AddProduct;