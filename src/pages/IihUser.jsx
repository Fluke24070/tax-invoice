import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaPrint,
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

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const email = currentUser.email;
    if (!email) return;

    fetch(`http://localhost:3000/invoice_get_email/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          const parsed = data.data.product.map((row) => ({
            ...row,
            seller:
              typeof row.seller === "string"
                ? JSON.parse(row.seller)
                : row.seller,
            buyer:
              typeof row.buyer === "string"
                ? JSON.parse(row.buyer)
                : row.buyer,
            item:
              typeof row.item === "string" ? JSON.parse(row.item) : row.item,
          }));
          setReceipts(parsed);
        }
      });
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const openReceiptModal = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
    setShowTaxInvoiceModal(false);
  };
  const closeReceiptModal = () => {
    setSelectedReceipt(null);
    setShowReceiptModal(false);
  };

  const openTaxInvoiceModal = (receipt) => {
    setSelectedReceipt(receipt);
    setShowTaxInvoiceModal(true);
    setShowReceiptModal(false);
  };
  const closeTaxInvoiceModal = () => {
    setSelectedReceipt(null);
    setShowTaxInvoiceModal(false);
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const formatDate = (iso) => new Date(iso).toLocaleDateString("th-TH");
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Filter receipts by search term (date or seller name)
  const filteredReceipts = receipts.filter((receipt) => {
    const keyword = searchTerm.toLowerCase();
    const dateMatch = formatDate(receipt.date).includes(keyword);
    const sellerMatch = `${receipt.seller.firstName} ${receipt.seller.lastName}`
      .toLowerCase()
      .includes(keyword);
    return dateMatch || sellerMatch;
  });

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
  const tdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#d6e8ff" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1a1aa6",
          color: "white",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <div onClick={toggleSidebar} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>TAX INVOICE</h1>
        <FaUserCircle
          size={24}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/UiUser")}
        />
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            width: "200px",
            height: "calc(100vh - 64px)",
            backgroundColor: "#9999ff",
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              padding: "1rem 0",
            }}
          >
            <div>
              <MenuItem
                icon={<FaHome />}
                text="หน้าแรก"
                onClick={() => navigate("/MainUser")}
                active={location.pathname === "/MainUser"}
              />
              <MenuItem
                icon={<FiFileText />}
                text="ประวัติการออกใบกำกับภาษี"
                onClick={() => navigate("/IihUser")}
                active={location.pathname === "/IihUser"}
              />
              <MenuItem
                icon={<FaUserCircle />}
                text="ข้อมูลผู้ใช้งาน"
                onClick={() => navigate("/UiUser")}
                active={location.pathname === "/UiUser"}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MenuItem
                icon={<FaSignOutAlt />}
                text="ออกจากระบบ"
                onClick={() => {
                  localStorage.clear();
                  navigate("/Enter");
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div
        style={{
          margin: "1.5rem auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#cce0ff",
            padding: "0.5rem 1rem",
            borderRadius: "30px",
            width: "80%",
            maxWidth: "600px",
          }}
        >
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ขาย หรือ วันที่"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flexGrow: 1,
              fontSize: "14px",
            }}
          />
          <FaSearch />
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          width: "90%",
          margin: "2rem auto",
          background: "white",
          borderRadius: "10px",
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
        >
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
            {paginatedReceipts.map((receipt, index) => (
              <tr key={index}>
                <td style={tdStyle}>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td style={tdStyle}>{formatTime(receipt.date)}</td>
                <td style={tdStyle}>{formatDate(receipt.date)}</td>
                <td style={tdStyle}>
                  {receipt.invoiceNumber || `INV${index + 1}`}
                </td>
                <td style={tdStyle}>{formatCurrency(receipt.grand_total)}</td>
                <td style={tdStyle}>
                  <span
                    onClick={() => openReceiptModal(receipt)}
                    style={{ color: "#1a1aa6", cursor: "pointer", marginRight: "1rem" }}
                  >
                    1.ดูใบเสร็จ
                  </span>
                  <span
                    onClick={() => openTaxInvoiceModal(receipt)}
                    style={{ color: "#1a1aa6", cursor: "pointer" }}
                  >
                    2.ดูใบกำกับ
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          style={{ padding: "4px 8px", borderRadius: "8px", cursor: "pointer" }}
        >
          หน้าก่อน
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              backgroundColor: currentPage === i + 1 ? "#6666cc" : "#e6f0ff",
              color: currentPage === i + 1 ? "white" : "#000",
              border: "none",
              padding: "4px 8px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          style={{ padding: "4px 8px", borderRadius: "8px", cursor: "pointer" }}
        >
          หน้าถัดไป
        </button>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={closeReceiptModal} />
      )}

      {/* Tax Invoice Modal */}
      {showTaxInvoiceModal && selectedReceipt && (
        <TaxInvoiceModal
          receipt={selectedReceipt}
          onClose={closeTaxInvoiceModal}
          formatCurrency={formatCurrency}
        />
      )}
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

const ReceiptModal = ({ receipt, onClose }) => {
  const vatRate = 0.07;
  const total = Number(receipt.total);
  const vatAmount = Number((total * vatRate).toFixed(2));
  const totalWithVAT = Number((total + vatAmount).toFixed(2));

  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "10px",
          width: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>ใบเสร็จรับเงิน</h2>
        <p>
          <strong>วันที่:</strong>{" "}
          {new Date(receipt.date).toLocaleDateString("th-TH")}{" "}
          {new Date(receipt.date).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <hr />
        {receipt.item.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>
              {Number(item.quantity).toFixed(2)} × {item.name}
            </span>
            <span>
              {Number(item.price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            <strong>มูลค่าก่อนภาษี:</strong>
          </span>
          <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            <strong>VAT 7%:</strong>
          </span>
          <span>{vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "18px",
            marginTop: "1rem",
          }}
        >
          <span>ยอดรวม:</span>
          <span>{totalWithVAT.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 2rem",
              backgroundColor: "#1a1aa6",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

const TaxInvoiceModal = ({ receipt, onClose, formatCurrency }) => {
  if (!receipt) return null;

  // ฟังก์ชันพิมพ์ใบกำกับภาษี (ย้ายมาไว้ในนี้)
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

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "80%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ color: "#1a1aa6" }}>ใบกำกับภาษี</h3>
          <button
            onClick={onClose}
            style={{
              fontSize: "20px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>

        <div id="invoice-print">
          <div>
            <b>ชื่อผู้ขาย:</b> {receipt.seller.firstName} {receipt.seller.lastName}
          </div>
          <div>
            <b>บริษัท:</b> {receipt.seller.companyName}
          </div>
          <div>
            <b>ที่อยู่:</b> {receipt.seller.address}
          </div>
          <div>
            <b>เลขประจำตัวผู้เสียภาษี:</b> {receipt.seller.taxId}
          </div>
          <hr />
          <div>
            <b>ชื่อผู้ซื้อ:</b> {receipt.buyer.firstName} {receipt.buyer.lastName}
          </div>
          <div>
            <b>บริษัท:</b> {receipt.buyer.companyName}
          </div>
          <div>
            <b>ที่อยู่:</b> {receipt.buyer.address}
          </div>
          <div>
            <b>เลขประจำตัวผู้เสียภาษี:</b> {receipt.buyer.taxId}
          </div>
          <hr />
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead style={{ backgroundColor: "#eee" }}>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  ลำดับ
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  สินค้า
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  จำนวน
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  หน่วยละ
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  รวม
                </th>
              </tr>
            </thead>
            <tbody>
              {receipt.item.map((item, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    {i + 1}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    {item.name}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    {formatCurrency(item.price)}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <div>มูลค่าก่อนภาษี: {formatCurrency(receipt.total)}</div>
            <div>VAT 7%: {formatCurrency(receipt.vat)}</div>
            <div>
              <b>ยอดรวม: {formatCurrency(receipt.grand_total)}</b>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: "1rem" }}>
          <button
            onClick={printInvoice}
            style={{
              backgroundColor: "#4da6ff",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <FaPrint style={{ marginRight: "8px" }} />
            พิมพ์ใบกำกับภาษี
          </button>
        </div>
      </div>
    </div>
  );
};

export default IihUser;
