import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaHome,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Product = () => {
  const navigate = useNavigate();
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, []);

  const handleAddProduct = () => navigate("/Addproduct");

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

      {/* Action Section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem", gap: "1rem" }}>
        <button onClick={handleAddProduct} style={buttonStyle}>
          <FaShoppingCart style={iconStyle} /> เพิ่มรายการสินค้า
        </button>

        {/* ช่องค้นหา + Auto Suggest */}
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

          {searchTerm && (
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #1a1aa6",
                borderRadius: "10px",
                marginTop: "0.3rem",
                width: "100%",
                maxHeight: "150px",
                overflowY: "auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "absolute",
                zIndex: 3,
              }}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    onClick={() => setSearchTerm(product.name)}
                    style={{
                      padding: "0.6rem 1rem",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {product.name}
                  </div>
                ))
              ) : (
                <div style={{ padding: "0.6rem 1rem", color: "#666" }}>ไม่พบสินค้า</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <h3 style={{ textAlign: "center", marginTop: "2rem" }}>สินค้าของคุณ</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "1rem",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "1rem",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate("/Editproduct", { state: { productId: product.id } })}
            style={{
              backgroundColor: "#fff",
              border: "2px solid #1a1aa6",
              padding: "0.5rem",
              textAlign: "center",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px" }}
              />
            )}
            <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{product.name}</div>
            <div>{Number(product.price).toLocaleString()} บาท</div>
          </div>
        ))}
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

const buttonStyle = {
  backgroundColor: "#dfe9ff",
  border: "1.5px solid #1a1aa6",
  borderRadius: "20px",
  padding: "0.6rem 1rem",
  width: "280px",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  fontSize: "15px",
  color: "#000",
  cursor: "pointer",
  boxShadow: "inset 0 0 0.5px #fff",
};

const iconStyle = {
  marginRight: "10px",
  fontSize: "16px",
};

export default Product;
