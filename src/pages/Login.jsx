import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const foundUser = users.find(
      (user) => user.email === username && user.password === password
    );

    if (!foundUser) {
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    // บันทึกผู้ใช้งานที่เข้าสู่ระบบไว้ใน localStorage
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    alert("เข้าสู่ระบบสำเร็จ!");

    // ✅ เงื่อนไขเปลี่ยนเส้นทางตาม Role
    if (foundUser.accountType === "บุคคล") {
      navigate("/mainuser");
    } else if (foundUser.accountType === "บริษัท") {
      navigate("/maincompany");
    } else {
      navigate("/"); // fallback
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
