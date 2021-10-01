import React, { useContext, useState } from "react";
import { MainContext } from "../config/MainContext";

import "./EditorScreen.css";
import ItemEditorScreen from "../components/ItemEditorScreen";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";

const EditorScreen: React.FC = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext) as any;

  const [screenData, setScreenData] = useState(mainData);
  const [ifAnyIsSetting, setIfAnyIsSetting] = useState(false);

  const renderItem = (itemKey: any) => {
    return (
      <ItemEditorScreen
        screenData={screenData}
        itemKey={itemKey}
        useIfAnyIsSettingState={{ ifAnyIsSetting, setIfAnyIsSetting }}
      />
    );
  };

  return (
    <>
      <MainContainerMid customClassName="in-editor-screen">
        {renderItem("prepareTime")}
        {renderItem("workoutTime")}
        {renderItem("restTime")}
        {renderItem("restTimeSets")}
        {renderItem("sets")}
        {renderItem("workouts")}
      </MainContainerMid>
      <MainContainerBtm>
        <a href="#">
          {screenData.settings.playSound ? <Icon.VolumeUp /> : <Icon.Cancel />}
        </a>
        <a href="#">
          <Icon.RestartAlt />
        </a>
        <a href="#">
          <Icon.Translate />
        </a>
      </MainContainerBtm>
    </>
  );
};

export default EditorScreen;
