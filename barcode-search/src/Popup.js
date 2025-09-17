import React from "react";
import "./Popup.css";
import { FaTimes } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function Popup({ product, onClose }) {
  if (!product) return null;

  // Filter keys to exclude __v, _id, pdfFile, pdfOriginalName
  const keys = Object.keys(product).filter(
    (k) => !["__v", "_id", "pdfFile", "pdfOriginalName"].includes(k)
  );

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        {/* Header */}
        <div className="popup-header">
          <h2 className="popup-title">{product.itemName || "Product Details"}</h2>
          <button className="popup-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Details Section */}
        <div className="popup-body">
          {keys.map((key) => (
            <div key={key} className="popup-row">
              <span className="popup-label">{key}</span>
              <span className="popup-value">{product[key] || "—"}</span>
            </div>
          ))}

          {/* PDF row */}
          {product.pdfFile && (
            <div className="popup-row">
              <span className="popup-label">PDF File</span>
              <span className="popup-value">
                {product.pdfOriginalName || product.pdfFile}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="popup-footer">
          {product.pdfFile ? (
            <a
              href={`${BASE_URL}/uploads/${product.pdfFile}`} // saved filename
              className="popup-btn download"
              target="_blank"
              rel="noopener noreferrer"
              download={product.pdfOriginalName || product.pdfFile} // original filename
            >
              Download PDF
            </a>
          ) : (
            <span className="popup-no-pdf">No PDF available</span>
          )}
        </div>
      </div>
    </div>
  );
}
