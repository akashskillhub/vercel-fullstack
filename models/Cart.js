const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "product",
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("cart", cartSchema)