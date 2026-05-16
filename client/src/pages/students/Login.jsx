import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentLogin() {
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
  const saved = localStorage.getItem("student");
  if (saved) {
    if (window.location.pathname !== "/students/dashboard") {
      navigate("/students/dashboard");
    }
  }
}, [navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/student-login", {
        student_number: studentNumber,
        password,
      });

      if (res.data.status === "success") {
        localStorage.setItem("student", JSON.stringify(res.data.student));
        window.dispatchEvent(new Event("loginStatusChanged"));
        navigate("/students/dashboard");
      } else {
        setMessage(res.data.message || "Invalid student number or password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #92a993ff, #c1d6c8ff)" }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "380px", borderRadius: "15px" }}>
        <h3 className="text-center mb-4" style={{ color: "#477448ff" }}>
          Student Log In
        </h3>

        {message && (
          <p
            className="text-center mb-3"
            style={{ color: "red", fontWeight: 600 }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="text-center">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Student Number"
              className="form-control rounded-pill text-center"
              required
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
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
            className="btn w-100 rounded-pill"
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

export default StudentLogin;
