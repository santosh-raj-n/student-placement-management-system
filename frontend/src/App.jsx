import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/Companies";
import Applications from "./pages/Applications";
import { Routes, Route } from "react-router-dom";
import RecruiterApplications from "./pages/RecruiterApplications";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company" element={<Companies />} />
        <Route path="/applications" element={<Applications />} />
        <Route
          path="/recruiter-applications"
          element={<RecruiterApplications />}
        />
      </Routes>
    </>
  );
};

export default App;
