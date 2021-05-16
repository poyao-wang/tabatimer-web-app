import React, { useContext } from "react";
import { MainContext } from "../config/MainContext";

function AccountScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  return (
    <div>
      <p>AccountScreen</p>
      <p>{JSON.stringify(mainData.settings, null, 4)}</p>
    </div>
  );
}

export default AccountScreen;
