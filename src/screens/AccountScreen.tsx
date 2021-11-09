import React, { useContext, useEffect } from "react";

import "./AccountScreen.css";
import { MainContext } from "../config/MainContext";
import BtnAccountScreen from "../components/BtnAccountScreen";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import { RouteComponentProps, StaticContext } from "react-router";

const AccountScreen: React.FC<
  RouteComponentProps<
    {
      [x: string]: string | undefined;
    },
    StaticContext,
    unknown
  >
> = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  useEffect(() => {
    setTabBarShow(true);
  }, []);

  return (
    <>
      <MainContainerMid>
        <p className="account-screen__title">User Account</p>
        <p className="account-screen__subtitle">
          Sign in for upload / download settings
        </p>
        <div className="account-screen-btns">
          <BtnAccountScreen.SignIn />
          <BtnAccountScreen.Apple />
          <BtnAccountScreen.Google />
        </div>
      </MainContainerMid>
      <MainContainerBtm>
        <button>
          <Icon.CloudUpload />
        </button>
        <button>
          <Icon.CloudDownload />
        </button>
      </MainContainerBtm>
    </>
  );
};

export default AccountScreen;
