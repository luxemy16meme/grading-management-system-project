import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login-admin", admin);

      if (res.data.status === "success") {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        window.dispatchEvent(new Event("loginStatusChanged"));

        navigate("/admin/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#92a993ff" }}
    >
      <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
        <h3 className="text-center mb-4" style={{ color: "#477448ff" }}>
          Admin Log In
        </h3>

        <form className="text-center" onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              onChange={handleChange}
              value={admin.email}
              placeholder="Email"
              className="form-control rounded-pill text-center"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={admin.password}
              placeholder="Password"
              className="form-control rounded-pill text-center"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary rounded-pill w-100"
            style={{
              backgroundColor: "#a5d6a7",
              color: "#477448ff",
              fontWeight: "600",
              border: "none",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
