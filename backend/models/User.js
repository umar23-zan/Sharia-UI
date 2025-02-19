const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String },
    doorNumber: { type: String },        
    streetName: { type: String },
    city: { type: String },
    country: { type: String },
    pincode: { type: String },
    profilePicture: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
});



module.exports = mongoose.model('User', UserSchema);
