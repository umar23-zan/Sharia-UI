const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const { uploadToS3, deleteFromS3 } = require('../config/s3config');
const path = require('path');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-signup', async (req, res) => {
    try {
        const { sub, email, name, picture } = req.body; // Extract user data from request body

        // Verify Google ID token
        const ticket = await client.verifyIdToken({
            idToken: req.headers.authorization, // Assuming the token comes in the authorization header
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        // Check if the token is valid and the user IDs match
        if (payload.sub!== sub) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        let user = await User.findOne({ email });

        if (user) {
            // User exists, log them in (create session or JWT)
            // Replace with your login logic
            res.json({ msg: 'Login successful', email: user.email, id: user._id });
        } else {
            // User does not exist, create a new user
            user = new User({
                name: name,
                email: email,
                profilePicture: picture, // Add profile picture if available
            });
            await user.save();
            res.status(201).json({ msg: 'User registered successfully', email: user.email, id: user._id });
        }
    } catch (error) {
        console.error('Google Sign-Up Error:', error);
        res.status(500).json({ message: 'Google Sign-Up failed' });
    }
});

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash the password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        res.status(200).json({ msg: 'Login successful', email: user.email, id: user._id });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Forgot Password Route
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'umar.zangroups@gmail.com',
      pass: 'qjkr qdzj nrwt suqe',
  },
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Hash the token and set expiration (1 hour)
      const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpire = resetPasswordExpire;
      await user.save();

      // Send the reset link via email
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) requested a password reset. Click the link to reset your password: \n\n ${resetUrl}`;
      
      await transporter.sendMail({
          to: email,
          subject: 'Password Reset Request',
          text: message,
      });

      res.status(200).json({ msg: 'Password reset email sent' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;

  try {
      // Hash the incoming token and find the user with the matching reset token and check if it's not expired
      const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() }, // Make sure the token is not expired
      });

      if (!user) {
          return res.status(400).json({ msg: 'Invalid or expired token' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Reset the token and expiration fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // Return user data without password
        const { password, ...userData } = user._doc; // Exclude password from response
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Update User Data Route
// Update User Route
// Example of the updateUserData function
router.put('/user/:email', async (req, res) => {
    const email = req.params.email;
    const { name, contactNumber, doorNumber, streetName, city, country, pincode } = req.body;

    try {
        // Update the user data
        const user = await User.findOneAndUpdate(
            { email },
            { name, contactNumber, doorNumber, streetName, city, country, pincode },
            { new: true } // Return the updated document
        );

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({
            msg: 'User updated successfully',
            user: {
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber,
                doorNumber: user.doorNumber,
                streetName: user.streetName,
                city: user.city,
                country: user.country,
                pincode: user.pincode,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Invalid file type. Only JPG and PNG allowed.');
            error.code = 'INVALID_FILE_TYPE';
            return cb(error, false);
        }
        cb(null, true);
    }
});
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const email = req.body.email;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const fileUrl = await uploadToS3(req.file, email);

        if (user.profilePicture) {
            try {
                await deleteFromS3(user.profilePicture);
            } catch (error) {
                console.error('Error deleting old profile picture:', error);
                // Continue with the update even if delete fails
            }
        }
        user.profilePicture = fileUrl;
        await user.save();

        res.json({ 
            msg: 'Profile picture uploaded successfully', 
            // profilePicture: relativeFilePath 
            profilePicture: user.profilePicture 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({ msg: error.message });
        }
        res.status(500).send('Server error');
    }
});


// Contact Us Route
router.post('/contact-us', async (req, res) => {
    const request = req.body;
    
    // Create the formdata object from the request
    const formdata = {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        message: request.message
    };

    try {
        // Create a new contact entry and save it to the database
        const contactEntry = new ContactUs(formdata);
        const savedEntry = await contactEntry.save(); // Save to the database and get the saved entry
        
        // Send email using the saved entry
        await sendEmail(savedEntry); 
        
        // Return the saved entry as a response
        res.status(200).json({ message: 'Contact details saved successfully and email sent!', data: savedEntry });
    } catch (error) {
        console.error('Error saving contact details or sending email:', error);
        res.status(500).json({ message: 'Error saving contact details or sending email.' });
    }
});

module.exports = router;
