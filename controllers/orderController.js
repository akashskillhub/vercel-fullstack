const Order = require("../models/Order")
const Product = require("../models/Product")
const asyncHandler = require("express-async-handler")
const Cart = require("../models/Cart")
const Razorpay = require("razorpay")
const { v4: uuid } = require("uuid")
const crypto = require("crypto")
const User = require("../models/User")
const { sendEmail } = require("../utils/email")
const { orderRecipt } = require("../utils/emailTemaplate")
const { format } = require("date-fns")

exports.placeOrder = asyncHandler(async (req, res) => {
    const { type, userId } = req.body
    if (!type) {
        return res.status(400).json({
            message: "please provide type"
        })
    }
    let productArray
    if (type === "buynow") {
        productArray = [{
            productId: req.body.productId,
            qty: req.body.qty
        }]
    } else {
        const CartItems = await Cart.findOne({ userId })
        await Cart.deleteOne({ userId })
        productArray = CartItems.products
    }
    const result = await Order.create({
        userId,
        products: productArray,
        paymentMode: "cod"
    })


    res.json({
        message: "order placed successfulyy",
        result
    })
})
exports.getUserOrder = asyncHandler(async (req, res) => {
    const result = await Order.find({ userId: req.body.userId }).populate("products.productId")
        .select("-createdAt -updatedAt -__v")
    console.log(result);
    res.json({
        message: " user order fetched successfulyy",
        result
    })
})
exports.userCancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const result = await Order.findByIdAndUpdate(orderId, { orderStatus: "cancel" })
    res.json({
        message: "order cancled successfulyy",
        result
    })
})

exports.orderPayment = asyncHandler(async (req, res) => {
    const instance = new Razorpay({
        key_id: process.env.Razorpay_KEY,
        key_secret: process.env.Razorpay_SECRET
    })
    instance.orders.create({
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: uuid()
    }, (err, order) => {
        if (err) {
            return res.status(400).json({
                message: "order fail" + err
            })
        }
        res.json({ message: "payment initiated", order })
    })
})

exports.verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const key = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
        .createHmac("sha256", `${process.env.RAZORPAY_SECRET}`)
        .update(key.toString())
        .digest("hex")
    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            message: "Invalid Payment,Signature mismatch"
        })
    }
    const { products, userId, type } = req.body

    const user = await User.findOne({ _id: userId })


    let CartItems, result, productDetails, formatedCartItems, total
    if (type === "cart") {

        CartItems = await Cart.findOne({ userId })

        productDetails = await Cart.findOne({ userId })
            .populate("products.productId", "-__v -createdAt -updatedAt -stock -employeeId ")
            .select("-__v -createdAt -updatedAt -_id -userId")
            .lean()

        formatedCartItems = productDetails.products.map(p => {
            return {
                ...p.productId,
                qty: p.qty
            }
        })
        console.log("hello");
        console.log(formatedCartItems, "formatedCartItems")
        const total = formatedCartItems.reduce((sum, i) => sum + (i.price * i.qty), 0)
        console.log(total);


        await Cart.deleteOne({ userId })

    } else if (type === "buynow") {
        CartItems = {
            products: [{
                productId: req.body.productId,
                qty: req.body.qty
            }]
        }

        const p = await Product.findOne({ _id: req.body.productId })
        total = p.price * req.body.qty
        formatedCartItems = [{
            name: p.name,
            price: p.price,
            qty: req.body.qty
        }]
        // console.log(total);
    }

    result = await Order.create({
        userId,
        products: CartItems.products,
        paymentMode: "online",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentSignature: razorpay_signature,
        paymentStatus: "paid"
    })
    sendEmail({
        sendTo: user.email,
        sub: "order placed successfully",
        htmlMsg: orderRecipt({
            userName: user.name,
            date: format(Date.now(), "dd-MM-yyyy"),
            orderId: result._id,
            products: formatedCartItems,
            total
        }),
        msg: ` Thank you for your order \n
    Order Id:${result._id} \n
    Payment Status : Paid \n
    Payment Mode : online \n
    Payment Id :${result.paymentId}
    `
    })
    res.json({
        message: "payment success"
    })
})

exports.destroyOrders = asyncHandler(async (req, res) => {
    await Order.deleteMany()
    res.json({
        message: "destroy all orders"
    })

})