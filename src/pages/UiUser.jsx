import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUser, FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";


const UiUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);
  const email = location.state?.email || localStorage.getItem("currentEmail");

 
localStorage.setItem("currentEmail", email);
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
  

  const headerHeight = 64;

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem" }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer", color: "white" }}>
          <FaBars size={20} />
        </div>
        <h1 style={{ color: "white", fontFamily: "monospace", letterSpacing: "2px", fontSize: "20px" }}>
          TAX INVOICE
        </h1>
        <FaUser style={{ color: "white", fontSize: "20px", cursor: "pointer" }} onClick={() => navigate("/UiUser")} />
      </div>

      {/* Sidebar */}
      {menuOpen && (
        <div style={{ position: "fixed", top: `${headerHeight}px`, left: 0, bottom: 0, width: "200px", backgroundColor: "#9999ff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0" }}>
          <div>
            <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainUser")} active={location.pathname === "/MainUser"} />
            <MenuItem icon={<FiFileText />} text="ประวัติการออกใบกำกับภาษี" onClick={() => navigate("/IihUser")} active={location.pathname === "/IihUser"} />
            <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiUser")} active={location.pathname === "/UiUser"} />
          </div>
          <MenuItem icon={<FaSignOutAlt />}text="ออกจากระบบ"onClick={() => {localStorage.clear();navigate("/Enter");}}/>
        </div>
      )}

      {/* Main Content */}
      <div style={{ marginLeft: menuOpen ? "200px" : "0", transition: "margin 0.3s", padding: "2rem" }}>
        <div style={{ backgroundColor: "white", width: "90%", maxWidth: "500px", margin: "0 auto", padding: "60px 40px", borderRadius: "15px", boxShadow: "0 6px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <div style={{ flex: 1.0 }}>
              <label style={labelStyle}>ชื่อจริง</label>
              <input name="firstName" value={userData.firstName} onChange={handleChange} placeholder="ชื่อจริง" style={inputStyle} />
            </div>
            <div style={{ flex: 1.4 }}>
              <label style={labelStyle}>นามสกุล</label>
              <input name="lastName" value={userData.lastName} onChange={handleChange} placeholder="นามสกุล" style={inputStyle} />
            </div>
          </div>

          {[
            { label: "เบอร์มือถือ", name: "phone" },
            { label: "ชื่อบริษัท", name: "companyName" },
            { label: "เลขประจำตัวผู้เสียภาษี", name: "taxId" },
            { label: "รายละเอียดที่อยู่บริษัท", name: "address" },
            { label: "สาขาสำนักงาน", name: "branch" },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>{field.label}</label>
              <input name={field.name} value={userData[field.name]} onChange={handleChange} placeholder={field.label} style={inputStyle} />
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button onClick={handleSave} style={{ backgroundColor: "#4cd964", color: "white", border: "none", padding: "10px 40px", borderRadius: "6px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>
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
      gap: "0.5rem",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: active ? "#6666cc" : "transparent",
      color: active ? "white" : "#000",
      fontWeight: active ? "bold" : "normal",
    }}
  >
    {icon}
    {text}
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

export default UiUser;
