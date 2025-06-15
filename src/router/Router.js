import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Enter from "../pages/Enter";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Success from "../pages/Success";
import MainUser from "../pages/mainuser";
import UiUser from "../pages/UiUser";
import Product from "../pages/Product";
import UiCompany from "../pages/UiCompany";
import Addproduct from "../pages/Addproduct";
import Editproduct from "../pages/Editproduct";
import CreateInvoice from "../pages/CreateInvoice";
import Addreceipt from "../pages/Addreceipt";
import CreatetaxInvoice from "../pages/CreatetaxInvoice";
import IihCompany from "../pages/IihCompany";
import IihUser from "../pages/IihUser";
import Makeinvoice from "../pages/makeinvoice";


const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/mainuser" element={<MainUser />} />
        <Route path="/UiUser" element={<UiUser />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/UiCompany" element={<UiCompany />} />
        <Route path="/Addproduct" element={<Addproduct />} />
        <Route path="/Editproduct/:id" element={<Editproduct />} />
        <Route path="/CreateInvoice" element={<CreateInvoice />} />
        <Route path="/Addreceipt" element={<Addreceipt />} />
        <Route path="/CreatetaxInvoice" element={<CreatetaxInvoice />} />
        <Route path="/IihCompany" element={<IihCompany />} />
        <Route path="/IihUser" element={<IihUser />} />
        <Route path="/makeinvoice" element={<Makeinvoice />} />
      </Routes>
    </Router>
  );
};

export default Routers;