import React, { useState, useEffect } from "react";
import RoleSelection from "./RoleSelection";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import ExportDashboard from "./ExportOffice"; // ✅ New export office dashboard
import { getProducts } from "./api"; // ✅ Backend API

function App() {
  const [currentPage, setCurrentPage] = useState("roleSelection"); // roleSelection | login | dashboard
  const [role, setRole] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null); // ✅ store logged-in user's department
  const [products, setProducts] = useState([]); // ✅ store fetched products

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
      if (department === "Export Office") {
        setCurrentPage("exportDashboard");
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
    setProducts([]); // reset products on logout
  };

  // ✅ Fetch products from backend when user logs in (only for user or export roles)
  useEffect(() => {
    if (role === "user" || role === "export") {
      getProducts({ department: userDepartment })
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
  }, [role, userDepartment]);

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
        <AdminDashboard onLogout={handleLogout} products={products} />
      )}

      {currentPage === "userDashboard" && (
        <UserDashboard
          onLogout={handleLogout}
          role="user"
          department={userDepartment}
          products={products} // ✅ pass products to UserDashboard
        />
      )}

      {currentPage === "exportDashboard" && (
        <ExportDashboard onLogout={handleLogout} products={products} />
      )}
    </div>
  );
}

export default App;
