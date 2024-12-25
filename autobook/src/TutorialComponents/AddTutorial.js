// AddTutorial.jsx
import React, { useState } from 'react';
import NavMy from './NavMy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/TutorialStyles/AddTutorial.css'; 

function AddTutorial() {
  const navigate = useNavigate(); // Renamed for clarity
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    
  });

  const [visualContent, setVisualContent] = useState(null); // State for visual content file

  // State for validation errors
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    visualContent: "",
   
  });

 

  // Handle input changes for title, content, and dropdown
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update inputs state
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Calculate word count if applicable
    if (name === "title" || name === "content") {
      const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
      // Validate input
      validateField(name, wordCount);
    }

    
  };

  // Handle file input change for visual content
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVisualContent(file); // Store the selected file

    // Validate file selection
    if (!file) {
      setErrors((prevState) => ({
        ...prevState,
        visualContent: "Visual content is required.",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        visualContent: "",
      }));
    }
  };

  // Validation function for title and content
  const validateField = (fieldName, count) => {
    let errorMsg = "";

    if (fieldName === "title") {
      if (count > 25) {
        errorMsg = "Title cannot exceed 25 words.";
      }
    } else if (fieldName === "content") {
      if (count > 450) {
        errorMsg = "Content cannot exceed 450 words.";
      }
    }

    setErrors((prevState) => ({
      ...prevState,
      [fieldName]: errorMsg,
    }));
  };


  // Check if the form is valid
  const isFormValid = () => {
    return (
      errors.title === "" &&
      errors.content === "" &&
      errors.visualContent === "" &&
     
      inputs.title.trim() !== "" &&
      inputs.content.trim() !== "" &&
      
      visualContent
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submission
    const titleWordCount = inputs.title.trim() === "" ? 0 : inputs.title.trim().split(/\s+/).length;
    const contentWordCount = inputs.content.trim() === "" ? 0 : inputs.content.trim().split(/\s+/).length;

    let valid = true;
    let newErrors = { title: "", content: "", visualContent: "", selectedOption: "" };

    if (titleWordCount > 25) {
      newErrors.title = "Title cannot exceed 25 words.";
      valid = false;
    }

    if (contentWordCount > 450) {
      newErrors.content = "Content cannot exceed 450 words.";
      valid = false;
    }

    if (!visualContent) {
      newErrors.visualContent = "Visual content is required.";
      valid = false;
    }


    setErrors(newErrors);

    if (!valid) {
      return; // Prevent submission if validation fails
    }

    console.log(inputs, visualContent);
    sendRequest()
      .then(() => navigate('/tutorialhome'))
      .catch((err) => console.error(err));
  };

  const sendRequest = async () => {
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('content', inputs.content);
 
    if (visualContent) formData.append('visualContent', visualContent); // Append the file

    await axios.post("http://localhost:5000/Tutorial", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => res.data);
  };

  return (
    <div className='main-container'>
      <button onClick={() => navigate('/mainhome')} className="back-to-home-btn">
        Back to Home
      </button>
      <div className="add-tutorial-container">
        <h1>Add Tutorial Page</h1>
        <form onSubmit={handleSubmit} noValidate>
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              name="title" 
              id="title"
              onChange={handleChange} 
              value={inputs.title} 
              required 
              maxLength="200" 
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          {/* Content Field */}
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea 
              name="content" 
              id="content"
              onChange={handleChange} 
              value={inputs.content} 
              required 
              maxLength="3000" // Optional: Prevent excessive characters
            ></textarea>
            {errors.content && <div className="error-message">{errors.content}</div>}
          </div>

       
          

          {/* Visual Content Input */}
          <div className="form-group">
            <label htmlFor="visualContent">Visual Content</label>
            <input
              type="file"
              name="visualContent"
              id="visualContent"
              accept="image/*,video/*" // Accept both images and videos
              onChange={handleFileChange}
              required // Make it required if necessary
            />
            {errors.visualContent && <div className="error-message">{errors.visualContent}</div>}
          </div>

          {/* Submit Button */}
          <button type="submit" className='add-tute-submitbtn' disabled={!isFormValid()}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTutorial;
