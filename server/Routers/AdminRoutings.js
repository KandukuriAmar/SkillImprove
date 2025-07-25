const express = require('express');
const router = express.Router();
const admincontroller = require("../Controllers/AdminController");

router.delete("/deleteuser", admincontroller.DeleterUserController);
router.get("/readuser", admincontroller.ReadUserController);
router.put("/updateuser", admincontroller.UpdateUserController);
router.post("/addroadmap", admincontroller.AddRoadMapController);
router.get("/getroadmap", admincontroller.GetRoadMapController);
router.delete("/deleteroadmap", admincontroller.DeleteRoadMapController);
router.put("/updateroadmap", admincontroller.UpdateRoadMapController);
router.get("/getallusers", admincontroller.GetAllUsersController);
router.get("/getallroadmaps", admincontroller.GetAllRoadMapsController);
router.post("/adminlogin", admincontroller.AdminLoginController);

module.exports = router;