const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.js');
const eventsRoutes = require('./routes/events.js');
const bookingRoutes = require('./routes/booking.js');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/booking', bookingRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Ab connection confirm hai, toh naam sahi print hoga!
    console.log("📦 DB NAME:", mongoose.connection.name); 
  })
  .catch((err) => {
    console.log('❌ Error connecting to MongoDB:', err);
  });

// Server Listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});