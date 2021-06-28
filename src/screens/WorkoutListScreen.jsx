import React, { useContext, useEffect, useState } from "react";

import "./WorkoutListScreen.css";
import { MainContext } from "../config/MainContext";
import WorkoutListItem from "../components/WorkoutListItem";

function WorkoutListScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const [data, setData] = useState(mainData.workoutSetup.flatListArray);

  const renderItem = (item, key) => {
    return <WorkoutListItem item={item} key={key} index={key} />;
  };

  useEffect(() => {
    setData(mainData.workoutSetup.flatListArray);
  }, []);

  return (
    <>
      <div className="center-container workout-list-screen-center-container">
        {data.map((item, key) => renderItem(item, key))}
      </div>
      <div className="bottom-container editor-screen-bottom-container">
        <div className="bottom-container-item">
          <button>delete all</button>
        </div>
      </div>
    </>
  );
}

export default WorkoutListScreen;
