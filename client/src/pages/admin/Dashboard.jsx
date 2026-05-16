import { useState, useEffect } from "react";
import axios from "axios";

import LeftSidebar from "./LeftSidebar";
import PendingTeachers from "./PendingTeachers";
import ApprovedTeachers from "./ApprovedTeachers";
import YearSectionSelector from "./YearSectionSelector";
import AssignTeacherModal from "./AssignTeacherModal";
import SectionTeachersModal from "./SectionTeachersModal"; 

export default function Dashboard() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);

  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false); 

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionAssignments, setSectionAssignments] = useState({});

  const [modalYear, setModalYear] = useState("");
  const [modalSection, setModalSection] = useState("");
  const [modalSelectedTeacher, setModalSelectedTeacher] = useState(null);
  const [modalAssignedTeachers, setModalAssignedTeachers] = useState([]);
  const [currentSectionTeachers, setCurrentSectionTeachers] = useState([]);

  const yearLevels = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
  ];
  const sections = ["A", "B", "C", "D", "E"];

  useEffect(() => {
    axios.get("http://localhost:5000/pending-teachers")
      .then(res => setPendingTeachers(res.data));

    axios.get("http://localhost:5000/approved-teachers")
      .then(res => setApprovedTeachers(res.data));
  }, []);


  useEffect(() => {
    if (!selectedYear) return;

    const fetchAssignments = async () => {
      const newAssignments = {};
      for (const sec of sections) {
        try {
          const res = await axios.get(`http://localhost:5000/assigned-teachers/${selectedYear}/${sec}`);
          newAssignments[sec] = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
        } catch (err) {
          newAssignments[sec] = [];
        }
      }
      setSectionAssignments(newAssignments);
    };

    fetchAssignments();
  }, [selectedYear]);

const handleSectionClick = async (sec) => {
  setSelectedSection(sec);

  try {
    const res = await axios.get(`http://localhost:5000/assigned-teachers/${selectedYear}/${sec}`);
    setCurrentSectionTeachers(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (err) {
    setCurrentSectionTeachers([]);
  }

  // Open modal
  setShowSectionModal(true);
};


  return (
    <>
      <LeftSidebar
        yearLevels={yearLevels}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />



      <AssignTeacherModal
        show={showAssignModal}
        setShow={setShowAssignModal}
        modalYear={modalYear}
        setModalYear={setModalYear}
        modalSection={modalSection}
        setModalSection={setModalSection}
        modalSelectedTeacher={modalSelectedTeacher}
        setModalSelectedTeacher={setModalSelectedTeacher}
        modalAssignedTeachers={modalAssignedTeachers}
        setModalAssignedTeachers={setModalAssignedTeachers}
        approvedTeachers={approvedTeachers}
        sections={sections}
        sectionAssignments={sectionAssignments}
        setSectionAssignments={setSectionAssignments}
      />

      <SectionTeachersModal
        show={showSectionModal}
        setShow={setShowSectionModal}
        section={selectedSection}
        teachers={currentSectionTeachers}
      />

      <div style={{ marginLeft: "90px", padding: "20px" }}>
        {selectedYear ? (
          <YearSectionSelector
            selectedYear={selectedYear}
            sectionAssignments={sectionAssignments}
            sections={sections}
            yearLevels={yearLevels}
            handleSectionClick={handleSectionClick} 
          />
        ) : (
          <>
            <PendingTeachers
              pendingTeachers={pendingTeachers}
              setPendingTeachers={setPendingTeachers}
            />
            <ApprovedTeachers
              approvedTeachers={approvedTeachers}
              setShowAssignModal={setShowAssignModal}
              setModalSelectedTeacher={setModalSelectedTeacher}
            />
          </>
        )}
      </div>
    </>
  );
}
