import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: "#e6f0ff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "#4CAF50",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "white", fontSize: "40px" }}>✓</span>
        </div>
        <h2 style={{ color: "#003366", marginTop: "20px" }}>
          สมัคร Tq เรียบร้อย
        </h2>
        <p style={{ color: "#4a4a4a", fontSize: "16px" }}>
          คุณสามารถเข้าใช้งาน Tq ได้ทันที
        </p>
        <p style={{ color: "#a0a0a0", fontSize: "14px" }}>แตะเพื่อกลับหน้าหลัก</p>
      </div>
    </div>
  );
};

export default Success;
