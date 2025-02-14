import React from "react";
import { useNavigate } from "react-router-dom";
const Enter = () => {
    const navigate = useNavigate();

    return(
        <div>
        <h5>
            ENTER PAGE
        </h5>
        <button onClick={() => navigate("/login")}>login</button>
        <button onClick={() => navigate("/signin")}>signin</button>
    </div>
    );
};
export default Enter;