import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser, FaHome, FaUserCircle, FaSignOutAlt, FaShoppingCart, FaClipboardList } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Invoice = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const [receiptHistory, setReceiptHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const headerHeight = 64;

  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem("receiptHistory")) || [];
    setReceiptHistory(storedReceipts);
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("th-TH", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff" }}>
      <div style={{ backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem" }}>
        <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: "pointer", color: "white" }}>
          <FaBars size={20} />
        </div>
        <h1 style={{ color: "white", fontFamily: "monospace", letterSpacing: "2px", fontSize: "20px" }}>TAX INVOICE</h1>
        <FaUser style={{ color: "white", fontSize: "20px", cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", top: `${headerHeight}px`, left: 0, bottom: 0, width: "200px", backgroundColor: "#9999ff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0" }}>
          <div>
            <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainCompany")} />
            <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} />
            <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} />
            <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} />
            <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} />
          </div>
          <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => navigate("/Enter")} />
        </div>
      )}

      <div style={{ marginLeft: menuOpen ? "200px" : "0", transition: "margin 0.3s", padding: "2rem" }}>
        <div style={{ backgroundColor: "#a6d4ff", padding: "0.75rem 2rem", borderRadius: "8px", textAlign: "center", fontWeight: "bold", fontSize: "20px", marginBottom: "1.5rem" }}>
          รายการใบเสร็จ
        </div>

        {selectedIndex === null ? (
          receiptHistory.map((receipt, index) => {
            const total = receipt.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            return (
              <div key={index} onClick={() => setSelectedIndex(index)} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "10px", marginBottom: "1rem", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  <span>ประวัติรายการที่ {index + 1}</span>
                  <span style={{ fontWeight: "normal" }}>{formatDate(receipt.date)}</span>
                </div>
                <hr />
                {receipt.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0" }}>
                    <span>{item.quantity.toFixed(2)} {item.name}</span>
                    <span>{item.price.toLocaleString()}</span>
                  </div>
                ))}
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                  <span>รวม</span>
                  <span>{total.toLocaleString()} บาท</span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#e0f0ff", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px", marginBottom: "0.3rem" }}>
              <span>ประวัติรายการที่ {selectedIndex + 1}</span>
              <span style={{ fontWeight: "normal" }}>{formatDate(receiptHistory[selectedIndex].date)}</span>
            </div>
            <div style={{ textAlign: "right", fontSize: "14px", color: "#555", marginBottom: "1rem" }}>
              เวลา {formatTime(receiptHistory[selectedIndex].date)} น.
            </div>
            <hr />
            {receiptHistory[selectedIndex].items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", margin: "0.3rem 0" }}>
                <span>{item.quantity.toFixed(2)} {item.name}</span>
                <span>{item.price.toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px" }}>
              <span>รวม</span>
              <span>{receiptHistory[selectedIndex].items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} บาท</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1.5rem" }}>
              <button onClick={() => setSelectedIndex(null)} style={{ padding: "0.6rem 1.5rem", backgroundColor: "#ff4d4d", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
                ยกเลิก
              </button>
              <button
                onClick={() => navigate("/CreatetaxInvoice", {
                  state: {
                    buyer: JSON.parse(localStorage.getItem("currentBuyer")),
                    receipt: receiptHistory[selectedIndex],
                  },
                })}
                style={{ padding: "0.6rem 1.5rem", backgroundColor: "#4da8ff", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
              >
                ทำใบกำกับ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, onClick }) => (
  <div onClick={onClick} style={{ padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "#000", cursor: "pointer", fontSize: "14px" }}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

export default Invoice;
