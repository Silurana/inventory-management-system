import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScanProduct from "./pages/ScanProduct";
import AddProduct from "./pages/AddProduct";
import SellProduct from "./pages/SellProduct";
import AdminBarcodeGen from "./pages/AdminBarcodeGen";
import "./styles/global.css";
import "./styles/navbar.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="layout">
          <div className="main-content">
            <MainRoutes />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

const MainRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/barcode-gen"
          element={
            <ProtectedRoute>
              <AdminBarcodeGen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
