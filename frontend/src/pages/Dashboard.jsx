import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_NETWORK") {
        alert(
          "Cannot connect to server. Please check if backend is running and MongoDB URI is correct in .env"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="flex-responsive" style={{ marginBottom: "2rem" }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          Dashboard
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-product")}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="table-container desktop-only">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Barcode</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th style={{ width: "80px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td style={{ fontFamily: "monospace" }}>{product.barcode}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.countInStock}</td>
                  <td>{product.category}</td>
                  <td>
                    <button
                      className="btn"
                      style={{ padding: "0.5rem", color: "#ef4444" }}
                      onClick={() => handleDelete(product._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="mobile-only">
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="mobile-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      color: "var(--text-main)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {product.name}
                  </h3>
                  <code
                    style={{ fontSize: "0.75rem", color: "var(--primary)" }}
                  >
                    {product.barcode}
                  </code>
                </div>
                <button
                  className="btn"
                  style={{
                    padding: "0.5rem",
                    color: "#ef4444",
                    background: "rgba(239, 68, 68, 0.1)",
                  }}
                  onClick={() => handleDelete(product._id)}
                >
                  <FaTrash />
                </button>
              </div>

              <div className="mobile-card-row">
                <span className="mobile-card-label">Category</span>
                <span
                  className="mobile-card-value"
                  style={{ fontSize: "0.85rem" }}
                >
                  {product.category}
                </span>
              </div>

              <div
                className="mobile-card-row"
                style={{
                  marginTop: "0.5rem",
                  borderTop: "1px solid var(--border-light)",
                  paddingTop: "0.75rem",
                }}
              >
                <div>
                  <div className="mobile-card-label">Price</div>
                  <div className="mobile-card-value">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mobile-card-label">Stock Status</div>
                  <div
                    className={`mobile-card-value`}
                    style={{
                      color: product.countInStock < 10 ? "#f59e0b" : "#10b981",
                    }}
                  >
                    {product.countInStock} units
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
