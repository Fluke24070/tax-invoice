import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaUser, FaPrint, FaShoppingCart,
  FaClipboardList, FaUserCircle, FaSignOutAlt, FaHome, FaSearch
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const IihCompany = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReceipts = async () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
      if (!currentUser.companyName) return;

      try {
        const url = `http://localhost:3000/invoice_get_com/${encodeURIComponent(currentUser.companyName)}`;
        const res = await fetch(url);
        const json = await res.json();
        const data = json.data?.product || [];

        const parsed = data.map((row) => ({
          ...row,
          seller: typeof row.seller === "string" ? JSON.parse(row.seller) : row.seller,
          buyer: typeof row.buyer === "string" ? JSON.parse(row.buyer) : row.buyer,
          item: typeof row.item === "string" ? JSON.parse(row.item) : row.item,
        }));

        setReceipts(parsed);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchReceipts();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const openModal = (receipt) => setSelectedReceipt(receipt);
  const closeModal = () => setSelectedReceipt(null);

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const formatDate = (iso) => new Date(iso).toLocaleDateString("th-TH");
  const formatTime = (iso) => new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-print").innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>พิมพ์ใบกำกับภาษี</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>`);
    win.document.close();
    win.print();
  };

  const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
  const tdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
  const paginationBtnStyle = {
    padding: "0.4rem 0.8rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#e6f0ff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
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

  const totalPages = Math.ceil(receipts.length / itemsPerPage);
  const paginatedReceipts = receipts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

const ReceiptModal = ({ receipt, onClose }) => {
  const vatRate = 0.07;

  const total = Number(receipt.total);
  const vatAmount = Number((total * vatRate).toFixed(2));
  const totalWithVAT = Number((total + vatAmount).toFixed(2));

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
      alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white", padding: "2rem", borderRadius: "10px",
        width: "600px", maxHeight: "90vh", overflowY: "auto"
      }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>ใบเสร็จรับเงิน</h2>
        <p><strong>วันที่:</strong> {formatDate(receipt.date)} {formatTime(receipt.date)}</p>
        <hr />
        {receipt.item.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{Number(item.quantity).toFixed(2)} × {item.name}</span>
            <span>{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>มูลค่าก่อนภาษี:</strong></span>
          <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>VAT 7%:</strong></span>
          <span>{vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", fontWeight: "bold",
          fontSize: "18px", marginTop: "1rem"
        }}>
          <span>ยอดรวม:</span>
          <span>{totalWithVAT.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button onClick={onClose} style={{
            padding: "0.5rem 2rem", backgroundColor: "#1a1aa6", color: "white",
            border: "none", borderRadius: "8px"
          }}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#d6e8ff" }}>
      <div style={{
        backgroundColor: "#1a1aa6",
        color: "white",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem"
      }}>
        <div onClick={toggleSidebar} style={{ cursor: "pointer" }}><FaBars size={20} /></div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>TAX INVOICE</h1>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {sidebarVisible && (
        <div style={{
          position: "fixed", top: "64px", left: 0, width: "200px",
          height: "calc(100vh - 64px)", backgroundColor: "#9999ff", zIndex: 20
        }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "1rem 0" }}>
            <div>
              <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainCompany")} active={location.pathname === "/MainCompany"} />
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

      <div style={{ margin: "1.5rem auto", display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", backgroundColor: "#cce0ff",
          padding: "0.5rem 1rem", borderRadius: "30px", width: "80%", maxWidth: "600px"
        }}>
          <input type="text" placeholder="ค้นหาผ่านวันที่ทำรายการ ชื่อลูกค้า" style={{
            border: "none", outline: "none", background: "transparent",
            flexGrow: 1, fontSize: "14px"
          }} />
          <FaSearch />
          <div style={{ marginLeft: "10px", cursor: "pointer" }}>📅</div>
        </div>
      </div>

      <div style={{ width: "90%", margin: "0 auto", background: "white", borderRadius: "10px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#b3ccff" }}>
              <th style={thStyle}>ลำดับ</th>
              <th style={thStyle}>เวลา</th>
              <th style={thStyle}>วันที่</th>
              <th style={thStyle}>เลขที่ใบกำกับ</th>
              <th style={thStyle}>ราคา</th>
              <th style={thStyle}>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReceipts.map((receipt, index) => {
              return (
                <tr key={index}>
                  <td style={tdStyle}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td style={tdStyle}>{formatTime(receipt.date)}</td>
                  <td style={tdStyle}>{formatDate(receipt.date)}</td>
                  <td style={tdStyle}>{receipt.invoiceNumber || `INV${index + 1}`}</td>
                  <td style={tdStyle}>{formatCurrency(receipt.grand_total)}</td>
                  <td style={tdStyle}>
                    <span onClick={() => { setSelectedReceipt(receipt); setShowReceiptModal(true); }}
                      style={{ color: "#1a1aa6", cursor: "pointer", marginRight: "1rem" }}>1.ดูใบเสร็จ</span>
                    <span onClick={() => openModal(receipt)} style={{ color: "#1a1aa6", cursor: "pointer" }}>2.ดูใบกำกับ</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "0.5rem" }}>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} style={paginationBtnStyle}>หน้าก่อน</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} style={{
            ...paginationBtnStyle,
            backgroundColor: currentPage === i + 1 ? "#6666cc" : "#e6f0ff",
            color: currentPage === i + 1 ? "white" : "#333",
          }}>{i + 1}</button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} style={paginationBtnStyle}>หน้าถัดไป</button>
      </div>

      {showReceiptModal && selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={() => setShowReceiptModal(false)} />
      )}

      {/* Modal ใบกำกับ */}
      {selectedReceipt && (
        <div onClick={closeModal} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px",
            width: "80%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ color: "#1a1aa6" }}>ใบกำกับภาษี</h3>
              <button onClick={closeModal} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>✖</button>
            </div>

            <div id="invoice-print">
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
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead style={{ backgroundColor: "#eee" }}>
                  <tr>
                    <th style={thStyle}>ลำดับ</th>
                    <th style={thStyle}>สินค้า</th>
                    <th style={thStyle}>จำนวน</th>
                    <th style={thStyle}>หน่วยละ</th>
                    <th style={thStyle}>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceipt.item.map((item, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.quantity}</td>
                      <td style={tdStyle}>{formatCurrency(item.price)}</td>
                      <td style={tdStyle}>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <div>มูลค่าก่อนภาษี: {formatCurrency(selectedReceipt.total)}</div>
                <div>VAT 7%: {formatCurrency(selectedReceipt.vat)}</div>
                <div><b>ยอดรวม: {formatCurrency(selectedReceipt.grand_total)}</b></div>
              </div>
            </div>

            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <button onClick={printInvoice} style={{
                backgroundColor: "#4da6ff", color: "white", padding: "0.5rem 1rem",
                borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold"
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

export default IihCompany;
