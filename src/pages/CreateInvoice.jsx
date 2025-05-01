import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaHome,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ใช้ตรวจ path ปัจจุบัน
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [receipts, setReceipts] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const receiptRefs = useRef([]);

  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem("receiptHistory")) || [];
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      const userReceipts = storedReceipts.filter(
        (r) => r.companyName === user.companyName
      );
      setReceipts(userReceipts);
      setCurrentUser(user);
    } else {
      setReceipts([]);
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("th-TH") + " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  };

  const handleDeleteReceipt = (receiptToDelete) => {
    const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบใบเสร็จนี้?");
    if (!confirmed) return;

    const updatedReceipts = receipts.filter(
      (r) => JSON.stringify(r) !== JSON.stringify(receiptToDelete)
    );
    localStorage.setItem("receiptHistory", JSON.stringify(updatedReceipts));
    setReceipts(updatedReceipts);
    setSelectedReceipt(null);
  };

  const filteredReceipts = receipts.filter((receipt) => {
    if (filterType === "invoiced") return receipt.isInvoiced;
    if (filterType === "notInvoiced") return !receipt.isInvoiced;
    return true;
  });

  const ReceiptModal = ({ receipt, onClose }) => (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "10px",
        width: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>ใบเสร็จรับเงิน</h2>
        {currentUser && (
          <div style={{ marginBottom: "1rem" }}>
            <p><strong>ชื่อบริษัท:</strong> {currentUser.companyName}</p>
            <p><strong>ที่อยู่:</strong> {currentUser.address}</p>
            <p><strong>เบอร์โทร:</strong> {currentUser.phone}</p>
            <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> {currentUser.taxId}</p>
            <p><strong>สาขา:</strong> {currentUser.branch}</p>
          </div>
        )}
        <p><strong>วันที่:</strong> {formatDateTime(receipt.date)}</p>
        <hr />
        {receipt.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{item.quantity.toFixed(2)} × {item.name}</span>
            <span>{Number(item.price).toLocaleString()}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <span>รวม</span>
          <span>{Number(receipt.total).toLocaleString()} บาท</span>
        </div>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 2rem",
              backgroundColor: "#1a1aa6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            ปิด
          </button>
          <button
            onClick={() => handleDeleteReceipt(receipt)}
            style={{
              padding: "0.5rem 2rem",
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            🗑 ลบ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      <div style={{
        backgroundColor: "#1a1aa6",
        height: `${headerHeight}px`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1rem",
        color: "white"
      }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <button onClick={() => navigate("/Addreceipt")} style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          border: "2px solid #1a1aa6",
          backgroundColor: "white",
          color: "#1a1aa6",
          padding: "0.6rem 1.2rem",
          borderRadius: "30px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          <span role="img" aria-label="icon">🗓️</span> เพิ่มใบเสร็จ
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        >
          <option value="all">แสดงทั้งหมด</option>
          <option value="notInvoiced">ยังไม่ออกใบกำกับ</option>
          <option value="invoiced">ออกใบกำกับแล้ว</option>
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <div style={{
          backgroundColor: "#a6d4ff",
          padding: "0.6rem 2rem",
          borderRadius: "6px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#000"
        }}>
          รายการใบเสร็จ
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "1rem auto", padding: "1rem" }}>
        {filteredReceipts.length === 0 ? (
          <div style={{ textAlign: "center", color: "#777" }}>ไม่มีประวัติใบเสร็จ</div>
        ) : (
          filteredReceipts.map((receipt, index) => (
            <div
              key={index}
              ref={(el) => (receiptRefs.current[index] = el)}
              style={{
                backgroundColor: "white",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong>ประวัติรายการที่ {index + 1}</strong>
                <span>{formatDateTime(receipt.date)}</span>
              </div>
              <hr />
              {receipt.items.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "0.3rem 0"
                }}>
                  <span>{item.quantity.toFixed(2)} × {item.name}</span>
                  <span>{Number(item.price).toLocaleString()}</span>
                </div>
              ))}
              <hr />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>รวม</span>
                <span>{Number(receipt.total).toLocaleString()} บาท</span>
              </div>
              <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                <button onClick={() => setSelectedReceipt(receipt)} style={{
                  padding: "0.3rem 1rem",
                  border: "1px solid #1a1aa6",
                  background: "white",
                  color: "#1a1aa6",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}>
                  ดูรายละเอียด
                </button>
              </div>
              {receipt.isInvoiced && (
                <div style={{
                  marginTop: "0.5rem",
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}>
                  ✅ ออกใบกำกับภาษีแล้ว
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedReceipt && <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}

      {menuOpen && (
        <div style={{
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
          zIndex: 2
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
    </div>
  );
};

// ✅ MenuItem รองรับ active
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

export default CreateInvoice;
