import React, { useContext, useEffect, useState } from "react";

import "./WorkoutListScreen.css";
import { MainContext } from "../config/MainContext";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import ItemWorkoutList from "../components/ItemWorkoutList";
import BtnListOrder from "../components/BtnListOrder";

const WorkoutListScreen: React.FC = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext) as any;

  const [data, setData] = useState(mainData.workoutSetup.flatListArray);

  const renderItem = (item: any, key: number) => {
    return <ItemWorkoutList item={item} key={key} index={key} />;
  };

  useEffect(() => {
    setData(mainData.workoutSetup.flatListArray);
  }, []);

  return (
    <>
      <MainContainerMid customClassName="in-workout-list-screen">
        <div className="workout-list-items">
          {data.map((item: any, key: number) => renderItem(item, key))}
        </div>
      </MainContainerMid>
      <MainContainerBtm>
        <Icon.DeleteSweep />
      </MainContainerBtm>
    </>
  );
};

export default WorkoutListScreen;
