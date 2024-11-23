import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate} from "react-router-dom"

import "./searchbar.css";

function SearchBar({ placeholder, data }) {
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    //const [products, setProducts] = useState([]);
    //const [loading, setLoading] = useState(false);  // Loading state
    const navigate=useNavigate();
    const handleCategoryClick = async (categoryName) => {
        if (!categoryName) {
            console.log("Category name is undefined or empty");
            return;
        }
        navigate(`/${categoryName}`)
        // Prevent re-fetching the same category
       /* if (products.some(product => product.category === categoryName)) {
            return; // If products are already fetched for the category, do nothing
        }

        setLoading(true);  // Set loading state to true while fetching
        try {
            const response = await fetch(`http://localhost:5000/products?category=${categoryName}`);
            const products_data = await response.json();

            if (response.ok) {
                console.log("Fetched Products:", products_data);
                setProducts(products_data); // Update products
            } else {
                console.error("Error fetching products:", products_data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);  // Reset loading state after fetching
        }*/
    };

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = data.filter((value) => {
            return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");
    };

    return (
        <div className="search">
            <div className="searchInput">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={wordEntered}
                    onChange={handleFilter}
                />
                <div className="searchIcons">
                    {filteredData.length === 0 ? (
                        <SearchIcon style={{ color: "black" }} />
                    ) : (
                        <CloseIcon id="clearBtn" onClick={clearInput} style={{ color: "black" }} />
                    )}
                </div>
            </div>

            {filteredData.length !== 0 && (
                <div className="dataResult">
                    {filteredData.slice(0, 2).map((value, key) => {
                        return (
                            <div className="dataItem" key={key} onClick={() => handleCategoryClick(value.name)}>
                                <p>{value.name}</p>
                            </div>
                        );
                    })}
                </div>
            )}

           
        </div>
    );
}

export default SearchBar;
