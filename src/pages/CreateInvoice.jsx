import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaHome,
  FaTrash,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState(null);

  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem("receiptHistory")) || [];
    setReceipts(storedReceipts);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const updateReceipt = (updatedItems) => {
    const updatedReceipts = [...receipts];
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    updatedReceipts[selectedReceiptIndex] = {
      ...updatedReceipts[selectedReceiptIndex],
      items: updatedItems,
      total: updatedTotal,
    };
    setReceipts(updatedReceipts);
    localStorage.setItem("receiptHistory", JSON.stringify(updatedReceipts));
  };

  const changeQuantity = (itemIndex, delta) => {
    const updatedItems = [...receipts[selectedReceiptIndex].items];
    const newQty = updatedItems[itemIndex].quantity + delta;
    if (newQty <= 0) return;
    updatedItems[itemIndex].quantity = newQty;
    updateReceipt(updatedItems);
  };

  const removeItem = (itemIndex) => {
    const updatedItems = receipts[selectedReceiptIndex].items.filter((_, i) => i !== itemIndex);
    updateReceipt(updatedItems);
  };

  const selectedReceipt = receipts[selectedReceiptIndex];
  const total = selectedReceipt?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("th-TH") + " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem", color: "white" }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <button onClick={() => navigate("/Addreceipt")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "2px solid #1a1aa6", backgroundColor: "white", color: "#1a1aa6", padding: "0.6rem 1.2rem", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
          <span role="img" aria-label="icon">🗓️</span> เพิ่มใบเสร็จ
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <div style={{ backgroundColor: "#a6d4ff", padding: "0.6rem 2rem", borderRadius: "6px", fontSize: "18px", fontWeight: "bold", color: "#000" }}>
          รายการใบเสร็จ
        </div>
      </div>

      {selectedReceiptIndex !== null ? (
        <div style={{ maxWidth: "400px", margin: "1rem auto", padding: "1rem" }}>
          <button onClick={() => setSelectedReceiptIndex(null)} style={{ marginBottom: "1rem", background: "#ccc", padding: "0.4rem 1rem", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            ← ย้อนกลับ
          </button>

          <div style={{ marginBottom: "0.5rem", fontStyle: "italic", textAlign: "right", color: "#555" }}>
            วันที่: {formatDateTime(selectedReceipt.date)}
          </div>

          {selectedReceipt.items.map((item, idx) => (
            <div key={idx} style={{ backgroundColor: "#dbe9ff", borderRadius: "15px", padding: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: "bold" }}>{item.name}</div>
                <div>{Number(item.price).toLocaleString()} บาท</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button onClick={() => changeQuantity(idx, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQuantity(idx, 1)}>+</button>
                <FaTrash style={{ color: "#555", cursor: "pointer" }} onClick={() => removeItem(idx)} />
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontWeight: "bold" }}>
            <span>ราคารวม</span>
            <span>{Number(total).toLocaleString()} บาท</span>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button style={{ padding: "0.6rem 1.5rem", backgroundColor: "#4da8ff", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
              ยืนยัน
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: "700px", margin: "1rem auto", padding: "1rem" }}>
          {receipts.length === 0 ? (
            <div style={{ textAlign: "center", color: "#777" }}>ไม่มีประวัติใบเสร็จ</div>
          ) : (
            receipts.map((receipt, index) => (
              <div key={index} onClick={() => setSelectedReceiptIndex(index)} style={{ backgroundColor: "white", padding: "1rem", marginBottom: "1rem", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <strong>ประวัติรายการที่ {index + 1}</strong>
                  <span>{formatDateTime(receipt.date)}</span>
                </div>
                <hr />
                {receipt.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", margin: "0.3rem 0" }}>
                    <span>{item.quantity.toFixed(2)} × {item.name}</span>
                    <span>{Number(item.price).toLocaleString()}</span>
                  </div>
                ))}
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                  <span>รวม</span>
                  <span>{Number(receipt.total).toLocaleString()} บาท</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {menuOpen && (
        <div style={{ position: "fixed", top: `${headerHeight}px`, left: 0, bottom: 0, width: "200px", backgroundColor: "#9999ff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0", zIndex: 2 }}>
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
    </div>
  );
};

const MenuItem = ({ icon, text, onClick }) => (
  <div onClick={onClick} style={{ padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "#000", cursor: "pointer", fontSize: "14px" }}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

export default CreateInvoice;