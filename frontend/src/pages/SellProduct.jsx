import { useState, useRef, useEffect } from "react";
import api from "../utils/api";
import {
  FaTrash,
  FaCheck,
  FaBarcode,
  FaCalculator,
  FaTimes,
} from "react-icons/fa";

const SellProduct = () => {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!barcode) return;

    setLoading(true);
    setError(null);

    try {
      // Check if already in cart
      const existingItem = cart.find(
        (item) => item.product.barcode === barcode
      );

      if (existingItem) {
        // If in cart, assume +1 quantity
        if (existingItem.qty + 1 > existingItem.product.countInStock) {
          setError(`Not enough stock for ${existingItem.product.name}`);
        } else {
          setCart(
            cart.map((item) =>
              item.product.barcode === barcode
                ? { ...item, qty: item.qty + 1 }
                : item
            )
          );
        }
      } else {
        // Fetch from API
        const { data } = await api.get(`/products/barcode/${barcode}`);
        if (data.countInStock > 0) {
          setCart([...cart, { product: data, qty: 1 }]);
        } else {
          setError("Product is out of stock");
        }
      }
      setBarcode("");
    } catch (err) {
      setError("Product not found");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.product._id !== id));
  };

  const updateQty = (id, newQty) => {
    // Logic to check max stock could go here
    const item = cart.find((i) => i.product._id === id);
    if (newQty > item.product.countInStock) {
      alert("Cannot exceed available stock");
      return;
    }
    if (newQty < 1) return;
    setCart(
      cart.map((item) =>
        item.product._id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart
      .reduce((acc, item) => acc + item.product.price * item.qty, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!window.confirm(`Confirm sale of $${calculateTotal()}?`)) return;

    setCheckoutLoading(true);
    try {
      await api.post("/products/sell", { items: cart });
      alert("Sale Successful!");
      setCart([]);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Auto focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="grid-responsive"
      style={{ height: "100%", alignItems: "start" }}
    >
      {/* Left Col: Cart & Scanning */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <h1 className="page-title" style={{ textAlign: "center" }}>
          Point of Sale
        </h1>

        {/* Scanner Input */}
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <FaBarcode size={24} color="var(--primary)" />
          <form onSubmit={handleScan} style={{ flex: 1, display: "flex" }}>
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              placeholder="Scan product barcode..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              autoComplete="off"
            />
          </form>
          {error && (
            <span style={{ color: "#ef4444", fontWeight: "bold" }}>
              {error}
            </span>
          )}
        </div>

        {/* Cart Table */}
        <div className="glass-panel" style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "var(--bg-card)",
              }}
            >
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th style={{ padding: "1rem" }}>Product</th>
                <th style={{ padding: "1rem" }}>Price</th>
                <th style={{ padding: "1rem" }}>Qty</th>
                <th style={{ padding: "1rem" }}>Total</th>
                <th style={{ padding: "1rem" }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr
                  key={item.product._id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "bold" }}>
                      {item.product.name}
                    </div>
                    <div
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      {item.product.barcode}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>${item.product.price}</td>
                  <td style={{ padding: "1rem" }}>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.product._id, parseInt(e.target.value))
                      }
                      style={{ width: "60px", padding: "0.25rem" }}
                    />
                  </td>
                  <td style={{ padding: "1rem" }}>
                    ${(item.product.price * item.qty).toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      className="btn"
                      style={{ color: "#ef4444", padding: "0.5rem" }}
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    Cart is empty. Scan items to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Col: Checkout Summary */}
      <div>
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2
            style={{
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaCalculator /> Summary
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
              fontSize: "1.1rem",
            }}
          >
            <span>Subtotal</span>
            <span>${calculateTotal()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
              fontSize: "1.1rem",
              color: "var(--text-muted)",
            }}
          >
            <span>Tax (0%)</span>
            <span>$0.00</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              borderTop: "1px solid var(--border)",
              paddingTop: "1rem",
            }}
          >
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%", fontSize: "1.2rem", padding: "1rem" }}
            disabled={cart.length === 0 || checkoutLoading}
            onClick={handleCheckout}
          >
            {checkoutLoading ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellProduct;
