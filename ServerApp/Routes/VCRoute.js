const express = require("express");
const { getVehicleDetails, addVehicle, getById, updateVehicle, deleteVehicle } = require("../Controllers/VCController");
const multer = require("multer");

const router = express.Router();

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

// Routes
router.get("/", getVehicleDetails);  // Get all vehicles
router.post("/", upload.single("image"), addVehicle);  // Add a vehicle with image
router.get("/:id", getById);  // Get vehicle by ID
router.put("/:id", upload.single("image"), updateVehicle);  // Update vehicle with image
router.delete("/:id", deleteVehicle);  // Delete vehicle


module.exports = router;
