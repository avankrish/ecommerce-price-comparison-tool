const mongoose = require('mongoose');

const productSchema=new mongoose.Schema(
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
      price: {
        type: String, // Store the price as a number, removing the currency symbol
        required: true,
      }
    }
  )
  
  const Product=mongoose.model("Product",productSchema,"Products")
  module.exports=Product