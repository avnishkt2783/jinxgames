import React from "react";

const Bullet = ({ x, y }) => {
  return (
    <rect x={x} y={y} width="4" height="10" fill="yellow" />
  );
};

export default Bullet;
