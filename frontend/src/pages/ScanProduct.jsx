import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { FaSearch, FaPlus, FaCheck } from "react-icons/fa";

const ScanProduct = () => {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!barcode) return;

    setLoading(true);
    setError(null);
    setProduct(null);

    try {
      const { data } = await api.get(`/products/barcode/${barcode}`);
      setProduct(data);
      setBarcode(""); // Clear after successful scan
    } catch (err) {
      setError("Product not found. Try adding it?");
    } finally {
      setLoading(false);
      // Keep focus for next scan
      inputRef.current?.focus();
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ textAlign: "center" }}>
        Scan Barcode
      </h1>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          className="glass-panel"
          style={{ padding: "2rem", marginBottom: "2rem" }}
        >
          <form onSubmit={handleScan} style={{ display: "flex", gap: "1rem" }}>
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              placeholder="Scan barcode here..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Scanning..." : <FaSearch />}
            </button>
          </form>
          {error && (
            <p style={{ color: "#ef4444", marginTop: "1rem" }}>{error}</p>
          )}
        </div>

        {product && (
          <div
            className="glass-panel"
            style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ fontSize: "1.5rem" }}>{product.name}</h2>
              <span
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.875rem",
                }}
              >
                In Stock: {product.countInStock}
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              {product.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                className="glass-panel"
                style={{
                  padding: "1rem",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Price
                </p>
                <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div
                className="glass-panel"
                style={{
                  padding: "1rem",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Category
                </p>
                <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  {product.category}
                </p>
              </div>
              <div
                className="glass-panel"
                style={{
                  padding: "1rem",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Barcode
                </p>
                <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  {product.barcode}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanProduct;
