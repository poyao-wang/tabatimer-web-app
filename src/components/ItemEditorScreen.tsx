import React, { useContext } from "react";

import Icon from "./Icon";
import { MainContext } from "../config/MainContext";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import "./ItemEditorScreen.css";

interface ItemEditorScreenProps {
  screenData: any;
  itemKey: any;
  useIfAnyIsSettingState: any;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

interface DisplayProps {
  item: any;
}

const ItemEditorScreen: React.FC<ItemEditorScreenProps> = ({
  screenData,
  itemKey,
  useIfAnyIsSettingState,
  onClick,
}) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext) as any;

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
