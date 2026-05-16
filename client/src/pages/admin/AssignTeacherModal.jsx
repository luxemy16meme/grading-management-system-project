import { useEffect } from "react";
import axios from "axios";

export default function AssignTeacherModal({
  show,
  setShow,
  modalYear,
  setModalYear,
  modalSection,
  setModalSection,
  modalSelectedTeacher,
  setModalSelectedTeacher,
  modalAssignedTeachers,
  setModalAssignedTeachers,
  approvedTeachers,
  sections,
  sectionAssignments,
  setSectionAssignments
}) {

  useEffect(() => {
    if (modalYear && modalSection) {
      axios.get(`http://localhost:5000/assigned-teachers/${modalYear}/${modalSection}`)
        .then(res => setModalAssignedTeachers(res.data))
        .catch(() => setModalAssignedTeachers([]));
    }
  }, [modalYear, modalSection, setModalAssignedTeachers]);

  const handleSaveAssignment = async (e) => {
    e.preventDefault();

    if (!modalSelectedTeacher || !modalYear || !modalSection) {
      alert("Please select teacher, year, and section");
      return;
    }

    try {
      await axios.post("http://localhost:5000/assign-teacher", {
        teachers_id: modalSelectedTeacher.teachers_id,
        year_level: modalYear,
        section: modalSection
      });

      alert(`${modalSelectedTeacher.fullname} assigned to ${modalYear} - Section ${modalSection}!`);

      const newAssignments = {};
      for (const sec of sections) {
        try {
          const res = await axios.get(`http://localhost:5000/assigned-teachers/${modalYear}/${sec}`);
          newAssignments[sec] = res.data || [];
        } catch {
          newAssignments[sec] = [];
        }
      }
      setSectionAssignments(newAssignments);

      setModalSelectedTeacher(null);
      setShow(false);
    } catch (err) {
      console.error(err);
      alert("Failed to assign teacher.");
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        onClick={() => setShow(false)}
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.5)", zIndex: 1600
        }}
      ></div>

      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        width: "450px",
        borderRadius: "10px",
        zIndex: 1700
      }}>
        <h4>Assign Teacher</h4>
        <form onSubmit={handleSaveAssignment}>
          <select
            className="form-control mt-3"
            value={modalYear}
            onChange={(e) => setModalYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {["1","2","3","4"].map(y => <option key={y} value={y}>{y} Year</option>)}
          </select>

          <select
            className="form-control mt-3"
            value={modalSection}
            onChange={(e) => setModalSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {modalYear && modalSection && (
            <>
              <h5 className="mt-3">Already Assigned</h5>
              <ul style={{ maxHeight: "100px", overflowY: "auto" }}>
                {modalAssignedTeachers.length > 0
                  ? modalAssignedTeachers.map(t => <li key={t.teachers_id}>{t.fullname} ({t.department})</li>)
                  : <li>No teachers assigned yet.</li>}
              </ul>
            </>
          )}

          <h5 className="mt-3">Select Teacher</h5>
          <select
            className="form-control"
            value={modalSelectedTeacher?.teachers_id || ""}
            onChange={(e) => {
              const t = approvedTeachers.find(a => a.teachers_id === parseInt(e.target.value));
              setModalSelectedTeacher(t);
            }}
          >
            <option value="">Select Teacher</option>
            {approvedTeachers.map(t => {
              const isAssigned = modalAssignedTeachers.some(a => a.teachers_id === t.teachers_id);
              return (
                <option key={t.teachers_id} value={t.teachers_id} disabled={isAssigned}>
                  {t.fullname} {isAssigned ? "(Already Assigned)" : ""}
                </option>
              );
            })}
          </select>

          <button className="btn btn-success w-100 mt-3" type="submit">Save Assignment</button>
          <button className="btn btn-secondary w-100 mt-2" type="button" onClick={() => setShow(false)}>Cancel</button>
        </form>
      </div>
    </>
  );
}
