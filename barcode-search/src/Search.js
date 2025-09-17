import React, { useState, useEffect } from "react";
import "./Search.css";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function Search({ role, onLogout }) {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [products, setProducts] = useState([]);

  const sizeOptions = ["S", "M", "L", "XL", "King", "Queen", "Double", "Twin"];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!search.trim()) {
        setProducts([]);
        return;
      }
      try {
        const params = new URLSearchParams();
        params.append("search", search);
        if (sizeFilter) params.append("size", sizeFilter);
        params.append("role", role); // role passed to backend

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
  }, [search, sizeFilter, role]);

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/product/${id}?role=${role}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Product deleted!");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.message || "❌ Failed to delete product.");
      }
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      alert("❌ Server error while deleting product.");
    }
  };

  return (
    <div className="admin-search-container">
      <div className="admin-search-box">
        <h1 className="admin-title">Barcode Search System</h1>
        <p className="admin-subtitle">Type an item name or barcode to find details.</p>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSizeFilter("");
          }}
          className="admin-search-input"
        />

        {search.trim() && (
          <div className="admin-size-buttons">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSizeFilter(sizeFilter === size ? "" : size)}
                className={`admin-size-btn ${sizeFilter === size ? "active" : ""}`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {search.trim() && (
          <div className="admin-results">
            {products.length > 0 ? (
              products.map((item) => {
                const keys = Object.keys(item).filter(
                  (k) => !["__v", "_id", "pdfFile", "pdfOriginalName"].includes(k)
                );

                return (
                  <div key={item._id} className="admin-product-card">
                    <div className="admin-product-row headings">
                      {keys.map((key) => (
                        <div key={key} className="admin-product-cell heading">{key}</div>
                      ))}
                      <div className="admin-product-cell heading">Action</div>
                    </div>

                    <div className="admin-product-row values">
                      {keys.map((key) => (
                        <div key={key} className="admin-product-cell value">{item[key]}</div>
                      ))}
                      <div className="admin-product-cell value">
                        <button className="admin-delete-btn" onClick={() => handleDelete(item._id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="admin-no-results">No products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
