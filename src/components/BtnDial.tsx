import React, { ReactElement } from "react";
import "./BtnDial.css";
import Icon from "./Icon";

interface BtnDialRenderProps {
  icon: ReactElement;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

interface BtnDialProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const BtnDialRender: React.FC<BtnDialRenderProps> = ({ icon, onClick }) => {
  return (
    <button className="btn-dial" onClick={onClick}>
      {icon}
    </button>
  );
};

const Plus: React.FC<BtnDialProps> = ({ onClick }) => {
  return <BtnDialRender icon={<Icon.KeyboardArrowUp />} onClick={onClick} />;
};

const Minus: React.FC<BtnDialProps> = ({ onClick }) => {
  return <BtnDialRender icon={<Icon.KeyboardArrowDown />} onClick={onClick} />;
};

const PlusMore: React.FC<BtnDialProps> = ({ onClick }) => {
  return (
    <BtnDialRender icon={<Icon.KeyboardDoubleArrowUp />} onClick={onClick} />
  );
};
const MinusMore: React.FC<BtnDialProps> = ({ onClick }) => {
  return (
    <BtnDialRender icon={<Icon.KeyboardDoubleArrowDown />} onClick={onClick} />
  );
};

const BtnDial = {
  Plus: Plus,
  Minus: Minus,
  PlusMore: PlusMore,
  MinusMore: MinusMore,
};

export default BtnDial;
