import React, { ReactElement } from "react";
import "./BtnSubmitEditorDetailScreen.css";
import Icon from "./Icon";

interface BBtnSubmitEditorDetailScreenProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Apply: React.FC<BBtnSubmitEditorDetailScreenProps> = ({ onClick }) => {
  return (
    <button className="btn-submit btn-apply" onClick={onClick}>
      <Icon.CheckCircle />
    </button>
  );
};

const Cancel: React.FC<BBtnSubmitEditorDetailScreenProps> = ({ onClick }) => {
  return (
    <button className="btn-submit btn-cancel" onClick={onClick}>
      <Icon.Cancel />
    </button>
  );
};

const BtnSubmitEditorDetailScreen = {
  Apply: Apply,
  Cancel: Cancel,
};

export default BtnSubmitEditorDetailScreen;
