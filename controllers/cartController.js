const Product = require("../models/Product")
const User = require("../models/User")
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const asyncHandler = require("express-async-handler")

exports.addToCart = asyncHandler(async (req, res) => {
    const { qty, productId } = req.body
    if (!qty || !productId) {
        return res.status(400).json({
            message: "all feild required"
        })
    }
    const cartItems = await Cart.findOne({ userId: req.body.userId })
    if (cartItems) {
        console.log(cartItems);
        const index = cartItems.products.findIndex(p => p.productId.toString() === req.body.productId)
        
        if (index >= 0) {
            cartItems.products[index].qty = req.body.qty
        } else {
            cartItems.products.push(req.body)
        }
        const result = await Cart.findByIdAndUpdate(cartItems._id, cartItems, { new: true })
        console.log(result);
        res.json({
            message: "cart update  successfulyy",
        })
    } else {
        const cartItem = {
            userId: req.body.userId,
            products: [req.body]
        }
        console.log(cartItem);
        const result = await Cart.create(cartItem)
        // console.log(result, "res");
        res.json({
            message: "product added to  cart  successfulyy",
            result
        })
    }
})
exports.getCartData = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const result = await Cart.findOne({ userId: userId })
        .populate("products.productId", "-__v -createdAt -updatedAt -stock -employeeId ")
        .select("-__v -createdAt -updatedAt -_id -userId").lean()
    // const x = result.map(item => item.products.map(p => p.productId))
    // const x = result.map(item => item.products.map(p => {
    //     return {
    //         ...p.productId,
    //         qty: p.qty
    //     }
    // }))
    if (!result) {
        return res.json({
            message: "cart Is empty",
            result: []
        })

    }
    const formatedCartItems = result.products.map(p => {
        return {
            ...p.productId,
            qty: p.qty
        }
    })
    // console.log(formatedCartItems);
    res.json({
        message: "fetched from  cart  successfulyy",
        result: formatedCartItems,
    })
})
exports.destroyCart = asyncHandler(async (req, res) => {
    await Cart.deleteMany()

    res.json({
        message: "deleted from  cart  successfulyy",

    })
})
exports.removeCart = asyncHandler(async (req, res) => {
    await Cart.deleteMany()

    res.json({
        message: "deleted from  cart  successfulyy",

    })
})
exports.removeSingleCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { userId } = req.body
    const result = await Cart.findOne({ userId })

    const index = result.products.findIndex(item => item.productId.toString() === productId)
    console.log(index);
    result.products.splice(index, 1)
    const x = await Cart.findByIdAndUpdate(result._id, result, { new: true })
    console.log(x, "mmmm");
    res.json({
        message: "deleted from  cart  successfulyy",

    })
})
exports.emptyCart = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const result = await Cart.deleteOne({ userId })

    res.json({
        message: "deleted from  cart  successfulyy",
        result
    })
})