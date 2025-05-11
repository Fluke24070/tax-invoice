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
      console.log("User data:", data.user);
  
      if (response.ok) {
        // บันทึกข้อมูลผู้ใช้ที่ล็อกอินไว้
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("currentEmail", data.user.email);
        localStorage.setItem("companyName", data.user.companyName);
        localStorage.setItem("address", data.user.address);
        localStorage.setItem("phone", data.user.phone);
        localStorage.setItem("taxId", data.user.taxId);
        localStorage.setItem("branch", data.user.branch);
        alert("เข้าสู่ระบบสำเร็จ!");

          
        if (data.user.accountType === "บุคคล") {
          navigate("/UiUser", {
            state: { email: data.user.email },
          });
        } else if (data.user.accountType === "บริษัท") {
          navigate("/maincompany");
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
      {/* Header */}
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

      {/* Login form */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "10px",
            width: "300px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>ลงชื่อเข้าใช้งาน</h3>
          <input
            type="text"
            placeholder="อีเมล"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleLogin} style={buttonStyle}>
            ล็อกอิน
          </button>

          <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
            <a href="#" onClick={() => navigate("/signup")} style={{ marginRight: "20px" }}>
              ยังไม่มีบัญชี
            </a>
            <a href="#" onClick={() => alert("ฟีเจอร์นี้อยู่ระหว่างพัฒนา")}>
              ลืมรหัสผ่าน?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "1em",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#4267b2",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontSize: "1em",
  cursor: "pointer",
};

export default Login;
