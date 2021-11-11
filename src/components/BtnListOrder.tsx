import React from "react";

import "./BtnListOrder.css";
import Icon from "./Icon";

const Up: React.FC = () => {
  return (
    <div className="btn-list-order">
      <Icon.KeyboardArrowUp />
    </div>
  );
};
const Down: React.FC = () => {
  return (
    <div className="btn-list-order">
      <Icon.KeyboardArrowDown />
    </div>
  );
};
const Top: React.FC = () => {
  return (
    <div className="btn-list-order">
      <Icon.ArrowTop />
    </div>
  );
};
const Bottom: React.FC = () => {
  return (
    <div className="btn-list-order">
      <Icon.ArrowBottom />
    </div>
  );
};

const BtnListOrder = {
  Up: Up,
  Down: Down,
  Top: Top,
  Bottom: Bottom,
};

export default BtnListOrder;
