import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Searchbar from "../components/searchbar";
import Category from "../category.json";
//import './Home.css'; // Import the CSS file

import Button from "@mui/material/Button"; // Import Button from Material-UI

function Home() {
    

    return (
        <>
        <h2>Price Nest</h2>
        <h4>Login to Explore</h4>
        <Button  variant="outlined"><Link to='/login'>Login</Link></Button>
        </>
    );
}

export default Home;
