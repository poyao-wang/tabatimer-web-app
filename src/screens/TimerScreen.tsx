import React, { useContext, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import "./TimerScreen.css";
import { MainContext } from "../config/MainContext";
import MainContainerBtm from "../components/MainContainerBtm";
import Icon from "../components/Icon";
import MainContainerMid from "../components/MainContainerMid";
import FractionTimerScreen from "../components/FractionTimerScreen";

const TimerScreen: React.FC = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext) as any;

  const [timeData, setTimeData] = useState(mainData.workoutSetup.workoutArray);
  const [flatListArray, setFlatListArray] = useState(
    mainData.workoutSetup.flatListArray
  );
  const [timerOn, setTimerOn] = useState(false);
  const [btnPressable, setBtnPressable] = useState(true);
  const [sectionId, setSectionId] = useState(0);
  const [centerContainerItemsValues, setCenterContainerItemsValues] = useState({
    lt: { index: null, imageUri: null },
    mi: { index: null, imageUri: null },
    rt: { index: null, imageUri: null },
  });

  const [{ sectionSeconds }, api] = useSpring(() => ({
    from: { sectionSeconds: 0 },
  }));

  function toggle() {
    setTimerOn(!timerOn);
  }

  function setPlusOrMinus(plus: boolean) {
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

  function setWorkoutPlusOrMinus(plus: boolean) {
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

    function createReturnObj(
      ltIndexNo: number | null,
      miIndexNo: number | null,
      rtIndexNo: number | null
    ) {
      function retrunObj(indexNo: number | null) {
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
    setCenterContainerItemsValues(createCenterContainerItemsValues() as any);
  }, [sectionId]);

  return (
    <>
      <MainContainerMid customClassName="in-timer-screen">
        <div className="container-top">
          <animated.div>{sectionSeconds.to((n) => n.toFixed(2))}</animated.div>
          <div>{timeData[sectionId].type}</div>
        </div>
        <div className="container-mid">
          <div className="container-mid__container">
            <div className="img-container img-container--left">
              <a
                href="#"
                onClick={() => {
                  setWorkoutPlusOrMinus(false);
                }}
              >
                <div className="icon-bg" />
                <Icon.SkipPreviousCircle />
              </a>
              <img
                src={
                  centerContainerItemsValues?.lt?.imageUri
                    ? centerContainerItemsValues?.lt?.imageUri
                    : ""
                }
                alt="lt-img"
              />
            </div>
          </div>
          <div className="container-mid__container">
            <div className="img-container img-container--mid">
              <img
                src={
                  centerContainerItemsValues?.mi?.imageUri
                    ? centerContainerItemsValues?.mi?.imageUri
                    : ""
                }
                alt="mi-img"
              />
            </div>
          </div>
          <div className="container-mid__container">
            <div className="img-container img-container--right">
              <a
                href="#"
                onClick={() => {
                  setWorkoutPlusOrMinus(true);
                }}
              >
                <div className="icon-bg" />
                <Icon.SkipNextCircle />
              </a>
              <img
                src={
                  centerContainerItemsValues?.rt?.imageUri
                    ? centerContainerItemsValues?.rt?.imageUri
                    : ""
                }
                alt="rt-img"
              />
            </div>
          </div>
        </div>
        <div className="container-btm">
          <div className="container-btm__container">
            <FractionTimerScreen
              title="Set"
              textTop={timeData[sectionId].setNo.toString()}
              textBtm={mainData.sets.value}
            />
          </div>
          <div className="container-btm__container">
            <a onClick={toggle}>
              {timerOn ? <Icon.Cancel /> : <Icon.PlayCircle />}
            </a>
          </div>
          <div className="container-btm__container">
            <FractionTimerScreen
              title="Workout"
              textTop={timeData[sectionId].workoutNo.toString()}
              textBtm={mainData.workouts.value}
            />
          </div>
        </div>
      </MainContainerMid>
      <MainContainerBtm>
        <a href="#" onClick={() => setPlusOrMinus(true)}>
          <Icon.AddCircle />
        </a>
        <a href="#" onClick={() => setPlusOrMinus(false)}>
          <Icon.RemoveCircle />
        </a>
        <a href="#" onClick={reset}>
          <Icon.RestartAlt />
        </a>
      </MainContainerBtm>
    </>
  );
};

export default TimerScreen;
