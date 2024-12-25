const Vehicle = require("../Models/VCModel");

// Fetch all vehicle details
const getVehicleDetails = async (req, res, next) => {
  let vehicles;

  try {
    vehicles = await Vehicle.find();
  } catch (err) {
    console.log(err);
  }

  if (!vehicles) {
    return res.status(404).json({ message: "Vehicles not found" });
  }

  // Include the full path for the image
  vehicles = vehicles.map(vehicle => ({
    ...vehicle._doc,
    imageUrl: vehicle.image ? `http://localhost:5000/uploads/${vehicle.image}` : null
  }));

  return res.status(200).json({ vehicles });
};

// Add a new vehicle with an optional image
const addVehicle = async (req, res, next) => {
  const {
    name,
    description,
    drivetrain,
    enginepower,
    enginetorque,
    enginedisplacement,
    engineconfiguration,
    transmission,
    doors,
    seats,
    wheelsize,
    wheeltype,
    fueltype,
    bodytype,
    climateControl,
    infotainmentSystem,
    sunroof,
    upholstery,
    powerAdjustableSeats,
    ambientLighting,
    heatedSeats
  } = req.body;

  let imagePath = null;
  if (req.file) {
    imagePath = req.file.filename;
  }

  let vehicle;

  try {
    vehicle = new Vehicle({
      name,
      description,
      drivetrain,
      enginepower,
      enginetorque,
      enginedisplacement,
      engineconfiguration,
      transmission,
      doors,
      seats,
      wheelsize,
      wheeltype,
      fueltype,
      bodytype,
      climateControl,
      infotainmentSystem,
      sunroof,
      upholstery,
      powerAdjustableSeats,
      ambientLighting,
      heatedSeats,
      image: imagePath
    });

    await vehicle.save();
  } catch (err) {
    console.log(err);
  }

  if (!vehicle) {
    return res.status(404).send({ message: "Unable to add vehicle" });
  }

  return res.status(200).json({ vehicle });
};

// Fetch a vehicle by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  let vehicle;

  try {
    vehicle = await Vehicle.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not available" });
  }

  const vehicleWithImage = {
    ...vehicle._doc,
    imageUrl: vehicle.image ? `http://localhost:5000/uploads/${vehicle.image}` : null
  };

  return res.status(200).json({ vehicle: vehicleWithImage });
};

// Update vehicle details (including image)
const updateVehicle = async (req, res, next) => {
  const id = req.params.id;
  const {
    name,
    description,
    drivetrain,
    enginepower,
    enginetorque,
    enginedisplacement,
    engineconfiguration,
    transmission,
    doors,
    seats,
    wheelsize,
    wheeltype,
    fueltype,
    bodytype,
    climateControl,
    infotainmentSystem,
    sunroof,
    upholstery,
    powerAdjustableSeats,
    ambientLighting,
    heatedSeats
  } = req.body;

  let imagePath = null;
  if (req.file) {
    imagePath = req.file.filename;
  }

  let vehicle;

  try {
    vehicle = await Vehicle.findByIdAndUpdate(id, {
      name,
      description,
      drivetrain,
      enginepower,
      enginetorque,
      enginedisplacement,
      engineconfiguration,
      transmission,
      doors,
      seats,
      wheelsize,
      wheeltype,
      fueltype,
      bodytype,
      climateControl,
      infotainmentSystem,
      sunroof,
      upholstery,
      powerAdjustableSeats,
      ambientLighting,
      heatedSeats,
      ...(imagePath && { image: imagePath })
    }, { new: true });
  } catch (err) {
    console.log(err);
  }

  if (!vehicle) {
    return res.status(404).json({ message: "Can't update vehicle record" });
  }

  return res.status(200).json({ vehicle });
};

// Delete a vehicle by ID
const deleteVehicle = async (req, res, next) => {
  const id = req.params.id;

  let vehicle;

  try {
    vehicle = await Vehicle.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle can't be deleted" });
  }

  return res.status(200).json({ vehicle });
};

exports.getVehicleDetails = getVehicleDetails;
exports.addVehicle = addVehicle;
exports.getById = getById;
exports.updateVehicle = updateVehicle;
exports.deleteVehicle = deleteVehicle;
