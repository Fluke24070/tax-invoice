import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Enter from "../pages/Enter";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Success from "../pages/Success";
import MainUser from "../pages/mainuser";
import UiUser from "../pages/UiUser";
import MainCompany from "../pages/maincompany";
import Product from "../pages/Product";
import UiCompany from "../pages/UiCompany";
import Addproduct from "../pages/Addproduct";
import Editproduct from "../pages/Editproduct";
import CreateInvoice from "../pages/CreateInvoice";
import Addreceipt from "../pages/Addreceipt";
import Invoice from "../pages/Invoice";
import CreatetaxInvoice from "../pages/CreatetaxInvoice";
import IihCompany from "../pages/IihCompany";
import IihUser from "../pages/IihUser";


const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Enter />} />
        <Route path="/enter" element={<Enter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/mainuser" element={<MainUser />} />
        <Route path="/UiUser" element={<UiUser />} />
        <Route path="/maincompany" element={<MainCompany />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/UiCompany" element={<UiCompany />} />
        <Route path="/Addproduct" element={<Addproduct />} />
        <Route path="/Editproduct/:id" element={<Editproduct />} />
        <Route path="/CreateInvoice" element={<CreateInvoice />} />
        <Route path="/Addreceipt" element={<Addreceipt />} />
        <Route path="/Invoice" element={<Invoice />} />
        <Route path="/CreatetaxInvoice" element={<CreatetaxInvoice />} />
        <Route path="/IihCompany" element={<IihCompany />} />
        <Route path="/IihUser" element={<IihUser />} />
      </Routes>
    </Router>
  );
};

export default Routers;