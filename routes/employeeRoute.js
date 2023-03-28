const { registerEmployee, getAllEmployees, getSingleEmployees, updateEmployees, deleteEmployees, destroyEmployees, getEmployeeProfile, adminGetAllProducts, adminDeleteAllProducts, adminGetAllUsers, adminUserStatus, adminStat } = require("../controllers/employeeController")
const router = require("express").Router()

router
    .get("/", getAllEmployees)
    .get("/profile", getEmployeeProfile)
    .get("/admin-products", adminGetAllProducts)
    .delete("/admin-delete", adminDeleteAllProducts)
    .get("/detail/:employeeId", getSingleEmployees)
    .post("/register", registerEmployee)
    .put("/update/:employeeId", updateEmployees)
    .delete("/delete/:employeeId", deleteEmployees)
    .delete("/destroy", destroyEmployees)


    .get("/users", adminGetAllUsers)
    .get("/stat", adminStat)
    .put("/users/status/:userId", adminUserStatus)
module.exports = router