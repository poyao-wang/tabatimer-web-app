import React, { useContext } from "react";
import { MainContext } from "../config/MainContext";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";

function AccountScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  return (
    <>
      <div className="center-container">
        <p>AccountScreen</p>
        <p>{JSON.stringify(mainData.settings, null, 4)}</p>
      </div>
      <MainContainerBtm>
        <a href="#">
          <Icon.CloudUpload />
        </a>
        <a href="#">
          <Icon.CloudDownload />
        </a>
      </MainContainerBtm>
    </>
  );
}

export default AccountScreen;
