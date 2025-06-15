import { Navigate } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("currentEmail", data.user.email);
        localStorage.setItem("companyName", data.user.companyName);
        localStorage.setItem("address", data.user.address);
        localStorage.setItem("phone", data.user.phone);
        localStorage.setItem("taxId", data.user.taxId);
        localStorage.setItem("branch", data.user.branch);

        alert("เข้าสู่ระบบสำเร็จ!");

        if (data.user.accountType === "บุคคล") {
          navigate("/MainUser", { state: { email: data.user.email } });
        } else if (data.user.accountType === "บริษัท") {
          navigate("/IihCompany");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div style={{ backgroundColor: "#e6f0ff", height: "100vh" }}>
      <div style={{ backgroundColor: "#1a1aa6", padding: "1rem", textAlign: "center" }}>
        <h1 style={headerText}>TAX INVOICE</h1>
      </div>

      <div style={formWrapper}>
        <div style={formContainer}>
          <h1 style={{ marginBottom: "0.5rem" }}>Login</h1>
          <h3 style={{ marginBottom: "1rem" }}>ลงชื่อเข้าใช้งาน</h3>

          <div style={labelStyle}>อีเมล</div>
          <input
            type="email"
            placeholder="example@email.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />

          <div style={labelStyle}>รหัสผ่าน</div>
          <input
            type="password"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <button onClick={handleLogin} style={buttonStyle}>
            ล็อกอิน
          </button>

          <div style={linkContainer}>
            <a href="#" onClick={() => navigate("/signup")} style={linkStyle}>
              ยังไม่มีบัญชี
            </a>
            <a href="#" onClick={() => alert("ฟีเจอร์นี้อยู่ระหว่างพัฒนา")} style={linkStyle}>
              ลืมรหัสผ่าน?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const headerText = {
  color: "white",
  margin: 0,
  fontFamily: "monospace",
  letterSpacing: "2px",
  fontSize: "1.5rem",
};

const formWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "90vh",
};

const formContainer = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "12px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  border: "1px solid #d9e0ea",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "1em",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4267b2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "1em",
  cursor: "pointer",
  marginTop: "5px",
};

const linkContainer = {
  marginTop: "10px",
  fontSize: "0.9em",
  display: "flex",
  justifyContent: "space-between",
};

const linkStyle = {
  color: "#0000ee",
  textDecoration: "underline",
};

const labelStyle = {
  textAlign: "left",
  marginBottom: "4px",
  fontWeight: "bold",
  fontSize: "0.95em",
};

export default Login;

