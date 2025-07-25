const express = require('express');
const router = express.Router();
const controller = require('../Controllers/controller');

router.post("/register", controller.registerController);
router.post("/login", controller.loginController);
router.post("/roadmap", controller.roadmapController);
router.delete("/deleteroadmap", controller.deleteRoadMapController);
router.get("/getroadmap", controller.getRoadMapController);
router.get("/quiz", controller.getQuizController);
router.post("/quizscore", controller.quizScoreController);
router.get("/getprofiledata", controller.getProfileDataController);
router.put("/updatepassword", controller.updatePasswordController);
router.post("/me", controller.getMeController);
router.post("/getcookie", controller.getCookie);


module.exports = router;