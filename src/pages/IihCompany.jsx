import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaUser, FaPrint, FaShoppingCart,
  FaClipboardList, FaUserCircle, FaSignOutAlt, FaHome
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const IihCompany = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ใช้ตรวจ path ปัจจุบัน
  const [menuOpen, setMenuOpen] = useState(true);
  const [receipts, setReceipts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const invoices = JSON.parse(localStorage.getItem("companyInvoices")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const filteredReceipts = invoices.filter((invoice) =>
      invoice.seller.firstName === currentUser.firstName &&
      invoice.seller.lastName === currentUser.lastName
    );
    setReceipts(filteredReceipts);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleView = (index) => setSelected(selected === index ? null : index);

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleString("th-TH", options);
  };

  const printInvoice = () => {
    const content = document.getElementById("invoice-print").innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>ใบกำกับภาษี</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            h2 { color: #1a1aa6; }
          </style>
        </head>
        <body>${content}</body>
      </html>`);
    win.document.close();
    win.print();
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
        fontWeight: active ? "bold" : "normal"
      }}
    >
      <div style={{ fontSize: "18px" }}>{icon}</div>
      <div>{text}</div>
    </div>
  );

  const thStyle = { border: "1px solid #ddd", padding: "8px", textAlign: "center" };
  const tdStyle = { border: "1px solid #ddd", padding: "8px", textAlign: "center" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-print, #invoice-print * {
              visibility: visible;
            }
            #invoice-print {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={{ backgroundColor: "#1a1aa6", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem", color: "white" }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}><FaBars size={20} /></div>
        <h1 style={{ fontSize: "20px" }}>TAX INVOICE</h1>
        <FaUser style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {/* Sidebar */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, bottom: 0, width: "200px",
          backgroundColor: "#9999ff", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "1rem 0", zIndex: 2
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

      {/* Content */}
      <div style={{ marginLeft: menuOpen ? "200px" : "0", padding: "2rem" }}>
        {receipts.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>
            ไม่พบใบกำกับภาษีที่ตรงกับข้อมูลของบริษัทนี้
          </div>
        ) : (
          receipts.map((receipt, index) => (
            <div key={index}>
              <div style={{ backgroundColor: "#e6f2ff", padding: "1rem", borderRadius: "10px", marginBottom: "1rem", boxShadow: "0 0 6px rgba(0,0,0,0.1)" }}>
                <div style={{ fontWeight: "bold" }}>ประวัติรายการที่ {index + 1}</div>
                <div>วันที่: {formatDateTime(receipt.date)}</div>
                <div>ลูกค้า: {receipt.buyer.firstName} {receipt.buyer.lastName}</div>
                <div>เลขผู้เสียภาษี: {receipt.buyer.taxId}</div>
                <div>ที่อยู่: {receipt.buyer.address}</div>
                <button
                  style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#4da6ff", color: "white", border: "none", borderRadius: "5px" }}
                  onClick={() => toggleView(index)}
                >
                  {selected === index ? "ซ่อนใบกำกับภาษี" : "ดูใบกำกับภาษี"}
                </button>
              </div>

              {selected === index && (
                <div style={{ marginBottom: "3rem" }}>
                  <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                    <button onClick={printInvoice} style={{
                      backgroundColor: "#4da6ff", border: "none", color: "white",
                      padding: "0.5rem 1rem", borderRadius: "5px",
                      display: "flex", alignItems: "center", gap: "0.5rem"
                    }}>
                      พิมพ์ใบกำกับภาษี <FaPrint />
                    </button>
                  </div>

                  <div id="invoice-print" style={{
                    width: "21cm", minHeight: "29.7cm", backgroundColor: "white",
                    padding: "2rem", borderRadius: "15px",
                    boxShadow: "0 0 12px rgba(0,0,0,0.1)", margin: "auto"
                  }}>
                    <h2 style={{ color: "#1a1aa6" }}>ใบเสร็จรับเงิน/ใบกำกับภาษี</h2>
                    <div style={{ fontSize: "14px", marginBottom: "1rem" }}>
                      วันที่ {formatDateTime(receipt.date)} เล่มที่ 001 เลขที่ {String(index + 1).padStart(3, '0')}
                    </div>

                    <div style={{ fontSize: "14px", marginBottom: "1.5rem" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <strong>ชื่อผู้ขาย</strong>
                        <div>{receipt.seller.firstName} {receipt.seller.lastName}</div>
                        <div>{receipt.seller.companyName}</div>
                        <div>ที่อยู่: {receipt.seller.address}</div>
                        <div>เลขประจำตัวผู้เสียภาษี: {receipt.seller.taxId} โทรศัพท์ {receipt.seller.phone}</div>
                      </div>
                      <div style={{ marginTop: "1.5rem" }}>
                        <strong>ชื่อผู้ซื้อ</strong>
                        <div>{receipt.buyer.firstName} {receipt.buyer.lastName}</div>
                        <div>{receipt.buyer.companyName}</div>
                        <div>ที่อยู่: {receipt.buyer.address}</div>
                        <div>เลขประจำตัวผู้เสียภาษี: {receipt.buyer.taxId} โทรศัพท์ {receipt.buyer.phone}</div>
                      </div>
                    </div>

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

                    <div style={{ marginTop: "1rem", fontSize: "14px", textAlign: "right" }}>
                      <div>มูลค่าก่อนเสียภาษี {formatCurrency(receipt.total)}</div>
                      <div>ภาษีมูลค่าเพิ่ม (VAT) {formatCurrency(receipt.vat)}</div>
                      <div style={{ fontWeight: "bold" }}>ยอดรวม {formatCurrency(receipt.total + receipt.vat)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IihCompany;
