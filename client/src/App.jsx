import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterT from "./pages/teachers/Register";
import LoginT from "./pages/teachers/Login";
import LoginS from "./pages/students/Login";
import LoginA from "./pages/admin/Login";
import DashboardA from "./pages/admin/Dashboard";
import DashboardT from "./pages/teachers/Dashboard";
import DashboardS from "./pages/students/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
      const admin = localStorage.getItem("admin");
      const teacher = localStorage.getItem("teacher");
      const student = localStorage.getItem("student");

      setLoggedIn(!!(admin || teacher || student));

      const handler = () => {
        const admin = localStorage.getItem("admin");
        const teacher = localStorage.getItem("teacher");
        const student = localStorage.getItem("student");
        setLoggedIn(!!(admin || teacher || student));
      };

      window.addEventListener("loginStatusChanged", handler);
      return () => window.removeEventListener("loginStatusChanged", handler);
    }, []);

  return (
    <Router>
      <div>
        {!loggedIn && (
          <nav style={{ margin: "20px" }}>
            <Link to="/students/login" style={{ marginRight: "10px", textDecoration: "none" }}>Student Login</Link>
            <Link to="/teachers/login" style={{ marginRight: "10px", textDecoration: "none" }}>Teacher Login</Link>
            <Link to="/teachers/register" style={{ marginRight: "10px", textDecoration: "none" }}>Teacher Register</Link>
            <Link to="/admin/login" style={{ marginRight: "10px", textDecoration: "none" }}>Admin Login</Link>
          </nav>
        )}

        <Routes>
          <Route path="/students/login" element={<LoginS />} />
          <Route path="/teachers/login" element={<LoginT />} />
          <Route path="/teachers/register" element={<RegisterT />} />
          <Route path="/admin/login" element={<LoginA />} />

          <Route path="/admin/dashboard" element={<DashboardA />} />
          <Route path="/teachers/dashboard" element={<DashboardT />} />
          <Route path="/students/dashboard" element={<DashboardS />} />

          <Route
            path="*"
            element={
              <div
                className="d-flex flex-column justify-content-center align-items-center vh-100"
                style={{
                  background: "linear-gradient(to right, #92a993ff, #c1d6c8ff)",
                  color: "#477448ff",
                  textAlign: "center",
                }}
              >
                <h1 className="mb-4">Welcome to Grading System</h1>
                <p className="mb-4" style={{ fontSize: "1.2rem" }}>Please select your login:</p>
                <div className="d-flex gap-3">
                  <Link to="/students/login" className="btn btn-success btn-lg" style={{ fontWeight: 600 }}>Student Login</Link>
                  <Link to="/teachers/login" className="btn btn-primary btn-lg" style={{ fontWeight: 600 }}>Teacher Login</Link>
                  <Link to="/admin/login" className="btn btn-danger btn-lg" style={{ fontWeight: 600 }}>Admin Login</Link>
                </div>
              </div>
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
