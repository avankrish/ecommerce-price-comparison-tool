const cron = require("node-cron");
const PriceTracker = require("./model/price_tracker");
const Product = require("./model/product");
const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const cleanPrice = (priceString) => {
    return parseFloat(priceString.replace(/[^\d.-]/g, ''));
  };
cron.schedule("* * * * *", async () => { // Runs every hour
    console.log("Running price check...");
    try {
        const trackers = await PriceTracker.find().populate("productId");
        for (const tracker of trackers) {
            console.log(tracker)
            const curr_price = tracker.productId.price;
            const currentPrice=cleanPrice(curr_price) // Assuming product schema has a price field
            if (currentPrice <= tracker.expectedPrice) {
                const mailOptions = {
                    from: "your_email@gmail.com",
                    to: tracker.userEmail,
                    subject: "Price Drop Alert!",
                    text: `The price of "${tracker.productId.product_name} "has dropped to ${currentPrice}.`,
                };
                await transporter.sendMail(mailOptions);

                // Remove the tracker after notification
                await PriceTracker.deleteOne({ _id: tracker._id });
                console.log(`Notified ${tracker.userEmail} and removed tracker.`);
            }
        }
    } catch (error) {
        console.error("Error in price check scheduler:", error);
    }
});
