const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Employee = require("./../models/Employee")
exports.adminProtected = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
    // const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "please provide token"
        })
    }
    console.log(token, "cookis");
    // const tk = token.split(" ")[1]
    const { id } = jwt.verify(token, process.env.JWT_KEY)
    const result = await Employee.findById(id)
    if (!result) {
        return res.status(401).json({
            message: "can not find this user"
        })
    }
    if (result.role !== "admin") {
        return res.status(401).json({
            message: "admin only Route,Please get in touch with admin"
        })
    }
    req.body.employeeId = id
    next()
})
exports.protected = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({
            message: "please provide token"
        })
    }
    const tk = token.split(" ")[1]
    // const [, tk]=token.split(" ")
    const { id } = jwt.verify(tk, process.env.JWT_KEY)
    if (!id) {
        return res.status(401).json({
            message: "invalid Token"
        })
    }
    const result = await User.findById(id)
    if (!result.active) {
        return res.status(401).json({
            message: "Account is Blocked By Admin. Get in touch with admin"
        })

    }
    req.body.userId = id

    next()
})