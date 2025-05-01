import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaBars, FaUserCircle, FaSignOutAlt,
  FaClipboardList, FaHome
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Addproduct = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้เพื่อเช็ค path ปัจจุบัน
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);

  const [productName, setProductName] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const textareaRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const formatNumberWithCommas = (value) => {
    const num = parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US");
  };

  const unformatNumber = (value) => value.replace(/,/g, "").replace(/[^\d]/g, "");

  const handleSave = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    const product = {
      id: Date.now(),
      name: productName,
      detail: productDetail,
      price: unformatNumber(productPrice),
      unit: productUnit,
      image: imagePreview,
      companyName: currentUser.companyName,
    };

    const oldProducts = JSON.parse(localStorage.getItem("products")) || [];
    oldProducts.push(product);
    localStorage.setItem("products", JSON.stringify(oldProducts));

    alert("เพิ่มสินค้าเรียบร้อยแล้ว");
    navigate("/Product");
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [productDetail]);

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 1rem", color: "white"
      }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {menuOpen && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0, bottom: 0,
          width: "200px", backgroundColor: "#9999ff",
          display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0", zIndex: 2
        }}>
          <div>
            <MenuItem icon={<FaHome />} text="ใบกำกับภาษี" onClick={() => navigate("/MainCompany")} active={location.pathname === "/MainCompany"} />
            <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} active={location.pathname === "/IihCompany"} />
            <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} active={location.pathname === "/UiCompany"} />
            <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} active={location.pathname === "/Product"} />
            <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} active={location.pathname === "/CreateInvoice"} />
          </div>
          <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => navigate("/Enter")} />
        </div>
      )}

      {/* Form Section */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "2rem" }}>
        <div style={{
          backgroundColor: "white", padding: "1.5rem", borderRadius: "10px",
          width: "90%", maxWidth: "400px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1rem"
        }}>
          <input placeholder="ชื่อรายการสินค้า" value={productName} onChange={(e) => setProductName(e.target.value)} style={inputStyle} />

          <label style={{ width: "100%" }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            <div style={{ ...imageBoxStyle, cursor: "pointer" }}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{
                  width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px"
                }} />
              ) : (
                "ภาพสินค้า"
              )}
            </div>
          </label>

          <textarea
            placeholder="รายละเอียดสินค้า"
            value={productDetail}
            onChange={(e) => setProductDetail(e.target.value)}
            ref={textareaRef}
            style={{ ...inputStyle, resize: "none", overflow: "hidden", lineHeight: "1.6", minHeight: "50px" }}
          />

          <input
            placeholder="ราคาสินค้า"
            value={productPrice}
            onChange={(e) => {
              const raw = unformatNumber(e.target.value);
              setProductPrice(formatNumberWithCommas(raw));
            }}
            onBlur={(e) => {
              const raw = unformatNumber(e.target.value);
              setProductPrice(formatNumberWithCommas(raw));
            }}
            style={inputStyle}
          />

          <input placeholder="หน่วย/unit" value={productUnit} onChange={(e) => setProductUnit(e.target.value)} style={inputStyle} />

          <button onClick={handleSave} style={saveButtonStyle}>บันทึกข้อมูล</button>
        </div>
      </div>
    </div>
  );
};

// ✅ MenuItem แบบไฮไลต์
const MenuItem = ({ icon, text, onClick, active }) => (
  <div
    onClick={onClick}
    style={{
      padding: "0.8rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      color: active ? "white" : "#000",
      backgroundColor: active ? "#6666cc" : "transparent",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: active ? "bold" : "normal",
    }}
  >
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "0.6rem 1rem",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const imageBoxStyle = {
  width: "100%",
  height: "180px",
  backgroundColor: "#f5f5f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "10px",
  border: "1px dashed #aaa",
  fontSize: "14px",
  color: "#333",
};

const saveButtonStyle = {
  width: "100%",
  backgroundColor: "#28a745",
  color: "#fff",
  padding: "0.8rem 0",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Addproduct;
