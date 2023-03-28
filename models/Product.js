const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["cloths", "electronics", "gadgets", "footware"]
    },
    desc: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    publish: {
        type: Boolean,
        default: true
    },
    employeeId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "employee"
    }
}, { timestamps: true })
module.exports = mongoose.model("product", productSchema) 