import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaUserCircle, FaSignOutAlt, FaShoppingCart,
  FaClipboardList, FaPrint, FaSearch
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const IihCompany = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
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

        // 🔽 จัดเรียงตามวันล่าสุด และ receipt_id มากสุดก่อน
        const sorted = parsed.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;

          return (b.receipt_id || 0) - (a.receipt_id || 0);
        });

        setReceipts(sorted);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchReceipts();
  }, []);

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("th-TH");

  const filteredReceipts = receipts.filter((receipt) => {
    const keyword = searchTerm.toLowerCase();
    const buyerMatch = `${receipt.buyer.firstName} ${receipt.buyer.lastName}`.toLowerCase().includes(keyword);
    const invoiceMatch = String(receipt.invoice_num || receipt.id || "").toLowerCase().includes(keyword);
    const dateMatch = formatDate(receipt.date).includes(keyword);

    const dateFilterMatch = selectedDate
      ? new Date(receipt.date).toLocaleDateString('en-CA') === selectedDate
      : true;

    return (buyerMatch || invoiceMatch || dateMatch) && dateFilterMatch;
  });

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const openInvoiceModal = (receipt) => setSelectedReceipt(receipt);
  const closeInvoiceModal = () => setSelectedReceipt(null);
  const openReceiptModal = (receipt) => {
    setSelectedReceiptForView(receipt);
    setShowReceiptModal(true);
  };
  const closeReceiptModal = () => {
    setSelectedReceiptForView(null);
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
            @media print {
              .no-print { display: none !important; }
            }
            body {
              font-family: "Tahoma", sans-serif;
              padding: 40px;
              margin: 0;
              font-size: 14px;
            }
            h3 { margin-top: 0; color: #1a1aa6; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: center;
            }
            hr {
              margin: 1rem 0;
            }
            .totals {
              text-align: right;
              margin-top: 1rem;
              font-size: 14px;
            }
            .totals b {
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
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
      padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem",
      color: active ? "white" : "#000", backgroundColor: active ? "#6666cc" : "transparent",
      cursor: "pointer", fontSize: "14px", fontWeight: active ? "bold" : "normal"
    }}>
      <div style={{ fontSize: "18px" }}>{icon}</div>
      <div>{text}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#d6e8ff" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#1a1aa6", color: "white", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem"
      }}>
        <div onClick={toggleSidebar} style={{ cursor: "pointer" }}><FaBars size={20} /></div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>TAX INVOICE</h1>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <div style={{
          position: "fixed", top: "64px", left: 0, width: "200px",
          height: "calc(100vh - 64px)", backgroundColor: "#9999ff", zIndex: 20
        }}>
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            height: "100%", padding: "1rem 0"
          }}>
            <div>
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

      {/* Title */}
      <h1 style={{ textAlign: "center", margin: "1.5rem 0 1rem" }}>ประวัติการออกใบกำกับภาษี</h1>

      {/* Search */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div style={{
          display: "flex", alignItems: "center", backgroundColor: "#cce0ff",
          padding: "0.5rem 1rem", borderRadius: "30px", width: "80%", maxWidth: "600px"
        }}>
          <input
            type="text"
            placeholder="ค้นหาผ่านวันที่ ชื่อลูกค้า หรือเลขที่ใบกำกับ"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              border: "none", outline: "none", background: "transparent",
              flexGrow: 1, fontSize: "14px"
            }}
          />
          <FaSearch />
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
          style={{
            padding: "0.5rem 1rem", fontSize: "14px", borderRadius: "10px", border: "1px solid #ccc"
          }}
        />
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedDate("");
            setCurrentPage(1);
          }}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "14px",
            borderRadius: "10px",
            backgroundColor: "#ff9999",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          ล้างข้อมูล
        </button>
      </div>


      {/* Table */}
      <div style={{ width: "90%", margin: "0 auto", background: "white", borderRadius: "10px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#b3ccff" }}>
              <th style={thStyle}>ลำดับ</th>
              <th style={thStyle}>วันที่</th>
              <th style={thStyle}>เลขที่ใบกำกับ</th>
              <th style={thStyle}>ยอดรวม</th>
              <th style={thStyle}>ใบเสร็จ</th>
              <th style={thStyle}>ใบกำกับภาษี</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReceipts.map((receipt, index) => (
              <tr key={index}>
                <td style={tdStyle}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td style={tdStyle}>{formatDate(receipt.date)}</td>
                <td style={tdStyle}>{receipt.invoice_num || receipt.id}</td>
                <td style={tdStyle}>{formatCurrency(receipt.grand_total)}</td>
                <td style={tdStyle}>
                  <button onClick={() => openReceiptModal(receipt)} style={{
                    backgroundColor: "#28a745", color: "white", padding: "0.3rem 1rem",
                    borderRadius: "5px", border: "none", cursor: "pointer"
                  }}>
                    ใบเสร็จ
                  </button>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => openInvoiceModal(receipt)} style={{
                    backgroundColor: "#1a75ff", color: "white", padding: "0.3rem 1rem",
                    borderRadius: "5px", border: "none", cursor: "pointer"
                  }}>
                    ใบกำกับ
                  </button>
                </td>
              </tr>
            ))}
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
      {selectedReceipt && (
        <div onClick={closeInvoiceModal} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px",
            width: "80%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              
              <button onClick={closeInvoiceModal} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>✖</button>
            </div>

<div id="invoice-print">
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <h2 style={{ fontSize: "20px", color: "#000", marginBottom: "1rem", marginTop: 0 }}>
      ใบกำกับภาษี
    </h2>
  </div>

  <div style={{ fontSize: "14px", marginBottom: "1rem" }}>
    <div>วันที่ออกใบกำกับ: {formatDate(selectedReceipt.date)}</div>
    <div>เลขที่ใบกำกับภาษี: {selectedReceipt.invoice_num || selectedReceipt.id}</div>
    <div>เลขที่อ้างอิง: {selectedReceipt.id}</div>
    <div>เลขที่ใบเสร็จ: {selectedReceipt.receipt_id}</div>
  </div>

  {/* ข้อมูลผู้ขาย */}
  <div><b>ชื่อผู้ขาย:</b> {selectedReceipt.seller.firstName} {selectedReceipt.seller.lastName}</div>
  <div><b>บริษัท:</b> {selectedReceipt.seller.companyName}</div>
  <div><b>ที่อยู่:</b> {selectedReceipt.seller.address}</div>
  <div><b>เลขประจำตัวผู้เสียภาษี:</b> {selectedReceipt.seller.taxId}</div>
  <div><b>เบอร์โทร:</b> {selectedReceipt.seller.phone || "-"}</div>

  <hr />

  {/* ข้อมูลผู้ซื้อ */}
  <div><b>ชื่อผู้ซื้อ:</b> {selectedReceipt.buyer.firstName} {selectedReceipt.buyer.lastName}</div>
  <div><b>บริษัท:</b> {selectedReceipt.buyer.companyName}</div>
  <div><b>ที่อยู่:</b> {selectedReceipt.buyer.address}</div>
  <div><b>เลขประจำตัวผู้เสียภาษี:</b> {selectedReceipt.buyer.taxId}</div>
  <div><b>เบอร์โทร:</b> {selectedReceipt.buyer.phone || "-"}</div>

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


<div style={{ textAlign: "right", marginTop: "1rem" }} className="no-print">
  <button onClick={printInvoice} style={{
    backgroundColor: "#4da6ff",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  }}>
    <FaPrint style={{ marginRight: "8px" }} />
    พิมพ์ใบกำกับภาษี
  </button>
</div>

          </div>
        </div>
      )}

      {showReceiptModal && selectedReceiptForView && (
        <div onClick={closeReceiptModal} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px",
            width: "80%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ color: "#28a745" }}>ใบเสร็จ</h3>
              <button onClick={closeReceiptModal} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>✖</button>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "1rem" }}>
              <div>วันที่ทำรายการ: {formatDate(selectedReceiptForView.date)}</div>
              <div>เลขที่ใบเสร็จ: {selectedReceiptForView.receipt_id}</div>
            </div>
            <div><b>ลูกค้า:</b> {selectedReceiptForView.buyer.firstName} {selectedReceiptForView.buyer.lastName}</div>
            <hr />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginTop: "10px" }}>
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
                {selectedReceiptForView.item.map((item, i) => (
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
              <div><b>ยอดรวม:</b> {formatCurrency(selectedReceiptForView.total)}</div>
              <div><b>VAT:</b> {formatCurrency(selectedReceiptForView.vat)}</div>
              <div><b>ยอดสุทธิ:</b> {formatCurrency(selectedReceiptForView.grand_total)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IihCompany;
