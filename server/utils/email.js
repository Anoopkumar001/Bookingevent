const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// 🔥 TEST SMTP CONNECTION
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ SMTP CONNECTION FAILED:", error);
    } else {
        console.log("✅ SMTP READY - Gmail connected successfully");
    }
});


// =====================
// BOOKING EMAIL
// =====================
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        console.log("📨 Sending Booking Email to:", userEmail);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>
                <p>Thank you for choosing Eventora.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Booking Email Sent:", info.response);

    } catch (error) {
        console.log("❌ Booking Email Error:", error);
    }
};


// =====================
// OTP EMAIL
// =====================
const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        console.log("📨 Sending OTP Email to:", userEmail);
        console.log("🔑 OTP Type:", type);
        console.log("🔢 OTP:", otp);

        const title = type === 'account_verification'
            ? 'Verify your Eventora Account'
            : 'Eventora Booking Verification';

        const msg = type === 'account_verification'
            ? 'Please use this OTP to verify your account.'
            : 'Please use this OTP to confirm your booking.';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial; text-align:center; padding:20px;">
                    <h2>${title}</h2>
                    <p>${msg}</p>
                    <div style="font-size:24px; font-weight:bold; letter-spacing:5px;">
                        ${otp}
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ OTP Email Sent:", info.response);

    } catch (error) {
        console.log("❌ OTP Email Error FULL:", error);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };