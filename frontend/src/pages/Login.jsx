import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
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
        minHeight: "80vh",
      }}
    >
      <div
        className="glass-panel"
        style={{ padding: "3rem", width: "100%", maxWidth: "400px" }}
      >
        <h1 className="page-title" style={{ textAlign: "center" }}>
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>
        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{ color: "var(--primary)", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
