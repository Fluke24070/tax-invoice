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

    if (accountType === "บริษัท") {
      if (!companyName || !taxId || !address || !branch) {
        alert("กรุณากรอกข้อมูลบริษัทให้ครบถ้วน");
        return false;
      }
    } else if (accountType === "บุคคล") {
      if (!address) {
        alert("กรุณากรอกที่อยู่");
        return false;
      }
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
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Register</h1>
          <form onSubmit={handleSubmit}>
            <label>ประเภทบัญชี</label>
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

            {/* บุคคล */}
            {formData.accountType === "บุคคล" && (
              <>
                <label>ชื่อจริง</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />

                <label>นามสกุล</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />

                <label>เบอร์มือถือ</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />

                <label>อีเมล</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />

                <label>เลขประจำตัวผู้เสียภาษี (ถ้ามี)</label>
                <textarea name="taxId" value={formData.taxId} onChange={handleChange} style={textareaStyle} />

                <label>ที่อยู่</label>
                <textarea name="address" value={formData.address} onChange={handleChange} style={textareaStyle} />

                <label>รหัสผ่าน</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
              </>
            )}

            {/* บริษัท */}
            {formData.accountType === "บริษัท" && (
              <>
                <label>ชื่อผู้จริง</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />

                <label>นามสกุล</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />

                <label>เบอร์มือถือ</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />

                <label>ชื่อบริษัท</label>
                <textarea name="companyName" value={formData.companyName} onChange={handleChange} style={textareaStyle} />

                <label>เลขประจำตัวผู้เสียภาษี</label>
                <textarea name="taxId" value={formData.taxId} onChange={handleChange} style={textareaStyle} />

                <label>รายละเอียดที่อยู่บริษัท</label>
                <textarea name="address" value={formData.address} onChange={handleChange} style={textareaStyle} />

                <label>สาขาสำนักงาน/ใหญ่/สาขาที่2</label>
                <textarea name="branch" value={formData.branch} onChange={handleChange} style={textareaStyle} />

                <label>อีเมล</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />

                <label>รหัสผ่าน</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
              </>
            )}

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
                <a href="#" style={{ margin: "0 4px", color: "#1a1aa6" }}>
                  ข้อตกลงการใช้งาน
                </a>{" "}
                และ{" "}
                <a href="#" style={{ color: "#1a1aa6" }}>
                  นโยบายความเป็นส่วนตัว
                </a>
              </label>
            </div>

            <button type="submit" style={buttonStyle}>สร้างบัญชี</button>
          </form>
        </div>
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
