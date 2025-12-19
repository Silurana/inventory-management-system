import { useState } from "react";
import Barcode from "react-barcode";

const AdminBarcodeGen = () => {
  const [text, setText] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h1 className="page-title">Barcode Generator</h1>
      <div
        className="glass-panel"
        style={{ padding: "1.5rem", maxWidth: "500px", width: "100%" }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Data to Encode
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter text or number..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {text ? (
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              overflowX: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Barcode value={text} width={1.8} height={80} fontSize={14} />
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "2rem",
              border: "2px dashed var(--border)",
              borderRadius: "12px",
            }}
          >
            Type above to preview barcode
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBarcodeGen;
