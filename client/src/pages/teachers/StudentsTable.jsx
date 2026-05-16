import { FaTrash } from "react-icons/fa";

export default function StudentsTable({
  students,
  updateGrade,
  handleDeleteStudent,
  setStudents,
  saveRow,
  handleShowCredentials
}) {
  return (
    <div
      style={{
        marginTop: "20px",
        width: "100%",
        minHeight: "55vh",
        background: "white",
        borderRadius: "15px",
        border: "2px solid #40653f55",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      {students.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Midterm</th>
              <th>Final</th>
              <th>Average</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
  {students.map((s, idx) => (
    <tr key={`${s.student_id}-${idx}`}>
      <td>{s.fullname}</td>

      <td>
        <input
          type="number"
          className="form-control"
          value={s.midterm || ""}
          disabled={!s.editing}
          onChange={(e) => updateGrade(idx, "midterm", e.target.value)}
        />
      </td>

      <td>
        <input
          type="number"
          className="form-control"
          value={s.final || ""}
          disabled={!s.editing}
          onChange={(e) => updateGrade(idx, "final", e.target.value)}
        />
      </td>

      <td>{s.average || ""}</td>

      <td
        style={{
          color:
            s.remarks === "PASSED"
              ? "green"
              : s.remarks === "FAILED"
              ? "red"
              : "black",
          fontWeight: 600,
        }}
      >
        {s.remarks || ""}
      </td>

      <td style={{ width: "260px" }}>
        {!s.editing ? (
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => {
              const updated = [...students];
              updated[idx].editing = true;
              setStudents(updated);
            }}
          >
            Edit
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => saveRow(s)}
          >
            Save
          </button>
        )}

        <button
          className="btn btn-info btn-sm me-2"
          onClick={() => handleShowCredentials(s)}
        >
          Credentials
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDeleteStudent(s.student_id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      ) : (
        <p style={{ marginTop: "60px", color: "#777" }}>No students found.</p>
      )}
    </div>
  );
}
