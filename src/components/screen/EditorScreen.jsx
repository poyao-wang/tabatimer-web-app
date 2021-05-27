import React, { useCallback, useContext, useState } from "react";
import { MainContext } from "../config/MainContext";

import "./EditorScreen.css";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import EditorItem from "./EditorItem";

function EditorScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const [screenData, setScreenData] = useState(mainData);
  const [ifAnyIsSetting, setIfAnyIsSetting] = useState(false);

  const renderEditorItem = (itemKey) => {
    return (
      <EditorItem
        screenData={screenData}
        itemKey={itemKey}
        useIfAnyIsSettingState={{ ifAnyIsSetting, setIfAnyIsSetting }}
      />
    );
  };

  return (
    <>
      <div className="center-container editor-screen-center-container">
        {renderEditorItem("prepareTime")}
        {renderEditorItem("workoutTime")}
        {renderEditorItem("restTime")}
        {renderEditorItem("restTimeSets")}
        {renderEditorItem("sets")}
        {renderEditorItem("workouts")}
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
