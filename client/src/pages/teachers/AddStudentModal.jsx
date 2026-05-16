import axios from "axios";
import { useState } from "react";

export default function AddStudentModal({ selectedYear, selectedSection, students, setStudents, setShowAddStudentModal }) {
  const [newStudent, setNewStudent] = useState({ fullname: "", student_number: "" });

  const handleAdd = async () => {
    if (!newStudent.fullname || !newStudent.student_number) return alert("Please fill all fields.");

    try {
      const res = await axios.post("http://localhost:5000/add-student", {
        fullname: newStudent.fullname,
        student_number: newStudent.student_number,
        year_level: selectedYear,
        section: selectedSection
      });

      const addedStudent = {
        student_id: res.data.student_id,
        fullname: newStudent.fullname,
        student_number: newStudent.student_number,
        year_level: selectedYear,
        section: selectedSection
      };

      setStudents([...students, addedStudent]);
      alert(`Student added successfully! Assigned password: ${res.data.assigned_password}`);
      setShowAddStudentModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add student.");
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: "fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:3000
    }}>
      <div className="modal-content" style={{ background:"white", padding:"30px", borderRadius:"15px", width:"400px", position:"relative" }}>
        <h4>Add Student</h4>

        <div className="mb-2">
          <label>Full Name</label>
          <input className="form-control" value={newStudent.fullname} onChange={e=>setNewStudent({...newStudent, fullname: e.target.value})}/>
        </div>

        <div className="mb-2">
          <label>Student Number</label>
          <input className="form-control" value={newStudent.student_number} onChange={e=>setNewStudent({...newStudent, student_number: e.target.value})}/>
        </div>

        <div className="mb-2">
          <label>Year Level</label>
          <input className="form-control" value={selectedYear} disabled/>
        </div>

        <div className="mb-2">
          <label>Section</label>
          <input className="form-control" value={selectedSection} disabled/>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-secondary" onClick={()=>setShowAddStudentModal(false)}>Cancel</button>
          <button className="btn btn-success" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
}
