import React, { useContext } from "react";
import { MainContext } from "../config/MainContext";

function TimerScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  return (
    <div>
      <p>TimerScreen</p>
      <p>{JSON.stringify(mainData.settings, null, 4)}</p>
    </div>
  );
}

export default TimerScreen;
