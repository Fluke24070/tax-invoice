import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Enter from "./Enter";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = () => {
        // คุณสามารถเพิ่มเงื่อนไขตรวจสอบหรือบันทึกข้อมูลได้ตรงนี้
        console.log("Email:", email);
        console.log("Password:", password);
        // หลังจากสมัครเสร็จ อาจจะเปลี่ยนหน้า หรือเก็บข้อมูลไว้
    };

    return (
        <div>
            <h5>SIGNUP</h5>
            <div>
                <label>Email:</label><br />
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                /><br /><br />
                
                <label>Password:</label><br />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter your password" 
                /><br /><br />
                
                <button onClick={handleSignup}>Sign Up</button>
                <br /><br />
                <button onClick={() => navigate("/enter")}>Back</button>
            </div>
        </div>
    );
};

export default Signup;
