import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import NavBar from "../Common/NavBar";
import "../Styles/CommunityForum/CommunityForum.css";

function UpdatePosts() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/posts/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.post));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/posts/${id}`, {
        title: String(inputs.title),
        description: String(inputs.description),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/forum"));
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div>
      <NavBar />
      <div className="add-post-container">
        <div className="update-wrapper">
          <div className="form-header">
            <h1 className="post-title">Update Post</h1>
            <button className="close-btn" onClick={handleClose}>
              ✖
            </button>
          </div>
          <form onSubmit={handleSubmit} className="update-post-form">
            <label for="title">Title: </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={inputs.title}
              required
            />
            <br />

            <label for="description">Description: </label>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              value={inputs.description}
              required
            />
            <br />

            <button type="submit" className="update-btn">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePosts;
