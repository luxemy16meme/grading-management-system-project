import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/login-teacher", {
      email,
      password,
    });

    if (res.data.status === "pending") {
      setMessage("Your account is waiting for approval.");
      return;
    }

    if (res.data.status === "fail") {
      setMessage(res.data.message || "Login failed.");
      return;
    }

    if (res.data.status === "success") {
      localStorage.setItem("teacher", JSON.stringify(res.data.teacher));
      
      window.dispatchEvent(new Event("loginStatusChanged"));

      navigate("/teachers/dashboard");
      return;
    }

  } catch (err) {
    setMessage("Login failed.");
  }
};


  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#92a993ff" }}
    >
      <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
        <h3 className="text-center mb-3" style={{ color: "#477448ff" }}>
          Teacher Log In
        </h3>

        {message && (
          <p
            className="text-center mb-3"
            style={{
              color: message.includes("waiting") ? "orange" : "red",
              fontWeight: "600"
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="text-center">
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control rounded-pill text-center"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control rounded-pill text-center"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn rounded-pill w-100"
            style={{
              backgroundColor: "#a5d6a7",
              color: "#477448ff",
              fontWeight: "600",
              border: "none"
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
