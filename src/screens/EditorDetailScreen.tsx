import React, { useContext, useState } from "react";
import { MainContext } from "../config/MainContext";

import "./EditorDetailScreen.css";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import BtnDial from "../components/BtnDial";
import BtnSubmitEditorDetailScreen from "../components/BtnSubmitEditorDetailScreen";
import { RouteComponentProps, StaticContext } from "react-router";
import { ItemEditorScreenProps } from "../config/timerSetupDefaultData";

const EditorDetailScreen: React.FC<
  RouteComponentProps<
    {},
    StaticContext,
    {
      itemKey: string;
      item: ItemEditorScreenProps;
      title: string;
      subtitle: string;
    }
  >
> = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  const itemKey = props.location.state.itemKey;
  const item = props.location.state.item;
  const title = props.location.state.title;
  const subtitle = props.location.state.subtitle;

  setTabBarShow(false);

  return (
    <>
      <MainContainerMid customClassName="in-editor-detail-screen">
        <p className="screen-title">{title}</p>
        <p className="screen-subtitle">{subtitle}</p>
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
