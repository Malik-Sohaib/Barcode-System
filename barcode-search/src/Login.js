import React, { useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import ExportOffice from "./ExportOffice";

import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  // Backend URL from .env
  const BASE_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/login`, {
        username,
        password,
      });

      if (res.data.success) {
        // Admin form me user credentials use na ho
        if (res.data.role === "admin" && res.data.category) {
          return setError("❌ Admin login ke liye sirf admin credentials use karein");
        }

        setUserData(res.data);
        setLoggedIn(true);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("❌ Invalid credentials or server error");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserData(null);
    setUsername("");
    setPassword("");
  };

  if (loggedIn && userData) {
    if (userData.role === "admin") {
      return <AdminDashboard onLogout={handleLogout} />;
    } else if (userData.role === "user") {
      return (
        <UserDashboard
          onLogout={handleLogout}
          department={userData.category} 
          role={userData.role}
        />
      );
    } else if (userData.role === "export") {
      return <ExportOffice onLogout={handleLogout} />;
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
