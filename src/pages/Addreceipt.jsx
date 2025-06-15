import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars, FaUserCircle, FaSearch, FaClipboardList, FaShoppingCart, FaSignOutAlt
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
  const [categories, setCategories] = useState(["ทั้งหมด"]);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) setCompanyName(storedCompanyName);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!companyName) return;
      const res = await fetch(`http://localhost:3000/product_get_com/${companyName}`);
      const data = await res.json();
      if (data.status === 200) setProducts(data.data.product);
    };
    fetchProducts();
  }, [companyName]);

  useEffect(() => {
    const unique = new Set();
    products.forEach(p => unique.add(p.item_type?.trim() || "ยังไม่ได้จัดหมวดหมู่"));
    setCategories(["ทั้งหมด", ...Array.from(unique)]);
  }, [products]);

  const handleQuantityChange = (productId, delta) => {
    setCart(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const handleCreateReceipt = async () => {
    const selectedItems = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const prod = products.find(p => p.id === parseInt(id));
        return { productId: parseInt(id), name: prod?.name, price: prod?.price, quantity: qty };
      });
    if (!selectedItems.length) return alert("กรุณาเลือกสินค้า");

    const total = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const now = new Date();
    const receiptData = {
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0],
      item: JSON.stringify(selectedItems),
      companyName,
      total
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
        alert("เกิดข้อผิดพลาด");
      }
    } catch {
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const type = p.item_type?.trim() || "ยังไม่ได้จัดหมวดหมู่";
    const matchCategory = selectedCategory === "ทั้งหมด" || selectedCategory === type;
    return matchSearch && matchCategory;
  });

  const grouped = filtered.reduce((acc, p) => {
    const type = p.item_type?.trim() || "ยังไม่ได้จัดหมวดหมู่";
    if (!acc[type]) acc[type] = [];
    acc[type].push(p);
    return acc;
  }, {});

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

  return (
    <div style={{ backgroundColor: "#e6f0ff", minHeight: "100vh", paddingBottom: "2rem" }}>
      <div style={{
        backgroundColor: "#1a1aa6", height: "64px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        padding: "0 1rem", color: "white", position: "sticky", top: 0, zIndex: 10
      }}>
        <FaBars style={{ cursor: "pointer" }} onClick={() => setSidebarVisible(!sidebarVisible)} />
        <h1 style={{ fontFamily: "monospace", fontSize: "20px" }}>TAX INVOICE</h1>
        <FaUserCircle style={{ cursor: "pointer" }} onClick={() => navigate("/UiCompany")} />
      </div>

      {sidebarVisible && (
        <div style={{
          position: "fixed", top: `${headerHeight}px`, left: 0,
          width: "200px", height: `calc(100vh - ${headerHeight}px)`, backgroundColor: "#9999ff",
          zIndex: 20, overflow: "hidden"
        }}>
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            height: "100%", padding: "1rem 0"
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

      <h1 style={{ textAlign: "center", margin: "1.5rem 0" }}>ออกใบเสร็จ</h1>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <FaSearch style={{
            position: "absolute", top: "50%", left: "12px",
            transform: "translateY(-50%)", color: "#888"
          }} />
          <input
            type="text"
            placeholder="ค้นหาสินค้า"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.6rem 2rem", width: "100%",
              borderRadius: "20px", border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{
          width: "100%", height: "45px", borderRadius: "20px",
          border: "1.5px solid #1a1aa6", backgroundColor: "#dfe9ff",
          padding: "0 1rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", fontSize: "15px", cursor: "pointer"
        }} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span>หมวดหมู่ : {selectedCategory}</span>
          <span style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }}>▲</span>
        </div>

        {dropdownOpen && (
          <div style={{
            backgroundColor: "white", border: "1px solid #ccc",
            borderRadius: "10px", marginTop: "5px", width: "100%", zIndex: 10
          }}>
            <input
              type="text"
              placeholder="ค้นหาหมวดหมู่"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              style={{
                padding: "0.4rem 0.8rem", width: "100%",
                border: "none", borderBottom: "1px solid #ccc",
                outline: "none", borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px"
              }}
            />
            {categories
              .filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()))
              .map(cat => (
                <div key={cat} onClick={() => {
                  setSelectedCategory(cat);
                  setDropdownOpen(false);
                  setCategorySearch("");
                }} style={{
                  padding: "0.5rem 1rem", cursor: "pointer",
                  backgroundColor: selectedCategory === cat ? "#e0e0ff" : "white"
                }}>{cat}</div>
              ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 1rem", maxWidth: "1200px", margin: "2rem auto" }}>
        {Object.keys(grouped).map((category) => (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>{category}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {grouped[category].map(product => (
                <div key={product.id} style={{
                  backgroundColor: "#fff", border: "2px solid #0000ff", borderRadius: "8px",
                  padding: "0.5rem", textAlign: "center"
                }}>
                  {product.image && (
                    <img src={product.image} alt={product.name} style={{
                      width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px"
                    }} />
                  )}
                  <div style={{ fontWeight: "bold", marginTop: "0.5rem" }}>{product.name}</div>
                  <div>{Number(product.price).toLocaleString()} บาท</div>
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem"
                  }}>
                    <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cart[product.id]?.toString() || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          const cleaned = value.replace(/^0+(?=\d)/, "");
                          setCart(prev => ({
                            ...prev,
                            [product.id]: cleaned === "" ? 0 : parseInt(cleaned)
                          }));
                        }
                      }}
                      style={{ width: "50px", textAlign: "center" }}
                    />
                    <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <button onClick={handleCreateReceipt} style={{
          backgroundColor: "#4da6ff", color: "white",
          padding: "0.8rem 1.5rem", border: "none",
          borderRadius: "10px", fontSize: "16px", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: "0.5rem"
        }}>
          <FaClipboardList /> ทำใบเสร็จ
        </button>
      </div>
    </div>
  );
};

export default Addreceipt;
