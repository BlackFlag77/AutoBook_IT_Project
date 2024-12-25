import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Vehicle(props) {
  const {
    _id,
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
    imageUrl
  } = props.vehicle;

  const navigate = useNavigate();

  // Vehicle details delete
  const deleteHandler = async () => {
    try {
        await axios.delete(`http://localhost:5000/Vehicles/${_id}`);
        navigate("/"); // Redirect to Home.js first
        setTimeout(() => {
            navigate("/vehicledetails"); // Then redirect to Vehicles.js after a delay
        }, 0); // Delay of 1000 milliseconds (1 second)
    } catch (error) {
        console.error("Error deleting the vehicle:", error);
        alert("Failed to delete the vehicle. Please try again.");
    }
  };

  // Prevent changes on checkboxes
  const handleCheckboxChange = (event) => {
    event.preventDefault(); // Prevent any change
  };

  return (
    <div className='vehicle-container'>
      <h2 className='vehicle-title'>Vehicle Details</h2>
      
      {/* Display the vehicle image */}
      {imageUrl ? (
        <img src={imageUrl} alt={name} className='vehicle-image' />
      ) : (
        <p className='no-image'>No image available</p>
      )}

      {/* Display the rest of the vehicle details */}
      <br/>
      <h3 className='specifications-title'>Performance Specifications</h3>
      <div className='specifications'>
        <p><strong>Title:</strong> {name}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Drivetrain:</strong> {drivetrain}</p>
        <p><strong>Engine Power (HP):</strong> {enginepower}</p>
        <p><strong>Engine Torque (Nm):</strong> {enginetorque}</p>
        <p><strong>Engine Displacement (cc):</strong> {enginedisplacement}</p>
        <p><strong>Engine Configuration:</strong> {engineconfiguration}</p>
        <p><strong>Transmission:</strong> {transmission}</p>
        <p><strong>Doors:</strong> {doors}</p>
        <p><strong>Seats:</strong> {seats}</p>
        <p><strong>Wheel Type:</strong> {wheeltype}</p>
        <p><strong>Wheel Size:</strong> {wheelsize}</p>
        <p><strong>Fuel Type:</strong> {fueltype}</p>
        <p><strong>Body Type:</strong> {bodytype}</p>
      </div>
      <br/>
      <h3 className='features-title'>Features & Options</h3>
      <div className='features'>
        <label> Climate Control:
          <input type="checkbox" className='feature-checkbox' checked={climateControl} onChange={handleCheckboxChange} />
        </label><br />
        <label> Infotainment System:
          <input type="checkbox" className='feature-checkbox' checked={infotainmentSystem} onChange={handleCheckboxChange} />
        </label><br />
        <label> Sunroof:
          <input type="checkbox" className='feature-checkbox' checked={sunroof} onChange={handleCheckboxChange} />
        </label><br />
        <label> Leather Upholstery:
          <input type="checkbox" className='feature-checkbox' checked={upholstery} onChange={handleCheckboxChange} />
        </label><br />
        <label> Power Adjustable Seats:
          <input type="checkbox" className='feature-checkbox' checked={powerAdjustableSeats} onChange={handleCheckboxChange} />
        </label><br />
        <label> Ambient Lighting:
          <input type="checkbox" className='feature-checkbox' checked={ambientLighting} onChange={handleCheckboxChange} />
        </label><br />
        <label> Heated Seats:
          <input type="checkbox" className='feature-checkbox' checked={heatedSeats} onChange={handleCheckboxChange} />
        </label><br />
      </div>
      <Link to={`/vehicledetails/${_id}`}><button className='update-button'>Update</button></Link>
      <button className='delete-button' onClick={deleteHandler}>Delete</button>
    </div>
  );
}

export default Vehicle;
