import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import YearSectionSelector from "./YearSectionSelector";
import SemesterSelector from "./SemesterSelector";
import StudentsTable from "./StudentsTable";
import AddStudentModal from "./AddStudentModal";
import StudentCredentialsModal from "./StudentCredentialsModal";

export default function Dashboard() {
  const [teacher, setTeacher] = useState(null);
  const [showProfileSidebar, setShowProfileSidebar] = useState(true);

  const [assignments, setAssignments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [semester, setSemester] = useState("");

  const [sectionData, setSectionData] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [credStudent, setCredStudent] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("teacher");
    if (!saved) return (window.location.href = "/teacher-login");
    const t = JSON.parse(saved);
    t.id = Number(t.id);
    setTeacher(t);

    axios
      .get(`http://localhost:5000/teacher-assignments/${t.id}`)
      .then((res) => setAssignments(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const assignedYears = [...new Set(assignments.map((a) => a.year_level))];
  const sectionsForSelectedYear = assignments
    .filter((a) => a.year_level === selectedYear)
    .map((a) => a.section);

useEffect(() => {
  if (!selectedYear || !selectedSection) {
    setSectionData([]);
    setStudents([]);
    return;
  }

  axios
    .get(`http://localhost:5000/assigned-teachers/${selectedYear}/${selectedSection}`)
    .then((res) => setSectionData(res.data || []))
    .catch((err) => console.error(err));

  axios
    .get(`http://localhost:5000/students/${selectedYear}/${selectedSection}`)
    .then(async (res) => {
      const stu = res.data || [];
      const studentMap = new Map();

      for (const s of stu) {
        if (!studentMap.has(s.student_id)) {
          const g = await axios.get(
            `http://localhost:5000/grades/${s.student_id}/${teacher.id}/${semester || "none"}`
          );

          studentMap.set(s.student_id, {
            ...s,
            midterm: g.data?.midterm || "",
            final: g.data?.final || "",
            average: g.data?.average || "",
            remarks: g.data?.remarks || "",
            editing: false,
          });
        }
      }

      setStudents([...studentMap.values()]);
    })
    .catch((err) => console.error(err));
}, [selectedYear, selectedSection, semester, teacher]);

  const updateGrade = (index, field, value) => {
    const updated = [...students];

    let grade = Number(value);
    if (grade < 0){
      grade = 0;
      alert("Grade should not be less than 0 or negative.");
    }
    if (grade > 100){
      grade = 100;
      alert("Grade should not be greater than 100.");
    }
    updated[index][field] = grade;

    const { midterm, final } = updated[index];

    if (!isNaN(midterm) && !isNaN(final)) {
      const avg = (midterm + final) / 2;
      updated[index].average = avg.toFixed(2);
      updated[index].remarks = avg >= 75 ? "PASSED" : "FAILED";
    }
    setStudents(updated);
  };

  const saveRow = async (student) => {
    if (!semester) return alert("Select a semester first.");

    try {
      await axios.post("http://localhost:5000/save-grade-row", {
        student_id: student.student_id,
        teacher_id: teacher.id,
        semester: semester,
        midterm: student.midterm,
        final: student.final,
        average: student.average,
        remarks: student.remarks,
      });

      alert("Saved!");

      const updated = students.map((s) =>
        s.student_id === student.student_id ? { ...s, editing: false } : s
      );
      setStudents(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to save grade.");
    }
  };

  const handleDeleteStudent = async (student_id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(`http://localhost:5000/delete-student/${student_id}`);
      setStudents(students.filter((s) => s.student_id !== student_id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete student.");
    }
  };

  const handleShowCredentials = (student) => {
    setCredStudent(student);
  };


  const filteredStudents = students.filter(
    (s) =>
      s.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.student_number || "").includes(searchTerm)
  );

  return (
    <>
      <Sidebar teacher={teacher} showProfileSidebar={showProfileSidebar} />

      <div className="flex-grow-1" style={{ marginLeft: "80px", padding: "1.5rem" }}>
        <div
          style={{
            background: "#eef5e9",
            padding: "25px",
            borderRadius: "15px",
            width: "78vw",
            minHeight: "80vh",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <YearSectionSelector
            assignedYears={assignedYears}
            sectionsForSelectedYear={sectionsForSelectedYear}
            selectedYear={selectedYear}
            selectedSection={selectedSection}
            setSelectedYear={setSelectedYear}
            setSelectedSection={setSelectedSection}
          />

          {selectedSection && <SemesterSelector semester={semester} setSemester={setSemester} />}

          {selectedSection && sectionData.length > 0 && (
            <>
              <div className="d-flex mb-3 gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or student number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={() => setShowAddStudentModal(true)}
                >
                  Add Student
                </button>
              </div>

              <StudentsTable
                students={filteredStudents}
                updateGrade={updateGrade}
                handleDeleteStudent={handleDeleteStudent}
                saveRow={saveRow}
                setStudents={setStudents}
                handleShowCredentials={handleShowCredentials}
              />
            </>
          )}
        </div>
      </div>

      {showAddStudentModal && (
        <AddStudentModal
          selectedYear={selectedYear}
          selectedSection={selectedSection}
          students={students}
          setStudents={setStudents}
          setShowAddStudentModal={setShowAddStudentModal}
        />
      )}

      {credStudent && (
        <StudentCredentialsModal
          student={credStudent}
          onClose={() => setCredStudent(null)}
        />
      )}
    </>
  );
}
