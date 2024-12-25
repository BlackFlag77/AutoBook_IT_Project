import React, { useState } from 'react'
import axios from "axios";
import NavBar from '../Common/NavBar';
import { useNavigate } from 'react-router-dom'

function AddPosts() {

    const history = useNavigate();
    const [inputs,setInputs] = useState({
        title:"",
        description:"",
        media:null
    });
    const navigate = useNavigate();

    const handleChange = (e)=>{

        const maxFileSize = 10 * 1024 * 1024; // 10MB limit for media file
        const allowedFileTypes = ["image/jpeg", "image/png", "video/mp4"];

        if (e.target.name === "media") {
            const file = e.target.files[0];
            if (file) {

                if (file.size > maxFileSize) {
                    alert("File size should not exceed 10MB.");
                    // console.error("File is too large. Please upload a file smaller than 10MB.");
                    return;
                }
                
                if (!allowedFileTypes.includes(file.type)) {
                    alert("Only JPEG, PNG images, and MP4 videos are allowed.");
                    // console.error("Unsupported file type. Please upload an image or video.");
                    return;
                } else {
                    setInputs((prevState) => ({
                        ...prevState,
                        media: file,
                    }));
                }
            }
        } else {
            setInputs((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        }
    };
    
    const handleClose = () => {
        navigate(-1);
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        // Frontend Validations
        const titleMaxLength = 100;
        const descriptionMaxLength = 300;
        
        // Checks if title or description are empty
        if (!inputs.title || !inputs.description) {
            alert("Title and description cannot be empty.");
            return;
        }

        // Checks if title reached max character length
        if (inputs.title.length > titleMaxLength) {
            alert(`Title should not exceed ${titleMaxLength} characters.`);
            return;
        }

        // Checks if description reached max character length
        if (inputs.description.length > descriptionMaxLength) {
            alert(`Description should not exceed ${descriptionMaxLength} characters.`);
            return;
        }

        try {
            await sendRequest();
            console.log('Post added:', inputs);
            history("/forum");
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };
    
    const sendRequest = async()=>{

        const formData = new FormData(); 
        
        formData.append("title", inputs.title);
        formData.append("description", inputs.description);
        
        if (inputs.media) {
            formData.append("media", inputs.media);
            console.log("Media file added:", inputs.media);
        }

        await axios.post("http://localhost:5000/posts/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            console.log("Post created successfully:", res.data);
        }).catch(err => {
            console.error("Error adding post:", err.response ? err.response.data : err.message);
        });
    };

  return (
    <div>
        <NavBar/>
        <div className="add-post-container">
            <div className="form-wrapper">
                <div className="form-header">
                    <h2>Create Post</h2>
                    <button className="close-btn" onClick={handleClose}>✖</button>
                </div>
                <div>
                <form onSubmit={handleSubmit} className="post-form">
                    <label htmlFor='title'>Title:</label>
                    <input 
                        type="text"
                        name="title" 
                        onChange={handleChange} 
                        value={inputs.title} 
                        required/>
                    <br/>

                    <label htmlFor='description'>Description:</label>
                    <textarea 
                        name="description" 
                        onChange={handleChange} 
                        value={inputs.description} 
                        required/>
                    <br/>

                    <label htmlFor='media'>Attachment (Image/Video):</label>
                    <input 
                        type="file" 
                        name="media" 
                        accept="image/*,video/*"    // Remove to show the file validations
                        onChange={handleChange}
                        className="file-input" />
                    <br/>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddPosts;
