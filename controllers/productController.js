
const asyncHandler = require("express-async-handler")
const { productUpload } = require("../utils/upload")
const Product = require("./../models/Product")
const jwt = require("jsonwebtoken")
const path = require("path")
const fs = require("fs").promises
exports.addProduct = asyncHandler(async (req, res) => {

    productUpload(req, res, async err => {
        const { id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        req.body.employeeId = id
        const { name, brand, category, desc, price, stock, employeeId } = req.body
        if (!name || !brand || !category || !desc || !price || !stock || !employeeId) {
            return res.status(400).json({
                message: "All feilds required"
            })
        }
        if (err) {
            return res.status(400).json({
                message: "multer error" + err
            })
        }
        const filenames = []
        for (let i = 0; i < req.files.length; i++) {
            // assets/images/products
            filenames.push(`assets/images/products/${req.files[i].filename}`)
        }
        const result = await Product.create({
            ...req.body,
            image: filenames
        })
        console.log({
            ...req.body,
            image: filenames
        })
        res.json({
            message: "product added successfully",
            result
        })
    })
})
exports.updateProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params
    const singleProduct = await Product.findById(productId)
    if (!singleProduct) {
        return res.status(400).json({
            message: "invalid user Id"
        })
    }

    productUpload(req, res, async err => {
        if (err) {
            res.status(400).json({
                message: "multor err" + err
            })
        }

        let filenames = []
        for (let i = 0; i < req.files.length; i++) {
            filenames.push(`assets/images/products/${req.files[i].filename}`)
        }
        if (filenames.length > 0) {
            for (let i = 0; i < singleProduct.image.length; i++) {
                await fs.unlink(path.join(__dirname, "..", "public", singleProduct.image[i]))
            }
        } else {
            filenames = singleProduct.image
        }
        const result = await Product.findByIdAndUpdate(productId, {
            ...req.body,
            image: filenames
        }, { new: true })
        res.json({
            message: "product image update successfully",
            result
        })
    })
})


exports.getAllProducts = asyncHandler(async (req, res) => {
    const result = await Product.find({ publish: true }).select("-employeeId -createdAt -updatedAt -__v")
    console.log(result, "res")
    res.json({
        message: " All product fetchd success",
        result: {
            count: result.length,
            data: result
        }
    })
})
exports.getsingleProducts = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await Product.findById(productId).select("-employeeId -createdAt -updatedAt -__v")
    if (!result) {
        return res.status(400).json({
            message: "invalid user Id"
        })
    }
    res.json({
        message: ` product with id ${productId} fetched success`,
        result
    })
})

exports.deleteProducts = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const result = await Product.findOne({ _id: productId })
    if (!result) {
        return res.status(400).json({
            message: "invalid user id"
        })
    }
    await Product.findByIdAndDelete(productId)
    res.json({
        message: " delete product success"
    })
})
exports.destroyProduct = asyncHandler(async (req, res) => {
    const result = await Product.deleteMany()
    //    await fs.unlink()
    res.json({
        message: " all product  deleted success"
    })
})

exports.updateProductImages = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const singleProduct = await Product.findById(productId)
    if (!singleProduct) {
        return res.status(400).json({
            message: "invalid user Id"
        })
    }
    productUpload(req, res, async err => {
        if (err) {
            res.status(400).json({
                message: "multor err" + err
            })
        }
        for (let i = 0; i < singleProduct.image.length; i++) {
            await fs.unlink(path.join(__dirname, "..", "public", singleProduct.image[i]))
        }
        const filenames = []
        for (let i = 0; i < req.files.length; i++) {
            filenames.push(`assets/images/products/${req.files[i].filename}`)
        }
        const result = await Product.findByIdAndUpdate(productId, { image: filenames }, { new: true })
        res.json({
            message: "product image update successfully",
            result
        })
    })
})