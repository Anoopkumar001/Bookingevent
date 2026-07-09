const User = require('../models/User.js');
const OTP = require("../models/OTP.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require("../utils/email.js")


const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

//register User

exports.registerUser = async (req, res) => {
    console.log("REGISTER FUNCTION CALLED");
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`OTP for ${email}: ${otp}`);

        await OTP.create({
            email,
            otp,
            action: 'account_verification'
        });

        // EMAIL FAIL SHOULD NOT BREAK REGISTRATION
        try {
            await sendOTPEmail(email, otp, 'account_verification');
        } catch (err) {
            console.log("Email failed but OTP saved:", err.message);
        }

        return res.status(201).json({
            message: "OTP generated successfully",
            email: user.email
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);
        return res.status(500).json({
            message: error.message || "Registration failed"
        });
    }
};

//login user

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials, please sign up' });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // check verification
        if (!user.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await OTP.deleteMany({ email, action: 'account_verification' });

            await OTP.create({
                email,
                otp,
                action: 'account_verification'
            });

            await sendOTPEmail(email, otp, 'account_verification');

            return res.status(400).json({
                error: 'Account not verified. A new OTP has been sent to your email.'
            });
        }

        // success
        res.json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// verify otp
// verify otp
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp, action: 'account_verification' });

        if (!otpRecord) {
            return res.status(400).json({ error: 'invalid or expired OTP' });
        }

        // `{ new: true }` lagane se updated user ka data milega fresh ID ke sath
        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { returnDocument: 'after' }
        );
        if (!user) {
            return res.status(404).json({ error: 'User not found associated with this OTP' });
        }

        await OTP.deleteMany({ email, action: "account_verification" });

        res.json({
            message: 'Account verified successfully. You can now log in.',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};