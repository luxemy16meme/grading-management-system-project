import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [teacher, setTeacher] = useState({
    fullname: "",
    email: "",
    password: "",
    department: ""
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher({ ...teacher, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/register-teacher", teacher);
    alert(res.data.message);
    setTeacher({ fullname: "", email: "", password: "", department: "" });
    navigate("/teachers/login");
  } catch (err) {
    console.error("Error:", err);
    alert("Failed to connect to the server");
    console.error("Error connecting to server:", err.message);

  }
};


  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#92a993ff" }}
      >
        <div
          className="card p-4 shadow-sm"
          style={{
            width: "350px",
            color: "#477448ff",
          }}
        >
          <form className="text-center" onSubmit={handleSubmit}>
            <h3>Teacher Register</h3>

            <div className="mb-3">
              <input
                type="text"
                name="fullname"
                value={teacher.fullname}
                placeholder="Full Name"
                onChange={handleChange}
                className="form-control rounded-pill text-center"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={teacher.email}
                onChange={handleChange}
                placeholder="Email"
                className="form-control rounded-pill text-center"
                required
              />
            </div>

            <div className="mb-3">
              <select
                className="form-control rounded-pill text-center"
                name="department"
                value={teacher.department}
                onChange={handleChange}
                style={{ color: "#477448ff" }}
                required
              >
                <option value="">Select Department</option>
                <option value="HM">HM</option>
                <option value="IT">IT</option>
                <option value="Education">Education</option>
                <option value="Agribusiness">Agribusiness</option>
              </select>
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={teacher.password}
                onChange={handleChange}
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
              Register
            </button>
          </form>

          <p className="text-center mt-2">
            Already have an account?{" "}
            <a
              href="#"
              style={{
                color: "#477448ff",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              Login here.
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
