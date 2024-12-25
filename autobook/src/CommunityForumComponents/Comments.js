import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../Common/NavBar";
import "../Styles/CommunityForum/CommunityForum.css";

const Comments = () => {
  const { id } = useParams(); // Extract post ID from the URL params
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to track if data is being fetched

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await axios.get(`http://localhost:5000/posts/${id}`);
        const commentsRes = await axios.get(`http://localhost:5000/comments/${id}`);

        setPost(postRes.data.post);
        setComments(commentsRes.data.comments);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching both post and comments
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  const { title, description, mediaUrl, mediaType, likes, dislikes } = post;

  return (
    <div className="comments-page">
      <NavBar />

      <div className="post-card">
        {/* {console.log(post)}
        {console.log(comments)} */}
        <h2 className="post-title">{title || "Untitled Post"}</h2>
        <p className="post-description">
          {description || "No description available."}
        </p>

        {mediaUrl && mediaType === "image" && (
          <img
            src={`http://localhost:5000${mediaUrl}`}
            alt={title}
            className="post-image"
          />
        )}

        {mediaUrl && mediaType === "video" && (
          <video width="100%" height="500" controls>
            <source src={`http://localhost:5000${mediaUrl}`} type="video/mp4" />
            Your browser does not support the videos.
          </video>
        )}

        <div className="reactions">
          <button className="search-button">👍 Like ({likes || 0})</button>
          <button className="search-button">
            👎 Dislike ({dislikes || 0})
          </button>
          <Link to={`/comments/${id}`}>
            <button className="search-button">💬 Comments</button>
          </Link>
        </div>
      </div>

      {/* Render comments */}
      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <p>
                <strong>{comment.content}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>No comments so far. Be the first one to comment!</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
