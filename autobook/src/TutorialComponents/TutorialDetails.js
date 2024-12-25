import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavMy from './NavMy';
import jsPDF from 'jspdf'; 
import '../Styles/TutorialStyles/TutorialDetails.css';

function TutorialDetail() {
  const location = useLocation();
  const id = location.state ? location.state._id : null; 
  const navigate = useNavigate();

  // State Variables
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0); // Track likes
  const [newComment, setNewComment] = useState(''); // For the new comment input
  const [comments, setComments] = useState([]); // Track comments

  // Fetch tutorial details
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tutorial/${id}`);
        const fetchedTutorial = response.data.Tutorial; // Adjust based on your backend response structure
        setTutorial(fetchedTutorial);

        // Initialize likes from fetched data
        if (fetchedTutorial.likes !== undefined) {
          setLikes(fetchedTutorial.likes);
        }

        // Initialize comments from fetched data
        if (Array.isArray(fetchedTutorial.comments)) {
          setComments(fetchedTutorial.comments);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tutorial details.');
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [id]);

  // Handle Like Button Click
  const handleLike = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/Tutorial/${id}/like`);
      
      // Ensure the backend returns the updated likes count
      if (response.data && typeof response.data.likes === 'number') {
        setLikes(response.data.likes); // Update likes based on backend response
      } else {
        // If the backend does not return likes, increment locally
        setLikes(prevLikes => prevLikes + 1);
      }
    } catch (err) {
      console.error('Failed to update likes:', err);
      alert('An error occurred while updating likes. Please try again.');
    }
  };

  // Handle Add Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a comment before submitting.');
      return;
    }

    const newCommentData = { user: "Anonymous", comment: newComment };

    try {
      const response = await axios.put(`http://localhost:5000/Tutorial/${id}/comment`, newCommentData);
      
      // Ensure the backend returns the updated comments array
      if (response.data && Array.isArray(response.data.comments)) {
        setComments(response.data.comments); // Update comments based on backend response
      } else {
        // If the backend does not return comments, append locally
        setComments(prevComments => [...prevComments, newCommentData]);
      }

      setNewComment(''); // Clear the input field
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('An error occurred while adding your comment. Please try again.');
    }
  };

  // Handle Delete Operation
  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this tutorial? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/Tutorial/${id}`);
      // Optionally, you can show a success message here
      navigate('/tutorialhome'); // Navigate back to Home page after deletion
    } catch (err) {
      console.error(err);
      setError('Failed to delete tutorial.');
    }
  };

  // Handle Generate Report using jsPDF
  const handleGenerateReport = () => {
    if (!tutorial) {
      alert('No tutorial data available to generate a report.');
      return;
    }
  
    const doc = new jsPDF();
  
    // Define page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;
  
    let currentY = 50; // Adjust as needed based on letterhead height
  
    // Helper function to add footer
    const addFooter = () => {
      doc.setFontSize(10);
      doc.setTextColor(100);
      const footerY = pageHeight - 15;
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5); // Horizontal line above footer
  
      const footerText = `Contact us: WhatsApp: +1234567890 | Email: contact@autobook.com
                              Instagram: @autobook_automotive | Facebook: /AutoBookAutomotive | `;
  
      const lines = doc.splitTextToSize(footerText, maxLineWidth);
      doc.text(lines, margin, footerY);
    };
  
    // Add Letterhead
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('AutoBook Automotive System', pageWidth / 2, 30, { align: 'center' });
  
    // Add a horizontal line below the letterhead
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
  
    // Add Tutorial Title
    doc.setFontSize(16);
    doc.setTextColor(30);
    doc.text(tutorial.title, margin, currentY);
    currentY += 10; // Move down after title
  
    // Add Tutorial Content
    doc.setFontSize(12);
    doc.setTextColor(50);
    const contentLines = doc.splitTextToSize(tutorial.content, maxLineWidth);
    doc.text(contentLines, margin, currentY);
    currentY += contentLines.length * 7 + 10; // Move down after content
  
    // Add Visual Content if exists
    if (tutorial.visualContent) {
      if (tutorial.visualContentType === 'image') {
        // Load the image
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // To avoid CORS issues
        img.src = `http://localhost:5000${tutorial.visualContent}`;
        img.onload = () => {
          const imgWidth = maxLineWidth;
          const imgHeight = (img.height * imgWidth) / img.width;
  
          // Check if image fits on the current page, else add a new page
          if (currentY + imgHeight > pageHeight - 30) {
            doc.addPage();
            addFooter();
            currentY = margin;
          }
  
          doc.addImage(img, 'JPEG', margin, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;
  
          // Add Footer
          addFooter();
  
          // Save the PDF
          doc.save(`${tutorial.title}_Report.pdf`);
        };
        img.onerror = () => {
          console.error('Failed to load image for PDF.');
          // Add Footer
          addFooter();
          doc.save(`${tutorial.title}_Report.pdf`);
        };
        return; // Exit to wait for image loading
      } else if (tutorial.visualContentType === 'video') {
        // Since embedding videos isn't straightforward, add a placeholder
        doc.setFillColor(230);
        doc.rect(margin, currentY, maxLineWidth, 60, 'F'); // Placeholder rectangle
        doc.setTextColor(80);
        doc.text('Video Content: Not Displayed in PDF', pageWidth / 2, currentY + 30, { align: 'center' });
        currentY += 70;
      }
    }
  
    // Add Footer to the first page if no new page was added
    if (currentY < pageHeight - 30) {
      addFooter();
    }
  
    // Save the PDF (if not already saved in image onload)
    if (tutorial.visualContentType !== 'image') {
      doc.save(`${tutorial.title}_Report.pdf`);
    }
  }

  // Render Loading State
  if (loading) {
    return (
      <div className='tutorial-detail-container'>
        <NavMy />
        <p className='loading'>Loading...</p>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className='tutorial-detail-container'>
        <NavMy />
        <p className='error'>{error}</p>
      </div>
    );
  }

  // Render If Tutorial Not Found
  if (!tutorial) {
    return (
      <div className='tutorial-detail-container'>
        <NavMy />
        <p className='error'>Tutorial not found.</p>
      </div>
    );
  }

  // Render Tutorial Details
  return (
    <div className="tutorial-detail-container">
      <div className='tutorial-details-nawmy'><NavMy /></div>
      
      <div className='tutorial-content'>
        <h2 className="tutorial-title">{tutorial.title}</h2>
        <p className="tutorial-text">{tutorial.content}</p>

        {/* Display Visual Content based on its type */}
        {tutorial.visualContent && tutorial.visualContentType === 'image' && (
          <div className="visual-content image-content">
            <h3>Image:</h3>
            <img 
              src={`http://localhost:5000${tutorial.visualContent}`} 
              alt={tutorial.title} 
              style={{ width: '600px', height: 'auto' }} 
            />
          </div>
        )}

        {tutorial.visualContent && tutorial.visualContentType === 'video' && (
          <div className="visual-content video-content">
            <h3>Video:</h3>
            <video width="600" height="400" controls>
              <source src={`http://localhost:5000${tutorial.visualContent}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Like Button */}
        <div className='like-section'>
          <button onClick={handleLike} className="like-button">
            Like
          </button>
          <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments</h3>
          {comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map((comment, index) => (
                <li key={index} className="comment-item">
                  <strong>{comment.user}:</strong> {comment.comment}
                  {comment.date && (
                    <em className='comment-date'>
                      ({new Date(comment.date).toLocaleString()})
                    </em>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}

          {/* Add Comment */}
          <div className='add-comment'>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              rows="3"
              className='comment-input'
            />
            <button 
              onClick={handleAddComment} 
              className='add-comment-button'>
              Add Comment
            </button>
          </div>
        </div>

              {/* Action Buttons */}
      <div className='button-group'>
        <button 
          onClick={() => navigate('/mainhome')}
          className="action-button back-button">
          Back to Home
        </button>
        <button 
          onClick={() => navigate(`/tutorial/${id}/update`)}
          className="action-button update-button">
          Update Tutorial
        </button> 
        <button 
          onClick={handleDelete} 
          className="action-button delete-button">
          Delete Tutorial
        </button> 
        <button 
          onClick={handleGenerateReport} 
          className="action-button report-button">
          Generate Report
        </button> 
      </div>
      
      </div>


    </div>
  );
}

export default TutorialDetail;
