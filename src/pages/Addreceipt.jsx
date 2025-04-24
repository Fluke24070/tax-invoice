import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaHome,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Addreceipt = () => {
  const navigate = useNavigate();
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleQuantityChange = (productId, delta) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) + delta;
      if (newQty < 0) return prev;
      return { ...prev, [productId]: newQty };
    });
  };

  const handleCreateReceipt = () => {
    const items = products
      .filter((product) => cart[product.id] > 0)
      .map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: cart[product.id],
      }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newReceipt = {
      date: new Date().toISOString(),
      items,
      total,
    };

    const history = JSON.parse(localStorage.getItem("receiptHistory")) || [];
    const updatedHistory = [newReceipt, ...history];
    localStorage.setItem("receiptHistory", JSON.stringify(updatedHistory));
    console.log("📥 Receipt saved to localStorage:", newReceipt);

    navigate("/CreateInvoice");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ height: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1a1aa6",
          height: `${headerHeight}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
          color: "white",
        }}
      >
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>TAX INVOICE</span>
        <FaUserCircle size={24} style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {/* Sidebar */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: `${headerHeight}px`,
            left: 0,
            bottom: 0,
            width: "200px",
            backgroundColor: "#9999ff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "1rem 0",
            zIndex: 2,
          }}
        >
          <div>
            <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainCompany")} />
            <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} />
            <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} />
            <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} />
            <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} />
          </div>
          <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => navigate("/Enter")} />
        </div>
      )}

      {/* Search Box */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <div style={{ position: "relative", width: "280px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#dfe9ff",
              border: "1.5px solid #1a1aa6",
              borderRadius: "20px",
              padding: "0.4rem 1rem",
              width: "100%",
            }}
          >
            <FaSearch style={{ marginRight: "10px", fontSize: "16px" }} />
            <input
              type="text"
              placeholder="ค้นหาสิ่งของที่ต้องการ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                width: "100%",
                fontSize: "15px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Product Grid with Quantity Control */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "1rem",
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "1rem",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "#fff",
              border: "2px solid #1a1aa6",
              padding: "0.5rem",
              textAlign: "center",
              borderRadius: "6px",
            }}
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px" }}
              />
            )}
            <div style={{ fontWeight: "bold", marginTop: "0.5rem" }}>{product.name}</div>
            <div>{Number(product.price).toLocaleString()} บาท</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "0.5rem", gap: "0.5rem" }}>
              <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
              <span>{cart[product.id] || 0}</span>
              <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <button
          onClick={handleCreateReceipt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#4da8ff",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <FaClipboardList /> ทำใบเสร็จ
        </button>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "0.8rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      color: "#000",
      cursor: "pointer",
      fontSize: "14px",
    }}
  >
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

export default Addreceipt;
