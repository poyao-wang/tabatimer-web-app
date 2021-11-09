import React, { useContext, useState } from "react";
import _ from "lodash";
import { RouteComponentProps, StaticContext } from "react-router";

import "./WorkoutListScreen.css";
import { ItemFlatListArrayProps } from "../config/timerSetupDefaultData";
import { MainContext } from "../config/MainContext";
import Icon from "../components/Icon";
import ItemWorkoutList from "../components/ItemWorkoutList";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import cache from "../config/cache";

export type MoveOrderActionType = "up" | "upToTop" | "down" | "downToBtm";

const WorkoutListScreen: React.FC<
  RouteComponentProps<{}, StaticContext, unknown>
> = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  const { storeToCache } = cache;

  const [data, setData] = useState<ItemFlatListArrayProps[]>(
    mainData.workoutSetup.flatListArray
  );

  const moveOrderAndSetData = function (
    index: number,
    type: MoveOrderActionType
  ) {
    const fromIndex = index;
    let toIndex: number;

    switch (type) {
      case "upToTop":
        toIndex = 0;
        break;
      case "downToBtm":
        toIndex = data.length;
        break;
      case "up":
        toIndex = fromIndex - 1 < 0 ? 0 : fromIndex - 1;
        break;
      case "down":
        toIndex = fromIndex + 1 > data.length ? data.length : fromIndex + 1;
        break;
    }

    data.splice(toIndex, 0, data.splice(fromIndex, 1)[0]);

    for (let i = 0; i < data.length; i++) {
      data[i].id = i;
    }

    const dataClone = _.cloneDeep(data);

    mainData.workoutSetup.flatListArray = dataClone;
    mainData.workoutSetup.updated = true;
    setMainData(mainData);
    setData(dataClone);
    storeToCache(mainData);
  };

  const renderItem = (item: ItemFlatListArrayProps, index: number) => {
    return (
      <ItemWorkoutList
        onMoveOrderAndSetData={moveOrderAndSetData}
        item={item}
        key={index}
        index={index}
        onAddImgClicked={() => {
          props.history.push("/workout-list-detail", {
            item,
            index,
          });
        }}
      />
    );
  };

  setTabBarShow(true);

  return (
    <>
      <MainContainerMid customClassName="in-workout-list-screen">
        <div className="workout-list-items">
          {data.map((item, index) => renderItem(item, index))}
        </div>
      </MainContainerMid>
      <MainContainerBtm>
        <button
          onClick={() => {
            timeDataSetupFunctions.resetFlatListArray(
              mainData,
              mainData.workouts.value
            );
            mainData.workoutSetup.updated = true;
            setMainData(mainData);
            const dataClone = _.cloneDeep(mainData.workoutSetup.flatListArray);
            setData(dataClone);
            storeToCache(mainData);
          }}
        >
          <Icon.DeleteSweep />
        </button>
      </MainContainerBtm>
    </>
  );
};

export default WorkoutListScreen;
