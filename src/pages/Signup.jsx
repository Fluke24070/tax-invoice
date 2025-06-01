import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountType: "",
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
    taxId: "",
    address: "",
    branch: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const {
      accountType,
      firstName,
      lastName,
      phone,
      companyName,
      taxId,
      address,
      branch,
      email,
      password,
      agreeTerms,
    } = formData;

    if (!accountType) {
      alert("กรุณาเลือกประเภทบัญชี");
      return false;
    }

    if (!firstName || !lastName) {
      alert("กรุณากรอกชื่อและนามสกุล");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("กรุณากรอกเบอร์มือถือให้ถูกต้อง 10 หลัก");
      return false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง");
      return false;
    }

    if (password.length < 6) {
      alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return false;
    }

    if (!companyName || !taxId || !address || !branch) {
      alert("กรุณากรอกข้อมูลบริษัทให้ครบถ้วน");
      return false;
    }

    if (!agreeTerms) {
      alert("กรุณายอมรับเงื่อนไขก่อนสมัครบัญชี");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:3000/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/success");
      } else {
        alert(data.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div style={{ backgroundColor: "#e6f0ff", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "#1a1aa6", padding: "1rem" }}>
        <h1
          style={{
            color: "white",
            margin: 0,
            fontFamily: "monospace",
            letterSpacing: "2px",
          }}
        >
          TAX INVOICE
        </h1>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>บัญชี</h3>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-- เลือกประเภทบัญชี --</option>
            <option value="บุคคล">บุคคล</option>
            <option value="บริษัท">บริษัท</option>
          </select>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              name="firstName"
              placeholder="ชื่อจริง"
              value={formData.firstName}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="lastName"
              placeholder="นามสกุล"
              value={formData.lastName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <input
            type="text"
            name="phone"
            placeholder="เบอร์มือถือ"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="companyName"
            placeholder="ชื่อบริษัท"
            value={formData.companyName}
            onChange={handleChange}
            style={textareaStyle}
          />
          <textarea
            name="taxId"
            placeholder="เลขประจำตัวผู้เสียภาษี"
            value={formData.taxId}
            onChange={handleChange}
            style={textareaStyle}
          />
          <textarea
            name="address"
            placeholder="รายละเอียดที่อยู่บริษัท"
            value={formData.address}
            onChange={handleChange}
            style={textareaStyle}
          />
          <textarea
            name="branch"
            placeholder="สาขาสำนักงาน/ใหญ่/สาขาที่2"
            value={formData.branch}
            onChange={handleChange}
            style={textareaStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
          />

          <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                style={{ marginRight: "8px" }}
              />
              ฉันยอมรับ{" "}
              <a href="#" style={{ margin: "0 4px" }}>
                ข้อตกลงการใช้งาน
              </a>{" "}
              และ{" "}
              <a href="#">นโยบายความเป็นส่วนตัว</a>
            </label>
          </div>

          <button type="submit" style={buttonStyle}>
            สร้างบัญชี
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  height: "48px",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "1em",
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "48px",
  maxHeight: "200px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4267b2",
  color: "white",
  fontSize: "1em",
  border: "none",
  borderRadius: "5px",
  marginTop: "20px",
  cursor: "pointer",
};

export default Signup;
