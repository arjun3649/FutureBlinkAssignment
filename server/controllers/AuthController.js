import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const signup = async (req, res) => { 
    try {
        const { username, email_address, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email_address,
            password: hashedPassword,
        
    });
        await newUser.save();
         res.status(201).json({
            success: true,
            message: "User created successfully",
            
        }) 
    
    
        
    } catch (error) {
         res.status(500).json({
      success: false,
      message: error.message,
    });
        
    }
}

const signin = async (req, res) => { 
    try {
        const { email_address, password } = req.body;
        
        const existingUser = await User.findOne({ email_address }).select("+password");

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign(
            { id: existingUser._id, email_address: existingUser.email_address }, 
            process.env.TOKEN_SECRET
        );

        // Create a clean user object without password and with _id converted to string
        const userForClient = {
            _id: existingUser._id.toString(),
            username: existingUser.username,
            email_address: existingUser.email_address,
            // Add other fields you want to send, but NOT password
        };

        res.cookie("Autherization", token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }).json({
            success: true,
            message: "User logged in successfully",
            user: userForClient,
            token,
        });
            
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
export default {signup,signin};