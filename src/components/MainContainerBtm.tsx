import React, { ReactInstance, ReactNode } from "react";
import "./MainContainerBtm.css";

interface MainContainerBtmProps {
  show?: boolean;
}

const MainContainerBtm: React.FC<MainContainerBtmProps> = ({
  show,
  children,
}) => {
  const className =
    "main-container-btm" + (show ? "" : " main-container-btm--hide");

  return <div className={className}>{children}</div>;
};

export default MainContainerBtm;
