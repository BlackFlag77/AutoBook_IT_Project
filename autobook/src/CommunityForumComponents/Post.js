import React from "react";
import { Link } from "react-router-dom";

import axios from "axios";
// import { useNavigate } from 'react-router-dom';
import "../Styles/CommunityForum/CommunityForum.css";

function Post(props) {
  const { _id, title, description, mediaUrl, mediaType, likes, dislikes } =
    props.post;

  const deleteHandler = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/posts/${_id}`);
        props.onDelete(_id);
        window.alert("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting the request:", error);
      }
    }
  };

  // Old handleDelete function
  // const deleteHandler = async () => {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this post?"
  //   );
  //   if (confirmed) {
  //     try {
  //       await axios
  //         .delete(`http://localhost:5000/posts/${_id}`)
  //         .then((res) => res.data);
  //       window.alert("Post deleted successfully!");
  //       window.location.reload();
  //     } catch (error) {
  //       console.error("Error deleting the request:", error);
  //     }
  //   }
  // };

  // Oldest handleDelete function
  // const history = useNavigate();

  // Delete confirmation
  // const confirmDelete = () => {
  //   if (window.confirm("Are you sure you want to delete this post?")) {
  //       deleteHandler();
  //   } else {
  //       console.log('Post deletion canceled.');
  //   }
  // };

  // const deleteHandler = async()=>{
  //   await axios.delete(`http://localhost:5000/posts/${_id}`)
  //   .then(res=>res.data)
  //   .then(() => history("/"))
  //   .then(() =>history("/forum"));
  // }

  return (
    <div className="post-card">
      <h2 className="post-title">{title}</h2>
      <p className="post-description">{description.length > 200 ? `${description.substring(0, 200)}...` : description}</p>

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

      <div className="reactions-and-comments">
        <div className="reactions">
          <button className="search-button">👍 Like ({likes})</button>
          <button className="search-button">👎 Dislike ({dislikes})</button>
          <Link to={`/comments/${_id}`}>
            <button className="search-button">💬 Comments</button>
          </Link>
          {/* <button className="search-button">💬 Comment</button> */}
        </div>

        <div className="actions">
          <Link to={`/forum/${_id}`}>
            <button className="update-button">Update</button>
          </Link>
          <button onClick={deleteHandler} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
