import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Enter from "../pages/Enter";
import Login from "../pages/Login";
import Signin from "../pages/Signin";

const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Enter />} />
        <Route path="/enter" element={<Enter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
};

export default Routers;