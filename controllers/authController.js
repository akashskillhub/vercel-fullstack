const User = require("./../models/User")
const Employee = require("./../models/Employee")

const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Cart = require("../models/Cart")
const { OAuth2Client } = require("google-auth-library")
const { sendEmail } = require("../utils/email")
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json({
            message: "All feilds required"
        })
    }
    const result = await User.findOne({ email }).lean()
    if (!result) {
        return res.status(401).json({
            message: "email is not registered with us "
        })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({
            message: "email or password wrong"
        })
    }
    if (!result.active) {
        return res.status(401).json({
            message: "Account Blocked by Admin"
        })
    }

    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    res.cookie("user", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 15
    })
    const cart = await Cart.find({ userId: result._id })
    res.json({
        message: "Login Success",
        result: {
            name: result.name,
            email: result.email,
            // id: result._id,
            // ...result,
            cart,
            token
        }
    })
})
exports.continueWithGoogle = asyncHandler(async (req, res) => {
    const { tokenId } = req.body
    if (!tokenId) {
        return res.status(400).json({
            message: "please provide token id"
        })
    }
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const { payload: { name, email, picture } } = await googleClient.verifyIdToken({ idToken: tokenId })
    const result = await User.findOne({ email }).lean()

    if (result) {
        // login

        if (!result.active) {
            return res.status(401).json({
                message: "account blocked by Admin"
            })
        }
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        const cart = await Cart.find({ userId: result._id })
        res.json({
            message: "Login Success",
            result: {

                ...result,
                cart,
                token
            }
        })
    } else {
        // register
        const password = await bcrypt.hash(Date.now().toString(), 10)
        const user = {
            name, email, password
        }
        const result = await User.create(user).lean()
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

        res.json({
            message: "user register success",
            result: {
                ...result,
                cart: [],
                token
            }
        })
    }

})
exports.loginEmolpyee = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json({
            message: "All feilds required"
        })
    }
    const result = await Employee.findOne({ email })
    console.log(result, "eelre");
    if (!result) {
        return res.status(401).json({
            message: "email is not registered with us "
        })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({
            message: "email or password wrong "
        })
    }
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY)


    if (!result.active) {
        return res.status(401).json({
            message: "Account Is Blocked. Get in touch with admin"
        })
    }
    // res.cookie("token", token, {
    //     maxAge: 1000,
    //     httpOnly: true,
    //     // secure: true
    // })
    // const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, { expiresIn: "15m" })
    if (result.role === "admin") {
        return res.json({
            message: "Login Success",
            result: {
                name: result.name,
                email: result.email,
                id: result._id,
                token
            }
        })
    } else {
        res.json({
            message: "u are not admin "
        })
    }

})


exports.forgetPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body
        // console.log(req.body, "email");
        const result = await User.findOne({ email })
        if (!result) {
            return res.status(400).json({
                message: "email is not registered with us "
            })
        }
        console.log(result, "resl");
        sendEmail({
            sendTo: email,
            sub: `reset pass`,
            msg: `http://localhost:3000/reset-password/${result._id}`
        })
        res.json({
            message: "email send successufully"
        })
    } catch (error) {
        return res.status(400).json({
            message: "error"
        })
    }

})

exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body
        const { id } = req.params
        const result = await User.findOne({ _id: id })
        const hashpass = bcrypt.hashSync(password, 10)
        if (result) {
            const updateUser = await User.findByIdAndUpdate(result._id, { password: hashpass })
            return res.json({
                message: "reset success",
                updateUser
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "error" + error
        })
    }
}