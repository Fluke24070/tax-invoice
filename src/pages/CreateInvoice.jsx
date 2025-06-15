import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaBars, FaUserCircle, FaSignOutAlt, FaClipboardList, FaSearch
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

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

const CreateInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerHeight = 64;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [modalReceipt, setModalReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [specificDate, setSpecificDate] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReceipts = async () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:3000/receist_get_com/${encodeURIComponent(user.companyName)}`);
        const data = await res.json();
        const formatted = data.data.product.map((receipt) => ({
          ...receipt,
          items: JSON.parse(receipt.item),
          isInvoiced: receipt.status,
        }));
        setReceipts(formatted);
      } catch (error) {
        console.error("โหลดใบเสร็จล้มเหลว:", error);
      }
    };
    fetchReceipts();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const formatDate = (iso) => {
    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toLocalDateStr = (d) => new Date(d).toLocaleDateString('en-CA');

  const filteredReceipts = receipts.filter((receipt) => {
    const receiptDate = toLocalDateStr(receipt.date);
    const todayStr = toLocalDateStr(new Date());

    const idMatch = receipt.re_id.toString().includes(searchTerm);
    const itemMatch = receipt.items.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const dateMatch = formatDate(receipt.date).includes(searchTerm);
    const priceMatch = receipt.total.toString().includes(searchTerm);
    const searchMatch = itemMatch || dateMatch || priceMatch || idMatch;

    const matchFilter =
      (filterMode === "today" && receiptDate === todayStr) ||
      filterMode === "all";

    const matchSpecificDate = specificDate ? receiptDate === specificDate : true;

    return searchMatch && matchFilter && matchSpecificDate;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => b.re_id - a.re_id);
  const paginatedReceipts = sortedReceipts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);

  const thStyle = { padding: "12px", borderBottom: "1px solid #aaa" };
  const tdStyle = { padding: "10px" };
  const pageButtonStyle = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#cce0ff",
    fontWeight: "bold",
    cursor: "pointer"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "0 1rem",
        color: "white", position: "sticky", top: 0, zIndex: 10
      }}>
        <FaBars onClick={toggleSidebar} style={{ cursor: "pointer" }} />
        <span style={{ fontWeight: "bold" }}>TAX INVOICE</span>
        <FaUserCircle size={24} onClick={() => navigate("/UiCompany")} style={{ cursor: "pointer" }} />
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0, width: "200px",
          height: `calc(100vh - ${headerHeight}px)`, backgroundColor: "#9999ff", zIndex: 20
        }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "1rem 0" }}>
            <div>
              <MenuItem icon={<FiFileText />} text="ประวัติการออกใบกำกับภาษี" onClick={() => navigate("/IihCompany")} active={location.pathname === "/IihCompany"} />
              <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} active={location.pathname === "/UiCompany"} />
              <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} active={location.pathname === "/Product"} />
              <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} active={location.pathname === "/CreateInvoice"} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => { localStorage.clear(); navigate("/login"); }} />
            </div>
          </div>
        </div>
      )}

      {/* ปุ่มค้นหา + เพิ่มรายการ */}
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>รายการใบเสร็จ</h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/Addreceipt")} style={{ borderRadius: "30px", padding: "0.7rem 2rem", border: "none", backgroundColor: "#a6d4ff", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
          เพิ่มรายการใบเสร็จ
        </button>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", padding: "0.4rem 1rem", borderRadius: "30px" }}>
          <input
            type="text"
            placeholder="ค้นหาจากวันที่รายการ ชื่อลูกค้า หรือราคา"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ border: "none", outline: "none", fontSize: "16px", backgroundColor: "transparent", width: "220px" }}
          />
          <FaSearch />
        </div>
      </div>

{/* Dropdown + Date Picker */}
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
  <select
    value={filterMode}
    onChange={(e) => {
      setFilterMode(e.target.value);
      setCurrentPage(1);
    }}
    style={{ padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "16px" }}
  >
    <option value="all">ดูทั้งหมด</option>
    <option value="today">ดูวันนี้</option>
  </select>

  <label style={{ fontSize: "16px" }}>เลือกวันที่ต้องการจะดู :</label>
  <input
    type="date"
    value={specificDate}
    onChange={(e) => {
      setSpecificDate(e.target.value);
      setCurrentPage(1);
    }}
    style={{ padding: "0.5rem", fontSize: "16px", borderRadius: "6px" }}
  />
  {specificDate && (
    <button onClick={() => setSpecificDate("")} style={{
      padding: "0.4rem 1rem",
      fontSize: "14px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#ffcccc",
      cursor: "pointer"
    }}>
      ล้างวันที่
    </button>
  )}
</div>


      {/* ตารางใบเสร็จ */}
      <div style={{ margin: "1rem auto", width: "95%", maxWidth: "850px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", marginTop: "1rem", borderRadius: "12px", overflow: "hidden" }}>
          <thead style={{ backgroundColor: "#d0e8ff", color: "#000", fontWeight: "bold" }}>
            <tr>
              <th style={thStyle}>ลำดับ</th>
              <th style={thStyle}>เลขที่ใบเสร็จ</th>
              <th style={thStyle}>วันที่</th>
              <th style={thStyle}>รายการ</th>
              <th style={thStyle}>ราคา</th>
              <th style={thStyle}>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReceipts.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>ไม่พบรายการ</td></tr>
            ) : (
              paginatedReceipts.map((receipt, i) => (
                <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                  <td style={tdStyle}>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td style={tdStyle}>{receipt.re_id}</td>
                  <td style={tdStyle}>{formatDate(receipt.date)}</td>
                  <td style={tdStyle}>{receipt.items[0]?.name || "-"}</td>
                  <td style={tdStyle}>{Number(receipt.total).toLocaleString()} ฿</td>
                  <td style={tdStyle}>
                    <button onClick={() => setModalReceipt(receipt)} style={{ color: "#1a1aa6", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>
                      ดูใบเสร็จ
                    </button>
                    <span style={{ margin: "0 6px" }}>/</span>
                    <button onClick={() => navigate("/makeinvoice", { state: { receipt } })} style={{ color: "#1a1aa6", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>
                      ออกใบกำกับ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} style={pageButtonStyle}>หน้าก่อน</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} style={{
            ...pageButtonStyle,
            backgroundColor: currentPage === i + 1 ? "#1a1aa6" : "#cce0ff",
            color: currentPage === i + 1 ? "white" : "black"
          }}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} style={pageButtonStyle}>หน้าถัดไป</button>
      </div>

      {/* Modal รายละเอียดใบเสร็จ */}
      {modalReceipt && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px",
            maxWidth: "600px", width: "90%", maxHeight: "80%", overflowY: "auto"
          }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>รายละเอียดใบเสร็จ</h2>
            <p><strong>วันที่:</strong> {formatDate(modalReceipt.date)}</p>
            <p><strong>เลขที่ใบเสร็จ:</strong> {modalReceipt.re_id}</p>
            <hr />
            {modalReceipt.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span>{item.quantity.toFixed(2)} × {item.name}</span>
                <span>{Number(item.price).toLocaleString()} ฿</span>
              </div>
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><strong>มูลค่าก่อนภาษี:</strong></span>
              <span>{modalReceipt.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><strong>VAT 7%:</strong></span>
              <span>{(modalReceipt.total * 0.07).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px", marginTop: "0.5rem" }}>
              <span>ยอดรวม:</span>
              <span>{(modalReceipt.total * 1.07).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button onClick={() => setModalReceipt(null)} style={{
                padding: "0.5rem 1.5rem", backgroundColor: "#1a1aa6", color: "white",
                border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer"
              }}>
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
