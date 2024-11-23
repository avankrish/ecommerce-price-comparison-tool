import React, { useState, useEffect } from "react";
import SearchBar from "../components/searchbar";
import category from "../category.json"
import './main.css'
function Front_page(){
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status

    useEffect(() => {
        // Check if token is present in localStorage to determine login status
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    

    return(
        <div className="web_name">
            <div className="header">
                <h1 className="title">PriceNest</h1>
                
            </div>
            <SearchBar placeholder="Enter the category" data={category} />
        </div>
    )
}
export default Front_page;