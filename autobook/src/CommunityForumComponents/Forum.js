import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import NavBar from "../Common/NavBar";
import Post from "./Post";
import { useReactToPrint } from "react-to-print";
import "../Styles/CommunityForum/CommunityForum.css";

const URL = "http://localhost:5000/posts";

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
}

function Forum() {

    const [posts, setPosts] = useState([]);  
    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHandler().then((data) => {
            if (data && data.posts) {
                setPosts(data.posts);
            }
        }).catch(error => {
            console.error('Error fetching posts:', error);
        });
    }, []);

    const handleSearch = () => {
        setLoading(true);
        fetchHandler().then((data) => {
            if (data && data.posts) {
                const fetchedPosts = data.posts || [];
                const searchKeywords = searchQuery.toLowerCase().split(" ").filter(Boolean);

                const filteredPosts = fetchedPosts.filter((post) => {
                    return searchKeywords.every((keyword) =>
                        Object.values(post).some((field) =>
                            field && field.toString().toLowerCase().includes(keyword)
                        )
                    );
                });

                setPosts(filteredPosts);
                setNoResults(filteredPosts.length === 0);
            } else {
                setNoResults(true);  // No posts found
            }
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching posts:', error);
            setLoading(false);
        });
    };

    const onSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Search Query:", searchQuery);
        handleSearch();
    };

    // Report Generation
    const ComponentsRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => ComponentsRef.current,
        DocumentTitle: "Forum Report",
        onafterprint: () => alert("Users Report Successfully Downloaded!"),
    });

    const handlePostDelete = (id) => {
        setPosts(posts.filter(post => post._id !== id));
     };

    return (
        <div>
            <NavBar />

            <div className="container" id="container-head">
                <div className="container-search">
                    <Link to='/addpost'><button className="add-post-button">Add Post</button></Link>
                    <button className="search-button" id='search'>Post History</button>
                </div>

                <form onSubmit={onSearchSubmit}>    
                {/* className="search-form" */}
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        name="search"
                        placeholder="Search Posts"
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>

            <div className="container">
                <h1 className="heading">Community Forum</h1>
            </div>

            <div className="container" id="container-post">
                {loading && <p>Loading...</p>}
                {noResults && <p>No posts found matching your search.</p>}

                
                {posts && posts.length === 0 && !loading ? (
                    <p>No posts available.</p>
                ) : (
                    <div ref={ComponentsRef} className="posts-container">
                        {posts && posts.map((post) => (
                            <Post key={post._id} post={post} onDelete={handlePostDelete} />
                        ))}
                    </div>
                )}
            </div>

            <div className="container">
                <button onClick={handlePrint} className="report-button">Download Report</button>
            </div>
        </div>
    );
}

export default Forum;
