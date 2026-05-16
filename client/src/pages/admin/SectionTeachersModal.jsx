export default function SectionTeachersModal({ show, setShow, section, teachers }) {
  if (!show) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        onClick={() => setShow(false)}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.5)",
          zIndex: 1600
        }}
      ></div>

      {/* Modal box */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "20px",
          width: "400px",
          borderRadius: "10px",
          zIndex: 1700
        }}
      >
        <h4>Teachers for Section {section}</h4>
        {teachers.length > 0 ? (
          <ul>
            {teachers.map(t => (
              <li key={t.teachers_id}>
                <strong>{t.fullname}</strong> - {t.department} - {t.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No teachers assigned.</p>
        )}
        <button
          className="btn btn-secondary w-100 mt-2"
          onClick={() => setShow(false)}
        >
          Close
        </button>
      </div>
    </>
  );
}
