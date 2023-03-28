const { loginUser, continueWithGoogle, forgetPassword, resetPassword, loginEmolpyee } = require("../controllers/authController")
const { loginLimiter } = require("../middleware/limiter")

const router = require("express").Router()

router
    .post("/user/login", loginLimiter, loginUser)
    .post("/user/login-with-google", loginLimiter, continueWithGoogle)
    .post("/employee/login", loginLimiter, loginEmolpyee)
    .post("/user/forget-pass", forgetPassword)
    .put("/user/reset-pass/:id", resetPassword)

module.exports = router