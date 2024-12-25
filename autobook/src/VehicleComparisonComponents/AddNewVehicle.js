import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function AddNewVehicle() {
  const navigate = useNavigate();

  // State to store form inputs
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    drivetrain: "",
    enginepower: "",
    enginetorque: "",
    enginedisplacement: "",
    engineconfiguration: "",
    transmission: "",
    doors: "",
    seats: "",
    wheelsize: "",
    wheeltype: "",
    fueltype: "",
    bodytype: "",
    climateControl: false,
    infotainmentSystem: false,
    sunroof: false,
    upholstery: false,
    powerAdjustableSeats: false,
    ambientLighting: false,
    heatedSeats: false,
  });

  // State to store the image file
  const [image, setImage] = useState(null);

  // State to store validation errors
  const [errors, setErrors] = useState({});

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value, // Update state for checkboxes and text inputs
    }));
  };

  // Handle file input (image)
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file (image) to state
  };

  // Validation function for form fields
  const validate = () => {
    let errors = {};
    let isValid = true;

    // Name validation
    if (!inputs.name) {
      isValid = false;
      errors.name = "Vehicle name is required."; // Error if name is empty
    } else if(inputs.name.length < 2){
      isValid = false;
      errors.name = "Vehicle name must be at least 2 characters long."
    }

    //description validation
    if(inputs.description.length > 500){
      isValid = false;
      errors.description = "Vehicle description cannot be exceeded 500 words."
    }

    // Drivetain validation
    if (!inputs.drivetrain) {
       isValid = false;
      errors.drivetrain = "Drivetrain is required";
    }

    // Engine Power validation
    if (!inputs.enginepower) {
      isValid = false;
      errors.enginepower = "Engine power is required"; // Error if engine power is empty
    }

    // Engine Torque validation
    if (!inputs.enginetorque) {
      isValid = false;
      errors.enginetorque = "Engine torque is required"; // Error if engine torque is empty
    }

    //Engine Displacement validation
    if(!inputs.enginedisplacement){
      isValid = false;
      errors.enginedisplacement = "Engine displacement is required."
    }else if (!/^\d\.\d L$/.test(inputs.enginedisplacement)){
      isValid = false;
      errors.enginedisplacement = "Engine displacement must be in format 'x.x L'.";
    }

    //Engine configuration validation
    if(!inputs.engineconfiguration){
      isValid = false;
      errors.engineconfiguration = "Engine configuration is required";
    }

    //Transmission validation
    if(!inputs.transmission){
      isValid= false;
      errors.transmission = "Transmission type is required."
    }

    //Doors validation
    if(!inputs.doors){
      isValid = true;
    }
    else if(inputs.doors < 2 || inputs.doors > 6){
      isValid = false;
      errors.doors = "Number of Doors must be between 2 to 6."
    }

    //Seats Validation
    if(!inputs.seats){
      isValid = true;
    }else if(inputs.seats < 2 || inputs.seats > 50){
      isValid = false;
      errors.seats = "Number of seats must be between 2 to 50."
    }

    //Wheel size validation
    if(!inputs.wheelsize){
      isValid = true;
    }else if (inputs.wheelsize < 14) {
      isValid = false;
      errors.wheelsize = "Minimum wheel size is 14 inches."
    }

    //fuel type validation
    if(!inputs.fueltype){
      isValid = false;
      errors.fueltype = "Fuel type is required."
    }

    //body type validation
    if(!inputs.bodytype){
      isValid = false;
      errors.bodytype = "Body type is required."
    }

    // Image file validation
    if (!image) {
      isValid = false;
      errors.image = "Vehicle image is required"; // Error if image is not uploaded
    } else if (!["image/jpeg", "image/png"].includes(image.type)) {
      isValid = false;
      errors.image = "Only JPG and PNG images are allowed"; // Error if image type is not valid
    }

    setErrors(errors); // Set errors in state
    return isValid; // Return whether the form is valid
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (validate()) {
      // Proceed only if validation passes
      sendRequest().then(() => navigate("/comparisonhome")); // Send form data if valid, then navigate to comparison home page
    }
  };

  // Send form data to backend
  const sendRequest = async () => {
    const formData = new FormData(); // Create FormData object to send file and text data
    formData.append("name", inputs.name);
    formData.append("description", inputs.description);
    formData.append("drivetrain", inputs.drivetrain);
    formData.append("enginepower", inputs.enginepower);
    formData.append("enginetorque", inputs.enginetorque);
    formData.append("enginedisplacement", inputs.enginedisplacement);
    formData.append("engineconfiguration", inputs.engineconfiguration);
    formData.append("transmission", inputs.transmission);
    formData.append("doors", inputs.doors);
    formData.append("seats", inputs.seats);
    formData.append("wheelsize", inputs.wheelsize);
    formData.append("wheeltype", inputs.wheeltype);
    formData.append("fueltype", inputs.fueltype);
    formData.append("bodytype", inputs.bodytype);

    // Append comfort features
    formData.append("climateControl", inputs.climateControl);
    formData.append("infotainmentSystem", inputs.infotainmentSystem);
    formData.append("sunroof", inputs.sunroof);
    formData.append("upholstery", inputs.upholstery);
    formData.append("powerAdjustableSeats", inputs.powerAdjustableSeats);
    formData.append("ambientLighting", inputs.ambientLighting);
    formData.append("heatedSeats", inputs.heatedSeats);

    if (image) {
      formData.append("image", image); // Append the image file to form data
    }

    try {
      await axios.post("http://localhost:5000/Vehicles", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set header for file upload
        },
      });
    } catch (err) {
      console.error("Error uploading vehicle:", err); // Log any errors during the request
    }
  };

  // Handle close button click
  const handleClose = () => {
    navigate("/comparisonhome"); // Redirect to the VehicleComparisonHome.js component
  };

  return (
    <div className="vcaddform-container">
      <h1 className="vcaddfrom-title">Add New Vehicle</h1>

      <button //close button
        className="close-button"
        onClick={handleClose}
      >
        &times; {/* Cross symbol */}
      </button>

      <form
        className="vcaddvehicle-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <br />
        <h2>Performance Specifications:</h2>

        {/* Vehicle Name */}
        <label className="vcaddform-label">Vehicle Name:</label>
        <input
          className="vcaddform-input"
          type="text"
          name="name"
          placeholder="Ex:- Honda Civic"
          onChange={handleChange}
          value={inputs.name}
        />
        {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}{" "}
        <br />

        {/* Description */}
        <label className="vcaddform-label">Description:</label>
        <input
          className="vcaddform-input"
          type="text"
          name="description"
          onChange={handleChange}
          value={inputs.description}
        />
        {errors.description && <div style={{ color: "red" }}>{errors.description}</div>}{" "}
        <br />

        {/* Drivetrain */}
        <label className="vcaddform-label">Drivetrain:</label>
        <select
          className="vcaddform-input"
          name="drivetrain"
          value={inputs.drivetrain}
          onChange={handleChange}
        >
          <option value="" disabled>Select Drivetrain</option>
          <option value="FWD">Front-Wheel Drive</option>
          <option value="RWD">Rear-Wheel Drive</option>
          <option value="AWD">All-Wheel Drive</option>
          <option value="4WD">Four-Wheel Drive</option>
        </select>
        {errors.drivetrain && (
          <div style={{ color: "red" }}>{errors.drivetrain}</div>
        )}
        <br />

        {/* Engine Power */}
        <label className="vcaddform-label">Engine Power (HP):</label>
        <input
          className="vcaddform-input"
          type="text"
          name="enginepower"
          placeholder="Ex:- 240 PS (237 hp) at 8,000 rpm"
          onChange={handleChange}
          value={inputs.enginepower}
        />
        {errors.enginepower && (
          <div style={{ color: "red" }}>{errors.enginepower}</div>
        )}{" "}
        <br />

        {/* Engine Torque */}
        <label className="vcaddform-label">Engine Torque (Nm):</label>
        <input
          className="vcaddform-input"
          type="text"
          name="enginetorque"
          placeholder="Ex:- 218 Nm (161 lb-ft) at 7,000 rpm"
          onChange={handleChange}
          value={inputs.enginetorque}
        />
        {errors.enginetorque && (
          <div style={{ color: "red" }}>{errors.enginetorque}</div>
        )}{" "}
        <br />

        {/* Engine Displacement */}
        <label className="vcaddform-label">Engine Displacement (cc):</label>
        <input
          className="vcaddform-input"
          type="text"
          name="enginedisplacement"
          placeholder="Ex:- 2.2 L"
          onChange={handleChange}
          value={inputs.enginedisplacement}
        />
        {errors.enginedisplacement && (
          <div style={{ color: "red" }}>{errors.enginedisplacement}</div>
        )}
        <br />

        {/* Engine Configuration */}
        <label className="vcaddform-label">Engine Configuration:</label>
        <select
          className="vcaddform-input"
          name="engineconfiguration"
          value={inputs.engineconfiguration}
          onChange={handleChange}
        >
          <option value="" disabled>Select Engine Configuration</option>
          <option value="Inline 3-cylinder">Inline 3-cylinder</option>
          <option value="Inline 4-cylinder">Inline 4-cylinder</option>
          <option value="Inline 5-cylinder">Inline 5-cylinder</option>
          <option value="Inline 6-cylinder">Inline 6-cylinder</option>
          <option value="V6">V6</option>
          <option value="V8">V8</option>
          <option value="V10">V10</option>
          <option value="V12">V12</option>
          <option value="Flat-4">Flat-4</option>
          <option value="Flat-6">Flat-6</option>
          <option value="W12">W12</option>
          <option value="W16">W16</option>
          <option value="Rotary">Rotary</option>
          <option value="H-type">H-type</option>
        </select>
        {errors.engineconfiguration && (
          <div style={{color: "red" }}>{errors.engineconfiguration}</div>
        )}
        <br />

        {/* Transmission */}
        <label className="vcaddform-label">Transmission:</label>
        <select
          className="vcaddform-input"
          type="text"
          name="transmission"
          value={inputs.transmission}
          onChange={handleChange}>
          <option value="" disabled>Select Transmission Type</option>
          <option value="Manual Transmission (MT)">Manual Transmission-MT</option>
          <option value="Automatic Transmission (AT)">Automatic Transmission-AT</option>
          <option value="Continously Variable Transmission (CVT)">Continously Variable Transmission-CVT</option>
          <option value="Dual-Clutch Transmission (DCT)">Dual-Clutch Transmission-DCT</option>
          <option value="Semi-Automatic Transmissioon (AMT)">Semi-Automatic Transmission</option>
          <option value="Tiptronic Transmission">Tiptronic Transmission</option>
        </select>
        {errors.transmission && (
          <div style={{ color: "red" }}>{errors.transmission}</div>
        )}
        <br />

        {/* Doors */}
        <label className="vcaddform-label">Doors:</label>
        <input
          className="vcaddform-input"
          type="text"
          name="doors"
          placeholder="Ex:- 5"
          onChange={handleChange}
          value={inputs.doors}
        />
        {errors.doors && (
          <div style={{ color:"red" }}>{errors.doors}</div>
        )}
        <br />
        {/* Seats */}
        <label className="vcaddform-label">Seats:</label>
        <input
          className="vcaddform-input"
          type="text"
          name="seats"
          placeholder="Ex:- 4"
          onChange={handleChange}
          value={inputs.seats}
        />
        {errors.seats && (
          <div style={{ color:"red" }}>{errors.seats}</div>
        )}
        <br />
        {/* Wheel Size */}
        <label className="vcaddform-label">Wheel Size:</label>
        <input
          className="vcaddform-input"
          type="text"
          name="wheelsize"
          placeholder="Ex:- 18"
          onChange={handleChange}
          value={inputs.wheelsize}
        />
        {errors.wheelsize && (
          <div style={{ color : "red" }}>{errors.wheelsize}</div>
        )}
        <br />

        {/* Wheel Type */}
        <label className="vcaddform-label">Wheel Type:</label>
        <select
          className="vcaddform-input"
          type = "text"
          name="wheeltype"
          value={inputs.wheeltype}
          onChange={handleChange}>
            <option value="" disabled>Select Wheel Type</option>
            <option value="Chrome">Chrome</option>
            <option value="Alloy">Alloy</option>
            <option value="Iron">Iron</option>
          </select>
        <br />

        {/* Fuel Type */}
        <label className="vcaddform-label">Fuel Type:</label>
        <select
          className="vcaddform-input"
          type="text"
          name="fueltype"
          value={inputs.fueltype}
          onChange={handleChange}>
            <option value="" disabled></option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Plug-in Hybrid">Plug-in Hybrid</option>
            <option value="CNG">CNG</option>
            <option value="Hydrogen">Hydrogen</option>
        </select>
        {errors.fueltype && (
          <div style={{ color:"red" }}>{errors.fueltype}</div>
        )}
        <br />

        {/* Body Type */}
        <label className="vcaddform-label">Body Type:</label>
        <select
        className="vcaddform-input"
        type="text"
        name="bodytype"
        value={inputs.bodytype}
        onChange={handleChange}>
          <option value="" disabled></option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="SUV">SUV</option>
          <option value="Crossover (CUV)">Crossover-CUV</option>
          <option value="Coupe">Coupe</option>
          <option value="Convertible">Convertible</option>
          <option value="Pickup Truck">Pickup Truck</option>
          <option value="Minivan (MPV)">Minivan-MPV</option>
          <option value="Wagon">Wagon</option>
          <option value="Roadster">Roadster</option>
          <option value="Van">Van</option>
          <option value="Super Car/ Sports Car">Super Car/ Sports Car</option>
          <option value="Limousine">Limousine</option>
        </select>
        {errors.bodytype && (
          <div style={{ color:"red" }}>{errors.bodytype}</div>
        )}
        <br />

        {/* Vehicle Image */}
        <label className="vcaddform-label">Vehicle Image:</label>
        <input
          className="vcaddform-input"
          type="file"
          name="image"
          onChange={handleFileChange}
        />
        {errors.image && <div style={{ color: "red" }}>{errors.image}</div>}{" "}
        {/* Display error for image */}
        <br />

        <h2>Features & Options:</h2>

        {/* Climate Control */}
        <label className="vcaddform-label">
          Climate Control:
          <br />
          <input
            type="checkbox"
            name="climateControl"
            onChange={handleChange}
            checked={inputs.climateControl}
          />{" "}
        </label>
        <br />
        {/* Infotainment System */}
        <label className="vcaddform-label">
          Infotainment System:
          <br />
          <input
            type="checkbox"
            name="infotainmentSystem"
            onChange={handleChange}
            checked={inputs.infotainmentSystem}
          />{" "}
        </label>
        <br />
        {/* Sunroof */}
        <label className="vcaddform-label">
          Sunroof:
          <br />
          <input
            type="checkbox"
            name="sunroof"
            onChange={handleChange}
            checked={inputs.sunroof}
          />{" "}
        </label>
        <br />
        {/* Upholstery */}
        <label className="vcaddform-label">
          Upholstery (Leather):
          <br />
          <input
            type="checkbox"
            name="upholstery"
            onChange={handleChange}
            checked={inputs.upholstery}
          />{" "}
        </label>
        <br />
        {/* Power Adjustable Seats */}
        <label className="vcaddform-label">
          Power Adjustable Seats:
          <br />
          <input
            type="checkbox"
            name="powerAdjustableSeats"
            onChange={handleChange}
            checked={inputs.powerAdjustableSeats}
          />{" "}
        </label>
        <br />
        {/* Ambient Lighting */}
        <label className="vcaddform-label">
          Ambient Lighting:
          <br />
          <input
            type="checkbox"
            name="ambientLighting"
            onChange={handleChange}
            checked={inputs.ambientLighting}
          />{" "}
        </label>
        <br />
        {/* Heated Seats */}
        <label className="vcaddform-label">
          Heated Seats:
          <br />
          <input
            type="checkbox"
            name="heatedSeats"
            onChange={handleChange}
            checked={inputs.heatedSeats}
          />{" "}
        </label>
        <br />
        {/* Submit Button */}
        <button type="submit" className="vcaddform-button">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}

export default AddNewVehicle;
