import React, { useContext, useState } from "react";
import { MainContext } from "../config/MainContext";

import "./EditorDetailScreen.css";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import BtnDial from "../components/BtnDial";
import BtnSubmitEditorDetailScreen from "../components/BtnSubmitEditorDetailScreen";

const EditorDetailScreen: React.FC = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  setTabBarShow(false);

  return (
    <>
      <MainContainerMid customClassName="in-editor-detail-screen">
        <p className="screen-title">Title</p>
        <p className="screen-subtitle">Sub Title</p>
        <div className="dials">
          <div className="dial-right">
            <div className="dial-top-btns">
              <BtnDial.Plus onClick={() => {}} />
              <BtnDial.PlusMore onClick={() => {}} />
            </div>
            <p className="dial-text">10</p>
            <div className="dial-btm-btns">
              <BtnDial.Minus onClick={() => {}} />
              <BtnDial.MinusMore onClick={() => {}} />
            </div>
          </div>
          <div className="dial-text">:</div>
          <div className="dial-left">
            <div className="dial-top-btns">
              <BtnDial.PlusMore onClick={() => {}} />
              <BtnDial.Plus onClick={() => {}} />
            </div>
            <p className="dial-text">10</p>
            <div className="dial-btm-btns">
              <BtnDial.MinusMore onClick={() => {}} />
              <BtnDial.Minus onClick={() => {}} />
            </div>
          </div>
        </div>
        <div className="submit-btns">
          <BtnSubmitEditorDetailScreen.Apply onClick={() => {}} />
          <BtnSubmitEditorDetailScreen.Cancel onClick={() => {}} />
        </div>
      </MainContainerMid>
      <MainContainerBtm />
    </>
  );
};

export default EditorDetailScreen;
