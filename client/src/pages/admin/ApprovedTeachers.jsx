export default function ApprovedTeachers({ approvedTeachers, setShowAssignModal, setModalSelectedTeacher }) {
  return (
    <>
      <h3 className="mt-4">Professors</h3>
      <div style={{
        backgroundColor: "#98c696ff",
        borderRadius: "20px",
        padding: "5px",
        height: "30vh",
        width: "90vw",
        overflowX: "auto",
        whiteSpace: "nowrap"
      }}>
        <div className="d-inline-flex gap-4">
          {approvedTeachers.length > 0
            ? approvedTeachers.map(t => (
              <div key={t.teachers_id} className="card shadow-sm mt-2" style={{ backgroundColor: "#fff", width: "300px", height: "25vh", padding: "12px", flexShrink: 0 }}>
                <h5>{t.fullname}</h5>
                <h6>Department: {t.department}</h6>
                <p>Email: {t.email}</p>
                <button className="btn btn-success w-100 mt-2" onClick={() => { setModalSelectedTeacher(t); setShowAssignModal(true); }}>Assign Year & Section</button>
              </div>
            ))
            : <p className="mt-2 ms-3">No approved teachers found.</p>}
        </div>
      </div>
    </>
  );
}
