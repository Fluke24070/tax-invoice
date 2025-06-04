import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaBars, FaUserCircle, FaSignOutAlt,
  FaClipboardList, FaHome
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Addproduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerHeight = 64;
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [productName, setProductName] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [categories, setCategories] = useState(["ยังไม่ได้จัดหมวดหมู่"]);

  const textareaRef = useRef(null);

  const formatNumberWithCommas = (value) => {
    const num = parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US");
  };

  const unformatNumber = (value) => value.replace(/,/g, "").replace(/[^\d]/g, "");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const companyName = currentUser.companyName;
    if (!companyName) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`http://localhost:3000/product_get_com/${companyName}`);
        const data = await res.json();
        if (data.status === 200) {
          const items = data.data.product;
          const uniqueTypes = new Set();
          items.forEach((item) => {
            const type = item.item_type?.trim();
            if (type && type !== "") uniqueTypes.add(type);
            else uniqueTypes.add("ยังไม่ได้จัดหมวดหมู่");
          });
          setCategories(Array.from(uniqueTypes));
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    const product = {
      name: productName.trim(),
      detail: productDetail.trim(),
      price: parseFloat(unformatNumber(productPrice)),
      unit: productUnit.trim(),
      email: currentUser.email,
      companyName: currentUser.companyName || "",
      item_type: productCategory.trim() || "ยังไม่ได้จัดหมวดหมู่",
    };

    try {
      const response = await fetch("http://localhost:3000/crete_item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Failed to save product");

      alert("เพิ่มสินค้าเรียบร้อยแล้ว");
      navigate("/Product");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกสินค้า");
      console.error(error);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [productDetail]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "0 1rem",
        color: "white", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div onClick={() => setSidebarVisible(!sidebarVisible)} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>เพิ่มรายการสินค้า</h1>

      {sidebarVisible && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0,
          width: "200px", height: `calc(100vh - ${headerHeight}px)`,
          backgroundColor: "#9999ff", zIndex: 20, overflow: "hidden"
        }}>
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            height: "100%", padding: "1rem 0",
          }}>
            <div>
              <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} active={location.pathname === "/IihCompany"} />
              <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} active={location.pathname === "/UiCompany"} />
              <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} active={location.pathname === "/Product"} />
              <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} active={location.pathname === "/CreateInvoice"} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => { localStorage.clear(); navigate("/Enter"); }} />
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{
          backgroundColor: "white", padding: "1.5rem", borderRadius: "10px",
          width: "90%", maxWidth: "400px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1rem"
        }}>
          <input placeholder="ชื่อรายการสินค้า" value={productName} onChange={(e) => setProductName(e.target.value)} style={inputStyle} />
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

          <input placeholder="ชื่อประเภทสินค้า" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} style={inputStyle} />

          <button onClick={handleSave} style={saveButtonStyle}>บันทึกข้อมูล</button>
        </div>
      </div>
    </div>
  );
};

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
