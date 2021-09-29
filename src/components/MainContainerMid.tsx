import React from "react";

import "./MainContainerMid.css";

interface MainContainerMidProps {
  children?: React.ReactNode;
  customClassName?: string;
}

const MainContainerMid: React.FC<MainContainerMidProps> = ({
  children,
  customClassName,
}) => {
  return (
    <div className={"main-container-mid " + customClassName}>{children}</div>
  );
};

export default MainContainerMid;
