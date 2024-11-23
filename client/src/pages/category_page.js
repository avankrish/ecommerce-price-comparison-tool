import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/searchbar";
import category from "../category.json";
import { useParams } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WishList from "./wishlist";
import './category_page.css';
import { Button } from "@mui/material";
import { Drawer, List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
//import Select from '@mui/material/Select';
//import MenuItem from '@mui/material/MenuItem';
//import {InputLabel,FormControl} from '@mui/material/InputLabel';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Slider from '@mui/material/Slider';
// Merge Sort Function
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

// Merge function to combine two sorted arrays
function merge(left, right) {
    let sortedArray = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i].price < right[j].price) {
            sortedArray.push(left[i]);
            i++;
        } else {
            sortedArray.push(right[j]);
            j++;
        }
    }

    return sortedArray.concat(left.slice(i)).concat(right.slice(j));
}

function Category() {
    const { categoryName } = useParams();
    const [products, setproducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lowest,setlowest]=useState("")
    const [highest,sethighest]=useState("")
    const [priceRange, setPriceRange] = useState([0, 500000]); // Example initial range
    const [rating, setRating] = useState(0); // Default to 0, which means no rating filter
    const [discount, setDiscount] = useState(0); // Default to 0, which means no discount filter
    const navigate =useNavigate()
    const sellers = [
        { seller_id: '673600d9eecacd5f557baf5c', name: 'IKIRU' },
        { seller_id: '673600d9eecacd5f557baf5d', name: 'LivingShapes' },
        { seller_id: '673600d9eecacd5f557baf5e', name: 'RoyalOak' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/products?category=${categoryName}`);
                const products_data = await response.json();

                if (response.ok) {
                    const sorted_product = mergeSort(products_data);
                    setproducts(products_data);
                    setlowest(sorted_product[0])
                    sethighest(sorted_product[sorted_product.length-1])
                } else {
                    console.error("Error fetching products:", products_data.message);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);
const highlight=()=>
{
    console.log(highest)
    sethighest(highest)
    setlowest(lowest)
}
    const toggleWishlist = async (product) => {
        const isWishlisted = wishlist.includes(product._id);
        try {
            // Make API call to add/remove from wishlist
            const response = await fetch(`http://localhost:5000/wishlist/${isWishlisted ? 'remove' : 'add'}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ productId: product._id })
            });
            const result = await response.json();

            if (response.ok) {
                setWishlist(prevWishlist =>
                    isWishlisted
                        ? prevWishlist.filter(id => id !== product._id)
                        : [...prevWishlist, product._id]
                );
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };
    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem("token");

        // Redirect to login page
       navigate("/login");
    };

    const toggleSidebar = (open) => () => {
        setIsSidebarOpen(open);
    };
    const handleTrackPrice = async (productId) => {
        const token = localStorage.getItem("token");
        const expectedPrice = window.prompt("Enter the expected price:");
        if (!expectedPrice || isNaN(expectedPrice) || expectedPrice <= 0) {
            alert("Please enter a valid price.");
            return;
        }

        const email = window.prompt("Enter your email:");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        console.log("Email being sent:", email);

        try {
            const response = await fetch("http://localhost:5000/price-tracker", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, expectedPrice, userEmail: email }),
            });

            if (response.ok) {
                alert("Price tracking has been enabled successfully!");
            } else {
                alert("Failed to enable price tracking. Please try again.");
            }
        } catch (error) {
            console.error("Error enabling price tracking:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const filteredProducts = products.filter(product => {
        // Parse the price, rating, and discount from product data
        const productPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
        const productRating = parseFloat(product.product_rating);
        const productDiscount = product.discount_percent === "N/A" ? 0 : parseFloat(product.discount_percent.replace('%', ''));
    
        // Filter by seller
        const matchesSeller = !selectedSeller || product.seller_id === selectedSeller;
    
        // Filter by price range
        const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
    
        // Filter by rating
        const matchesRating = rating === 0 || productRating >= rating;
    
        // Filter by discount
        const matchesDiscount = discount === 0 || productDiscount >= discount;
    
        return matchesSeller && matchesPrice && matchesRating && matchesDiscount;
    });
    
    
    const handlePriceChange = (event, newValue) => {
            setPriceRange(newValue);
        };
        
    return (
        <div>
          <br></br><br></br>
            <div className="searchbar"><SearchBar placeholder="enter the category" data={category}   /></div>

            <div className="category-page">
                <br /><br />
                <div className="tool_bar">
                    <h2 className="heading">{categoryName} Products</h2>
                    
                    <MenuIcon onClick={toggleSidebar(true)} style={{ cursor: 'pointer' }} />

                </div>

                <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar(false)}>
        <Box sx={{ width: 250, padding: 2, backgroundColor: "#f4f6f9", height: "100vh" }}>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: 2, fontWeight: "bold" ,fontStyle:"italic"}}>
            Filter Options
          </Typography>
          <List>
            <ListItem sx={{ paddingBottom: 2 }}>
              <Button variant="outlined"  fullWidth sx={{color:"black" ,border:"1px solid lightgrey"}}>
                <WishList></WishList>
              </Button>
            </ListItem>

            <ListItem sx={{ paddingBottom: 2 }}>
              <Button variant="outlined" onClick={highlight} fullWidth sx={{color:"black" ,border:"1px solid lightgrey"}}>
                Price Hightlighter
              </Button>
            </ListItem>

            <ListItem sx={{ paddingBottom: 2 }}>
              <Typography gutterBottom sx={{ fontSize: 14 }}>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={500000}
                step={1000}
                valueLabelFormatter={(value) => `₹${value}`}
                sx={{
                  width: "100%",
                  color: "#606c38",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#283618",
                  },
                }}
              />
            </ListItem>

            <ListItem sx={{ paddingBottom: 2 }}>
              <Typography gutterBottom sx={{ fontSize: 14 }}>
                Rating...;
              </Typography>
              <Slider
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                step={0.5}
                valueLabelFormatter={(value) => `${value} stars`}
                sx={{
                  width: "100%",
                  color: "#ffb703",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#fb8500",
                  },
                }}
              />
            </ListItem>

            <ListItem sx={{ paddingBottom: 2 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="seller-select-label">Select Seller</InputLabel>
                <Select
                  labelId="seller-select-label"
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  label="Select Seller"
                >
                  <MenuItem value="">
                    <em>Select Seller</em>
                  </MenuItem>
                  {sellers.map((seller) => (
                    <MenuItem key={seller.seller_id} value={seller.seller_id}>
                      {seller.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem sx={{ paddingBottom: 2 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="discount-select-label">Discount</InputLabel>
                <Select
                  labelId="discount-select-label"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  label="Discount"
                >
                  <MenuItem value={0}>All</MenuItem>
                  <MenuItem value={10}>10% and above</MenuItem>
                  <MenuItem value={20}>20% and above</MenuItem>
                  <MenuItem value={30}>30% and above</MenuItem>
                  <MenuItem value={50}>50% and above</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            {localStorage.getItem("token") && (
              <ListItem>
                <Button
                  onClick={handleLogout}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<LogoutIcon />}
                  sx={{ marginTop: 3 }}
                >
                  Logout
                </Button>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

                <div className="cat_pg">
                    {loading ? (
                        <div>Loading...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div>No Products Found</div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div className="product-item" key={product._id} style={{
                                border: product._id === lowest?._id ? '2px solid green' : '',
                                backgroundColor: product._id === highest?._id ? '2px solid red' : ''
                            }}>
                                <div className="image-container">
                                    <img
                                        src={product.image_url || 'default-image.jpg'}
                                        alt={product.product_name}
                                    />
                                    <span onClick={() => toggleWishlist(product)}>
                                        {wishlist.includes(product._id) ? (
                                            <FavoriteIcon style={{ color: 'red' }} />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </span>
                                </div>
                                <div className="product_details">
                                    <div className="product_name">
                                        <p>{product.product_name}</p>
                                        <p>Price : {product.price}</p><p>Mrp : {product.Mrp}</p>
                                        <p>{product.discount_percent}</p>
                                        <Button variant="outlined" href={product.product_url}
                                            sx={{
                                                textTransform: 'none', // Keeps the text case as-is
                                                padding: '10px 20px', // Custom padding
                                                borderRadius: '8px',
                                                border: '1px solid black',
                                                color: "black", // Rounded corners
                                                fontSize: '16px',
                                                width: "200px"
                                            }}>
                                            visit the page
                                        </Button>
                                        <br></br><br></br>
                                        <Button variant="outlined" sx={{
                                                textTransform: 'none', // Keeps the text case as-is
                                                padding: '10px 20px', // Custom padding
                                                borderRadius: '8px',
                                                border: '1px solid black',
                                                color: "black", // Rounded corners
                                                fontSize: '16px',
                                                width: "200px"
                                            }} onClick={()=>handleTrackPrice(product._id)}>Track Price</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Category;
