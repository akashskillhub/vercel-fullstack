const { placeOrder, getUserOrder, userCancelOrder, orderPayment, verifyPayment, destroyOrders } = require("../controllers/orderController")
const { protected } = require("../middleware/auth")

const router = require("express").Router()

router
    .post("/place", protected, placeOrder)
    .get("/order-history", protected, getUserOrder)
    .put("/order-cancel/:orderId", protected, userCancelOrder)
    .post("/payment", orderPayment)
    .post("/payment/verify", protected, verifyPayment)
    .delete("/destroy", destroyOrders)


module.exports = router