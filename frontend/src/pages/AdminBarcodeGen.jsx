import { useState } from "react";
import Barcode from "react-barcode";

const AdminBarcodeGen = () => {
  const [text, setText] = useState("");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 className="page-title" style={{ textAlign: "center" }}>
        Barcode Generator
      </h1>
      <div
        className="glass-panel"
        style={{ padding: "2rem", maxWidth: "500px", width: "100%" }}
      >
        <input
          type="text"
          className="input-field"
          placeholder="Enter text/number to generate barcode..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: "2rem" }}
        />

        {text && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Barcode value={text} />
          </div>
        )}

        {!text && (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
            Type above to preview
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminBarcodeGen;
