import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaUserCircle, FaShoppingCart, FaSignOutAlt,
  FaClipboardList, FaHome, FaSearch
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Addreceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [companyName, setCompanyName] = useState("");
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
      const storedCompanyName = localStorage.getItem("companyName");
      if (storedCompanyName) {
        setCompanyName(storedCompanyName);
      } else {
        console.warn("ไม่พบ companyName ใน localStorage");
      }
    }, []);

  useEffect(() => {
      console.log("Current companyName:", companyName);
      const fetchProducts = async () => {
        if (companyName) {
          try {
            const res = await fetch(`http://localhost:3000/product_get_com/${companyName}`);
            const data = await res.json();
            if (data.status === 200) {
              setProducts(data.data.product);
            } else {
              console.error('Failed to fetch products:', data.message);
            }
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        } else {
          console.warn('Company name is not available');
        }
      };
      if (companyName) {
        fetchProducts();
      }
    }, [companyName]);

  const handleQuantityChange = (productId, delta) => {
    setCart((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const handleCreateReceipt = async () => {
    const selectedItems = Object.entries(cart)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === parseInt(productId));
        return {
          productId: parseInt(productId),
          name: product?.name,
          price: product?.price,
          quantity,
        };
      });
  
    if (selectedItems.length === 0) {
      alert("กรุณาเลือกสินค้าก่อนทำใบเสร็จ");
      return;
    }
  
    const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    const receiptData = {
      date: new Date().toISOString(), // ตรงกับ backend ที่ใช้ column ชื่อ "date"
      item: JSON.stringify(selectedItems), // แปลงเป็น string เพื่อเก็บลงฐานข้อมูล
      companyName,
      total, // ส่งยอดรวม
    };
  
    console.log("ส่งข้อมูลใบเสร็จ:", receiptData);
  
    try {
      const res = await fetch("http://localhost:3000/create_receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receiptData),
      });
  
      const data = await res.json();
  
      if (data.status === 200) {
        alert("สร้างใบเสร็จเรียบร้อยแล้ว");
        setCart({});
        navigate("/IihCompany");
      } else {
        console.error("การสร้างใบเสร็จล้มเหลว:", data.message);
        alert("เกิดข้อผิดพลาดในการสร้างใบเสร็จ");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };
  
  

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 1rem", color: "white"
      }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <h1 style={{ fontFamily: "monospace", fontSize: "20px", letterSpacing: "1px" }}>TAX INVOICE</h1>
        <FaUserCircle style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {menuOpen && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0, bottom: 0,
          width: "200px", backgroundColor: "#9999ff",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "1rem 0", zIndex: 2
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

      <div style={{ marginLeft: menuOpen ? "200px" : "0", padding: "2rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <FaSearch style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", color: "#888" }} />
            <input
              type="text"
              placeholder="ค้นหาสิ่งของที่ต้องการ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "0.6rem 2rem", width: "100%", borderRadius: "20px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={{ backgroundColor: "#fff", border: "2px solid #0000ff", borderRadius: "8px", padding: "0.5rem", textAlign: "center" }}>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                  />
                )}
                <div style={{ fontWeight: "bold", marginTop: "0.5rem" }}>{product.name}</div>
                <div style={{ marginBottom: "0.5rem" }}>{Number(product.price).toLocaleString()} บาท</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                  <div>{cart[product.id] || 0}</div>
                  <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleCreateReceipt} style={{
            marginTop: "2rem", backgroundColor: "#4da6ff", color: "white",
            padding: "0.8rem 1.5rem", border: "none", borderRadius: "10px",
            fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            <FaClipboardList /> ทำใบเสร็จ
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ เพิ่มตัวเช็ค active สำหรับเมนู
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

export default Addreceipt;
