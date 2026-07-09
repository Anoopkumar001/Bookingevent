const express = require('express');
const router = express.Router();
const { protect, admin } = require("../middleware/auth.js");
const{bookEvent,sendBookingEmail,getMyBookings,getAllBookings,confirmBooking,cancelBooking}=require('../controllers/bookingController.js')


console.log("Booking routes loaded");

router.post('/', protect, bookEvent);
router.post('/send-otp', protect, sendBookingEmail)
router.get('/my', protect, getMyBookings);
router.get("/", protect, admin, getAllBookings);
router.put('/:id/confirm', protect, admin, confirmBooking)
router.delete('/:id', protect, cancelBooking);



module.exports = router;