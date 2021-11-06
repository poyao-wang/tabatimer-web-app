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

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [numbers, setNumbers] = useState(0);

  const itemKey = props.location.state.itemKey;
  const item = props.location.state.item;
  const title = props.location.state.title;
  const subtitle = props.location.state.subtitle;

  setTabBarShow(false);

  const minutesOrSecondsCheckAndSet = (
    dataType: "minutes" | "seconds",
    incrementType: "plus" | "plus-more" | "minus" | "minus-more"
  ) => {
    const dataToCheck = dataType === "minutes" ? minutes : seconds;
    const setFn = dataType === "minutes" ? setMinutes : setSeconds;
    const limitValue =
      incrementType === "plus" || incrementType === "plus-more" ? 59 : 0;
    const incrementValue =
      incrementType === "plus"
        ? 1
        : incrementType === "plus-more"
        ? 5
        : incrementType === "minus"
        ? -1
        : -5;
    const elseIfCheckCondition =
      incrementType === "plus" || incrementType === "plus-more"
        ? dataToCheck + incrementValue > limitValue
        : dataToCheck + incrementValue < limitValue;

    if (dataToCheck === limitValue) {
    } else if (elseIfCheckCondition) {
      setFn(limitValue);
    } else {
      setFn(dataToCheck + incrementValue);
    }
  };

  const numbersCheckAndSet = (
    incrementType: "plus" | "plus-more" | "minus" | "minus-more"
  ) => {
    const dataToCheck = numbers;
    const setFn = setNumbers;
    const limitValue =
      incrementType === "plus" || incrementType === "plus-more" ? 30 : 0;
    const incrementValue =
      incrementType === "plus"
        ? 1
        : incrementType === "plus-more"
        ? 5
        : incrementType === "minus"
        ? -1
        : -5;
    const elseIfCheckCondition =
      incrementType === "plus" || incrementType === "plus-more"
        ? dataToCheck + incrementValue > limitValue
        : dataToCheck + incrementValue < limitValue;

    if (dataToCheck === limitValue) {
    } else if (elseIfCheckCondition) {
      setFn(limitValue);
    } else {
      setFn(dataToCheck + incrementValue);
    }
  };

  const TimePicker: React.FC = () => {
    return (
      <>
        <div className="dial-right">
          <div className="dial-top-btns">
            <BtnDial.Plus
              onClick={() => {
                minutesOrSecondsCheckAndSet("minutes", "plus");
              }}
            />
            <BtnDial.PlusMore
              onClick={() => {
                minutesOrSecondsCheckAndSet("minutes", "plus-more");
              }}
            />
          </div>
          <p className="dial-text">{minutes}</p>
          <div className="dial-btm-btns">
            <BtnDial.Minus
              onClick={() => {
                minutesOrSecondsCheckAndSet("minutes", "minus");
              }}
            />
            <BtnDial.MinusMore
              onClick={() => {
                minutesOrSecondsCheckAndSet("minutes", "minus-more");
              }}
            />
          </div>
        </div>
        <div className="dial-text">:</div>
        <div className="dial-left">
          <div className="dial-top-btns">
            <BtnDial.PlusMore
              onClick={() => {
                minutesOrSecondsCheckAndSet("seconds", "plus-more");
              }}
            />
            <BtnDial.Plus
              onClick={() => {
                minutesOrSecondsCheckAndSet("seconds", "plus");
              }}
            />
          </div>
          <p className="dial-text">{seconds}</p>
          <div className="dial-btm-btns">
            <BtnDial.MinusMore
              onClick={() => {
                minutesOrSecondsCheckAndSet("seconds", "minus-more");
              }}
            />
            <BtnDial.Minus
              onClick={() => {
                minutesOrSecondsCheckAndSet("seconds", "minus");
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const NumberPicker: React.FC = () => {
    return (
      <>
        <div className="dial-left">
          <div className="dial-top-btns">
            <BtnDial.PlusMore
              onClick={() => {
                numbersCheckAndSet("plus-more");
              }}
            />
            <BtnDial.Plus
              onClick={() => {
                numbersCheckAndSet("plus");
              }}
            />
          </div>
          <p className="dial-text">{numbers}</p>
          <div className="dial-btm-btns">
            <BtnDial.MinusMore
              onClick={() => {
                numbersCheckAndSet("minus-more");
              }}
            />
            <BtnDial.Minus
              onClick={() => {
                numbersCheckAndSet("minus");
              }}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <MainContainerMid customClassName="in-editor-detail-screen">
        <p className="screen-title">{title}</p>
        <p className="screen-subtitle">{subtitle}</p>
        <div className="dials">
          {item.type === "time" ? <TimePicker /> : <NumberPicker />}
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
