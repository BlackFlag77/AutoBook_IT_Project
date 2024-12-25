import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Vehicle from './Vehicle'; // Assuming you have a Vehicle component to display vehicle details
import axios from 'axios';

const URL = "http://localhost:5000/Vehicles";

function VehicleCompareSearch() {
  const [searchQuery1, setSearchQuery1] = useState("");  // Left side search bar
  const [searchQuery2, setSearchQuery2] = useState("");  // Right side search bar
  const [vehicle1, setVehicle1] = useState(null);  // Vehicle result for search 1
  const [vehicle2, setVehicle2] = useState(null);  // Vehicle result for search 2
  const [noResults, setNoResults] = useState(false);

  const [score1, setScore1] = useState(0); //score for vehicle 1
  const [score2, setScore2] = useState(0); //Score for vehicle 2
  const [comfortComparison, setComfortComparison] = useState(""); // compare results (set who is the winner)

  const handleSearch = () => {
    // Fetch vehicles from the backend and filter based on search queries
    axios.get(URL).then(response => {
      const vehicles = response.data.vehicles;

      // Search for Vehicle 1
      const filteredVehicle1 = vehicles.find(vehicle =>
        Object.values(vehicle).some(field =>
          field?.toString().toLowerCase().includes(searchQuery1.toLowerCase())
        )
      );

      // Search for Vehicle 2
      const filteredVehicle2 = vehicles.find(vehicle =>
        Object.values(vehicle).some(field =>
          field?.toString().toLowerCase().includes(searchQuery2.toLowerCase())
        )
      );

      setVehicle1(filteredVehicle1 || null);
      setVehicle2(filteredVehicle2 || null);
      setNoResults(!filteredVehicle1 && !filteredVehicle2);


      //calculate scores based on selected features
      if(filteredVehicle1) {
        const score = calculateScore(filteredVehicle1); //calculate score for vehicle 1
        setScore1(score); //update vehicle1 score
      }
      
      if(filteredVehicle2) {
        const score = calculateScore(filteredVehicle2); //calculate score for vehicle 2
        setScore2(score);  //update vehicle2 score
      }

    }).catch(error => {
      console.error("Error fetching vehicles:", error);
      setNoResults(true);
    });
  };

  //Function to calculate score based on features
  const calculateScore = (vehicle) => {
    let score = 0;
    if (vehicle.climateControl) score += 1;
    if (vehicle.infotainmentSystem) score += 1;
    if (vehicle.sunroof) score += 1;
    if (vehicle.upholstery) score += 1;
    if (vehicle.powerAdjustableSeats) score += 1;
    if (vehicle.ambientLighting) score += 1;
    if (vehicle.heatedSeats) score += 1;

      // Scale the score to be out of 10
    const maxScore = 7;
    const scaledScore = (score / maxScore) * 10;

    return Math.round(scaledScore); //Ensure the score doesn't exceed 10
  };


    //Compare scores to find which vehicle has better comfort
    useEffect(() => {
      if (vehicle1 && vehicle2) {
        if (score1 > score2) {
          setComfortComparison(`${vehicle1.name} has better comfort.`);
        } else if (score2 > score1) {
          setComfortComparison(`${vehicle2.name} has better comfort.`);
        } else if (score1 === score2) {
          setComfortComparison("Both vehicles have the same comfort level.");
        }
      }
    }, [score1, score2, vehicle1, vehicle2]);


// Generate the PDF report for the two vehicles

const generatePDF = () => {
  const doc = new jsPDF();  // Create a new jsPDF instance

  // Add a title for the first page
  doc.text("Vehicle Comparison Report", 20, 20);
  
  // Vehicle 1 details
  if (vehicle1) {
    doc.text("Vehicle 1: " + vehicle1.name, 20, 30);

    // Adding vehicle1 image (assuming it's a base64 image or URL)
    if (vehicle1.imageUrl) {
      doc.addImage(vehicle1.imageUrl, 'JPEG', 50, 40, 120, 75);  // Adjusted image position //X:50, Y:40 Width: 100, Height: 75
    }

    // Vehicle 1 characteristics
    doc.autoTable({
      startY: 120, // Adjust to start after the image
      head: [['Characteristic', 'Details']],
      body: [
        ['Description', vehicle1.description],
        ['Drivetrain', vehicle1.drivetrain],
        ['Engine Power (HP)', vehicle1.enginepower],
        ['Engine Torque (Nm)', vehicle1.enginetorque],
        ['Engine Displacement (cc)', vehicle1.enginedisplacement],
        ['Engine Configuration', vehicle1.engineconfiguration],
        ['Transmission', vehicle1.transmission],
        ['Doors', vehicle1.doors],
        ['Seats', vehicle1.seats],
        ['Wheel Size', vehicle1.wheelsize],
        ['Wheel Type', vehicle1.wheeltype],
        ['Fuel Type', vehicle1.fueltype],
        ['Body Type', vehicle1.bodytype],
        ['Climate Control', vehicle1.climateControl ? 'Yes' : 'No'],
        ['Infotainment System', vehicle1.infotainmentSystem ? 'Yes' : 'No'],
        ['Sunroof', vehicle1.sunroof ? 'Yes' : 'No'],
        ['Leather Upholstery', vehicle1.upholstery ? 'Yes' : 'No'],
        ['Power Adjustable Seats', vehicle1.powerAdjustableSeats ? 'Yes' : 'No'],
        ['Ambient Lighting', vehicle1.ambientLighting ? 'Yes' : 'No'],
        ['Heated Seats', vehicle1.heatedSeats ? 'Yes' : 'No'],
        ['Comfort Score', score1 + '/10'],
      ],
    });
  }

  // Add a new page for Vehicle 2
  doc.addPage();  // Create a new page for vehicle 2

  // Add title for the second page
  doc.text("Vehicle Comparison Report", 20, 20);

  // Vehicle 2 details
  if (vehicle2) {
    doc.text("Vehicle 2: " + vehicle2.name, 20, 30);

    // Adding vehicle2 image (assuming it's a base64 image or URL)
    if (vehicle2.imageUrl) {
      doc.addImage(vehicle2.imageUrl, 'JPEG', 50, 40, 120, 75);  // Adjusted image position //X:50, Y:40 Width: 100, Height: 75
    }

    // Vehicle 2 characteristics
    doc.autoTable({
      startY: 120, // Adjust to start after the image
      head: [['Characteristic', 'Details']],
      body: [
        ['Description', vehicle2.description],
        ['Drivetrain', vehicle2.drivetrain],
        ['Engine Power (HP)', vehicle2.enginepower],
        ['Engine Torque (Nm)', vehicle2.enginetorque],
        ['Engine Displacement (cc)', vehicle2.enginedisplacement],
        ['Engine Configuration', vehicle2.engineconfiguration],
        ['Transmission', vehicle2.transmission],
        ['Doors', vehicle2.doors],
        ['Seats', vehicle2.seats],
        ['Wheel Size', vehicle2.wheelsize],
        ['Wheel Type', vehicle2.wheeltype],
        ['Fuel Type', vehicle2.fueltype],
        ['Body Type', vehicle2.bodytype],
        ['Climate Control', vehicle2.climateControl ? 'Yes' : 'No'],
        ['Infotainment System', vehicle2.infotainmentSystem ? 'Yes' : 'No'],
        ['Sunroof', vehicle2.sunroof ? 'Yes' : 'No'],
        ['Leather Upholstery', vehicle2.upholstery ? 'Yes' : 'No'],
        ['Power Adjustable Seats', vehicle2.powerAdjustableSeats ? 'Yes' : 'No'],
        ['Ambient Lighting', vehicle2.ambientLighting ? 'Yes' : 'No'],
        ['Heated Seats', vehicle2.heatedSeats ? 'Yes' : 'No'],
        ['Comfort Score', score2 + '/10'],
      ],
    });
  }

  // Save the PDF
  doc.save("Vehicle_Comparison_Report.pdf");
};


  return (
    <div className="vcs-container">
      <div className="vcs-searchbars-container">
        {/* Search Bar 1 */}
        <input
          type="text"
          name="search1"
          className="vcs-searchbar1"
          placeholder="Search for Vehicle 1"
          value={searchQuery1}
          onChange={(e) => setSearchQuery1(e.target.value)}
        />
        {/* Search Bar 2 */}
        <input
          type="text"
          name="search2"
          className="vcs-searchbar2"
          placeholder="Search for Vehicle 2"
          value={searchQuery2}
          onChange={(e) => setSearchQuery2(e.target.value)}
        />
      </div>
      <button onClick={handleSearch} className="vcs-searchbtn">Search</button>

      {noResults ? (
        <div>
          <p>No Vehicles found</p>
        </div>
      ) : (
        <div className="vcs-vehiclescompare-container">
          {/* Display Vehicle 1 */}
          {vehicle1 ? (
            <div>
              <Vehicle vehicle={vehicle1} />
              <h2>Comfort Score: {score1}/10</h2>
            </div>
          ) : (
            <p>No Vehicle 1 found</p>
          )}

          {/* Display Vehicle 2 */}
          {vehicle2 ? (
            <div>
              <Vehicle vehicle={vehicle2} />
              <h2>Comfort Score: {score2}/10</h2>
            </div>
          ) : (
            <p>No Vehicle 2 found</p>
          )}
        </div>
      )}

      {/* Display which vehicle has better comfort*/}
      {comfortComparison && (
        <div className="vcs-compare-winner">
          <h1>{comfortComparison}</h1>
          </div>
      )}

      {/* Button to generate the report */}
      <button onClick={generatePDF} className="vcs-generate-btn">Generate Report</button>
    </div>
  );
}

export default VehicleCompareSearch;
