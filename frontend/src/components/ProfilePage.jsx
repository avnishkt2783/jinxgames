import React from "react";
import Navbar from "./Navbar";
import MatchHistory from "../components/MatchHistory";

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
        <h2>Profile Page</h2>
        <p>Comimng soon...</p>
        <h2>Match Histroy</h2>
        <MatchHistory />
      </div>
    </>
  );
};

export default ProfilePage;
