import React, { useEffect } from "react";
import NavBar from "./NavBar";
// import { Link } from "react-router-dom";
import "../Styles/Home.css";

export default function Home() {
  useEffect(() => {
    function movement(event) {
      document.querySelectorAll(".img--object").forEach((element) => {
        var movingValue = element.getAttribute("data-value");
        var x = (event.clientX * movingValue) / 250;
        var y = (event.clientY * movingValue) / 250;

        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    }
    document.addEventListener("mousemove", movement);

    return () => {
      document.removeEventListener("mousemove", movement);
    };
  }, []);

  return (
    <div>
      <NavBar />
      <div className="home--container">
        <h1 className="main--title--1">Discover, Learn</h1>
        <h1 className="main--title--2">and optimize with AutoBook!</h1>
        <button className="home--note--button">Sign Up</button>
        <img
          src={require("../Images/icon-1.gif")}
          data-value="10"
          className="img--object"
          alt=""
        />
        <img
          src={require("../Images/icon-6.gif")}
          data-value="12"
          className="img--object"
          alt=""
        />
        <img
          src={require("../Images/icon-3.gif")}
          data-value="8"
          className="img--object"
          alt=""
        />
        <img
          src={require("../Images/icon-2.gif")}
          data-value="7"
          className="img--object"
          alt=""
        />
        <img
          src={require("../Images/icon-5.gif")}
          data-value="10"
          className="img--object"
          alt=""
        />
        <p className="description">
          At AutoBook, we empower car owners with the tools and knowledge they
          need.
          <br /> Shop, learn, and collaborate for a seamless automotive
          experience.
        </p>
      </div>
    </div>
  );
}
