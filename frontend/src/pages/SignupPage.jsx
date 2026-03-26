import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
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
      await signupUser(formData);
      setStatusMessage("Account created. Redirecting you to login...");
      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Roomora Account"
      subtitle="Set up your user profile and start listing or finding rooms today."
      footerTag="FAST ONBOARDING"
      form={
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

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
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="owner">Owner</option>
            <option value="student">Student</option>
          </select>

          {statusMessage && <p className="status success">{statusMessage}</p>}
          {errorMessage && <p className="status error">{errorMessage}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <p className="micro-note">
            Have access already? <Link to="/login">Sign in</Link>
          </p>
        </form>
      }
    />
  );
}
