import React from "react";
import { useNavigate } from "react-router-dom";
import Enter from "./Enter";

const Signin = () =>{
    const navigate = useNavigate();
    
    return(
        <div>
        <h5>
            SIGNIN
        </h5>
        <button onClick={() => navigate("/enter")}>back</button>
    </div>
    );
};
export default Signin;