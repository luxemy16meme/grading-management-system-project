export default function StudentCredentialsModal({ student, onClose }) {
  if (!student) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          width: "380px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.2s ease-in-out",
        }}
      >
        <h4 style={{ marginBottom: "20px" }}>Student Credentials</h4>

        <p><strong>Name:</strong> {student.fullname}</p>

        <p>
          <strong>Student Number:</strong> {student.student_number}
          <button
            className="btn btn-secondary btn-sm ms-2"
            onClick={() => copyToClipboard(student.student_number)}
          >
            Copy
          </button>
        </p>

        <p>
          <strong>Password:</strong> {student.password}
          <button
            className="btn btn-secondary btn-sm ms-2"
            onClick={() => copyToClipboard(student.password)}
          >
            Copy
          </button>
        </p>

        <div className="text-end mt-4">
          <button className="btn btn-dark" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
