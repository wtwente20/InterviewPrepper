const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, username, password } = req.body;
  console.log('User registration initiated.')
  // Validate Data Before Creating a User
  if (!name || !email || !username || !password) {
    console.error('Registration failed due to missing fields.');
    return res.status(400).send('All fields are required.');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('Username already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
    //Make sure token is succesffully generated
    console.log('Generated JWT:', token);


    // Send token in HTTP cookie
    res.cookie('auth-token', token, { httpOnly: true, secure: true, sameSite: 'None' });


    // Responding with token and user data
    console.log("Sending response:", { token, user: { name, email, username } });
    res.status(201).json({ token, user: { name, email, username } });

  } catch (err) {
    res.status(400).send(err);
  }
});

// User Login
router.post('/login', async (req, res) => {
  console.log('Received login request with data:', req.body);

  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send('Username or password is wrong');
      }
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(400).send('Username or password is wrong');
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      //Make sure token is succesffully generated
      console.log('Generated JWT:', token);

      // Send token and user details in the response
      res.json({
          token: token,
          user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              username: user.username
              // Include any other user fields you want to send to the frontend here
          }
      });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(400).send(err);
  }
});

// Token Validation and Fetch User
router.get('/me', authMiddleware, async (req, res) => {
  console.log('Fetching user by token.');
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.error('No user found for ID:', req.user._id);
      return res.status(401).send('Authentication failed');
    }
    console.log('User fetched successfully:', user);
    res.json(user);
  } catch (err) {
    console.error('Error during user fetch:', err);
    res.status(400).send(err);
  }
});

module.exports = router;
