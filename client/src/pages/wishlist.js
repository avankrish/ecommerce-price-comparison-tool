import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import './wishlist.css'
const WishlistButton = () => {
    const [wishlist, setWishlist] = useState(new Map()); // Store products in a Map for easier deletion
    const [isVisible, setIsVisible] = useState(false); // Toggle visibility

    useEffect(() => {
        // Fetch the wishlist details on component mount
        const fetchWishlist = async () => {
            try {
                const response = await fetch("http://localhost:5000/wishlist", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const newWishlistMap = new Map();
                    data.wishlist.forEach(product => {
                        newWishlistMap.set(product._id, product); // Store product by ID
                    });
                    setWishlist(newWishlistMap);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };

        fetchWishlist();
    }, []); // Empty dependency array to fetch once on mount

    const toggleWishlist = () => {
        setIsVisible(!isVisible); // Toggle visibility on button click
    };

    // Remove item from wishlist both locally and from backend
    const removeFromWishlist = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                // Remove product from local wishlist
                setWishlist(prevWishlist => {
                    const updatedWishlist = new Map(prevWishlist);
                    updatedWishlist.delete(productId); // Remove product by ID
                    return updatedWishlist;
                });
            } else {
                console.error('Failed to remove product from wishlist');
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const wishlistArray = Array.from(wishlist.values());

    return (
        <div>
            
            <Button onClick={toggleWishlist} sx={{width:200}}>
                {isVisible ? 'Hide Wishlist' : 'Show Wishlist'}
            </Button>

            {isVisible && (
                <div className="wishlist-container">
                    {wishlistArray.length === 0 ? (
                        <p>Your wishlist is empty.</p>
                    ) : (
                        <ul>
                            {wishlistArray.map((product) => (
                                <li key={product._id}>
                                    <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                                        {product.product_name}
                                    </a>
                                    <RemoveIcon onClick={() => removeFromWishlist(product._id)}></RemoveIcon>
                                    
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default WishlistButton;
