import React from "react";

const Brick = ({ x, y, health }) => {
  const colors = ["white", "silver", "lightgray", "darkgray", "gray"];
  const fill = colors[5 - health] || "gray";

  return <rect x={x} y={y} width="15" height="15" fill={fill} stroke="black" />;
};

export default Brick;
