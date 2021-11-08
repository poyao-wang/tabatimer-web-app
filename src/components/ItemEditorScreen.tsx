import React from "react";

import "./ItemEditorScreen.css";
import { WorkoutSetupProps } from "../config/timerSetupDefaultData";
import Icon from "./Icon";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";

interface ItemEditorScreenProps {
  screenData: WorkoutSetupProps;
  itemKey: keyof WorkoutSetupProps;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

interface DisplayProps {
  item: any;
}

const ItemEditorScreen: React.FC<ItemEditorScreenProps> = ({
  screenData,
  itemKey,
  onClick,
}) => {
  const item = screenData[itemKey];
  const title = itemKey + " title";
  const subtitle = itemKey + "subtitle";

  const Display: React.FC<DisplayProps> = ({ item = null }) => {
    if (!item) return null;
    return (
      <>
        {item.type === "number" && item.value}
        {item.type === "time" &&
          timeDataSetupFunctions.totalSecToMinAndSec(item.value).displayText}
      </>
    );
  };

  return (
    <>
      <div className="item-editor-screen" onClick={onClick}>
        <div className="item-editor-screen__div-l">
          <p className="item-editor-screen__title">{title}</p>
          <p className="item-editor-screen__subtitle">{subtitle}</p>
        </div>
        <div className="item-editor-screen__div-r">
          <p className="item-editor-screen__value">
            <Display item={item} />
          </p>
          <Icon.KeyboardDoubleArrowRight />
        </div>
      </div>
    </>
  );
};

export default ItemEditorScreen;
