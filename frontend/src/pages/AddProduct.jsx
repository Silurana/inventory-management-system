import { useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext"; 

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
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 className="page-title" style={{ textAlign: "center" }}>
        Add New Product
      </h1>
      <div className="glass-panel" style={{ padding: "2rem" }}>
        {error && (
          <div
            style={{
              color: "#ef4444",
              marginBottom: "1rem",
              background: "rgba(239, 68, 68, 0.1)",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
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
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
              }}
            >
              Barcode
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                name="barcode"
                required
                className="input-field"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Scan or type..."
              />
              <button
                type="button"
                className="btn"
                style={{ border: "1px solid var(--border)" }}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-muted)",
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
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-muted)",
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
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
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
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
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
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
