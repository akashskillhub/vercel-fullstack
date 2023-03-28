const { registerUser, getAllUsers, editUser, getSingleUser, destroyUsers, deleteUser, getUserProfile } = require("../controllers/userController")
const router = require("express").Router()
const { protected } = require("../middleware/auth")
router
    .get("/", getAllUsers)
    .get("/profile", protected, getUserProfile)
    .post("/add", registerUser)
    .put("/profile-update", protected, editUser)
    .delete("/delete/:id", deleteUser)
    .delete("/destroy", destroyUsers)
    .get("/:id", getSingleUser)
module.exports = router