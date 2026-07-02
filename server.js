require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors({ origin: '*' })); // Allows any website to connect
app.use(express.json()); // Allows reading JSON data from requests

// =============================================
// MONGODB CONNECTION
// =============================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.log('❌ Database error:', err));

// =============================================
// TEST ROUTE
// =============================================
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working perfectly!' });
});

// =============================================
// USER SCHEMA
// =============================================
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', UserSchema);

// =============================================
// REGISTER ROUTE
// =============================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.json({ success: true, message: '✅ User registered successfully!' });
  } catch (error) {
    res.json({ success: false, message: '❌ Email already exists or error.' });
  }
});

// =============================================
// LOGIN ROUTE
// =============================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, message: '✅ Login successful!', user });
    } else {
      res.json({ success: false, message: '❌ Invalid email or password.' });
    }
  } catch (error) {
    res.json({ success: false, message: '❌ Server error.' });
  }
});

// =============================================
// START SERVER
// =============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));