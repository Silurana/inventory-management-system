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
    } catch {
      setError("Product not found. Try adding it?");
    } finally {
      setLoading(false);
      // Keep focus for next scan
      inputRef.current?.focus();
    }
  };

  return (
    <div>
      <h1 className="page-title">Scan Barcode</h1>

      <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
        <div
          className="glass-panel"
          style={{ padding: "1.5rem", marginBottom: "2rem" }}
        >
          <form
            onSubmit={handleScan}
            style={{ display: "flex", gap: "0.75rem" }}
          >
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              placeholder="Scan barcode here..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              autoComplete="off"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: "0.875rem 1.5rem" }}
            >
              {loading ? "..." : <FaSearch />}
            </button>
          </form>
          {error && (
            <p
              style={{
                color: "#ef4444",
                marginTop: "1rem",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          )}
        </div>

        {product && (
          <div
            className="glass-panel"
            style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}
          >
            <div
              className="flex-responsive"
              style={{ alignItems: "start", marginBottom: "1.5rem" }}
            >
              <h2 style={{ fontSize: "1.75rem" }}>{product.name}</h2>
              <span
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  padding: "0.5rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Stock: {product.countInStock}
              </span>
            </div>

            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              {product.description}
            </p>

            <div className="grid-responsive">
              <div
                className="glass-panel"
                style={{
                  padding: "1.25rem",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Price
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "var(--primary)",
                  }}
                >
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div
                className="glass-panel"
                style={{
                  padding: "1.25rem",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Category
                </p>
                <p style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                  {product.category}
                </p>
              </div>
              <div
                className="glass-panel"
                style={{
                  padding: "1.25rem",
                  background: "rgba(255,255,255,0.03)",
                  gridColumn: "1 / -1",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Barcode
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    fontFamily: "monospace",
                  }}
                >
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
