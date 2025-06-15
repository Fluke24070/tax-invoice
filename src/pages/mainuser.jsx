import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiFileText, FiDownload } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

const MenuItem = ({ icon, text, onClick, active }) => (
  <div onClick={onClick} style={{
    padding: "0.8rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    color: active ? "white" : "#000",
    backgroundColor: active ? "#6666cc" : "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: active ? "bold" : "normal"
  }}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

const MainUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const qrRef = useRef();
  const headerHeight = 64;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const email = currentUser.email;

    if (email) {
      fetch("http://localhost:3000/get_users")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            const foundUser = data.data.users.find((u) => u.email === email);
            if (foundUser) {
              setUserData(foundUser);
            }
          }
        })
        .catch((err) => console.error("API Error:", err));
    }
  }, []);

  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 400, 400);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "user-qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const qrContent = userData
    ? JSON.stringify({ phone: userData.phone, taxId: userData.taxId })
    : "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#d6e8ff" }}>

      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "0 1rem",
        color: "white", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div onClick={() => setSidebarVisible(!sidebarVisible)} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiUser")} />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>หน้าหลัก</h1>

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
            height: "100%", padding: "1rem 0"
          }}>
            <div>
              <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainUser")} active={location.pathname === "/MainUser"} />
              <MenuItem icon={<FiFileText />} text="ประวัติการออกใบกำกับภาษี" onClick={() => navigate("/IihUser")} active={location.pathname === "/IihUser"} />
              <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiUser")} active={location.pathname === "/UiUser"} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => { localStorage.clear(); navigate("/login"); }} />
            </div>
          </div>
        </div>
      )}

      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        paddingBottom: "60px",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          backgroundColor: "#9999ff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            padding: "0 10px",
          }}>
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>นามบัตร</span>
            <div onClick={downloadQRCode} style={{
              backgroundColor: "#f5d0e0",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
            }}>
              <FiDownload size={18} />
            </div>
          </div>

          <div ref={qrRef} style={{
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "14px",
            height: "260px",
            width: "260px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {qrContent ? (
              <QRCodeSVG value={qrContent} size={230} level="H" includeMargin={true} />
            ) : (
              <p style={{ fontSize: "14px" }}>ไม่มีข้อมูล</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainUser;
