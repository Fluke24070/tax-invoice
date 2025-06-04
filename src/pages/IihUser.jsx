import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaUserCircle, FaSignOutAlt, FaHome, FaSearch, FaPrint
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const IihUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showTaxInvoiceModal, setShowTaxInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const email = currentUser.email;

  useEffect(() => {
    if (!email) return;
    fetch(`http://localhost:3000/invoice_get_email/${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          const parsed = data.data.product.map(row => ({
            ...row,
            seller: typeof row.seller === "string" ? JSON.parse(row.seller) : row.seller,
            buyer: typeof row.buyer === "string" ? JSON.parse(row.buyer) : row.buyer,
            item: typeof row.item === "string" ? JSON.parse(row.item) : row.item,
          }));
          setReceipts(parsed);
        }
      });
  }, [email]);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const formatCurrency = (amount) => Number(amount).toLocaleString("th-TH", { minimumFractionDigits: 2 });
  const formatDate = (iso) => new Date(iso).toLocaleDateString("th-TH");
  const formatTime = (iso) => new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

  const filteredReceipts = receipts
    .filter(r => r?.buyer?.email === email)
    .filter((r) => {
      const keyword = searchTerm.toLowerCase();
      return formatDate(r.date).includes(keyword) ||
        `${r.seller.firstName} ${r.seller.lastName}`.toLowerCase().includes(keyword) ||
        String(r.invoice_num || r.id || "").toLowerCase().includes(keyword);
    });

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const paginatedReceipts = filteredReceipts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
  const tdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };

  const openReceiptModal = (r) => {
    setSelectedReceipt(r);
    setShowReceiptModal(true);
    setShowTaxInvoiceModal(false);
  };

  const openTaxInvoiceModal = (r) => {
    setSelectedReceipt(r);
    setShowTaxInvoiceModal(true);
    setShowReceiptModal(false);
  };

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-print").innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>พิมพ์ใบกำกับภาษี</title>
          <style>
            body { font-family: Tahoma, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            h2 { color: #000; text-align: right; margin-bottom: 1rem; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>`);
    win.document.close();
    win.print();
  };

  const closeModal = () => {
    setSelectedReceipt(null);
    setShowReceiptModal(false);
    setShowTaxInvoiceModal(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#d6e8ff" }}>

      <div style={{
        backgroundColor: "#1a1aa6", color: "white", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem"
      }}>
        <div onClick={toggleSidebar} style={{ cursor: "pointer" }}><FaBars size={20} /></div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>TAX INVOICE</h1>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiUser")} />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>ประวัติการออกใบกำกับภาษี</h1>

      {sidebarVisible && (
        <div style={{
          position: "fixed", top: "64px", left: 0, width: "200px",
          height: "calc(100vh - 64px)", backgroundColor: "#9999ff", zIndex: 20
        }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "1rem 0" }}>
            <div>
              <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainUser")} active={location.pathname === "/MainUser"} />
              <MenuItem icon={<FiFileText />} text="ประวัติใบกำกับภาษี" onClick={() => navigate("/IihUser")} active={location.pathname === "/IihUser"} />
              <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiUser")} active={location.pathname === "/UiUser"} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => { localStorage.clear(); navigate("/Enter"); }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ margin: "1.5rem auto", display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", backgroundColor: "#cce0ff",
          padding: "0.5rem 1rem", borderRadius: "30px", width: "80%", maxWidth: "600px"
        }}>
          <input type="text" placeholder="ค้นหาชื่อผู้ขาย, วันที่, หรือเลขใบกำกับ"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              border: "none", outline: "none", background: "transparent",
              flexGrow: 1, fontSize: "14px"
            }} />
          <FaSearch />
        </div>
      </div>

      <div style={{ width: "90%", margin: "0 auto", background: "white", borderRadius: "10px", overflowX: "auto" }}>
<table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
  <thead>
    <tr style={{ backgroundColor: "#b3ccff" }}>
      <th style={thStyle}>ลำดับ</th>
      <th style={thStyle}>วันที่</th>
      <th style={thStyle}>เลขที่ใบกำกับ</th>
      <th style={thStyle}>ราคา</th>
      <th style={thStyle}>รายละเอียด</th>
    </tr>
  </thead>
  <tbody>
    {paginatedReceipts.map((r, i) => (
      <tr key={i}>
        <td style={tdStyle}>{(currentPage - 1) * itemsPerPage + i + 1}</td>
        <td style={tdStyle}>{formatDate(r.date)}</td>
        <td style={tdStyle}>{r.invoice_num || r.id}</td>
        <td style={tdStyle}>{formatCurrency(r.grand_total)}</td>
        <td style={tdStyle}>
          <span onClick={() => openReceiptModal(r)} style={{ color: "#1a1aa6", cursor: "pointer", marginRight: "1rem" }}>
            ใบเสร็จ
          </span>
          <span onClick={() => openTaxInvoiceModal(r)} style={{ color: "#1a1aa6", cursor: "pointer" }}>
            ใบกำกับ
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "0.5rem" }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>หน้าก่อน</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} style={{
            backgroundColor: currentPage === i + 1 ? "#6666cc" : "#e6f0ff",
            color: currentPage === i + 1 ? "white" : "#000", border: "none",
            padding: "4px 8px", borderRadius: "8px", cursor: "pointer"
          }}>{i + 1}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>หน้าถัดไป</button>
      </div>

      {showReceiptModal && selectedReceipt && (
        <div onClick={closeModal} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "10px",
            width: "600px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>ใบเสร็จรับเงิน</h2>
            <p><b>วันที่:</b> {formatDate(selectedReceipt.date)} {formatTime(selectedReceipt.date)}</p>
            <hr />
            {selectedReceipt.item.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.quantity} × {item.name}</span>
                <span>{formatCurrency(item.price)}</span>
              </div>
            ))}
            <hr />
            <div style={{ textAlign: "right" }}>
              <div>มูลค่าก่อนภาษี: {formatCurrency(selectedReceipt.total)}</div>
              <div>VAT 7%: {formatCurrency(selectedReceipt.vat)}</div>
              <div><b>ยอดรวม: {formatCurrency(selectedReceipt.grand_total)}</b></div>
            </div>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button onClick={closeModal} style={{
                padding: "0.5rem 2rem", backgroundColor: "#1a1aa6",
                color: "white", border: "none", borderRadius: "8px"
              }}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {showTaxInvoiceModal && selectedReceipt && (
        <div onClick={closeModal} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px",
            width: "80%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ color: "#000" }}>ใบกำกับภาษี</h2>
              <button onClick={closeModal} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>✖</button>
            </div>

            <div id="invoice-print">
              <div><b>วันที่:</b> {formatDate(selectedReceipt.date)}</div>
              <div><b>เลขที่ใบกำกับภาษี:</b> {selectedReceipt.invoice_num || selectedReceipt.id}</div>
              <div><b>เลขที่อ้างอิง:</b> {selectedReceipt.id}</div>
              <hr />
              <div><b>ชื่อผู้ขาย:</b> {selectedReceipt.seller.firstName} {selectedReceipt.seller.lastName}</div>
              <div><b>บริษัท:</b> {selectedReceipt.seller.companyName}</div>
              <div><b>ที่อยู่:</b> {selectedReceipt.seller.address}</div>
              <div><b>เลขประจำตัวผู้เสียภาษี:</b> {selectedReceipt.seller.taxId}</div>
              <hr />
              <div><b>ชื่อผู้ซื้อ:</b> {selectedReceipt.buyer.firstName} {selectedReceipt.buyer.lastName}</div>
              <div><b>บริษัท:</b> {selectedReceipt.buyer.companyName}</div>
              <div><b>ที่อยู่:</b> {selectedReceipt.buyer.address}</div>
              <div><b>เลขประจำตัวผู้เสียภาษี:</b> {selectedReceipt.buyer.taxId}</div>
              <hr />
              <table>
                <thead>
                  <tr><th>ลำดับ</th><th>สินค้า</th><th>จำนวน</th><th>หน่วยละ</th><th>รวม</th></tr>
                </thead>
                <tbody>
                  {selectedReceipt.item.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: "right", marginTop: "1rem" }}>
                <div>มูลค่าก่อนภาษี: {formatCurrency(selectedReceipt.total)}</div>
                <div>VAT 7%: {formatCurrency(selectedReceipt.vat)}</div>
                <div><b>ยอดรวม: {formatCurrency(selectedReceipt.grand_total)}</b></div>
              </div>
            </div>

            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <button onClick={printInvoice} style={{
                backgroundColor: "#4da6ff", color: "white",
                padding: "0.5rem 1rem", borderRadius: "8px",
                border: "none", cursor: "pointer", fontWeight: "bold"
              }}>
                <FaPrint style={{ marginRight: "8px" }} />
                พิมพ์ใบกำกับภาษี
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

export default IihUser;
