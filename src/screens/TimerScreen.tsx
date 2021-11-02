import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import "./TimerScreen.css";
import { MainContext } from "../config/MainContext";
import MainContainerBtm from "../components/MainContainerBtm";
import Icon from "../components/Icon";
import MainContainerMid from "../components/MainContainerMid";
import FractionTimerScreen from "../components/FractionTimerScreen";
import useTimerControl, {
  ResetTimerCBs,
  ScrollingChangeSectionCBs,
  SetPlusOrMinusCBs,
  StateChangeSectionIdCBs,
  StateChangeTimerOnCBs,
} from "../hook/useTimerControl";

interface ImgContainerProps {
  type: "left" | "mid" | "right";
  imgSrc: string;
  icon: ReactElement;
  btnOnClick: () => void;
}

const TimerScreen: React.FC = (props) => {
  const {
    timer: useTimerSetupState,
    tabBar: { setTabBarShow },
    // language: { uiText }, TODO: Language support
  } = useContext(MainContext);

  const [timeData, setTimeData] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );

  // TODO: Play sound support

  const [workoutArray, setWorkoutArray] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );
  const [flatListArray, setFlatListArray] = useState(
    useTimerSetupState.timerSetup.workoutSetup.flatListArray
  );

  const {
    timerOn: { current: timerOn, set: setTimerOn },
    sectionId: { current: sectionId, set: setSectionId },
    hidableBtnsShow: { current: hidableBtnsShow, set: setHidableBtnsShow },
    directControlFns: {
      toggleOnOff: toggle,
      setPlusOrMinus: setPlusOrMinus,
      resetTimer: reset,
      scrollingChangeSection: scrollingChangeSection,
    },
    stateChange: {
      hidableBtnsShow: StateChangeHidableBtnsShow,
      workoutArray: StateChangeWorkoutArray,
      sectionId: StateChangeSectionId,
      timerOn: StateChangeTimerOn,
    },
  } = useTimerControl(workoutArray, useTimerSetupState);

  const [btnPressable, setBtnPressable] = useState(true);

  const [centerContainerItemsValues, setCenterContainerItemsValues] = useState({
    lt: { index: null, imageUri: null },
    mi: { index: null, imageUri: null },
    rt: { index: null, imageUri: null },
  });

  const [{ sectionSeconds }, api] = useSpring(() => ({
    from: { sectionSeconds: 0 },
  }));

  function setWorkoutPlusOrMinus(plus: boolean) {
    setTimerOn(false);
    const totalWorkoutAmt = useTimerSetupState.timerSetup.workouts.value;
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

  function timerAnimationLoop(startTime = 0) {
    api.start({
      from: { sectionSeconds: startTime },
      to: { sectionSeconds: timeData[sectionId].duration },
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
    const totalWorkoutAmt = useTimerSetupState.timerSetup.workouts.value;
    const currentWoroutNo = timeData[sectionId].workoutNo;

    function createReturnObj(
      ltIndexNo: number | null,
      miIndexNo: number | null,
      rtIndexNo: number | null
    ) {
      function retrunObj(indexNo: number | null) {
        return {
          index: indexNo,
          imageUri:
            indexNo !== null ? flatListArray[indexNo].imgSrcForReact : "",
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

  // Directly control functions callbacks

  const setPlusOrMinusCallbacks: SetPlusOrMinusCBs = {
    setTotalSecAndUpdateInput: (newSectionId) => {
      console.log("setTotalSecAndUpdateInput called"); // non exist in web ver
    },
    resetSectionSeconds: () => {
      sectionSeconds.set(0);
    },
    picturesScrollToHead: () => {
      console.log("picturesScrollToHead called");
    },
    updateSetInput: (newSectionId) => {
      console.log("updateSetInput called");
    },
    resetBgAnime: () => {
      console.log("resetBgAnime called");
    },
  };

  const resetTimerCallbacks: ResetTimerCBs = {
    resetTotalSecAndInput: () => {
      console.log("resetTotalSecAndInput called");
    },
    resetSectionSeconds: () => {
      sectionSeconds.set(0);
    },
    picturesScrollToHead: () => {
      setSectionId(0);
    },
    resetSetInput: () => {
      console.log("resetSetInput called");
    },
    resetSectionSecondsRemainsInput: () => {
      console.log("resetSectionSecondsRemainsInput called");
    },
    resetBgAnime: () => {
      console.log("resetBgAnime called");
    },
  };

  const stateChangeTimerOnCallbacks: StateChangeTimerOnCBs = {
    startAnimeLoop: () => {
      timerAnimationLoop(sectionSeconds.get());
    },
    stppAnimeLoop: () => {
      api.stop();
    },
  };

  const stateChangeSectionIdCallbacks: StateChangeSectionIdCBs = {
    changeBgColor: (sectionType) => {
      // TODO:
    },
    picturesScrollToIndex: (index) => {
      setCenterContainerItemsValues(createCenterContainerItemsValues() as any);
    },
    resetSectionSeconds: () => {
      // sectionSeconds.setValue(0);
    },
    resetBackgroundAnimationValue: () => {
      // TODO:
    },
    updateSetInput: (sectionId) => {
      // non in web ver
    },
    startNewSectionAnimeLoop: () => {
      timerAnimationLoop(0);
    },
  };

  StateChangeTimerOn(stateChangeTimerOnCallbacks);
  StateChangeSectionId(stateChangeSectionIdCallbacks);

  // Other useEffects

  useEffect(() => {
    if (useTimerSetupState.timerSetup.workoutSetup.updated) {
      setFlatListArray(
        useTimerSetupState.timerSetup.workoutSetup.flatListArray
      );
      setTimeData(useTimerSetupState.timerSetup.workoutSetup.workoutArray);
      reset(resetTimerCallbacks);
      useTimerSetupState.timerSetup.workoutSetup.updated = false;
      useTimerSetupState.setTimerSetup(useTimerSetupState.timerSetup);
    }
  }, []);

  useEffect(() => {
    setCenterContainerItemsValues(createCenterContainerItemsValues() as any);
  }, [sectionId]);

  const ImgContainerSide: React.FC<ImgContainerProps> = (props) => {
    return props.imgSrc ? (
      <div className={"img-container img-container--" + props.type}>
        <a href="#" onClick={props.btnOnClick}>
          <div className="icon-bg" />
          {props.icon}
        </a>
        <img src={props.imgSrc} alt={"img" + props.type} />
      </div>
    ) : (
      <div className={"img-container img-container--hidden"} />
    );
  };

  return (
    <>
      <animated.div
        style={{
          zIndex: -1,
          position: "absolute",
          width: "100vw",
          height: sectionSeconds.to(
            (n) => `${(n * 100) / workoutArray[sectionId].duration}vh`
          ),
          backgroundColor: "white",
        }}
      />
      <animated.div
        style={{
          zIndex: -2,
          position: "absolute",
          width: "100vw",
          height: "100vh",
          backgroundColor:
            workoutArray[sectionId].type === "workout"
              ? "red"
              : workoutArray[sectionId].type === "rest"
              ? "green"
              : "gray",
        }}
      />
      <MainContainerMid customClassName="in-timer-screen">
        <div className="container-top">
          <animated.div>
            {sectionSeconds.to((n) =>
              Math.ceil(workoutArray[sectionId].duration - n)
            )}
          </animated.div>
          <div>{timeData[sectionId].type}</div>
        </div>
        <div className="container-mid">
          <div className="container-mid__container">
            <ImgContainerSide
              icon={<Icon.SkipPreviousCircle />}
              type="left"
              imgSrc={
                centerContainerItemsValues?.lt?.imageUri
                  ? centerContainerItemsValues?.lt?.imageUri
                  : ""
              }
              btnOnClick={() => {
                setWorkoutPlusOrMinus(false);
              }}
            />
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
            <ImgContainerSide
              icon={<Icon.SkipNextCircle />}
              type="right"
              imgSrc={
                centerContainerItemsValues?.rt?.imageUri
                  ? centerContainerItemsValues?.rt?.imageUri
                  : ""
              }
              btnOnClick={() => {
                setWorkoutPlusOrMinus(true);
              }}
            />
          </div>
        </div>
        <div className="container-btm">
          <div className="container-btm__container">
            <FractionTimerScreen
              title="Set"
              textTop={timeData[sectionId].setNo.toString()}
              textBtm={useTimerSetupState.timerSetup.sets.value.toString()}
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
              textBtm={useTimerSetupState.timerSetup.workouts.value.toString()}
            />
          </div>
        </div>
      </MainContainerMid>
      <MainContainerBtm>
        <a
          href="#"
          onClick={() => setPlusOrMinus(true, setPlusOrMinusCallbacks)}
        >
          <Icon.AddCircle />
        </a>
        <a
          href="#"
          onClick={() => setPlusOrMinus(false, setPlusOrMinusCallbacks)}
        >
          <Icon.RemoveCircle />
        </a>
        <a href="#" onClick={() => reset(resetTimerCallbacks)}>
          <Icon.RestartAlt />
        </a>
      </MainContainerBtm>
    </>
  );
};

export default TimerScreen;
