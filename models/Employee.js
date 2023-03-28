const mongoose = require("mongoose");

module.exports = mongoose.model("employee", mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    emailVerify: {
        type: Boolean,
    },
    password: {
        type: String,
        required: true

    },
    address: {
        type: String
    },
    mobile: {
        type: String
    },
    mobileVerify: {
        type: Boolean,
    },
    role: {
        type: String,
        enum: ["intern", "account", "cms", "support", "admin"],
        default: "intern"
    },
    active: {
        type: Boolean,
        default: true
    },
    joiningDate: {
        type: Date
    },
    dob: {
        type: Date
    },
    salary: {
        type: Number,
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

}, { timestamps: true }))



