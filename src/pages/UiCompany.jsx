import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaSignOutAlt,
  FaShoppingCart,
  FaClipboardList,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const UiCompany = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ใช้ตรวจ path ปัจจุบัน
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const email = location.state?.email || localStorage.getItem("currentEmail");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
    taxId: "",
    address: "",
    branch: "",
  });

  useEffect(() => {
    // console.log("Current email:", email);
    const fetchUserData = async () => {
      if (!email) return;
  
      try {
        const response = await fetch(`http://localhost:3000/profile_get/${email}`);
        const result = await response.json();
  
        if (response.ok) {
          const data = result.data.card[0];
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            companyName: data.companyName || "",
            taxId: data.taxId || "",
            address: data.address || "",
            branch: data.branch || "",
          });
        } else {
          alert("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาด:", err);
      }
    };
  
    fetchUserData();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("บันทึกข้อมูลลงระบบสำเร็จแล้ว!");
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ");
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1a1aa6",
          height: `${headerHeight}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
          color: "white",
        }}
      >
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>
          TAX INVOICE
        </span>
        <FaUserCircle
          size={24}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/UiCompany")}
        />
      </div>

      {/* Sidebar */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: `${headerHeight}px`,
            left: 0,
            bottom: 0,
            width: "200px",
            backgroundColor: "#9999ff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "1rem 0",
          }}
        >
          <div>
            <MenuItem icon={<FaHome />} text="ใบกำกับภาษี" onClick={() => navigate("/MainCompany")} active={location.pathname === "/MainCompany"} />
            <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} active={location.pathname === "/IihCompany"} />
            <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} active={location.pathname === "/UiCompany"} />
            <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} active={location.pathname === "/Product"} />
            <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} active={location.pathname === "/CreateInvoice"} />
          </div>
          <MenuItem icon={<FaSignOutAlt />}text="ออกจากระบบ"onClick={() => {localStorage.clear();navigate("/Enter");}}/>

        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          marginLeft: menuOpen ? "200px" : "0",
          transition: "margin 0.3s",
          padding: "2rem",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            width: "90%",
            maxWidth: "500px",
            margin: "0 auto",
            padding: "60px 40px",
            borderRadius: "15px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* First Name + Last Name */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <div style={{ flex: 1.0 }}>
              <label style={labelStyle}>ชื่อจริง</label>
              <input
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                placeholder="ชื่อจริง"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1.4 }}>
              <label style={labelStyle}>นามสกุล</label>
              <input
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                placeholder="นามสกุล"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Other Fields */}
          {[
            { label: "เบอร์มือถือ", name: "phone" },
            { label: "ชื่อบริษัท", name: "companyName" },
            { label: "เลขประจำตัวผู้เสียภาษี", name: "taxId" },
            { label: "รายละเอียดที่อยู่บริษัท", name: "address" },
            { label: "สาขาสำนักงาน", name: "branch" },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>{field.label}</label>
              <input
                name={field.name}
                value={userData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                style={inputStyle}
              />
            </div>
          ))}

          {/* Save Button */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#4cd964",
                color: "white",
                border: "none",
                padding: "10px 40px",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ MenuItem รองรับ active
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

const labelStyle = {
  display: "block",
  fontSize: "0.9rem",
  fontWeight: "bold",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "0.95rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
  height: "38px",
};

export default UiCompany;
