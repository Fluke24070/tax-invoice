import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaUser, FaHome, FaUserCircle,
  FaSignOutAlt, FaShoppingCart, FaClipboardList
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { Html5Qrcode } from "html5-qrcode";

const MainCompany = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [results, setResults] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("registeredUsers");
    if (stored) setRegisteredUsers(JSON.parse(stored));
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      const filtered = registeredUsers.filter(user =>
        Object.values(user).some(val =>
          typeof val === "string" && val.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user) => {
    setSearchTerm(user.phone || user.email || "");
    setResults(user);
    setShowSuggestions(false);
    localStorage.setItem("currentBuyer", JSON.stringify(user));
  };

  const handleSearch = () => {
    const found = registeredUsers.find(user =>
      Object.values(user).some(value =>
        typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setResults(found || null);
    if (found) localStorage.setItem("currentBuyer", JSON.stringify(found));
  };

  const handleScanResult = (scannedData) => {
    try {
      const parsed = JSON.parse(scannedData);
      if (parsed.phone && parsed.taxId) {
        const found = registeredUsers.find(user => user.phone === parsed.phone && user.taxId === parsed.taxId);
        if (found) {
          setResults(found);
          setSearchTerm(found.phone);
          localStorage.setItem("currentBuyer", JSON.stringify(found));
        } else {
          alert("ไม่พบข้อมูลลูกค้าในระบบ");
          setResults(null);
        }
      } else {
        alert("QR ไม่ถูกต้อง หรือข้อมูลไม่ครบ");
        setResults(null);
      }
    } catch (e) {
      console.error("QR parsing failed", e);
      alert("QR อ่านไม่สำเร็จ");
    }
  };

  const startScanner = () => {
    setScanning(true);
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("reader");
      setScannerInstance(html5QrCode);
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScanResult(decodedText);
          html5QrCode.stop().then(() => {
            document.getElementById("reader").innerHTML = "";
            setScanning(false);
            setScannerInstance(null);
          });
        },
        () => {}
      ).catch((err) => {
        console.error("ไม่สามารถเริ่มกล้องได้:", err);
        setScanning(false);
      });
    }, 100);
  };

  const stopScanner = () => {
    if (scannerInstance) {
      scannerInstance.stop().then(() => {
        document.getElementById("reader").innerHTML = "";
        setScanning(false);
        setScannerInstance(null);
      }).catch((err) => console.error("เกิดข้อผิดพลาดขณะปิดกล้อง:", err));
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.5rem", marginBottom: "0.5rem",
    border: "1px solid #ccc", borderRadius: "5px"
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff" }}>
      <div style={{ backgroundColor: "#1a1aa6", height: `64px`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem" }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer", color: "white" }}><FaBars size={20} /></div>
        <h1 style={{ color: "white", fontFamily: "monospace", fontSize: "20px" }}>TAX INVOICE</h1>
        <FaUser style={{ color: "white", fontSize: "20px", cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", top: `64px`, left: 0, bottom: 0, width: "200px", backgroundColor: "#9999ff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0" }}>
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

      <div style={{ marginLeft: menuOpen ? "200px" : "0", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", position: "relative" }}>
          <div style={{ width: "400px", position: "relative" }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="ค้นหาด้วย ชื่อ อีเมล เบอร์ ฯลฯ"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => { if (filteredSuggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              style={{ width: "100%", padding: "1rem", fontSize: "16px", borderRadius: "20px", border: "1px solid #ccc", outline: "none", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 5px)", width: "100%", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", maxHeight: "200px", overflowY: "auto", zIndex: 10 }}>
                {filteredSuggestions.map((user, index) => (
                  <div key={index} onClick={() => handleSuggestionClick(user)} style={{ padding: "0.75rem 1rem", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                    {user.firstName} {user.lastName} - {user.phone}
                  </div>
                ))}
              </div>
            )}
            <div onClick={handleSearch} style={{ position: "absolute", right: "2.5rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "20px", color: "#666" }}>🔍</div>
            <div onClick={scanning ? stopScanner : startScanner} style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "20px" }}>📷</div>
          </div>
        </div>

        {scanning && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div id="reader" style={{ width: "300px" }}></div>
            <button onClick={stopScanner} style={{ marginTop: "0.5rem", backgroundColor: "#1a1aa6", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}>ปิดกล้อง</button>
          </div>
        )}

        {results && (
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "20px", width: "400px", margin: "2rem auto", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <input value={results.firstName || ""} readOnly placeholder="ชื่อจริง" style={inputStyle} />
              <input value={results.lastName || ""} readOnly placeholder="นามสกุล" style={inputStyle} />
            </div>
            <input value={results.phone || ""} readOnly placeholder="เบอร์มือถือ" style={inputStyle} />
            <input value={results.email || ""} readOnly placeholder="อีเมล" style={inputStyle} />
            <input value={results.taxId || ""} readOnly placeholder="เลขผู้เสียภาษี" style={inputStyle} />
            <input value={results.companyName || ""} readOnly placeholder="บริษัท" style={inputStyle} />
            <input value={results.address || ""} readOnly placeholder="ที่อยู่" style={inputStyle} />
            <input value={results.branch || ""} readOnly placeholder="สาขา" style={inputStyle} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <button style={{ backgroundColor: "#ff4d4d", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "5px" }}>ยกเลิก</button>
              <button onClick={() => navigate("/Invoice")} style={{ backgroundColor: "#4da6ff", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "5px", cursor: "pointer" }}>ทำใบกำกับ</button>
            </div>
          </div>
        )}
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

export default MainCompany;
