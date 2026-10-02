import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dept: "",
    phone: "",
    role: "STUDENT",
    companyName: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email should not be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (formData.role === "STUDENT" && formData.dept.trim() === "") {
      newErrors.dept = "Department cannot be empty";
    }

    if (
      formData.role === "RECRUITER" &&
      formData.companyName.trim() === ""
    ) {
      newErrors.companyName =
        "Company / Organization cannot be empty";
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message || "Registration failed"
        );
      }

      await response.json();

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>

          <p>
            Join the Student Placement Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="role-selection">
            <label className="section-label">
              Register as
            </label>

            <div className="role-options">
              <label
                className={`role-option ${
                  formData.role === "STUDENT"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={formData.role === "STUDENT"}
                  onChange={handleChange}
                />

                <div>
                  <strong>Student</strong>
                  <span>
                    Find companies and apply for opportunities
                  </span>
                </div>
              </label>

              <label
                className={`role-option ${
                  formData.role === "RECRUITER"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="RECRUITER"
                  checked={formData.role === "RECRUITER"}
                  onChange={handleChange}
                />

                <div>
                  <strong>Recruiter</strong>
                  <span>
                    Post companies and manage applications
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter your name"
              onChange={handleChange}
            />

            {errors.name && (
              <p className="error-message">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
            />

            {errors.email && (
              <p className="error-message">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Create a password"
              onChange={handleChange}
            />

            {errors.password && (
              <p className="error-message">
                {errors.password}
              </p>
            )}
          </div>

          {formData.role === "STUDENT" ? (
            <div className="form-group">
              <label>Department</label>

              <input
                type="text"
                name="dept"
                value={formData.dept}
                placeholder="Enter your department"
                onChange={handleChange}
              />

              {errors.dept && (
                <p className="error-message">
                  {errors.dept}
                </p>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label>Company / Organization</label>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                placeholder="Enter company or organization name"
                onChange={handleChange}
              />

              {errors.companyName && (
                <p className="error-message">
                  {errors.companyName}
                </p>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              placeholder="Enter your 10-digit phone number"
              onChange={handleChange}
            />

            {errors.phone && (
              <p className="error-message">
                {errors.phone}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;