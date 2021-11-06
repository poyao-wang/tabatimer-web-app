import React, { useContext, useState } from "react";
import { MainContext } from "../config/MainContext";

import "./EditorScreen.css";
import ItemEditorScreen from "../components/ItemEditorScreen";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import { RouteComponentProps, StaticContext } from "react-router";
import { WorkoutSetupProps } from "../config/timerSetupDefaultData";

const EditorScreen: React.FC<RouteComponentProps<{}, StaticContext, unknown>> =
  (props) => {
    const {
      timer: { timerSetup: mainData, setTimerSetup: setMainData },
    } = useContext(MainContext);

    const [screenData, setScreenData] = useState(mainData);
    const [ifAnyIsSetting, setIfAnyIsSetting] = useState(false);

    const renderItem = (itemKey: keyof WorkoutSetupProps) => {
      const item = screenData[itemKey];
      const title = itemKey;
      const subtitle = itemKey;

      return (
        <ItemEditorScreen
          screenData={screenData}
          itemKey={itemKey}
          useIfAnyIsSettingState={{ ifAnyIsSetting, setIfAnyIsSetting }}
          onClick={() => {
            props.history.push("/editor-detail", {
              itemKey,
              item,
              title,
              subtitle,
            });
          }}
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
          <button>
            {screenData.settings.playSound ? (
              <Icon.VolumeUp />
            ) : (
              <Icon.Cancel />
            )}
          </button>
          <button>
            <Icon.RestartAlt />
          </button>
          <button>
            <Icon.Translate />
          </button>
        </MainContainerBtm>
      </>
    );
  };

export default EditorScreen;
