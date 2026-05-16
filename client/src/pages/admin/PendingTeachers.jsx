import axios from "axios"; 

export default function PendingTeachers({ pendingTeachers, setPendingTeachers }) {

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/approve-teacher/${id}`);
      setPendingTeachers(prev => prev.filter(t => t.teachers_id !== id));
      alert("Teacher approved!");
    } catch (err) { 
      console.error(err);
      alert("Failed to approve."); 
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reject-teacher/${id}`);
      setPendingTeachers(prev => prev.filter(t => t.teachers_id !== id));
      alert("Teacher rejected!");
    } catch (err) { 
      console.error(err);
      alert("Failed to reject."); 
    }
  };

  return (
    <>
      <h3 className="mt-4">Pending Requests</h3>
      <div style={{
        backgroundColor: "#98c696ff",
        borderRadius: "10px",
        padding: "10px",
        height: "30vh",
        width: "90vw",
        overflowX: "auto",
        whiteSpace: "nowrap"
      }}>
        <div className="d-inline-flex gap-4">
          {pendingTeachers.length > 0
            ? pendingTeachers.map(t => (
              <div key={t.teachers_id} className="card shadow-sm mt-2" style={{ backgroundColor: "#d5d5d5ff", width: "300px", padding: "12px", flexShrink: 0 }}>
                <h5>{t.fullname}</h5>
                <h6>Department: {t.department}</h6>
                <p>Email: {t.email}</p>
                <div className="btn btn-group mt-2">
                  <button className="btn btn-danger" onClick={() => handleReject(t.teachers_id)}>Reject</button>
                  <button className="btn btn-success" onClick={() => handleApprove(t.teachers_id)}>Approve</button>
                </div>
              </div>
            ))
            : <p className="mt-2 ms-3">No pending requests found.</p>}
        </div>
      </div>
    </>
  );
}
