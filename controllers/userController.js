const User = require("./../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../utils/email")
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            throw new Error("All feilds required")
        }
        const found = await User.findOne({ email })
        if (found) {
            throw new Error("email alredy exit")
        }
        const hashPass = await bcrypt.hash(password, 10)
        const result = await User.create({
            name,
            email,
            password: hashPass
        })
        // console.log(hashPass)
        const token = jwt.sign({ id: result._id }, process.env.JWT_KEY)
        sendEmail({
            sendTo: email,
            sub: "welcome to mern e-commerce",
            msg: "hiii welcome "
        })
        res.json({
            message: "User register Successfully",
            result: {
                id: result._id,
                name,
                token,
                // email
            }
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error
        })
    }
}
exports.editUser = async (req, res) => {
    try {
        const { id } = req.params
        if (req.body.email) {
            throw new Error("can not change email")
        }
        const result = await User.findByIdAndUpdate(req.body.userId, req.body)
        res.json({
            message: "User Updated Successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error
        })
    }
}
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findByIdAndDelete(id)
        res.json({
            message: "User Deleted Successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error
        })
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const result = await User.find()
        res.json({
            message: "User fetched Successfully",
            result
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error
        })
    }
}
exports.getSingleUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findOne({ _id: id })
        if (!result) {
            throw new Error("User Not Found")
        }
        res.json({
            message: "User fetched Successfully",
            result
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error
        })
    }
}
exports.destroyUsers = async (req, res) => {
    try {
        const result = await User.deleteMany()
        res.json({
            message: "All User deleted Successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error
        })
    }
}
exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findOne({ _id: req.body.userId }).select("-password -_id -__v -createdAt -updatedAt")
        if (!result) {
            throw new Error("User Not Found")
        }
        res.json({
            message: "User fetched Successfully",
            result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile || "",
                city: result.city || "",
                pincode: result.pincode || "",
                state: result.state || "",
                house: result.house || "",
                landmark: result.landmark || "",
            }
        })
    } catch (error) {
        res.status(400).json({
            message: "Error" + error
        })
    }
}