//pass-  vbcTXgK7k5VaH4It

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const router = require("./Routes/VCRoute");
const router2 = require("./Routes/PostRoutes");
const routerC = require("./Routes/CommentRoutes");
const router3 = require("./Routes/TuteRoute");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Set up Multer for file upload handling
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: fileStorage });

// Routes Middleware
app.use("/Vehicles", router);   // "/Vehicles" - this is route path (http://localhost:5000/Vehicles)
app.use("/posts", router2);
app.use("/comments", routerC);
app.use("/Tutorial",router3);

// Connect to database
mongoose
  .connect("mongodb+srv://it22057624:Dinuka123@cluster0.stb7f.mongodb.net/")
  .then(() => console.log("Connected to mongoDB"))
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.log(err));
