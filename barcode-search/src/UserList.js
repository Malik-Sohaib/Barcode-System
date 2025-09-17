import React, { useEffect, useState } from "react";
import "./UserList.css";

// ✅ Backend URL from .env
const BASE_URL = process.env.REACT_APP_API_URL;

function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch(`${BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch((err) => console.error("❌ Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    }
  };

  return (
    <div className="user-list">
      <h2>Registered Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.category}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
