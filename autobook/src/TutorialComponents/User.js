import React from 'react'
import { useNavigate } from "react-router-dom";
import '../Styles/TutorialStyles/User.css';

function User(props) {

    const {_id,title,content,visualContent, visualContentType,likes,comments} = props.user
    const navigate = useNavigate();

    const handleView = () => {
      navigate(`/tutorial`,{state:{_id}}); // Navigate to the detailed view
    };
  
    return (
      <div className="tutorial-card--inner"style={{ cursor: 'pointer' }}>
          <h2>Title: {title}</h2>
          <p>Content: {content.substring(0,100)}...</p>  {/* Show a snippet of the content */}
          <p className='tutorial-likes'>{likes} Likes</p> {/* Display number of likes */}


          {/* Display Visual Content based on its type */}
          {visualContent && visualContentType === 'image' && (
              <div>
                  <h3>Photo:</h3>
                  <img 
                      src={`http://localhost:5000${visualContent}`} 
                      alt={title} 
                      className='tutorial-image'
                      onClick={handleView}
                  />
              </div>
          )}

          {visualContent && visualContentType === 'video' && (
              <div>
                  <h3>Video:</h3>
                  <video  controls className="tutorial-video"
                   onClick={handleView}>
                      <source src={`http://localhost:5000${visualContent}`} type="video/mp4" />
                      Your browser does not support the video tag.
                  </video>
              </div>
          )}

         {/* Optionally display a snippet of comments
         {comments && comments.length > 0 && (
              <div>
                  <h4>Comments:</h4>
                  <ul>
                      {comments.slice(0, 2).map((comment, index) => (
                          <li key={index}>
                              <strong>{comment.user}:</strong> {comment.comment}
                          </li>
                      ))}
                      {comments.length > 2 && <li>and {comments.length - 2} more...</li>}
                  </ul>
              </div>
          )} */}

        <button className="view-button"  onClick={handleView}>View Details</button> {/* Add a View button */}
      </div>
  );
}

export default User
