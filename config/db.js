const mongoose = require("mongoose")

const connectDB = () => {
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log("MONGO ERROR " + error);
    }
}

module.exports = connectDB