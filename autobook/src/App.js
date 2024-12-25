import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Common/Home";
import ComparisonHome from './VehicleComparisonComponents/ComparisonHome';
import AddNewVehicle from "./VehicleComparisonComponents/AddNewVehicle";
import Vehicles from "./VehicleComparisonComponents/Vehicles";
import UpdateVehicle from "./VehicleComparisonComponents/UpdateVehicle";
import VehicleSearch from "./VehicleComparisonComponents/VehicleSearch";
import VehicleCompareSearch from "./VehicleComparisonComponents/VehicleCompareSearch";
import Forum from "./CommunityForumComponents/Forum";
import AddPosts from "./CommunityForumComponents/AddPosts";
import UpdatePosts from "./CommunityForumComponents/UpdatePosts";
import Comments from "./CommunityForumComponents/Comments";
import "../src/Styles/VehicleComparisonStyles/VehicleComparisonStyles.css";
import "./Styles/CommunityForum/CommunityForum.css";

import TutorialHome from "./TutorialComponents/TutorialHome";
import AddTutorial from "./TutorialComponents/AddTutorial";
import TutorialDetail from "./TutorialComponents/TutorialDetails";
import UpdateTutorial from "./TutorialComponents/UpdateTutorial";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparisonhome" element={<ComparisonHome />}/>
        <Route path="/addnewvehicle" element={<AddNewVehicle />}  />
        <Route path="/vehicledetails" element={ <Vehicles /> } />
        <Route path="/vehicledetails/:id" element={ <UpdateVehicle /> } />
        <Route path="/vehiclesearch" element={<VehicleSearch />} />
        <Route path="/vehiclecomparesearch" element={<VehicleCompareSearch />} />
        
        {/*Forum Routes */}
        <Route path="/forum" element={<Forum />} />
        <Route path="/addpost" element={<AddPosts />} />
        <Route path="/forum/:id" element={<UpdatePosts />} />
        <Route path="/comments/:id" element={<Comments />} />
        
        {/*start tutorial routes */}
        <Route path="/tutorialhome" element={<TutorialHome />}/>
          <Route path="/addtutorial" element={<AddTutorial />}/>
          <Route path="/tutorial" element={<TutorialDetail />} />
          <Route path="/tutorial/:id" element={<TutorialDetail />} />
          <Route path="/tutorial/:id/update" element={<UpdateTutorial />} /> 
        {/*End tutorial routes */}
      </Routes>
    </BrowserRouter>
  );
}
