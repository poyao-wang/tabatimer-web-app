import React, { useContext } from "react";
import { MainContext } from "../config/MainContext";

import "./TimerScreen.css";

function TimerScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  return (
    <>
      <div className="center-container">
        <div className="center-container-top"></div>
        <div className="center-container-mid"></div>
        <div className="center-container-low"></div>
      </div>
      <div className="bottom-container">Btn</div>
    </>
  );
}

export default TimerScreen;
