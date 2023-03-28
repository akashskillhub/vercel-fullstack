const mongoose = require("mongoose");

module.exports = mongoose.model("user", mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    email_varify: {
        type: Boolean,

    },
    mobile: {
        type: String,
    },
    mobile_varify: {
        type: Boolean,
    },
    house: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: String,
    },
    state: {
        type: String,
    },
    landmark: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }

}, { timestamps: true }))