const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require('./model/user');
const PriceTracker=require('./model/price_tracker')
const Product=require("./model/product")
const { verifyToken } = require('./middle');
const app = express();
const PORT = 5000;

const MONGO_URI = 'mongodb://localhost:27017/ecommerce_comparison_db';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGO_URI).then(() => {
  console.log("connected to mongo db");
}).catch(err => console.log("error", err));

/*const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});*/

/*const productSchema=new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    category_id: {
      type: String, // Assuming category_id is an ObjectId referring to a Category collection
      ref: 'Category',
      required: true,
    },
    seller_id: {
      type:String, // Assuming seller_id is an ObjectId referring to a Seller collection
      ref: 'Seller',
      required: true,
    },product_url: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    brand_name: {
      type: String,
      required: true,
      trim: true,
    },
    description_: {
      type: String,
      required: true,
    },product_color: {
      type: String,
      required: true,
    },
    product_length: {
      type: String, // Can be Number if it's numeric only, otherwise keep as String
      required: true,
    },
    product_width: {
      type: String, // Same as above; can be Number if always numeric
      required: true,
    },
    product_breadth: {
      type: String, // Same as above; can be Number if always numeric
      required: true,
    }, product_rating: {
      type: Number, // Assuming rating is numeric (e.g., 4.5 for a 4.5-star rating)
      min: 0,
      max: 5,
      default: 0,
    },
  }
)

const Product=mongoose.model("Product",productSchema,"Products")*/

const categorySchema=new mongoose.Schema({
  name: { type: String, required: true, unique: true },
})

const Category=mongoose.model("Product_category",categorySchema,"Product_categories")

/*userSchema.pre("save", async function (next) {
  console.log("Before hashing: ", this.password);
  if (!this.isModified('password')) {
    console.log("Password not modified, skipping hashing...");
    return next();  // Skip hashing if the password is not modified
  }  // Skip hashing if password is not modified
  
  try {
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Hashed password: ", this.password);  // Log the hashed password
    next();  // Proceed to the next middleware or save operation
  } catch (error) {
    console.error("Error during password hashing: ", error);
    next(error);  // Pass any error to the next middleware
  }
});
const User = mongoose.model("User", userSchema);*/
const JWT_SECRET = 'your_jwt_secret';

//route for signin
app.post("/Signin", async (req, res) => {
  console.log("Received data:", req.body);
  const { email, password } = req.body;
  
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    
    // Create a new user and hash the password (this triggers the pre-save middleware)
    const newUser = new User({ email, password });
    await newUser.save();  // This will trigger the pre-save middleware for hashing
    
    console.log("Hashed password stored:", newUser.password);  // Log the hashed password after save
    res.status(201).json({ message: "Account Created successfully" });
  } catch (err) {
    console.error("Error during user creation:", err);
    res.status(500).json({ message: "Error creating user" });
  }
});


//route for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid)
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
    console.log(token)
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

//route for products
app.get("/products",async(req,res)=>{
  const category_name=req.query.category
  console.log(category_name)
  if(!category_name){
    return res.status(400).json({message:"Category is required"})
  }
  try{
    const category= await Category.findOne({name:category_name})
    console.log("Category found:", category);
    if(!category_name){
      return res.status(400).json({message:"Category not found"})
    }
    x={category_id:category._id.toString()}
    console.log(x)
    const products=await Product.find({category_id:category._id})
    console.log(products)
    res.status(200).json(products)
  }catch(error){
    console.log(error)
res.status(500).json({message:"error fetching data"})
  }
})


//routes for wishlist
app.post('/wishlist/add', verifyToken, async (req, res) => {
  try {
      const userId = req.user.id;
      const { productId } = req.body;
      console.log(userId)
      console.log(productId)
      const user = await User.findByIdAndUpdate(userId, {
          $addToSet: { wishlist: productId }  // $addToSet prevents duplicates
      }, { new: true });
      
      res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
      res.status(500).json({ message: "Error adding to wishlist" });
  }
});

app.post('/wishlist/remove', verifyToken, async (req, res) => {
  try {
      const userId = req.user.id;
      const { productId } = req.body;

      const user = await User.findByIdAndUpdate(userId, {
          $pull: { wishlist: productId }  // $pull removes an item from the array
      }, { new: true });
      
      res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
      res.status(500).json({ message: "Error removing from wishlist" });
  }
});

app.get('/wishlist', verifyToken, async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('wishlist');  // Populate product details if needed

      res.status(200).json({wishlist:user.wishlist});
  } catch (error) {
      res.status(500).json({ message: "Error fetching wishlist" });
  }
});

app.delete('/wishlist/:productId', verifyToken, async (req, res) => {
  const userId = req.user.id; // Get user ID from token
  const { productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    ); // Remove product from wishlist

    await user.save();
    res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from wishlist' });
  }
});

app.post("/price-tracker",verifyToken,async(req,res)=>{
  const{productId,expectedPrice,userEmail}=req.body;
  console.log(productId,expectedPrice,userEmail)
  if (!productId || !expectedPrice || !userEmail) {
    return res.status(400).json({ message: "All fields are required" });
}
  try{
    const tracker=new PriceTracker({productId,expectedPrice,userEmail})
    await tracker.save()
    res.status(201).json({message:"price tracker saved"})
  }catch(error)
  {console.log("error saving price tracker",error)
    res.status(500).json({message:"failed to save price tracker"})
  }
})
require('./scheduler');  // This will run the cron job.



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
