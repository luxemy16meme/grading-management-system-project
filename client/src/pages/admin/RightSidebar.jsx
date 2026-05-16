import { useEffect, useState } from "react";
import axios from "axios";

export default function RightSidebar() {
  const [adminInfo, setAdminInfo] = useState(null);

  // Fetch logged-in admin details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/current-admin", {
          withCredentials: true, // needed for session cookies
        });
        setAdminInfo(res.data.admin);
      } catch (err) {
        console.error("Failed to fetch admin info", err);
        setAdminInfo(null);
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
      alert("Failed to logout");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100vh",
        background: "#f5f5f5",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
        padding: "20px",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h4>Admin Profile</h4>
        {adminInfo ? (
          <>
            <p><strong>{adminInfo.fullName}</strong></p>
            <p>{adminInfo.email}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div>
        <button className="btn btn-danger w-100 mb-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
