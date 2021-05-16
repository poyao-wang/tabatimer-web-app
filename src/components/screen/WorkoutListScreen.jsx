import React, { useContext } from "react";
import { MainContext } from "../config/MainContext";

function WorkoutListScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  return (
    <div>
      <p>WorkoutListScreen</p>
      <p>{JSON.stringify(mainData.settings, null, 4)}</p>
    </div>
  );
}

export default WorkoutListScreen;
