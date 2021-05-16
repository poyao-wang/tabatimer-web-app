import React, { useContext } from "react";
import { MainContext } from "../config/MainContext";

function EditorScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  return (
    <div>
      <p>EditorScreen</p>
      <p>{JSON.stringify(mainData.settings, null, 4)}</p>
    </div>
  );
}

export default EditorScreen;
