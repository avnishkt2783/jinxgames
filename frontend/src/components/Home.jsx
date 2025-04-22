import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Home() {
  return (
    <>
      <Navbar />
      <h1>Welcome, User</h1>
      <Footer />
    </>
  );
}

export default Home;
