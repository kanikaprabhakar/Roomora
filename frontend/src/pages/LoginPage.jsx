import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      if (response?.token) {
        localStorage.setItem("roomoraToken", response.token);
      }
      if (response?.user) {
        localStorage.setItem("roomoraUser", JSON.stringify(response.user));
      }
      setStatusMessage("Login successful. You are now authenticated.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to continue building your match profile and find your next room."
      footerTag="SECURE LOGIN"
      form={
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          {statusMessage && <p className="status success">{statusMessage}</p>}
          {errorMessage && <p className="status error">{errorMessage}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="micro-note">
            Need an account? <Link to="/signup">Join Roomora</Link>
          </p>
        </form>
      }
    />
  );
}
