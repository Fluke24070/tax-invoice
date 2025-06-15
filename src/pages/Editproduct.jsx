import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaHome
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

// Sidebar menu item component
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
  const [customUnit, setCustomUnit] = useState("");
  const [productCategory, setProductCategory] = useState("ยังไม่ได้จัดหมวดหมู่");
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState(["ยังไม่ได้จัดหมวดหมู่"]);
  const textareaRef = useRef(null);

  // Load product data
  useEffect(() => {
    if (!productId) {
      alert("ไม่พบสินค้าที่ต้องการแก้ไข");
      navigate("/Product");
      return;
    }

    fetch(`http://localhost:3000/product_get_id/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        const productData = data?.data?.product?.[0];
        if (productData) {
          setProduct({
            id: productData.id,
            name: productData.name,
            detail: productData.detail,
            price: productData.price?.toString() || "",
            unit: productData.unit,
            item_type: productData.item_type,
          });
          setProductCategory(productData.item_type || "ยังไม่ได้จัดหมวดหมู่");
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

  // Load categories
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const companyName = currentUser.companyName;
    if (!companyName) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`http://localhost:3000/product_get_com/${companyName}`);
        const data = await res.json();
        if (data.status === 200) {
          const items = data.data.product;
          const uniqueTypes = new Set();
          items.forEach((item) => {
            const type = item.item_type?.trim();
            if (type && type !== "") uniqueTypes.add(type);
            else uniqueTypes.add("ยังไม่ได้จัดหมวดหมู่");
          });
          setCategories(Array.from(uniqueTypes));
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Format and unformat price with commas
  const formatNumberWithCommas = (value) => {
    const num = parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US");
  };
  const unformatNumber = (value) => value.replace(/,/g, "").replace(/[^\d]/g, "");

  // Save changes
  const handleSave = async () => {
    // validation example
    if (!product.name || !product.price) {
      alert("กรุณากรอกชื่อและราคาสินค้า");
      return;
    }

    const unitValue = product.unit === "custom" ? customUnit.trim() : product.unit.trim();
    const itemTypeValue = productCategory === "custom" ? customCategory.trim() : productCategory.trim();

    try {
      const response = await fetch(`http://localhost:3000/item_edit/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          detail: product.detail,
          price: parseFloat(unformatNumber(product.price)),
          unit: unitValue,
          item_type: itemTypeValue || "ยังไม่ได้จัดหมวดหมู่",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("บันทึกข้อมูลเรียบร้อยแล้ว");
         window.location.href = "/Product"; // บังคับโหลดใหม่
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + result.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) return;
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [product.detail]);

  const inputStyle = {
    width: "80%",
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", position: "relative" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "0 1rem",
        color: "white", position: "sticky", top: 0, zIndex: 10
      }}>
        <div onClick={() => setSidebarVisible(!sidebarVisible)} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {/* Sidebar Menu */}
      {sidebarVisible && (
        <div style={{
          position: "fixed",
          top: `${headerHeight}px`,
          left: 0,
          width: "200px",
          height: `calc(100vh - ${headerHeight}px)`,
          backgroundColor: "#9999ff",
          zIndex: 20,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            height: "100%", padding: "1rem 0",
          }}>
            <div>
              <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} active={location.pathname === "/IihCompany"} />
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

      {/* Page Title */}
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>แก้ไขสินค้า</h1>

      {/* Form Container */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "10px", width: "90%", maxWidth: "400px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <input placeholder="ชื่อรายการสินค้า" value={product.name} onChange={(e) => setProduct(p => ({ ...p, name: e.target.value }))} style={inputStyle} />

          <textarea placeholder="รายละเอียดสินค้า" value={product.detail} onChange={(e) => setProduct(p => ({ ...p, detail: e.target.value }))} ref={textareaRef} style={{ ...inputStyle, resize: "none", overflow: "hidden", lineHeight: "1.6", minHeight: "50px" }} />

          <input placeholder="ราคาสินค้า" value={product.price} onChange={(e) => { const raw = unformatNumber(e.target.value); setProduct(p => ({ ...p, price: formatNumberWithCommas(raw) })); }} onBlur={(e) => { const raw = unformatNumber(e.target.value); setProduct(p => ({ ...p, price: formatNumberWithCommas(raw) })); }} style={inputStyle} />

          {/* Unit Dropdown */}
          <select value={product.unit} onChange={(e) => { const value = e.target.value; setProduct(p => ({ ...p, unit: value })); if (value !== "custom") setCustomUnit(""); }} style={inputStyle}>
            <option value="">-- เลือกหน่วย --</option>
            <option value="custom">+ เพิ่มหน่วย</option>
            <option value="ชิ้น">ชิ้น</option>
            <option value="กล่อง">กล่อง</option>
            <option value="แพ็ค">แพ็ค</option>
            <option value="กิโลกรัม">กิโลกรัม</option>
            <option value="ลิตร">ลิตร</option>
          </select>
          {product.unit === "custom" && (
            <input placeholder="พิมพ์ชื่อหน่วยใหม่" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} style={{ ...inputStyle, marginTop: "0.5rem" }} />
          )}

          {/* Category Dropdown */}
          <select value={productCategory} onChange={(e) => { const value = e.target.value; setProductCategory(value); if (value !== "custom") { setProduct(p => ({ ...p, item_type: value })); setCustomCategory(""); } }} style={inputStyle}>
            <option value="">-- เลือกประเภทสินค้า --</option>
            <option value="custom">+ เพิ่มประเภทสินค้า</option>
            {categories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
          </select>
          {productCategory === "custom" && (
            <input placeholder="พิมพ์ประเภทใหม่" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={{ ...inputStyle, marginTop: "0.5rem" }} />
          )}

          <button onClick={handleSave} style={saveButtonStyle}>บันทึกข้อมูล</button>
          <button onClick={handleDelete} style={{ ...saveButtonStyle, backgroundColor: "#dc3545" }}>ลบสินค้า</button>
        </div>
      </div>
    </div>
  );
};

export default Editproduct;
