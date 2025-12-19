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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!barcode) return;

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
    } catch {
      setError("Product not found");
    } finally {
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
      style={{ alignItems: "start", gap: "2rem" }}
    >
      {/* Left Col: Cart & Scanning */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>
          Point of Sale
        </h1>

        {/* Scanner Input */}
        <div
          className="glass-panel"
          style={{
            padding: "1rem 1.5rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <FaBarcode size={24} style={{ color: "var(--primary)" }} />
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
        </div>

        {error && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "0.9rem",
              fontWeight: "600",
              padding: "0 0.5rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Desktop Cart Table */}
        <div className="table-container desktop-only">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th style={{ width: "50px" }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product._id}>
                  <td>
                    <div style={{ fontWeight: "600" }}>{item.product.name}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        fontFamily: "monospace",
                      }}
                    >
                      {item.product.barcode}
                    </div>
                  </td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="input-field"
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.product._id, parseInt(e.target.value))
                      }
                      style={{
                        width: "65px",
                        padding: "0.4rem",
                        textAlign: "center",
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: "600" }}>
                    ${(item.product.price * item.qty).toFixed(2)}
                  </td>
                  <td>
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
                      padding: "4rem 2rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    <FaBarcode
                      size={32}
                      style={{ marginBottom: "1rem", opacity: 0.2 }}
                    />
                    <p>Cart is empty. Scan items to begin.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cart Card View */}
        <div className="mobile-only">
          {cart.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: "3rem 1rem",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              <FaBarcode
                size={40}
                style={{ marginBottom: "1rem", opacity: 0.2 }}
              />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="mobile-card"
                  style={{ marginBottom: 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: "600" }}>
                        {item.product.name}
                      </h4>
                      <code
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {item.product.barcode}
                      </code>
                    </div>
                    <button
                      className="btn"
                      style={{
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.05)",
                        padding: "0.4rem",
                      }}
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Qty:
                      </span>
                      <input
                        type="number"
                        min="1"
                        className="input-field"
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item.product._id, parseInt(e.target.value))
                        }
                        style={{
                          width: "60px",
                          padding: "0.3rem",
                          fontSize: "0.9rem",
                          textAlign: "center",
                        }}
                      />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Total
                      </div>
                      <div
                        style={{ fontWeight: "700", color: "var(--primary)" }}
                      >
                        ${(item.product.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Col: Checkout Summary */}
      <div style={{ position: "sticky", top: "120px" }}>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "1.25rem",
            }}
          >
            <FaCalculator style={{ color: "var(--primary)" }} /> Summary
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
              fontSize: "1rem",
              color: "var(--text-muted)",
            }}
          >
            <span>Items ({cart.reduce((acc, i) => acc + i.qty, 0)})</span>
            <span>${calculateTotal()}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
              fontSize: "1.5rem",
              fontWeight: "700",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
              color: "var(--text-main)",
            }}
          >
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%", fontSize: "1.1rem", padding: "1rem" }}
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
