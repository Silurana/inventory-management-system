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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          className="page-title"
          style={{ margin: 0, textAlign: "center", flex: 1 }}
        >
          Dashboard
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-product")}
        >
          <FaPlus style={{ marginRight: "0.5rem" }} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <th style={{ padding: "1rem" }}>Name</th>
              <th style={{ padding: "1rem" }}>Barcode</th>
              <th style={{ padding: "1rem" }}>Price</th>
              <th style={{ padding: "1rem" }}>Stock</th>
              <th style={{ padding: "1rem" }}>Category</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ padding: "2rem", textAlign: "center" }}
                >
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ padding: "2rem", textAlign: "center" }}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={{ padding: "1rem" }}>{product.name}</td>
                  <td style={{ padding: "1rem", fontFamily: "monospace" }}>
                    {product.barcode}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    ${product.price.toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem" }}>{product.countInStock}</td>
                  <td style={{ padding: "1rem" }}>{product.category}</td>
                  <td style={{ padding: "1rem" }}>
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
    </div>
  );
};

export default Dashboard;
