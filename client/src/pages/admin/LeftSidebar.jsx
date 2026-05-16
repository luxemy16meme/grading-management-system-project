import { FaHome, FaGraduationCap, FaBook, FaClipboardList, FaUsers, FaPowerOff } from "react-icons/fa";

export default function LeftSidebar({
  yearLevels,
  selectedYear,
  setSelectedYear,
  setSelectedSection,
}) {
  const hoverStyle = (e, enter) => {
    e.currentTarget.style.background = enter
      ? "rgba(255,255,255,0.25)"
      : "transparent";
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you wanted to logout?");
    if(confirmLogout){
      localStorage.removeItem("admin");
      window.location.href = "/admin/login"; 
    }
  }

  return (
    <div
      style={{
        width: "80px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#40653fff",
        paddingTop: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "35px",
        zIndex: 2000,
        justifyContent: "space-between", // distribute top icons and logout at bottom
        paddingBottom: "20px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
        {/* Home Button */}
        <div
          title="Home"
          style={{ padding: "12px", borderRadius: "15px", cursor: "pointer" }}
          onMouseEnter={(e) => hoverStyle(e, true)}
          onMouseLeave={(e) => hoverStyle(e, false)}
          onClick={() => {
            setSelectedYear(null);      // reset selected year
            setSelectedSection(null);   // reset selected section
          }}
        >
          <FaHome size={26} color="white" />
        </div>

        {yearLevels.map((year, index) => {
          const icons = [FaGraduationCap, FaBook, FaClipboardList, FaUsers];
          const Icon = icons[index];

          return (
            <div
              key={year.value}
              title={year.label}
              style={{ padding: "12px", borderRadius: "15px", cursor: "pointer" }}
              onMouseEnter={(e) => hoverStyle(e, true)}
              onMouseLeave={(e) => hoverStyle(e, false)}
              onClick={() => setSelectedYear(year.value)}
            >
              <Icon size={26} color="white" />
            </div>
          );
        })}
      </div>

      <div
        title="Logout"
        style={{ padding: "12px", borderRadius: "15px", cursor: "pointer" }}
        onMouseEnter={(e) => hoverStyle(e, true)}
        onMouseLeave={(e) => hoverStyle(e, false)}
        onClick={handleLogout}
      >
        <FaPowerOff size={26} color="white" />
      </div>
    </div>
  );
}
