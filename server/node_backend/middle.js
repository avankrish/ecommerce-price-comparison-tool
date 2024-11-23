const jwt = require('jsonwebtoken');
const User = require('./model/user'); // Assuming you're using a User model
const JWT_SECRET = 'your_jwt_secret'; 
// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from the Authorization header
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token,JWT_SECRET); // process.env.JWT_SECRET is your JWT secret key
        console.log("Decoded token:", decoded); 
        // Attach the user information to the request object
        req.user = decoded;
        
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = { verifyToken };
