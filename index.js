const express = require("express")
const path = require("path")
require("dotenv").config({ path: "./.env" })
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
// const 

const connectDB = require("./config/db")
const { log, logEvent } = require("./middleware/logger")
const { format } = require("date-fns")
const { errorHandler } = require("./middleware/error")
const { adminProtected } = require("./middleware/auth")
connectDB()
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "build")))
app.use(express.static(path.join(__dirname, "public")))

// app.use(express.static("public"))
app.use(log)
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: (o, cb) => {
        const allowed = [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://vercel-fullstack-ten.vercel.app",
        ]
        if (allowed.indexOf(o) !== -1 || !o) {
            cb(null, true)
        } else {
            cb("blocked by cors")
        }
    }
}))

app.use("/api/user", require("./routes/userRoute"))
app.use("/api/cart", require("./routes/cartRoute"))
app.use("/api/order", require("./routes/orderRoutes"))
app.use("/api/employee", adminProtected, require("./routes/employeeRoute"))
app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/products", require("./routes/productRoute"))
app.use("*", (req, res) => {
    res.sendFile()
})
app.use(errorHandler)
const PORT = process.env.PORT || 5000

mongoose.connection.once("open", () => {
    app.listen(PORT, console.log(`SEVER RUNNING http://localhost:${PORT} `))
    console.log("mongo connected");
})

mongoose.connection.on("error", err => {
    const msg = `${format(new Date(), "dd-MM-yyyy \t HH:mm:ss")}\t${err.code}\t${err.name}`
    logEvent({
        fileName: "mongo.log",
        message: msg
    })
})

module.exports = app