import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaHome,
  FaPrint,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const CreatetaxInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [seller, setSeller] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(1);

  useEffect(() => {
    const sellerData = localStorage.getItem("currentUser");
    if (sellerData) setSeller(JSON.parse(sellerData));

    const passedData = location.state;
    if (passedData) {
      setBuyer(passedData.buyer);
      setReceipt(passedData.receipt);
    }

    const allInvoices = JSON.parse(localStorage.getItem("companyInvoices") || "[]");
    setInvoiceNumber(allInvoices.length + 1);
  }, [location.state]);

  useEffect(() => {
    const saveToHistories = () => {
      const invoice = {
        buyer,
        seller,
        items: receipt?.items || [],
        date: new Date().toISOString(),
        total: calculateTotal(),
        vat: calculateVAT(),
        number: invoiceNumber
      };

      const companyHistory = JSON.parse(localStorage.getItem("companyInvoices") || "[]");
      const buyerHistory = JSON.parse(localStorage.getItem("buyerInvoices") || "[]");

      localStorage.setItem("companyInvoices", JSON.stringify([...companyHistory, invoice]));
      localStorage.setItem("buyerInvoices", JSON.stringify([...buyerHistory, invoice]));

      const allReceipts = JSON.parse(localStorage.getItem("receiptHistory") || "[]");
      const updatedReceipts = allReceipts.filter(r => r.date !== receipt.date);
      localStorage.setItem("receiptHistory", JSON.stringify(updatedReceipts));
    };

    if (buyer && seller && receipt) {
      saveToHistories();
    }
  }, [buyer, seller, receipt]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const formatCurrency = (amount) => amount.toLocaleString("th-TH", { minimumFractionDigits: 2 });
  const calculateTotal = () => receipt?.items?.reduce((sum, i) => sum + i.quantity * i.price, 0) || 0;
  const calculateVAT = () => calculateTotal() * 0.07;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-area, #invoice-area * {
              visibility: visible;
            }
            #invoice-area {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>

      <div style={{ backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem", color: "white" }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      <div id="invoice-area" style={{ width: "21cm", minHeight: "29.7cm", margin: "2rem auto", backgroundColor: "white", padding: "2rem", borderRadius: "15px", boxShadow: "0 0 12px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ color: "#1a1aa6" }}>ใบเสร็จรับเงิน/ใบกำกับภาษี</h2>
          <button style={{ backgroundColor: "#4da6ff", border: "none", color: "white", padding: "0.5rem 1rem", borderRadius: "5px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={() => window.print()}>
            พิมพ์หน้านี้ <FaPrint />
          </button>
        </div>

        <div style={{ fontSize: "14px", marginBottom: "1rem" }}>วันที่ {new Date().toLocaleDateString("th-TH")} เล่มที่ 001 เลขที่ {String(invoiceNumber).padStart(3, '0')}</div>

        <div style={{ fontSize: "14px", marginBottom: "1.5rem" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>ชื่อผู้ขาย</strong>
            <div>{seller?.firstName} {seller?.lastName}</div>
            <div>{seller?.companyName}</div>
            <div>ที่อยู่: {seller?.address}</div>
            <div>เลขประจำตัวผู้เสียภาษี: {seller?.taxId} โทรศัพท์ {seller?.phone}</div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <strong>ชื่อผู้ซื้อ</strong>
            <div>{buyer?.firstName} {buyer?.lastName}</div>
            <div>{buyer?.companyName}</div>
            <div>ที่อยู่: {buyer?.address}</div>
            <div>เลขประจำตัวผู้เสียภาษี: {buyer?.taxId} โทรศัพท์ {buyer?.phone}</div>
          </div>
        </div>

        {receipt && receipt.items && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={thStyle}>ลำดับ</th>
                <th style={thStyle}>รายการ</th>
                <th style={thStyle}>จำนวน</th>
                <th style={thStyle}>หน่วยละ</th>
                <th style={thStyle}>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={tdStyle}>{formatCurrency(item.price)}</td>
                  <td style={tdStyle}>{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: "1rem", fontSize: "14px", textAlign: "right" }}>
          <div>มูลค่าก่อนเสียภาษี {formatCurrency(calculateTotal())}</div>
          <div>ภาษีมูลค่าเพิ่ม (VAT) {formatCurrency(calculateVAT())}</div>
          <div style={{ fontWeight: "bold" }}>ยอดรวม {formatCurrency(calculateTotal() + calculateVAT())}</div>
        </div>
      </div>

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

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

const MenuItem = ({ icon, text, onClick }) => (
  <div onClick={onClick} style={{ padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "#000", cursor: "pointer", fontSize: "14px" }}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

export default CreatetaxInvoice;