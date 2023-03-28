const { getCartData, addToCart, destroyCart, removeSingleCartItem, emptyCart } = require("../controllers/cartController")
const { protected } = require("../middleware/auth")

const router = require("express").Router()

router


    .post("/add-to-cart", protected, addToCart)
    .get("/cart-history", protected, getCartData)
    .delete("/cart-destroy", destroyCart)
    .delete("/empty-cart", protected, emptyCart)
    .delete("/cart-remove-single/:productId", protected, removeSingleCartItem)

module.exports = router