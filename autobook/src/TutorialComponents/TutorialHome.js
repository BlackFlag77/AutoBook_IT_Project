import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import NavMy from "./NavMy";
import axios from "axios";
import User from "./User";
import '../Styles/TutorialStyles/TutorialHome.css';  
import NavBar from '../Common/NavBar';

const URL = "http://localhost:5000/Tutorial";

//fetchhandler
const fetchhandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}

function TutorialHome() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchhandler()
      .then((data) => {
        console.log(data); // Check the structure of the response
        if (data && data.Tutorial) { // Adjust based on actual data structure
          setUsers(data.Tutorial); // Should use database tutorial details
        } else {
          console.error("Unexpected data format:", data);
        }
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const handleSearch = () => {
    fetchhandler().then((data) => {
      if (data && data.Tutorial) {
        // Assuming 'Tutorial' contains the list of tutorials or users
        const filteredUsers = data.Tutorial.filter((user) =>
          Object.values(user).some((field) =>
            field.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setUsers(filteredUsers);
        setNoResults(filteredUsers.length === 0);
      } else {
        console.error("Unexpected data format:", data);
        setNoResults(true); // Set no results in case of an unexpected format
      }
    }).catch(error => console.error("Error fetching users:", error));
  }

  return (
    <div>
      <NavBar />
      <NavMy />
      <h2>Home Page</h2>
      <div className='tutorials-search-container'>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        name="search"
        className='tutorials-searchbar'
        placeholder="Search Tutorials"
      ></input>

      <button className='tutorial-seachbarbtn' onClick={handleSearch}>Search</button>
      </div>

      {noResults ? (
        <div>
          <p>No Users Found</p>
        </div>
      ) : (
        <div className="tutorial-container">
          {users && users.map((user, i) => (
            <div key={i} className="tutorial-card">
              <User user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorialHome;
