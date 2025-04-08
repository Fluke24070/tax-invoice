import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Enter from "../pages/Enter";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Enter />} />
        <Route path="/enter" element={<Enter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default Routers;