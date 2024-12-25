const express = require("express");
const router = express.Router();

//Insert Post Model
const Post = require("../Models/PostModel");

//Insert User Model
const User = require("../Models/UserModel");

//Insert Post Controller
const PostController = require("../Controllers/PostController");

//Post Routes
router.get("/",PostController.getAllPosts);
router.post("/posts",PostController.upload, PostController.addPosts);
router.get("/:id",PostController.getById);
router.put("/:id",PostController.updatePost);
router.delete("/:id",PostController.deletePost);
router.get("/search", PostController.getSearchResults);

//User Routes
router.post("/register", PostController.register);
router.post("/login", PostController.login);

// Export
module.exports = router;
