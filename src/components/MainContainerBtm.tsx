import React from "react";

import "./MainContainerBtm.css";

interface MainContainerBtmProps {
  show?: boolean;
  customClassName?: string;
}

const MainContainerBtm: React.FC<MainContainerBtmProps> = ({
  show,
  children,
  customClassName,
}) => {
  if (show === undefined) show = true;
  const className =
    "main-container-btm " +
    (show ? "" : "main-container-btm--hide ") +
    customClassName;

  return <div className={className}>{children}</div>;
};

export default MainContainerBtm;
