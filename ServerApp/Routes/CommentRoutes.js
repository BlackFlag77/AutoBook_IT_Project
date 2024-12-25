const express = require("express");
const router = express.Router();

//Insert Comment Model
const Post = require("../Models/CommentModel");

//Insert User Model
const User = require("../Models/UserModel");

//Insert Comment Model
const Comment = require("../Models/CommentModel");

//Insert Comment Controller
const CommentController = require("../Controllers/CommentController");

//Post Routes
router.get("/",CommentController.getAllComments);
router.get("/:postId",CommentController.getCommentsByPostId);
router.post("/",CommentController.addComment);
router.put("/:id",CommentController.updateComment);
router.delete("/:id",CommentController.deleteComment);
// router.get("/search",CommentController.getSearchComments);

// Export
module.exports = router;