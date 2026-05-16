import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("student");
    if (!saved) return navigate("/student/login");
    const s = JSON.parse(saved);
    setStudent(s);
    fetchGrades(s.id);
  }, []);

  const fetchGrades = async (student_id) => {
    try {
      const res = await axios.get(`http://localhost:5000/student-grades/${student_id}`);
      if (res.data.status === "success") setGrades(res.data.grades);
      else alert(res.data.message || "Failed to fetch grades");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch grades");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    setStudent(null);
    setGrades([]);
    navigate("/student/login");
  };

  if (!student) return null;

  return (
    <div
      className="container-fluid p-4"
      style={{ backgroundColor: "#f0f8f1", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#3b5c32" }}>Welcome, {student.fullname}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h4 style={{ color: "#3b5c32" }}>Your Grades:</h4>
      <div className="row mt-3">
        {grades.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-warning text-center">
              No grades available
            </div>
          </div>
        ) : (
          grades.map((g, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <div className="card shadow-sm border-success">
                <div
                  className="card-header text-white"
                  style={{
                    backgroundColor: g.remarks === "PASSED" ? "#4caf50" : "#f44336",
                    fontWeight: 600,
                  }}
                >
                  {g.semester} Semester
                </div>
                <div className="card-body">
                  <p><strong>Midterm:</strong> {g.midterm || "-"}</p>
                  <p><strong>Final:</strong> {g.final || "-"}</p>
                  <p><strong>Average:</strong> {g.average || "-"}</p>
                  <p>
                    <strong>Remarks:</strong>{" "}
                    <span style={{ color: g.remarks === "PASSED" ? "green" : "red", fontWeight: 600 }}>
                      {g.remarks || "-"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
