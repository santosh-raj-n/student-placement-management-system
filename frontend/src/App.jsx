import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/Companies";
import Applications from "./pages/Applications";
import { Routes, Route } from "react-router-dom";
import RecruiterApplications from "./pages/RecruiterApplications";
import RegisterCompany from "./pages/RegisterCompany";
import EditCompany from "./pages/EditCompany";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company" element={<Companies />} />
        <Route path="/company/register" element={<RegisterCompany />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/recruiter-applications"
          element={<RecruiterApplications />}
        />
        <Route path="/company/edit/:id" element={<EditCompany />} />
      </Routes>
    </>
  );
};

export default App;
