const Booking = require("../models/Booking.js");
const OTP = require("../models/OTP.js");
const Event = require("../models/Event.js");
const { sendOTPEmail, sendBookingEmail } = require("../utils/email.js");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
exports.sendBookingEmail = async (req, res) => {
  try {
    const otp = generateOtp();

    await OTP.findOneAndDelete({
      email: req.user.email,
      action: "event_booking",
    });

    await OTP.create({
      email: req.user.email,
      otp: otp,
      action: "event_booking",
    });

    await sendOTPEmail(req.user.email, otp, "event_booking");

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Book Event
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    if (!otpRecord) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    if (event.totalSeats <= 0) {
      return res.status(400).json({
        error: "No seats available",
      });
    }

    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "You have already booked this event",
      });
    }

    await Booking.create({
      userId: req.user._id,
      eventId,
      status: "pending",
      paymentStatus: "non_paid",
      amount: event.ticketPrice,
    });

    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    res.status(201).json({
      message: "Booking created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm Booking
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["paid", "non_paid"].includes(paymentStatus)) {
      return res.status(400).json({
        error: "Invalid payment status",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("eventId")
      .populate("userId");

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({
        error: "Booking already confirmed",
      });
    }

    const event = await Event.findById(booking.eventId._id);

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    if (event.totalSeats <= 0) {
      return res.status(400).json({
        error: "No seats available",
      });
    }

    booking.status = "confirmed";
    booking.paymentStatus = paymentStatus;

    await booking.save();

    event.totalSeats -= 1;
    await event.save();
    await sendBookingEmail(
      booking.userId.email,
      event.title,
      booking._id
    );

    res.json({
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get My Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    }).populate("eventId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    if (
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    const wasConfirmed = booking.status === "confirmed";

    booking.status = "cancelled";
    await booking.save();

    if (wasConfirmed) {
      const event = await Event.findById(booking.eventId);

      if (event) {
        event.totalSeats += 1;
        await event.save();
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};