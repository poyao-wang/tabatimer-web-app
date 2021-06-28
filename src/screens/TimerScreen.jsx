import React, { useContext, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import "./TimerScreen.css";
import { MainContext } from "../config/MainContext";

function TimerScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const [timeData, setTimeData] = useState(mainData.workoutSetup.workoutArray);
  const [flatListArray, setFlatListArray] = useState(
    mainData.workoutSetup.flatListArray
  );
  const [timerOn, setTimerOn] = useState(false);
  const [btnPressable, setBtnPressable] = useState(true);
  const [sectionId, setSectionId] = useState(0);
  const [centerContainerItemsValues, setCenterContainerItemsValues] =
    useState(null);

  const [{ sectionSeconds }, api] = useSpring(() => ({
    from: { sectionSeconds: 0 },
  }));

  function toggle() {
    setTimerOn(!timerOn);
  }

  function setPlusOrMinus(plus) {
    setTimerOn(false);

    const workoutNo = 1;
    let setNo = timeData[sectionId].setNo;
    if (setNo == 0) setNo = 1;
    setNo = plus ? setNo + 1 : setNo - 1;

    const totalWorkoutAmt = mainData.workouts.value;
    const totalSetAmt = mainData.sets.value;

    if (setNo <= 0) return;
    if (setNo > totalSetAmt) return;

    const newSectionId =
      1 + (setNo - 1) * 2 * totalWorkoutAmt + (workoutNo - 1) * 2;
    sectionSeconds.set(0);
    setSectionId(newSectionId);
  }

  function setWorkoutPlusOrMinus(plus) {
    setTimerOn(false);
    const totalWorkoutAmt = mainData.workouts.value;
    let workoutNo = timeData[sectionId].workoutNo;
    if (plus) {
      if (workoutNo + 1 <= totalWorkoutAmt) workoutNo = workoutNo + 1;
    } else {
      if (workoutNo > 1) {
        workoutNo = workoutNo - 1;
      } else {
        workoutNo = 1;
      }
    }

    let setNo = timeData[sectionId].setNo;
    if (setNo <= 0) setNo = 1;

    const newSectionId =
      1 + (setNo - 1) * 2 * totalWorkoutAmt + (workoutNo - 1) * 2;
    sectionSeconds.set(0);
    setSectionId(newSectionId);
  }

  function reset() {
    setTimerOn(false);
    sectionSeconds.set(0);
    setSectionId(0);
  }

  function timerAnimationLoop(startTime = 0) {
    api.start({
      from: { sectionSeconds: startTime },
      to: timeData[sectionId].duration,
      config: { duration: (timeData[sectionId].duration - startTime) * 1000 },
      onRest: ({ finished }) => {
        if (sectionId + 1 > timeData.length - 1) {
          setTimerOn(false);
        } else {
          if (finished) setSectionId(sectionId + 1);
        }
        console.log("finished", finished);
      },
    });
  }

  function createCenterContainerItemsValues() {
    const totalWorkoutAmt = mainData.workouts.value;
    const currentWoroutNo = timeData[sectionId].workoutNo;

    function createReturnObj(ltIndexNo, miIndexNo, rtIndexNo) {
      function retrunObj(indexNo) {
        return {
          index: indexNo,
          imageUri: indexNo !== null ? flatListArray[indexNo].image : "",
        };
      }

      return {
        lt: retrunObj(ltIndexNo),
        mi: retrunObj(miIndexNo),
        rt: retrunObj(rtIndexNo),
      };
    }

    if (currentWoroutNo <= 1) {
      return createReturnObj(null, 0, 1);
    }
    if (currentWoroutNo >= totalWorkoutAmt) {
      return createReturnObj(currentWoroutNo - 2, currentWoroutNo - 1, null);
    }

    return createReturnObj(
      currentWoroutNo - 2,
      currentWoroutNo - 1,
      currentWoroutNo
    );
  }

  useEffect(() => {
    if (mainData.workoutSetup.updated) {
      setFlatListArray(mainData.workoutSetup.flatListArray);
      setTimeData(mainData.workoutSetup.workoutArray);
      reset();
      mainData.workoutSetup.updated = false;
      setMainData(mainData);
    }
  }, []);

  useEffect(() => {
    if (timerOn) {
      timerAnimationLoop(sectionSeconds.get());
    } else {
      api.stop();
    }
  }, [timerOn]);

  useEffect(() => {
    if (timerOn) {
      timerAnimationLoop(0);
    }
    setCenterContainerItemsValues(createCenterContainerItemsValues());
  }, [sectionId]);

  return (
    <>
      <div className="center-container">
        <div className="center-container-top">
          <animated.div>{sectionSeconds.to((n) => n.toFixed(2))}</animated.div>
          <div>{timeData[sectionId].type}</div>
        </div>
        <div className="center-container-mid">
          <div className="center-container-mid-item">
            <div className="img-container">
              {centerContainerItemsValues?.lt?.index}
              <img
                src={centerContainerItemsValues?.lt?.imageUri}
                alt="lt-img"
              />
            </div>
            <button
              onClick={() => {
                setWorkoutPlusOrMinus(false);
              }}
            >
              {"<"}
            </button>
          </div>
          <div className="center-container-mid-item">
            <div className="img-container">
              {centerContainerItemsValues?.mi?.index}
              <img
                src={centerContainerItemsValues?.mi?.imageUri}
                alt="mi-img"
              />
            </div>
          </div>
          <div className="center-container-mid-item">
            <div className="img-container">
              {centerContainerItemsValues?.rt?.index}
              <img
                src={centerContainerItemsValues?.rt?.imageUri}
                alt="rt-img"
              />
            </div>
            <button
              onClick={() => {
                setWorkoutPlusOrMinus(true);
              }}
            >
              {">"}
            </button>
          </div>
        </div>
        <div className="center-container-low">
          <div className="center-container-low-item-container">
            {"Set: " +
              timeData[sectionId].setNo.toString() +
              " / " +
              mainData.sets.value}
          </div>
          <div className="center-container-low-item-container">
            <button onClick={toggle}>{timerOn ? "Pause" : "Play"}</button>
          </div>
          <div className="center-container-low-item-container">
            {"Workout: " +
              timeData[sectionId].workoutNo.toString() +
              " / " +
              mainData.workouts.value}
          </div>
        </div>
      </div>
      <div className="bottom-container">
        <div className="bottom-container-item">
          <button onClick={() => setPlusOrMinus(true)}>Set +</button>
        </div>
        <div className="bottom-container-item">
          <button onClick={() => setPlusOrMinus(false)}>Set -</button>
        </div>
        <div className="bottom-container-item">
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </>
  );
}

export default TimerScreen;
