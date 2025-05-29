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
  const location = useLocation();
  const headerHeight = 64;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const email = location.state?.email || localStorage.getItem("currentEmail");

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
        headers: { "Content-Type": "application/json" },
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

      {/* Sidebar */}
      {sidebarVisible && (
        <div style={{
          position: "fixed",
          top: `${headerHeight}px`,
          left: 0,
          width: "200px",
          height: `calc(100vh - ${headerHeight}px)`,
          backgroundColor: "#9999ff",
          zIndex: 20,
          overflow: "hidden",
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

      {/* Main Content */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px 60px 20px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          paddingBottom: "80px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "600px",
          boxSizing: "border-box"
        }}>
          <h3 style={{ textAlign: "center", marginBottom: "24px", color: "#333" }}>
            ข้อมูลผู้ใช้งาน
          </h3>
          <div style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>ชื่อจริง</label>
              <input name="firstName" value={userData.firstName} onChange={handleChange} style={{ ...inputStyle, maxWidth: "220px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>นามสกุล</label>
              <input name="lastName" value={userData.lastName} onChange={handleChange} style={{ ...inputStyle, maxWidth: "220px" }} />
            </div>
          </div>
          {["phone", "companyName", "taxId", "address", "branch"].map((field, i) => (
            <div key={field} style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                {["เบอร์มือถือ", "ชื่อบริษัท", "เลขประจำตัวผู้เสียภาษี", "รายละเอียดที่อยู่บริษัท", "สาขาสำนักงาน"][i]}
              </label>
              <input name={field} value={userData[field]} onChange={handleChange} style={{ ...inputStyle, maxWidth: "475px" }} />
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button onClick={handleSave} style={{
              backgroundColor: "#4cd964", color: "white", border: "none",
              padding: "12px 48px", borderRadius: "6px",
              fontSize: "1rem", fontWeight: "bold", cursor: "pointer",
            }}>
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, onClick, active }) => (
  <div onClick={onClick} style={{
    padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem",
    color: active ? "white" : "#000", backgroundColor: active ? "#6666cc" : "transparent",
    cursor: "pointer", fontSize: "14px", fontWeight: active ? "bold" : "normal",
  }}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

const labelStyle = {
  display: "block",
  fontSize: "0.95rem",
  fontWeight: "600",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  height: "auto",
  boxSizing: "border-box",
};

export default UiCompany;
