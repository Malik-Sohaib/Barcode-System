import React, { useState, useEffect } from "react";
import Search from "./Search";
import Form from "./AddProduct";
import UserForm from "./UserForm";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("search");
  const [users, setUsers] = useState([]);

  // Load all users
  useEffect(() => {
    if (activePage === "viewUsers") {
      fetchUsers();
    }
  }, [activePage]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u) => u._id !== id));
      }
    } catch (error) {
      console.error("❌ Error deleting user:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="top-bar">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="nav-buttons">
          <button
            className={`nav-btn ${activePage === "search" ? "active" : ""}`}
            onClick={() => setActivePage("search")}
          >
            🔍 Search
          </button>
          <button
            className={`nav-btn ${activePage === "addProduct" ? "active" : ""}`}
            onClick={() => setActivePage("addProduct")}
          >
            ➕ Add Product
          </button>
          <button
            className={`nav-btn ${activePage === "addUser" ? "active" : ""}`}
            onClick={() => setActivePage("addUser")}
          >
            👤 Add User
          </button>
          <button
            className={`nav-btn ${activePage === "viewUsers" ? "active" : ""}`}
            onClick={() => setActivePage("viewUsers")}
          >
            📋 View Users
          </button>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Search component me role="admin" pass kar diya */}
        {activePage === "search" && <Search role="admin" />}
        {activePage === "addProduct" && <Form />}
        {activePage === "addUser" && <UserForm />}
        {activePage === "viewUsers" && (
          <div className="user-list">
            <h2>All Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.category}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
