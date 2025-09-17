import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import Popup from "./Popup";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function ExportOffice({ onLogout }) {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [popupProduct, setPopupProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!search.trim() && !sizeFilter) return setProducts([]);

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (sizeFilter) params.append("size", sizeFilter);
        params.append("role", "exportOffice");

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
  }, [search, sizeFilter]);

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
        <h2>Export Office Dashboard</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className="user-search-box">
        <h1 className="user-title">Export Office Product Search</h1>
        <p className="user-subtitle">Search products across all departments.</p>

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

        {search.trim() && (
          <div className="user-results">
            {products.length > 0 ? (
              products.map((item) => {
                const keys = Object.keys(item).filter((k) => !["_id", "__v", "pdfFile", "pdfOriginalName"].includes(k));
                return (
                  <div key={item._id} className="user-product-card">
                    <div className="user-product-row headings">
                      {keys.map((key) => <div key={key} className="user-product-cell heading">{key}</div>)}
                    </div>

                    <div className="user-product-row values">
                      {keys.map((key) => <div key={key} className="user-product-cell value">{item[key]}</div>)}
                      <div className="user-product-cell value">
                        <button className="user-open-btn" onClick={() => openPopup(item)}>Open</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : <p className="user-no-results">No products found.</p>}
          </div>
        )}

        {popupProduct && (
          <Popup product={popupProduct} onClose={closePopup} onDownload={handleDownload} />
        )}
      </div>
    </div>
  );
}
