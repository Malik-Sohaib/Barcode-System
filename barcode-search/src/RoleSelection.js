import React from "react";
import "./RoleSelection.css";

function RoleSelection({ onSelectRole }) {
  return (
    <div className="role-container">
      <div className="role-box">
        <h2>Select Your Role</h2>
        <button className="role-btn admin" onClick={() => onSelectRole("admin")}>
          Admin
        </button>
        <button className="role-btn user" onClick={() => onSelectRole("user")}>
          User
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;
