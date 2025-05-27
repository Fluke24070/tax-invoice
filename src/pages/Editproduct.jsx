import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaShoppingCart, FaBars, FaUserCircle, FaSignOutAlt, FaClipboardList, FaHome } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Editproduct = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams(); 
  const location = useLocation();

  const headerHeight = 64;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [product, setProduct] = useState({
    id: "",
    name: "",
    detail: "",
    price: "",
    unit: "",
    item_type: "ยังไม่ได้จัดหมวดหมู่",
  });

  const [productCategory, setProductCategory] = useState("");
  const [categories, setCategories] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("categories")) || [
      "อาหารจานเดียว", "อาหารแปลก", "เครื่องใช้ไฟฟ้า", "อื่น ๆ"
    ];
    if (!stored.includes("ยังไม่ได้จัดหมวดหมู่")) stored.push("ยังไม่ได้จัดหมวดหมู่");
    return stored;
  });

  const textareaRef = useRef(null);

  useEffect(() => {
    if (!productId) {
      alert("ไม่พบสินค้าที่ต้องการแก้ไข");
      navigate("/Product");
      return;
    }

    fetch(`http://localhost:3000/product_get_id/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProduct({
            id: data.id,
            name: data.name,
            detail: data.detail,
            price: data.price,
            unit: data.unit,
            item_type: data.item_type || "ยังไม่ได้จัดหมวดหมู่",
          });
          setProductCategory(data.item_type || "ยังไม่ได้จัดหมวดหมู่");
        } else {
          alert("ไม่พบสินค้าที่ต้องการแก้ไข");
          navigate("/Product");
        }
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        navigate("/Product");
      });
  }, [productId, navigate]);

  const formatNumberWithCommas = (value) => {
    const num = parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US");
  };

  const unformatNumber = (value) => value.replace(/,/g, "").replace(/[^\d]/g, "");

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/item_edit/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          detail: product.detail,
          price: parseFloat(unformatNumber(product.price)),
          unit: product.unit,
          item_type: productCategory.trim() || "ยังไม่ได้จัดหมวดหมู่",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("บันทึกข้อมูลเรียบร้อยแล้ว");
        navigate("/Product");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + result.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/delete_pro/${productId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        alert("ลบสินค้าเรียบร้อยแล้ว");
        navigate("/Product");
      } else {
        alert("เกิดข้อผิดพลาดในการลบสินค้า: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [product.detail]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "0 1rem",
        color: "white", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div onClick={() => setSidebarVisible(!sidebarVisible)} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0,
          width: "200px", height: `calc(100vh - ${headerHeight}px)`,
          backgroundColor: "#9999ff", zIndex: 20, overflow: "hidden"
        }}>
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            height: "100%", padding: "1rem 0",
          }}>
            <div>
              <MenuItem icon={<FaHome />} text="ใบกำกับภาษี" onClick={() => navigate("/MainCompany")} active={location.pathname === "/MainCompany"} />
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

      {/* Form */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{
          backgroundColor: "white", padding: "1.5rem", borderRadius: "10px",
          width: "90%", maxWidth: "400px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1rem"
        }}>
          <input
            placeholder="ชื่อรายการสินค้า"
            value={product.name}
            onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))}
            style={inputStyle}
          />

          <textarea
            placeholder="รายละเอียดสินค้า"
            value={product.detail}
            onChange={(e) => setProduct((p) => ({ ...p, detail: e.target.value }))}
            ref={textareaRef}
            style={{ ...inputStyle, resize: "none", overflow: "hidden", lineHeight: "1.6", minHeight: "50px" }}
          />

          <input
            placeholder="ราคาสินค้า"
            value={product.price}
            onChange={(e) => {
              const raw = unformatNumber(e.target.value);
              setProduct((p) => ({ ...p, price: formatNumberWithCommas(raw) }));
            }}
            onBlur={(e) => {
              const raw = unformatNumber(e.target.value);
              setProduct((p) => ({ ...p, price: formatNumberWithCommas(raw) }));
            }}
            style={inputStyle}
          />

          <input
            placeholder="หน่วย/unit"
            value={product.unit}
            onChange={(e) => setProduct((p) => ({ ...p, unit: e.target.value }))}
            style={inputStyle}
          />

          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <button onClick={handleSave} style={saveButtonStyle}>บันทึกข้อมูล</button>
          <button onClick={handleDelete} style={{ ...saveButtonStyle, backgroundColor: "#dc3545" }}>ลบสินค้า</button>
        </div>
      </div>
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

const inputStyle = {
  width: "100%",
  padding: "0.6rem 1rem",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const saveButtonStyle = {
  width: "100%",
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "0.8rem 0",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Editproduct;
