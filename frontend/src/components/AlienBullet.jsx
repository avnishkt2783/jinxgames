import React from "react";

const AlienBullet = ({ x, y }) => {
  return (
    <rect x={x} y={y} width="4" height="10" fill="red" />
  );
};

export default AlienBullet;
