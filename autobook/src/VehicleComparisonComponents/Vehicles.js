import React, { useEffect, useState, useRef } from 'react';
import Vehicle from './Vehicle';
import axios from 'axios';
import jsPDF from 'jspdf';  
import 'jspdf-autotable';  //for better table formatting
import NavBar from '../Common/NavBar';


const URL = "http://localhost:5000/Vehicles";

// Fetch handler to get vehicle data from the backend
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;  // Return the full response object
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return { vehicles: [] };  // Return empty array in case of an error
  }
};

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);  // Initialize with an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler()
      .then(data => {
        setVehicles(data.vehicles || []);  // Safely handle if 'vehicles' is undefined
        setFilteredVehicles(data.vehicles || []);  // Initialize filteredVehicles with all vehicles
      })
      .catch(error => console.error("Error fetching vehicles:", error));
  }, []);  // Only run once when the component mounts

  const handleSearch = () => {
    if (searchQuery === "") {
      setFilteredVehicles(vehicles);  // Reset to all vehicles if search query is empty
      setNoResults(false);
      return;
    }
    
    const filtered = vehicles.filter((vehicle) =>
      Object.values(vehicle).some((field) =>
        field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    setFilteredVehicles(filtered);
    setNoResults(filtered.length === 0);
  };

   // Function to generate PDF report
   const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Vehicle Report", 10, 10);

    // Add filtered vehicles to the PDF using autoTable
    const vehicleData = filteredVehicles.map(vehicle => [
      vehicle.name
    ]);  // Customize fields as per your vehicle structure

    doc.autoTable({
      head: [['Name']],
      body: vehicleData
    });

    // Save the PDF
    doc.save("vehicle_report.pdf");
  };

  return (
    <div className='search-page'>
      <NavBar />
      <div className='any-vehicle-searchbar-container'>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        name="search"
        placeholder="Search for any vehicle"
        className='any-vehicle-searchbar'
        value={searchQuery}
      />

      <button onClick={handleSearch} className='any-vehicle-search-btn'>Search</button>
      </div>
      <div>
      {noResults ? (
        <div>
          <p>No Vehicle found</p>
        </div>
      ) : (
        <div>
          {/* Check if filteredVehicles is not empty, then map over it and pass each to the Vehicle component */}
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle, i) => (
              <div key={i}>
                <Vehicle vehicle={vehicle} />
              </div>
            
            ))
          ) : (
            <p>No vehicles available</p>
          )}
        </div>
      )}
      </div>
      <button onClick={generatePDF}>Download Report</button> {/* Button to download PDF */}
    </div>
  );
}

export default Vehicles;
