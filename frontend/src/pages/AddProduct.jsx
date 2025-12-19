import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: "",
    countInStock: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
      <h1 className="page-title">Add New Product</h1>
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        {error && (
          <div
            style={{
              color: "#ef4444",
              marginBottom: "1rem",
              background: "rgba(239, 68, 68, 0.1)",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Mouse"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Barcode
            </label>
            <div className="flex-responsive" style={{ gap: "0.75rem" }}>
              <input
                type="text"
                name="barcode"
                required
                className="input-field"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Scan or type..."
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{
                  border: "1px solid var(--border)",
                  padding: "0.875rem 1.5rem",
                  whiteSpace: "nowrap",
                }}
                onClick={() =>
                  setFormData({
                    ...formData,
                    barcode: Math.floor(
                      Math.random() * 1000000000000
                    ).toString(),
                  })
                }
              >
                Generate
              </button>
            </div>
          </div>

          <div className="grid-responsive">
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Category
              </label>
              <input
                type="text"
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                required
                className="input-field"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Count In Stock
            </label>
            <input
              type="number"
              name="countInStock"
              required
              className="input-field"
              value={formData.countInStock}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Description
            </label>
            <textarea
              name="description"
              required
              className="input-field"
              style={{ minHeight: "100px", resize: "vertical" }}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: "0.5rem", width: "100%", padding: "1rem" }}
          >
            {loading ? "Creating..." : "Add Product to Inventory"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
