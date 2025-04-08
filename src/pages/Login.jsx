import React from "react";
import { useNavigate } from "react-router-dom";
import Enter from "./Enter";

const Login = () =>{
    const navigate = useNavigate();
    
    return(
        <div>
        <h5> 
            LOG IN
        </h5>
        <h2>ลงชื่อเข้าใช้งาน</h2>
        
        <button onClick={() => navigate("/enter")}>back</button>
    </div>
    )
}
export default Login;