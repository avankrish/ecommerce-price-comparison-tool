const mongoose = require("mongoose");

const PriceTrackerSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a Product
        ref: "Product",
        required: true,
    },
    expectedPrice: {
        type: Number,
        required: true,
        min: 0, // Price cannot be negative
    },
    userEmail: {
        type: String,
        required: true,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const PriceTracker = mongoose.model("PriceTracker", PriceTrackerSchema);
module.exports = PriceTracker;
