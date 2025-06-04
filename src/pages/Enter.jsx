import React from "react";
import { useNavigate } from "react-router-dom";

const Enter = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#e6f0ff", height: "100vh" }}>
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
            width: "320px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Tax invoice website to reduce <br />
            human error by using QR code
          </h2>

          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#b3d9ff",
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            login
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={{
              backgroundColor: "#b3d9ff",
              width: "100%",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Enter;
