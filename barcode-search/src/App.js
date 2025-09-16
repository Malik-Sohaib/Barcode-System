import React, { useState } from "react";
import RoleSelection from "./RoleSelection";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import ExportDashboard from "./ExportOffice"; // ✅ New export office dashboard

function App() {
  const [currentPage, setCurrentPage] = useState("roleSelection"); // roleSelection | login | dashboard
  const [role, setRole] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null); // ✅ store logged-in user's department

  // Jab role select hota hai
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setCurrentPage("login");
  };

  // Jab login success hota hai
  const handleLoginSuccess = (userRole, department) => {
    setRole(userRole);
    setUserDepartment(department);

    if (userRole === "admin") {
      setCurrentPage("adminDashboard");
    } 
    else if (userRole === "user") {
      // ✅ Export Office user → ExportDashboard
      if (department === "Export Office") {
        setCurrentPage("exportOffice");
      } else {
        setCurrentPage("userDashboard");
      }
    }
  };

  // Logout
  const handleLogout = () => {
    setRole(null);
    setUserDepartment(null);
    setCurrentPage("roleSelection");
  };

  return (
    <div>
      {currentPage === "roleSelection" && (
        <RoleSelection onSelectRole={handleRoleSelect} />
      )}

      {currentPage === "login" && (
        <Login
          role={role}
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setCurrentPage("roleSelection")}
        />
      )}

      {currentPage === "adminDashboard" && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {currentPage === "userDashboard" && (
        <UserDashboard
          onLogout={handleLogout}
          role="user"
          department={userDepartment} // ✅ pass department to UserDashboard
        />
      )}

      {currentPage === "exportDashboard" && (
        <ExportDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
