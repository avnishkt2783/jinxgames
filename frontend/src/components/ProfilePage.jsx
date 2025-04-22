import React from "react";
import Navbar from "./Navbar";
import MatchHistory from "../components/MatchHistory";
import ProfileContent from "../components/ProfileContent";
import "./Universal.css";
import Footer from "./Footer";

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          margin: "10px auto",
          color: "white",
        }}
      >
        <h2
          style={{
            marginTop: "0px",
            marginBottom: "20px",
          }}
        >
          Profile Page
        </h2>
        <ProfileContent />
        <h2
          style={{
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          Match Histroy
        </h2>
        <MatchHistory />
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
