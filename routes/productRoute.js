const { addProduct, getAllProducts, deleteProducts, destroyProduct, getsingleProducts, updateProductImages, updateProduct } = require("../controllers/productController")
const { adminProtected } = require("../middleware/auth")

const router = require("express").Router()

router
    .get("/", getAllProducts)
    .get("/details/:productId", getsingleProducts)
    .post("/add-product", adminProtected, addProduct)
    .put("/update-product/:productId", adminProtected, updateProduct)
    .put("/update-product-image/:productId", adminProtected, updateProductImages)
    .delete("/delete/:productId", adminProtected, deleteProducts)
    .delete("/destroy", destroyProduct)

module.exports = router