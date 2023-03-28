const rateLimiter = require("express-rate-limit")
const { logEvent } = require("./logger")
const { format } = require("date-fns")
exports.loginLimiter = rateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many attempts",
    handler: (req, res, next, options) => {
        const msg = `${format(new Date(), "dd-MM-yyyy\t HH:mm:ss")}\t${req.url}\t${req.method}\t${req.headers.origin}\t too many login attempts\n`
        logEvent({
            message: msg,
            fileName: "error.log"
        })

        res.status(401).json({
            message: "too many attempts, please retry aftre 60 seconds"
        })
    }
})