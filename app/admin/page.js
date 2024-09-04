"use client";
import React, { useEffect, useState } from "react";
import "./loginstyle.css";
import axios from "axios";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const url = "http://localhost/attendance-api/auth.php";

  useEffect(() => {
    const data = sessionStorage.getItem("admin");

    if (data) {
      window.location.href = "/admin/dashboard";
    }
  }, []);
  const validate = () => {
    let errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const login = async () => {
    try {
      const res = await axios.get(url, {
        params: {
          operation: "adminLogin",
          json: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      });

      if (res.status !== 200) {
        alert("Status error: " + res.statusText);
        return;
      }

      if (res.data.success) {
        sessionStorage.setItem("admin", JSON.stringify(res.data.success));
        window.location.href = "/admin/dashboard";
      } else {
        alert(res.data.error);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login();
    }
  };

  return (
    <div className="log-form">
      <h2>Login to your account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            title="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="error" style={{ color: "red" }}>
              {errors.email}
            </p>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            title="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="error" style={{ color: "red" }}>
              {errors.password}
            </p>
          )}
        </div>
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminAuth;
