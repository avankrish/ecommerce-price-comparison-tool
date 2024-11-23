const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] 
  });

userSchema.pre("save", async function (next) {
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
  const User = mongoose.model("User", userSchema);

  module.exports = User;