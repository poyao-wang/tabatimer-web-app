import React, { useCallback, useContext, useState } from "react";
import { MainContext } from "../config/MainContext";

import "./EditorScreen.css";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";

function EditorScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const [screenData, setScreenData] = useState(mainData);

  const renderItem = useCallback(
    (itemKey) => {
      const item = screenData[itemKey];
      const title = itemKey + " title";
      const subtitle = itemKey + "subtitle";

      return (
        <div
          className="center-container-item"
          onPress={() => {
            //navigate to EditorDetailScreen
          }}
        >
          <div className="titles-ontainer">
            <div className="title">{title}</div>
            <div className="subtitle">{subtitle}</div>
          </div>
          <div className="value-text-container">
            <div className="value-text">
              {item.type == "number" && item.value}
              {!(item.type == "number") &&
                timeDataSetupFunctions.totalSecToMinAndSec(item.value)
                  .displayText}
            </div>
          </div>
        </div>
      );
    },
    [screenData]
  );

  return (
    <>
      <div className="center-container editor-screen-center-container">
        {renderItem("prepareTime")}
        {renderItem("workoutTime")}
        {renderItem("restTime")}
        {renderItem("restTimeSets")}
        {renderItem("sets")}
        {renderItem("workouts")}
      </div>
      <div className="bottom-container editor-screen-bottom-container">
        <div className="bottom-container-item">
          <button>
            {screenData.settings.playSound ? "volume-high" : "volume-off"}
          </button>
        </div>
        <div className="bottom-container-item">
          <button>{"reset"}</button>
        </div>
        <div className="bottom-container-item">
          <button>{"language"}</button>
        </div>
      </div>
    </>
  );
}

export default EditorScreen;
