import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function VehicleSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    // Redirect to the Vehicles page when the search bar is clicked
    navigate(`/vehicledetails`);
  };

  return (
    <div>
      <input
        type="text"
        name="search"
        className="anyvehicle-searchbar"
        placeholder="Search for any Vehicle"
        onClick={handleClick}  // Trigger the redirection on click
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default VehicleSearch;
