import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaSearch, FaBars, FaUserCircle,
  FaSignOutAlt, FaClipboardList, FaHome, FaTrashAlt
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

const Product = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerHeight = 64;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(() =>
    localStorage.getItem("selectedCategory") || "ทั้งหมด"
  );

  const [categories, setCategories] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("categories")) || [
      "ทั้งหมด", "อาหารจานเดียว", "อาหารแปลก", "เครื่องใช้ไฟฟ้า", "อื่น ๆ"
    ];
    if (!stored.includes("ยังไม่ได้จัดหมวดหมู่")) stored.push("ยังไม่ได้จัดหมวดหมู่");
    localStorage.setItem("categories", JSON.stringify(stored));
    return stored;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) setCompanyName(storedCompanyName);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (companyName) {
        try {
          const res = await fetch(`http://localhost:3000/product_get_com/${companyName}`);
          const data = await res.json();
          if (data.status === 200) {
            setProducts(data.data.product);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };
    if (companyName) fetchProducts();
  }, [companyName]);

  const handleAddProduct = () => navigate("/Addproduct");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (
      selectedCategory === "ทั้งหมด" ||
      (selectedCategory === "ยังไม่ได้จัดหมวดหมู่" &&
        (!product.item_type || product.item_type.trim() === "")) ||
      product.item_type?.trim() === selectedCategory.trim()
    )
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const type = product.item_type?.trim() || "ยังไม่ได้จัดหมวดหมู่";
    if (!acc[type]) acc[type] = [];
    acc[type].push(product);
    return acc;
  }, {});

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
              <MenuItem icon={<FaHome />} text="หน้าแรก" onClick={() => navigate("/MainCompany")} active={location.pathname === "/MainCompany"} />
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

      {/* Content */}
      <div style={{ paddingTop: "40px", paddingBottom: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <button onClick={handleAddProduct} style={buttonStyle}>
          <FaShoppingCart style={iconStyle} /> เพิ่มรายการสินค้า
        </button>

        {/* Search */}
        <div style={{ position: "relative", width: "280px" }}>
          <div style={{
            display: "flex", alignItems: "center",
            backgroundColor: "#dfe9ff", border: "1.5px solid #1a1aa6",
            borderRadius: "20px", padding: "0.4rem 1rem", width: "100%"
          }}>
            <FaSearch style={{ marginRight: "10px", fontSize: "16px" }} />
            <input
              type="text"
              placeholder="ค้นหาสิ่งของที่ต้องการ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", backgroundColor: "transparent", width: "100%", fontSize: "15px" }}
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div style={{ position: "relative", width: "280px" }}>
          <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{
            backgroundColor: "#dfe9ff", border: "1.5px solid #1a1aa6",
            borderRadius: "20px", padding: "0.6rem 1rem",
            display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
          }}>
            <span>หมวดหมู่ : {selectedCategory}</span>
            <span style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }}>▲</span>
          </div>
          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "100%", left: 0, width: "100%",
              backgroundColor: "#fff", border: "1px solid #1a1aa6", borderRadius: "10px",
              marginTop: "0.3rem", zIndex: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {categories.map((category, idx) => (
                <div key={idx} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.6rem 1rem", cursor: "pointer",
                  borderBottom: idx < categories.length - 1 ? "1px solid #eee" : "none"
                }}>
                  <div onClick={() => {
                    setSelectedCategory(category);
                    localStorage.setItem("selectedCategory", category);
                    setDropdownOpen(false);
                  }} style={{ flex: 1 }}>{category}</div>
                  {category !== "ทั้งหมด" && category !== "ยังไม่ได้จัดหมวดหมู่" && (
                    <FaTrashAlt
                      title="ลบหมวดหมู่"
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmDelete = window.confirm(`ต้องการลบข้อมูลหมวดหมู่ "${category}" หรือไม่?`);
                        if (confirmDelete) {
                          const newCategories = categories.filter((c) => c !== category);
                          setCategories(newCategories);
                          setSelectedCategory("ทั้งหมด");
                          localStorage.setItem("categories", JSON.stringify(newCategories));
                          localStorage.setItem("selectedCategory", "ทั้งหมด");
                        }
                      }}
                      style={{ color: "red", marginLeft: "10px", cursor: "pointer" }}
                    />
                  )}
                </div>
              ))}
              <div onClick={() => setShowModal(true)} style={{
                padding: "0.6rem 1rem", cursor: "pointer",
                backgroundColor: "#f0f8ff", textAlign: "center", fontWeight: "bold", borderTop: "1px solid #ccc"
              }}>
                + เพิ่มหมวดหมู่ใหม่
              </div>
            </div>
          )}
        </div>

        <h3 style={{ textAlign: "center", marginTop: "2rem" }}>สินค้าของคุณ</h3>
        <h4 style={{ textAlign: "center", color: "#1a1aa6", marginTop: "0.5rem" }}>
          หมวดหมู่ที่เลือก: {selectedCategory}
        </h4>

        <div style={{ padding: "0 1rem" }}>
          {Object.keys(groupedProducts).map((category) => (
            <div key={category} style={{ marginBottom: "2rem" }}>
              <h4 style={{ marginBottom: "1rem", textAlign: "left" }}>{category}</h4>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem"
              }}>
                {groupedProducts[category].map((product) => (
                  <div key={product.id} onClick={() => navigate(`/Editproduct/${product.id}`)} style={{
                    backgroundColor: "#fff", border: "2px solid #1a1aa6", padding: "0.5rem",
                    textAlign: "center", borderRadius: "6px", cursor: "pointer",
                    transition: "transform 0.2s"
                  }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {product.image && (
                      <img src={product.image} alt={product.name}
                        style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px" }} />
                    )}
                    <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{product.name}</div>
                    <div>{Number(product.price).toLocaleString()} บาท</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px",
            width: "300px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", textAlign: "center"
          }}>
            <h3>เพิ่มหมวดหมู่ใหม่</h3>
            <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="ใส่ชื่อหมวดหมู่"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "1rem" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => {
                const name = newCategoryName.trim();
                if (name === "") return alert("กรุณากรอกชื่อหมวดหมู่");
                if (categories.includes(name)) return alert("หมวดหมู่ซ้ำ");
                const newList = [...categories, name];
                setCategories(newList);
                localStorage.setItem("categories", JSON.stringify(newList));
                alert(`เพิ่มหมวดหมู่ "${name}" แล้ว`);
                setNewCategoryName("");
                setShowModal(false);
              }} style={{ backgroundColor: "#1a1aa6", color: "white", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}>ยืนยัน</button>
              <button onClick={() => { setShowModal(false); setNewCategoryName(""); }} style={{ backgroundColor: "#ccc", color: "#333", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
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
