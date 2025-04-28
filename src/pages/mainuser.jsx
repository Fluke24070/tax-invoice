import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser, FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiFileText, FiPrinter } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

const MainUser = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const qrRef = useRef();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const headerHeight = 64;

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
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

  // เอาเฉพาะเบอร์มือถือ และ เลขประจำตัวผู้เสียภาษี
  const qrContent = userData
    ? JSON.stringify({
        phone: userData.phone,
        taxId: userData.taxId,
      })
    : "";

  const MenuItem = ({ icon, text, onClick }) => (
    <div
      onClick={onClick}
      style={{
        padding: "0.8rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "#000",
        cursor: "pointer",
      }}
    >
      {icon} {text}
    </div>
  );

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
        }}
      >
        <div onClick={toggleMenu} style={{ cursor: "pointer", color: "white" }}>
          <FaBars size={20} />
        </div>
        <h1
          style={{
            color: "white",
            fontFamily: "monospace",
            letterSpacing: "2px",
            fontSize: "20px",
          }}
        >
          TAX INVOICE
        </h1>
        <FaUser
          style={{ color: "white", fontSize: "20px", cursor: "pointer" }}
          onClick={() => navigate("/UiUser")}
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
            <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainUser")} />
            <MenuItem icon={<FiFileText />} text="ประวัติการออกใบกำกับภาษี" onClick={() => navigate("/IihUser")} />
            <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiUser")} />
          </div>
          <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => navigate("/Enter")} />
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
            backgroundColor: "#9999ff",
            borderRadius: "25px",
            width: "360px",
            margin: "60px auto",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              padding: "0 10px",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>นามบัตร</span>
            <div
              onClick={downloadQRCode}
              style={{
                backgroundColor: "#f5d0e0",
                padding: "8px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <FiPrinter size={18} />
            </div>
          </div>

          <div
            ref={qrRef}
            style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "14px",
              height: "260px",
              width: "260px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {qrContent ? (
              <QRCodeSVG
                value={qrContent}
                size={230}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
              />
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
