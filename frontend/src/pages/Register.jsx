import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dept: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email should not be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid Email";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (formData.dept.trim() === "") {
      newErrors.dept = "Department cannot be empty";
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone no.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();

      console.log("Registered User:", data);

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      alert(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Student Registration</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter Your Name:"
            onChange={handleChange}
          />
        </div>

        {errors.name && <p>{errors.name}</p>}

        <br />

        <div>
          <label>Email:</label>

          <input
            type="text"
            name="email"
            placeholder="Enter your email:"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {errors.email && <p>{errors.email}</p>}

        <br />

        <div>
          <label>Password:</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password:"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {errors.password && <p>{errors.password}</p>}

        <br />

        <div>
          <label>Department:</label>

          <input
            type="text"
            name="dept"
            placeholder="Enter Your Department"
            value={formData.dept}
            onChange={handleChange}
          />
        </div>

        {errors.dept && <p>{errors.dept}</p>}

        <br />

        <div>
          <label>Phone Number:</label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            placeholder="Enter Your PhoneNo:"
            onChange={handleChange}
          />
        </div>

        {errors.phone && <p>{errors.phone}</p>}

        <br />

        <button type="submit">Register</button>
      </form>

      <h2>Student Details</h2>

      <p>
        <strong>Name:</strong> {formData.name}
      </p>

      <p>
        <strong>Email:</strong> {formData.email}
      </p>

      <p>
        <strong>Department:</strong> {formData.dept}
      </p>

      <p>
        <strong>Phone Number:</strong> {formData.phone}
      </p>
    </div>
  );
};

export default Register;
