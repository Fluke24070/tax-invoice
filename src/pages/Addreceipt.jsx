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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [companyName, setCompanyName] = useState("");

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    } else {
      console.warn("ไม่พบ companyName ใน localStorage");
    }
  }, []);

  useEffect(() => {
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
      }
    };
    if (companyName) fetchProducts();
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

    const now = new Date();
    const receiptData = {
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0],
      item: JSON.stringify(selectedItems),
      companyName,
      total,
    };

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
        navigate("/CreateInvoice");
      } else {
        alert("เกิดข้อผิดพลาดในการสร้างใบเสร็จ");
      }
    } catch (error) {
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e6f0ff" }}>
      <div style={{
        backgroundColor: "#1a1aa6", height: `${headerHeight}px`, display: "flex",
        justifyContent: "space-between", alignItems: "center", padding: "0 1rem",
        color: "white", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div onClick={toggleSidebar} style={{ cursor: "pointer" }}>
          <FaBars size={20} />
        </div>
        <h1 style={{ fontFamily: "monospace", fontSize: "20px", letterSpacing: "1px" }}>TAX INVOICE</h1>
        <FaUserCircle style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => navigate("/UiCompany")} />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>ออกใบเสร็จ</h1>

      {sidebarVisible && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0,
          width: "200px", height: `calc(100vh - ${headerHeight}px)`,
          backgroundColor: "#9999ff", zIndex: 20, overflow: "hidden"
        }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "1rem 0" }}>
            <div>
              <MenuItem icon={<FiFileText />} text="ประวัติการทำรายการ" onClick={() => navigate("/IihCompany")} active={location.pathname === "/IihCompany"} />
              <MenuItem icon={<FaUserCircle />} text="ข้อมูลผู้ใช้งาน" onClick={() => navigate("/UiCompany")} active={location.pathname === "/UiCompany"} />
              <MenuItem icon={<FaShoppingCart />} text="สินค้า" onClick={() => navigate("/Product")} active={location.pathname === "/Product"} />
              <MenuItem icon={<FaClipboardList />} text="ทำใบเสร็จ" onClick={() => navigate("/CreateInvoice")} active={location.pathname === "/CreateInvoice"} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => navigate("/Enter")} />
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "2rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <FaSearch style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", color: "#888" }} />
            <input type="text" placeholder="ค้นหาสิ่งของที่ต้องการ" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "0.6rem 2rem", width: "100%", borderRadius: "20px", border: "1px solid #ccc" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={{ backgroundColor: "#fff", border: "2px solid #0000ff", borderRadius: "8px", padding: "0.5rem", textAlign: "center" }}>
                {product.image && (
                  <img src={product.image} alt={product.name} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px" }} />
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

export default Addreceipt;
