import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle, FaShoppingCart, FaSignOutAlt, FaClipboardList, FaHome, FaSearch } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Addreceipt = () => {
  const navigate = useNavigate();
  const headerHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    const filteredProducts = storedProducts.filter(
      (product) => product.companyName === currentUser.companyName
    );

    setProducts(filteredProducts);
  }, []);

  const handleQuantityChange = (productId, delta) => {
    setCart((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const handleCreateReceipt = () => {
    const receiptItems = products
      .filter((product) => cart[product.id] > 0)
      .map((product) => ({
        ...product,
        quantity: cart[product.id],
      }));

    if (receiptItems.length === 0) {
      alert("กรุณาเลือกสินค้าก่อนทำใบเสร็จ");
      return;
    }

    const receiptHistory = JSON.parse(localStorage.getItem("receiptHistory")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    const newReceipt = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: receiptItems,
      companyName: currentUser.companyName || "",
      total: receiptItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    receiptHistory.push(newReceipt);
    localStorage.setItem("receiptHistory", JSON.stringify(receiptHistory));

    alert("สร้างใบเสร็จเรียบร้อยแล้ว");
    navigate("/CreateInvoice");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem", color: "white" }}>
        <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <h1 style={{ fontFamily: "monospace", fontSize: "20px", letterSpacing: "1px" }}>TAX INVOICE</h1>
        <FaUserCircle style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", top: `${headerHeight}px`, left: 0, bottom: 0, width: "200px", backgroundColor: "#9999ff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0", zIndex: 2 }}>
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

          <button onClick={handleCreateReceipt} style={{ marginTop: "2rem", backgroundColor: "#4da6ff", color: "white", padding: "0.8rem 1.5rem", border: "none", borderRadius: "10px", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaClipboardList /> ทำใบเสร็จ
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, onClick }) => (
  <div onClick={onClick} style={{ padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "#000", cursor: "pointer", fontSize: "14px" }}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>{text}</div>
  </div>
);

export default Addreceipt;
