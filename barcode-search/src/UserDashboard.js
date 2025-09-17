import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import Popup from "./Popup";

// ✅ Backend URL from .env
const BASE_URL = process.env.REACT_APP_API_URL;

export default function UserDashboard({ onLogout, role, department }) {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [popupProduct, setPopupProduct] = useState(null);

  // Size options per department
  const sizeOptionsMap = {
    Bedding: ["King", "Queen", "Double", "Twin"],
    Apparel: ["S", "M", "L", "XL"],
    "Gloves/PPE": ["S", "M", "L", "XL"],
    Socks: ["Small", "Medium", "Large"],
  };

  const sizeOptions = department ? sizeOptionsMap[department] || [] : [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (sizeFilter) params.append("size", sizeFilter);
        if (role === "user" && department) params.append("department", department);
        params.append("role", role);

        const res = await fetch(`${BASE_URL}/api/products?${params}`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [search, sizeFilter, department, role]);

  const handleDownload = async (pdfFile) => {
    if (!pdfFile) return alert("❌ No PDF available for this product");
    try {
      const res = await fetch(`${BASE_URL}/api/download-pdf/${pdfFile}`);
      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFile;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error downloading PDF:", err);
      alert("❌ Failed to download PDF");
    }
  };

  const openPopup = (product) => setPopupProduct(product);
  const closePopup = () => setPopupProduct(null);

  return (
    <div className="user-search-container">
      <div className="user-navbar">
        <h2>User Dashboard</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className="user-search-box">
        <h1 className="user-title">Barcode Search System</h1>
        <p className="user-subtitle">Type an item name or barcode to find details.</p>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSizeFilter("");
          }}
          className="user-search-input"
        />

        {search.trim() && sizeOptions.length > 0 && (
          <div className="user-size-buttons">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSizeFilter(sizeFilter === size ? "" : size)}
                className={`user-size-btn ${sizeFilter === size ? "active" : ""}`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {search.trim() && (
          <div className="user-results">
            {products.length > 0 ? (
              products.map((item) => {
                const keys = Object.keys(item).filter(
                  (k) => k !== "__v" && k !== "_id" && k !== "pdfFile" && k !== "pdfOriginalName"
                );
                return (
                  <div key={item._id} className="user-product-card">
                    <div className="user-product-row headings">
                      {keys.map((key) => (
                        <div key={key} className="user-product-cell heading">
                          {key}
                        </div>
                      ))}
                    </div>

                    <div className="user-product-row values">
                      {keys.map((key) => (
                        <div key={key} className="user-product-cell value">
                          {item[key]}
                        </div>
                      ))}
                      <div className="user-product-cell value">
                        <button className="user-open-btn" onClick={() => openPopup(item)}>
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="user-no-results">No products found.</p>
            )}
          </div>
        )}

        {popupProduct && (
          <Popup
            product={popupProduct}
            onClose={closePopup}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}
