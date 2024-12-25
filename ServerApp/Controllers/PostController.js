const Post = require("../Models/PostModel");
const User = require("../Models/UserModel");

const multer = require("multer");

// Display All Posts
const getAllPosts = async (req, res, next) => {
  let posts;

  try {
    posts = await Post.find();
  } catch {
    console.log(err);
  }

  //not found
  if (!posts) {
    return res.status(404).json({ message: "Post not found" });
  }

  //Display all posts
  return res.status(200).json({ posts });
};

// File Upload
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },   // File size limit 20 MB
});

// Post Creation/Insertion
const addPosts = async (req, res, next) => {
  const { title, description } = req.body;

  let mediaUrl = null;
  let mediaType = null;

  // // Backend validation
  // if (!title || title.trim() === '') {
  //   return res.status(400).json({ error: 'Title is required' });
  // }
  // if (title.length > 100) {
  //   return res.status(400).json({ error: 'Title must be less than 100 characters' });
  // }
  // if (!content || content.trim() === '') {
  //   return res.status(400).json({ error: 'Content is required' });
  // }
  // if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
  //   return res.status(400).json({ error: 'Only image or video files are allowed' });
  // }

  if (req.file) {
    mediaUrl = `/Uploads/${req.file.filename}`;
    mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";
  }

  let posts;

  try {
    posts = new Post({
      title: title,
      description: description,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      // userId: req.user.userId, // Attach the logged-in user's ID to the post
    });
    await posts.save();
  } catch (err) {
    console.log(err);
  }

  // If post did not insert
  if (!posts) {
    return res.status(404).send({ message: "unable to add post" });
  }
  return res.status(200).json({ posts });
};

// Get post by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  let post;

  try {
    post = await Post.findById(id);
  } catch (err) {
    console.log(err);
  }

  // Not available posts
  if (!post) {
    return res.status(404).send({ message: "Post not found" });
  }
  return res.status(200).json({ post });
};

// Update Post Details
const updatePost = async (req, res, next) => {
  const id = req.params.id;
  const { title, description } = req.body;

  let posts;

  try {
    posts = await Post.findByIdAndUpdate(id, {
      title: title,
      description: description,
    });
    posts = await posts.save();
  } catch (err) {
    console.log(err);
  }

  // If post not updated
  if (!posts) {
    return res.status(404).send({ message: "Unable to Update Post Details" });
  }
  return res.status(200).json({ posts });
};

// Delete Post Details
const deletePost = async (req, res, next) => {
  const id = req.params.id;

  let post;

  try {
    post = await Post.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  // If post did not delete
  if (!post) {
    return res.status(404).send({ message: "Unable to Delete Post Details" });
  }
  return res.status(200).json({ post });
};

// Get all searched posts
const getSearchResults = async (req, res) => {
  try {
    const { search } = req.query;
    let posts;

    if (search) {
      // Text search
      posts = await Post.find(
        { $text: { $search: search } },
        { score: { $meta: "textScore" } } // Project the text score
      ).sort({ score: { $meta: "textScore" }, createdAt: -1 });
    } else {
      // If no search query, return all posts sorted by creation date
      posts = await Post.find().sort({ createdAt: -1 });
    }

    console.log("Search Query:", search);
    console.log("Number of Posts Found:", posts.length);

    res.json({ posts });
  } catch (error) {
    console.error("Error in getSearchResults:", error);
    res.status(500).json({ message: error.message });
  }
};



// Temporary Register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });

    await user.save();
    res.status(200).json({ user, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error, message: "Error in getSearchResults:" });
    console.log(error);
  }
};

// Temp Login
const login = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    if (req.body.password !== user.password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create a JWT token
    // const token = jwt.sign({ userId: user._id }, "your_secret_key", {
    //   expiresIn: "1h", // Token valid for 1 hour
    // });

    // const { password, ...userData } = user._doc;

    res.status(200).json({
      token, // Send the token back to the client
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Error Occurred logging in the User",
    });
    console.log(error);
  }
};


// const jwt = require("jsonwebtoken");

// Middleware to authenticate the user using JWT
// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(403).json({ message: "Authorization token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, "your_secret_key");
//     req.user = decoded; // Attach the decoded userId to req.user
//     next(); // Proceed to the next middleware/controller
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



exports.getAllPosts = getAllPosts;
exports.addPosts = addPosts;
exports.upload = upload.single("media");
exports.getById = getById;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getSearchResults = getSearchResults;

exports.register = register;
exports.login = login;
// exports.authenticate = authenticate;
