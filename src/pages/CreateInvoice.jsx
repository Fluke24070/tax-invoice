// ✅ CreateInvoice.jsx (with Receipt ID in Table and Modal)
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
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
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
        setCurrentUser(user);
      } catch (error) {
        console.error("โหลดใบเสร็จล้มเหลว:", error);
      }
    };
    fetchReceipts();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const formatDate = (iso) => new Date(iso).toLocaleDateString("th-TH");

  const filteredReceipts = receipts.filter((receipt) => {
  const idMatch = receipt.re_id.toString().includes(searchTerm);
    const itemMatch = receipt.items.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const dateMatch = new Date(receipt.date).toLocaleDateString("th-TH").includes(searchTerm);
    const priceMatch = receipt.total.toString().includes(searchTerm);
    return itemMatch || dateMatch || priceMatch || idMatch;
  });

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const paginatedReceipts = sortedReceipts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);

  const thStyle = { padding: "12px", borderBottom: "1px solid #aaa" };
  const tdStyle = { padding: "10px" };
  const pageButtonStyle = {
    padding: "6px 12px", borderRadius: "6px", border: "none",
    backgroundColor: "#cce0ff", fontWeight: "bold", cursor: "pointer"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", paddingBottom: "3rem" }}>
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "0 1rem",
        color: "white", position: "sticky", top: 0, zIndex: 10
      }}>
        <FaBars onClick={toggleSidebar} style={{ cursor: "pointer" }} />
        <span style={{ fontWeight: "bold" }}>TAX INVOICE</span>
        <FaUserCircle size={24} onClick={() => navigate("/UiCompany")} style={{ cursor: "pointer" }} />
      </div>

      {sidebarVisible && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0, width: "200px",
          height: `calc(100vh - ${headerHeight}px)`, backgroundColor: "#9999ff", zIndex: 20
        }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "1rem 0" }}>
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
                    <button onClick={() => setSelectedReceipt(receipt)} style={{ color: "#1a1aa6", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>
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

      {selectedReceipt && (
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
            {currentUser && (
              <div>
                <p><strong>ชื่อบริษัท:</strong> {currentUser.companyName}</p>
                <p><strong>ที่อยู่:</strong> {currentUser.address}</p>
                <p><strong>เบอร์โทร:</strong> {currentUser.phone}</p>
                <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> {currentUser.taxId}</p>
                <p><strong>สาขา:</strong> {currentUser.branch}</p>
                <p><strong>เลขที่ใบเสร็จ:</strong> {selectedReceipt.re_id}</p>
              </div>
            )}
            <p><strong>วันที่:</strong> {formatDate(selectedReceipt.date)}</p>
            <hr />
            {selectedReceipt.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.quantity.toFixed(2)} × {item.name}</span>
                <span>{Number(item.price).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><strong>มูลค่าก่อนภาษี:</strong></span>
              <span>{selectedReceipt.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><strong>VAT 7%:</strong></span>
              <span>{(selectedReceipt.total * 0.07).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px", marginTop: "1rem" }}>
              <span>ยอดรวม:</span>
              <span>{(selectedReceipt.total * 1.07).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
              <button onClick={() => setSelectedReceipt(null)} style={{
                padding: "0.5rem 2rem", backgroundColor: "#1a1aa6", color: "white",
                border: "none", borderRadius: "8px"
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