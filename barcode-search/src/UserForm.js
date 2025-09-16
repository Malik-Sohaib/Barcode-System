import React, { useState } from "react";
import './UserForm.css'

export default function UserForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("Apparel");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { username, password, category };

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (data.success) {
        alert("✅ User created successfully!");
        setUsername("");
        setPassword("");
        setCategory("Apparel");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error creating user");
    }
  };

  return (
    <div className="user-form">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Apparel">Apparel</option>
          <option value="Bedding">Bedding</option>
          <option value="Socks">Socks</option>
          <option value="Safety and PPE">Safety and PPE</option>
          <option value="Export Office">Export Office</option>
        </select>

        <button className="submit-btn" type="submit">Create User</button>
      </form>
    </div>
  );
}
