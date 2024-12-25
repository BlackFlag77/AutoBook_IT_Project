import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NavMy from './NavMy';
import '../Styles/TutorialStyles/UpdateTutorial.css'

function UpdateTutorial() {
  const { id } = useParams(); // Get the tutorial ID from URL
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    title: '',
    content: '',
  });

  const [visualContent, setVisualContent] = useState(null);
  const [existingVisualContent, setExistingVisualContent] = useState(null);
  const [visualContentType, setVisualContentType] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current tutorial data on mount
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/Tutorial/${id}`);
        const data = response.data.Tutorial; // Adjust based on backend response structure
        setInputs({
          title: data.title,
          content: data.content,
        });
        setExistingVisualContent(data.visualContent);
        setVisualContentType(data.visualContentType);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tutorial data:', err);
        setError('Failed to fetch tutorial details.');
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [id]);

  // Handle input changes for title and content
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file input change for visual content
  const handleFileChange = (e) => {
    setVisualContent(e.target.files[0]); // Store the selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input length
    if (inputs.title.split(' ').length > 25) {
      setError('Title cannot exceed 25 words.');
      return;
    }

    if (inputs.content.split(' ').length > 450) {
      setError('Content cannot exceed 450 words.');
      return;
    }


    try {
      await sendRequest(); // Wait for the update request to complete
      navigate(`/tutorialhome`); // Navigate back to the tutorial detail page
    } catch (err) {
      console.error(err);
      setError('Failed to update tutorial.');
    }
  };
  // Send the update request to the backend
  const sendRequest = async () => {
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('content', inputs.content);
    
    if (visualContent) {
        formData.append('visualContent', visualContent);
    }

    try {
        const response = await axios.put(`http://localhost:5000/Tutorial/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Response from update:', response.data);
        return response.data; // Ensure you are returning the response
    } catch (error) {
        console.error('Error updating tutorial:', error);
        throw error; // Rethrow to handle it in the catch block of handleSubmit
    }
};


  if (loading) {
    return (
      <div>
        <NavMy />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavMy />
        <p>{error}</p>
      </div>
    );
  }

  return (

    <div className='main-container-update'>
      <button onClick={() => navigate('/mainhome')} className="back-to-home-btn">
       Back to Home
      </button>
    <div className='update-tutorial-container'>
     
      <h1>Update Tutorial</h1>
      <form onSubmit={handleSubmit}>
        <label className='Title-name'>Title</label>
        <br />
        <input
          type="text"
          name="title"
          className='title-filed'
          onChange={handleChange}
          value={inputs.title}
          required
        />
        <br /><br />

        <label>Content</label>
        <br />
        <textarea
          name="content"
          onChange={handleChange}
          value={inputs.content}
          className='content-filed'
          required
          rows="5"
          cols="50"
        ></textarea>
        <br /><br />

        <label>Visual Content</label>
        <br />
        {/* Display existing visual content */}
        {existingVisualContent && visualContentType === 'image' && (
          <div className='update-image-holder'>
            <img
              src={`http://localhost:5000${existingVisualContent}`}
              alt="Existing"
              className='update-image'
              //style={{ width: '200px', height: 'auto' }}
            />
          </div>
        )}
        {existingVisualContent && visualContentType === 'video' && (
          <div>
            <video width="200" controls>
              <source src={`http://localhost:5000${existingVisualContent}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <br />
        <input
          type="file"
          name="visualContent"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <br /><br />

        <button type="submit">Update</button>
      </form>
    </div>
    </div>
  );
}

export default UpdateTutorial;
