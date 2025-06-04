import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaSearch, FaBars, FaUserCircle,
  FaSignOutAlt, FaClipboardList
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
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [categories, setCategories] = useState(["ทั้งหมด"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) setCompanyName(storedCompanyName);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/product_get_com/${companyName}`);
        const data = await res.json();
        if (data.status === 200) setProducts(data.data.product);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    if (companyName) fetchProducts();
  }, [companyName]);

  useEffect(() => {
    const uniqueCategories = new Set();
    products.forEach((p) => {
      const type = p.item_type?.trim();
      if (type && type !== "") uniqueCategories.add(type);
      else uniqueCategories.add("ยังไม่ได้จัดหมวดหมู่");
    });
    setCategories(["ทั้งหมด", ...Array.from(uniqueCategories)]);
  }, [products]);

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

  const unifiedBoxStyle = {
    width: "100%",
    height: "45px",
    borderRadius: "20px",
    border: "1.5px solid #1a1aa6",
    backgroundColor: "#dfe9ff",
    padding: "0.4rem 1rem",
    display: "flex",
    alignItems: "center",
    fontSize: "15px"
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

      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>สินค้า</h1>

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
              <MenuItem icon={<FaSignOutAlt />} text="ออกจากระบบ" onClick={() => { localStorage.clear(); navigate("/Enter"); }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "40px", paddingBottom: "60px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "500px", width: "100%", gap: "1rem" }}>
          <button onClick={handleAddProduct} style={{ ...unifiedBoxStyle, justifyContent: "center", cursor: "pointer", gap: "10px" }}>
            <FaShoppingCart /> เพิ่มรายการสินค้า
          </button>

          <div style={{ ...unifiedBoxStyle, justifyContent: "flex-start", gap: "10px" }}>
            <FaSearch />
            <input
              type="text"
              placeholder="ค้นหาสิ่งของที่ต้องการ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none", outline: "none", backgroundColor: "transparent",
                width: "100%", fontSize: "15px"
              }}
            />
          </div>

          <div style={{ ...unifiedBoxStyle, justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>หมวดหมู่ : {selectedCategory}</span>
            <span style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }}>▲</span>
          </div>

          {dropdownOpen && (
            <div style={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "10px",
              marginTop: "5px",
              width: "100%",
              zIndex: 10
            }}>
              {categories.map((cat) => (
                <div key={cat} style={{
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  backgroundColor: selectedCategory === cat ? "#e0e0ff" : "white"
                }}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDropdownOpen(false);
                  }}>
                  {cat}
                </div>
              ))}
            </div>
          )}

          <h3 style={{ marginTop: "2rem" }}>สินค้าของคุณ</h3>
        </div>

        <div style={{ padding: "0 1rem", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
          {Object.keys(groupedProducts).map((category) => (
            <div key={category} style={{ marginBottom: "2rem" }}>
              <h4 style={{ marginBottom: "1rem", textAlign: "left" }}>{category}</h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "1rem"
              }}>
                {groupedProducts[category].map((product) => (
                  <div key={product.id} onClick={() => navigate(`/Editproduct/${product.id}`)} style={{
                    backgroundColor: "#fff", border: "2px solid #1a1aa6", padding: "0.5rem",
                    textAlign: "center", borderRadius: "6px", cursor: "pointer",
                    transition: "transform 0.2s"
                  }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
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
    </div>
  );
};

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

export default Product;
