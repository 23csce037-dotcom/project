const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({

    // 🔑 Link employer profile to logged-in user
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // 👤 Employer Personal Details
    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        min: 18
    },

    // 🏢 Company Details
    companyName: {
        type: String,
        required: true,
        trim: true
    },

    companyEmail: {
        type: String,
        required: true,
        unique: true,           // prevents duplicate emails
        lowercase: true,        // converts to lowercase
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },

    phone: {
        type: Number
    },

    companyType: {
        type: String
    },

    industry: {
        type: String
    },

    companySize: {
        type: Number
    },

    companyLocation: {
        type: String
    },

    website: {
        type: String
    },

    description: {
        type: String
    },



});

module.exports = mongoose.model("employers", employerSchema);
