import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    barcode: "",
    itemName: "",
    carton: "",
    color: "",
    size: "",
    pcs: "",
    department: "Bedding",
    pdfFile: null, // ✅ New field
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pdfFile") {
      setFormData((prev) => ({ ...prev, pdfFile: files[0] }));
      return;
    }

    let val = value;
    if (val.length > 0 && ["itemName", "carton", "color", "size"].includes(name)) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.post("http://localhost:5000/api/add-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("✅ Product added successfully!");
        setFormData({
          barcode: "",
          itemName: "",
          carton: "",
          color: "",
          size: "",
          pcs: "",
          department: "Bedding",
          pdfFile: null,
        });
      }
    } catch (error) {
      console.error("❌ Error adding product:", error.response?.data || error.message);
      alert("❌ Failed to add product. Check console for details.");
    }
  };

  const departments = ["Bedding", "Apparel", "Safety and PPE", "Socks"];

  return (
    <div className="add-product-container">
      <div className="add-product-box">
        <h1 className="add-product-title">Add New Product</h1>
        <p className="add-product-subtitle">Fill the details to save product in database</p>

        <form className="add-product-form" onSubmit={handleSubmit}>
          {["barcode", "itemName", "carton", "color", "size", "pcs"].map((field) => (
            <div className="add-product-field" key={field}>
              <label>
                {field === "itemName" ? "Item Name" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input type="text" name={field} value={formData[field]} onChange={handleChange} required />
            </div>
          ))}

          <div className="add-product-field department">
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ PDF Upload Field */}
          <div className="add-product-field pdf-upload">
            <label>Upload PDF</label>
            <input type="file" name="pdfFile" accept="application/pdf" onChange={handleChange} />
          </div>

          <button type="submit" className="add-product-submit">
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}
