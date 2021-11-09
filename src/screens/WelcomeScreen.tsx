import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, StaticContext } from "react-router";

import "./WelcomeScreen.css";
import { MainContext } from "../config/MainContext";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import { ReactComponent as AppIcon } from "../assets/icons/tabatimer.svg";

type Language = "en" | "ja" | "zh";

const WelcomeScreen: React.FC<
  RouteComponentProps<
    {
      [x: string]: string | undefined;
    },
    StaticContext,
    unknown
  >
> = (props) => {
  const {
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  useEffect(() => {
    setTabBarShow(false);
  }, []);

  const [langSelected, setLangSelected] = useState<Language>("en");

  return (
    <>
      <MainContainerMid customClassName="in-welcome-screen">
        <p className="screen-title">Taba Timer</p>
        <div className="app-icon">
          <AppIcon />
        </div>
        <button
          className="btn-play"
          onClick={() => {
            props.history.push("/timer");
          }}
        >
          <Icon.PlayCircle />
        </button>
      </MainContainerMid>
      <MainContainerBtm customClassName="in-welcome-screen">
        <button
          className={langSelected === "ja" ? "lang-selected" : ""}
          onClick={() => setLangSelected("ja")}
        >
          <Icon.LanguageJa />
          <p className="icon-text">日本語</p>
        </button>
        <button
          className={langSelected === "en" ? "lang-selected" : ""}
          onClick={() => setLangSelected("en")}
        >
          <Icon.LanguageEn />
          <p className="icon-text">English</p>
        </button>
        <button
          className={langSelected === "zh" ? "lang-selected" : ""}
          onClick={() => setLangSelected("zh")}
        >
          <Icon.LanguageZh />
          <p className="icon-text">中文</p>
        </button>
      </MainContainerBtm>
    </>
  );
};

export default WelcomeScreen;
