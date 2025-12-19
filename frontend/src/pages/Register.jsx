import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      navigate("/");
    } else {
      alert(res.error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "1rem 0",
      }}
    >
      <div
        className="glass-panel"
        style={{ padding: "2rem", width: "100%", maxWidth: "400px" }}
      >
        <h1
          className="page-title"
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          Register
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "1rem", marginTop: "0.5rem" }}
          >
            Sign Up
          </button>
        </form>
        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.95rem",
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
