import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaHome,
  FaUserCircle,
  FaSignOutAlt,
  FaShoppingCart,
  FaClipboardList,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);
  const [receiptHistory, setReceiptHistory] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const headerHeight = 64;
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    } else {
      console.warn("ไม่พบ companyName ใน localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser || !currentUser.companyName) {
          console.warn("ไม่พบข้อมูลผู้ใช้งานใน localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/receist_get_com/${currentUser.companyName}`
        );
        const data = await response.json();
        if (data.status === 200) {
          setReceiptHistory(data.data.product);
          setCompanyName(currentUser.companyName);
        } else {
          console.warn("การดึงข้อมูลไม่สำเร็จ");
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", err);
      }
    };

    fetchReceipts();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReceipts = receiptHistory
    .map((receipt) => {
      const items = receipt.item ? JSON.parse(receipt.item) : [];
      return {
        ...receipt,
        items,
      };
    })
    .filter((receipt) => {
      if (filterType === "invoiced") return receipt.isInvoiced;
      if (filterType === "notInvoiced") return !receipt.isInvoiced;
      return true;
    });

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", display: "flex" }}>
      <div
        style={{
          width: "200px",
          backgroundColor: "#9999ff",
          paddingTop: `${headerHeight}px`,
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 2,
        }}
      >
        <div>
          <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainCompany")} active={location.pathname === "/MainCompany"} />
          <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} active={location.pathname === "/IihCompany"} />
          <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} active={location.pathname === "/UiCompany"} />
          <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} active={location.pathname === "/Product"} />
          <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} active={location.pathname === "/CreateInvoice"} />
        </div>
        <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => navigate("/Enter")} />
      </div>

      <div style={{ flex: 1, marginLeft: menuOpen ? "200px" : "0", transition: "margin 0.3s" }}>
        <div
          style={{
            backgroundColor: "#1a1aa6",
            height: `${headerHeight}px`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1rem",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <FaBars onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: "pointer" }} />
          <h1 style={{ fontFamily: "monospace", letterSpacing: "2px", fontSize: "20px" }}>
            TAX INVOICE
          </h1>
          <FaUser style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
        </div>

        <div style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: "1px solid #ccc",
                fontSize: "16px"
              }}
            >
              <option value="all">แสดงทั้งหมด</option>
              <option value="notInvoiced">ยังไม่ออกใบกำกับ</option>
              <option value="invoiced">ออกใบกำกับแล้ว</option>
            </select>
          </div>

          <div style={{ backgroundColor: "#a6d4ff", padding: "0.75rem 2rem", borderRadius: "8px", textAlign: "center", fontWeight: "bold", fontSize: "20px", marginBottom: "1.5rem" }}>
            รายการใบเสร็จ
          </div>

          {filteredReceipts.map((receipt, index) => {
            const total = Array.isArray(receipt.items)
              ? receipt.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
              : 0;

            return (
              <div
                key={index}
                onClick={() =>
                  navigate("/CreatetaxInvoice", {
                    state: {
                      buyer: location.state?.buyer,
                      receipt,
                    },
                  })
                }
                style={{
                  backgroundColor: "#fff",
                  padding: "1rem",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  maxWidth: "700px",
                  margin: "1rem auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  <span>ประวัติรายการที่ {index + 1}</span>
                  <span style={{ fontWeight: "normal" }}>{formatDate(receipt.date)} {formatTime(receipt.date)}</span>
                </div>
                <hr />
                {Array.isArray(receipt.items) &&
                  receipt.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0" }}>
                      <span>{item.quantity.toFixed(2)} × {item.name}</span>
                      <span>{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                  <span>รวม</span>
                  <span>{total.toLocaleString()} บาท</span>
                </div>
                {receipt.isInvoiced && (
                  <div style={{ marginTop: "0.5rem", color: "green", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    ✅ ออกใบกำกับภาษีแล้ว
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
