import _ from "lodash";
import { MainContext } from "../config/MainContext";
import { RouteComponentProps, StaticContext } from "react-router";
import { useTranslation } from "react-i18next";
import React, { useContext, useState } from "react";

import "./EditorScreen.css";
import { WorkoutSetupProps } from "../config/timerSetupDefaultData";
import cache from "../config/cache";
import Icon from "../components/Icon";
import ItemEditorScreen from "../components/ItemEditorScreen";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";

const EditorScreen: React.FC<RouteComponentProps<{}, StaticContext, unknown>> =
  (props) => {
    const {
      timer: { timerSetup: mainData, setTimerSetup: setMainData },
      tabBar: { setTabBarShow },
    } = useContext(MainContext);

    const { t } = useTranslation();

    const { storeToCache } = cache;

    const [screenData, setScreenData] = useState(mainData);

    const renderItem = (itemKey: keyof WorkoutSetupProps) => {
      const item = screenData[itemKey];
      const title = itemKey;
      const subtitle = itemKey;

      return (
        <ItemEditorScreen
          screenData={screenData}
          itemKey={itemKey}
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

    setTabBarShow(true);

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
          <button
            onClick={() => {
              const confirmed = window.confirm(t("editorScreen.resetAlertMsg"));
              if (confirmed) {
                timeDataSetupFunctions.resetMainData(mainData);
                setMainData(mainData);
                const dataClone = _.cloneDeep(mainData);
                setScreenData(dataClone);
                storeToCache(mainData);
              }
            }}
          >
            <Icon.RestartAlt />
          </button>
          <button
            onClick={() => {
              props.history.push("/");
            }}
          >
            <Icon.Translate />
          </button>
        </MainContainerBtm>
      </>
    );
  };

export default EditorScreen;
