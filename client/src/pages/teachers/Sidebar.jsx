import { FaHome } from "react-icons/fa";

export default function Sidebar({ teacher, showProfileSidebar }) {
  const hoverStyle = (e, enter) => e.currentTarget.style.background = enter ? "rgba(255,255,255,0.25)" : "transparent";

  const handleLogout = () =>{
    const confirmLogout = window.confirm("Are you sure you wanted to logout?");

    if(confirmLogout){
      localStorage.removeItem("teacher");
      window.location.href="/teachers/login";
    }
  }
  return (
    <>
      <div style={{
        width: "260px", height: "100vh", position: "fixed",
        top: 0, right: showProfileSidebar ? "0" : "-260px",
        background: "#3b5c32", color: "white", padding: "20px", transition: "right 0.3s ease", zIndex: 2000
      }}>
        <h3>Profile</h3>
        {teacher && <>
          <p><strong>Name:</strong> {teacher.fullName}</p>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Department:</strong> {teacher.department}</p>
        </>}
        <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ width: "80px", height: "100vh", position: "fixed", top: 0, left: 0, background: "#40653fff", paddingTop: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "35px", zIndex: 2000 }}>
        <div title="Dashboard" style={{ padding:"12px", borderRadius:"15px", cursor:"pointer" }}
          onMouseEnter={(e)=>hoverStyle(e,true)} onMouseLeave={(e)=>hoverStyle(e,false)}
          onClick={()=>{ window.location.reload(); }}
        ><FaHome size={26} color="white"/></div>
      </div>
    </>
  );
}
