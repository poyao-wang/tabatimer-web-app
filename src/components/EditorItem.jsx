import React, { useContext, useState } from "react";

import "./EditorItem.css";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import { MainContext } from "../config/MainContext";

function EditorItem({
  screenData = null,
  itemKey = null,
  useIfAnyIsSettingState,
}) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const finalValue = { minutes: 0, seconds: 0, numbers: 0 };

  const item = screenData[itemKey];
  const title = itemKey + " title";
  const subtitle = itemKey + "subtitle";

  const [isSetting, setIsSetting] = useState(false);
  const { ifAnyIsSetting, setIfAnyIsSetting } = useIfAnyIsSettingState;

  const okPressed = () => {
    item.value =
      item.type == "number"
        ? finalValue.numbers < 1
          ? 1
          : finalValue.numbers
        : finalValue.minutes * 60 + finalValue.seconds < 5
        ? 5
        : finalValue.minutes * 60 + finalValue.seconds;
    mainData.workoutSetup.workoutArray =
      timeDataSetupFunctions.makeWorkoutsArray(mainData);
    mainData.workoutSetup.updated = true;
    if (itemKey == "workouts") {
      mainData.workoutSetup.flatListArray =
        timeDataSetupFunctions.makeFlatListArray(mainData, item.value);
    }
    setMainData(mainData);
    // cache.store(mainData);
  };

  function DisplayOrSelector({ item = null }) {
    if (!item.type) return null;
    const isTime = item.type === "time";
    const isNumber = item.type === "number";

    function Selector({ minOrSecOrNum = null }) {
      if (!minOrSecOrNum) return null;
      const optionAmt =
        minOrSecOrNum === "minute" ? 60 : minOrSecOrNum === "second" ? 60 : 31;

      const onChange = (e) => {
        if (minOrSecOrNum === "minute")
          finalValue.minutes = Number(e.target.value);
        if (minOrSecOrNum === "second")
          finalValue.seconds = Number(e.target.value);
        if (minOrSecOrNum === "number")
          finalValue.numbers = Number(e.target.value);
      };

      return (
        <>
          <div>
            <select name={minOrSecOrNum} id={minOrSecOrNum} onChange={onChange}>
              {[...Array(optionAmt).keys()].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </>
      );
    }

    function SelectorCombined() {
      return (
        <>
          {isTime && (
            <>
              <Selector minOrSecOrNum="minute" />:
              <Selector minOrSecOrNum="second" />
            </>
          )}
          {isNumber && <Selector minOrSecOrNum="number" />}
        </>
      );
    }

    function Display({ item = null }) {
      if (!item) return null;
      return (
        <>
          {item.type == "number" && item.value}
          {item.type == "time" &&
            timeDataSetupFunctions.totalSecToMinAndSec(item.value).displayText}
        </>
      );
    }

    return (
      <>
        {isSetting && <SelectorCombined />}
        {!isSetting && <Display item={item} />}
      </>
    );
  }

  function SetupBtnOrOkCancelBtn() {
    return (
      <>
        {!isSetting && !ifAnyIsSetting && (
          <button
            onClick={() => {
              setIsSetting(true);
              setIfAnyIsSetting(true);
            }}
          >
            setup
          </button>
        )}
        {isSetting && (
          <>
            <button
              onClick={() => {
                okPressed();
                setIsSetting(false);
                setIfAnyIsSetting(false);
              }}
            >
              OK
            </button>
            <button
              onClick={() => {
                setIsSetting(false);
                setIfAnyIsSetting(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </>
    );
  }

  return (
    <div className="editor-screen-item">
      <div className="editor-screen-item-title-container">
        <div className="editor-screen-item-title">{title}</div>
        <div className="editor-screen-item-subtitle">{subtitle}</div>
      </div>
      <div className="editor-screen-item-text-container">
        <div className="editor-screen-item-value-text">
          <DisplayOrSelector item={item} />
        </div>
      </div>
      <div className="editor-screen-item-setting-container">
        <SetupBtnOrOkCancelBtn />
      </div>
    </div>
  );
}

export default EditorItem;
