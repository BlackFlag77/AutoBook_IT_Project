//import express
const express = require("express");

//import router
const router = express.Router();

//import model
const User = require("../Models/TuteModel");

//import userController
const userController = require("../Controllers/TuteControl");

// Import the upload middleware
const { upload } = require("../Controllers/TuteControl");


//create route path display function
router.get("/",userController.getAllUsers);

//route path for insert function
router.post("/",upload.single('visualContent'),userController.addTutorial);

//route path for get  by id
router.get("/:id",userController.getById);

//route path for update
router.put("/:id", upload.single('visualContent'),userController.updateTutorial);

//route path for delete
router.delete("/:id",userController.deleteTutorial);

// New routes for likes and comments
router.put("/:id/like", userController.likeTutorial);
router.put("/:id/comment", userController.addComment);
router.get("/:id/comments", userController.getComments);


//export router path
module.exports = router;
