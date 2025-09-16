import React, { useState } from "react";
import "./UserForm.css";

function UserForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role: "user",
          category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ User created successfully!");
        setUsername("");
        setPassword("");
        setCategory("Apparel");
      } else {
        setMessage(data.message || "❌ Error creating user");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Error creating user");
    }
  };

  return (
    <div className="user-form-container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} className="user-form">
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="Apparel">Apparel</option>
          <option value="Gloves/PPE">Gloves/PPE</option>
          <option value="Bedding">Bedding</option>
          <option value="Socks">Socks</option>
        </select>
        <button type="submit" className="submit-btn">
          Add User
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UserForm;
