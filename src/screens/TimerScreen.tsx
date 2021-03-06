import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  animated,
  Controller,
  OnRest,
  SpringValue,
  useSpring,
} from "react-spring";
import { useTranslation } from "react-i18next";

import "./TimerScreen.css";
import { MainContext } from "../config/MainContext";
import FractionTimerScreen from "../components/FractionTimerScreen";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import useAudio from "../hook/useAudio";
import useTimerControl, {
  ResetTimerCBs,
  SetPlusOrMinusCBs,
  StateChangeHidableBtnsShowCBs,
  StateChangeSectionIdCBs,
  StateChangeTimerOnCBs,
} from "../hook/useTimerControl";

import _ from "lodash";
import { RouteComponentProps, StaticContext } from "react-router";

type ImgContainerStatus = "hide" | "img" | "no-img";

interface ImgContainerProps {
  status: ImgContainerStatus;
  btnShow: boolean;
  type: "left" | "mid" | "right";
  imgSrc: string | null;
  icon: ReactElement;
  btnOnClick: () => void;
  textWhenNoImg: string | number;
}

interface CenterContainerItemValuesProps {
  index: number | null;
  imageUri: string | null;
  status: ImgContainerStatus;
}

interface CenterContainerItemsProps {
  lt: CenterContainerItemValuesProps;
  mi: CenterContainerItemValuesProps;
  rt: CenterContainerItemValuesProps;
}

const TimerScreen: React.FC<
  RouteComponentProps<
    {
      [x: string]: string | undefined;
    },
    StaticContext,
    unknown
  >
> = (props) => {
  const {
    timer: useTimerSetupState,
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  const { t } = useTranslation();

  const [timeData, setTimeData] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );

  const {
    soundsLoaded,
    loadSounds,
    playSound,
    playCountDownSound,
    pauseAllSounds,
    checkIfAnySoundIsPlaying,
  } = useAudio();

  const [mutedForReact, setMutedForReact] = useState<boolean>(true);

  const [workoutArray] = useState(
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
      setPlusOrMinus,
      resetTimer: reset,
      // scrollingChangeSection: scrollingChangeSection, // non exist in web ver
    },
    stateChange: {
      hidableBtnsShow: StateChangeHidableBtnsShow,
      // workoutArray: StateChangeWorkoutArray, // non exist in web ver
      sectionId: StateChangeSectionId,
      timerOn: StateChangeTimerOn,
    },
  } = useTimerControl(workoutArray, useTimerSetupState);

  const [btnPressable, setBtnPressable] = useState(true);

  const [centerContainerItemsValues, setCenterContainerItemsValues] =
    useState<CenterContainerItemsProps>({
      lt: { index: null, imageUri: null, status: "hide" },
      mi: { index: null, imageUri: null, status: "hide" },
      rt: { index: null, imageUri: null, status: "hide" },
    });

  const [{ sectionSeconds }, sectionSecondsApi] = useSpring(() => ({
    from: { sectionSeconds: 0 },
  }));

  const [{ secondsOpacity, textOpacity }, opacityApi] = useSpring(() => ({
    from: { secondsOpacity: 1, textOpacity: 0 },
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

  function checkCurrentSectionTypeAndPlayStartingSound() {
    const soundType =
      workoutArray[sectionId].type === "prepare"
        ? "rest"
        : workoutArray[sectionId].type === "workout"
        ? "workOutStart"
        : workoutArray[sectionId].type === "rest"
        ? "rest"
        : null;

    playSound(soundType, soundsLoaded && !mutedForReact);
  }

  const sectionTypeTextTrans = (textFromTimeData: string) => {
    if (textFromTimeData === "prepare")
      return t("timerScreen.sectionTypePrepare");
    if (textFromTimeData === "workout")
      return t("timerScreen.sectionTypeWorkout");
    if (textFromTimeData === "rest") return t("timerScreen.sectionTypeRest");
    return null;
  };

  function timerAnimationLoop(startTime = 0) {
    let sectionSecondsRemainsCeil: number;
    let newSectionSecondsRemainsCeil: number;

    const checkSectionTypeAndDecideCountDownSoundType = ():
      | "countDownStart"
      | "countDownRest"
      | "countDown" => {
      if (
        workoutArray[sectionId].type === "prepare" ||
        workoutArray[sectionId].type === "rest"
      ) {
        return "countDownStart";
      } else if (workoutArray[sectionId].type === "workout") {
        return "countDownRest";
      } else return "countDown";
    };

    const countDownSoundType = checkSectionTypeAndDecideCountDownSoundType();

    const checkAndUploadRemainsCeilThenPlaySound: OnRest<
      SpringValue<{ sectionSeconds: number }>,
      Controller<{
        sectionSeconds: number;
      }>
    > = ({ value: { sectionSeconds: value } }) => {
      // Calc newSectionSecondsRemainsCeil
      newSectionSecondsRemainsCeil = Math.ceil(
        workoutArray[sectionId].duration - value
      );
      if (newSectionSecondsRemainsCeil !== sectionSecondsRemainsCeil) {
        // If timer is running
        if (timerOn) {
          // If seconds remains <= 3
          if (
            sectionSecondsRemainsCeil === 5 &&
            newSectionSecondsRemainsCeil === 4
          ) {
            playCountDownSound(
              countDownSoundType,
              soundsLoaded && !mutedForReact,
              0
            );
          } else if (
            sectionSecondsRemainsCeil === 4 &&
            newSectionSecondsRemainsCeil === 3
          ) {
            playCountDownSound(
              countDownSoundType,
              soundsLoaded && !mutedForReact,
              1
            );
          } else if (
            sectionSecondsRemainsCeil === 3 &&
            newSectionSecondsRemainsCeil === 2
          ) {
            playCountDownSound(
              countDownSoundType,
              soundsLoaded && !mutedForReact,
              2
            );
          } else if (
            sectionSecondsRemainsCeil === 2 &&
            newSectionSecondsRemainsCeil === 1
          ) {
            playCountDownSound(
              countDownSoundType,
              soundsLoaded && !mutedForReact,
              3
            );
          } else if (
            sectionSecondsRemainsCeil === 1 &&
            newSectionSecondsRemainsCeil === 0
          ) {
            playCountDownSound(
              countDownSoundType,
              soundsLoaded && !mutedForReact,
              4
            );
          }
        }

        // Set new ceiled value
        sectionSecondsRemainsCeil = newSectionSecondsRemainsCeil;
        // console.log(sectionSecondsRemainsCeil);
      }
    };

    if (!checkIfAnySoundIsPlaying()) {
      checkCurrentSectionTypeAndPlayStartingSound();
    }

    sectionSecondsApi.start({
      from: { sectionSeconds: startTime },
      to: { sectionSeconds: timeData[sectionId].duration },
      config: { duration: (timeData[sectionId].duration - startTime) * 1000 },
      onChange: _.throttle(checkAndUploadRemainsCeilThenPlaySound, 50),
      onRest: ({ finished }) => {
        if (finished) {
          if (sectionId + 1 > timeData.length - 1) {
            setTimerOn(false);
            setHidableBtnsShow(true);

            const playFinishedSound = () =>
              playSound("finished", soundsLoaded && !mutedForReact);

            setTimeout(playFinishedSound, 500);
            // console.log("finished", finished);
            sectionSeconds.set(0);
          } else {
            setSectionId(sectionId + 1);
          }
        }
      },
    });
    opacityApi.set({ secondsOpacity: 0, textOpacity: 1 });
    opacityApi.start({
      from: { secondsOpacity: 0, textOpacity: 1 },
      to: { secondsOpacity: 1, textOpacity: 0 },
      delay: 500,
      reset: true,
    });
  }

  function createCenterContainerItemsValues(): CenterContainerItemsProps {
    const totalWorkoutAmt = useTimerSetupState.timerSetup.workouts.value;
    const currentWoroutNo = timeData[sectionId].workoutNo;

    function createReturnObj(
      ltIndexNo: number | null,
      miIndexNo: number | null,
      rtIndexNo: number | null
    ): CenterContainerItemsProps {
      function retrunObj(
        indexNo: number | null
      ): CenterContainerItemValuesProps {
        let status: ImgContainerStatus;

        if (indexNo === null) {
          status = "hide";
        } else {
          if (flatListArray[indexNo].image) {
            status = "img";
          } else {
            status = "no-img";
          }
        }

        return {
          index: indexNo,
          imageUri: indexNo !== null ? flatListArray[indexNo].image : "",
          status,
        };
      }

      return {
        lt: retrunObj(ltIndexNo),
        mi: retrunObj(miIndexNo),
        rt: retrunObj(rtIndexNo),
      };
    }

    if (totalWorkoutAmt <= 1) {
      return createReturnObj(null, 0, null);
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

  function loopTimerAnimeWithStartSound(startSectionTime = 0) {
    timerAnimationLoop(startSectionTime);
  }

  // Directly control functions callbacks

  const setPlusOrMinusCallbacks: SetPlusOrMinusCBs = {
    setTotalSecAndUpdateInput: (newSectionId) => {
      // non exist in web ver
    },
    resetSectionSeconds: () => {
      sectionSeconds.set(0);
    },
    picturesScrollToHead: () => {
      // non exist in web ver
    },
    updateSetInput: (newSectionId) => {
      // non exist in web ver
    },
    resetBgAnime: () => {
      // non exist in web ver
    },
  };

  const resetTimerCallbacks: ResetTimerCBs = {
    resetTotalSecAndInput: () => {
      // non exist in web ver
    },
    resetSectionSeconds: () => {
      sectionSeconds.set(0);
    },
    picturesScrollToHead: () => {
      setSectionId(0);
    },
    resetSetInput: () => {
      // non exist in web ver
    },
    resetSectionSecondsRemainsInput: () => {
      // non exist in web ver
    },
    resetBgAnime: () => {
      // non exist in web ver
    },
  };

  const stateChangeTimerOnCallbacks: StateChangeTimerOnCBs = {
    playStartingSound: () => {
      checkCurrentSectionTypeAndPlayStartingSound();
    },
    startAnimeLoop: () => {
      loopTimerAnimeWithStartSound(sectionSeconds.get());
    },
    stopAnimeLoop: () => {
      sectionSecondsApi.stop();
    },
    stopAllSounds: () => {
      pauseAllSounds();
    },
  };

  const stateChangeSectionIdCallbacks: StateChangeSectionIdCBs = {
    changeBgColor: (sectionType) => {
      // no need for react ver
    },
    picturesScrollToIndex: (index) => {
      setCenterContainerItemsValues(createCenterContainerItemsValues());
    },
    resetSectionSeconds: () => {
      // sectionSeconds.setValue(0);
    },
    resetBackgroundAnimationValue: () => {
      // non in web ver
    },
    updateSetInput: (sectionId) => {
      // non in web ver
    },
    startNewSectionAnimeLoop: () => {
      loopTimerAnimeWithStartSound(0);
    },
  };

  const stateChangeHidableBtnsShowCallbacks: StateChangeHidableBtnsShowCBs = {
    setNavBarShow: (show) => {
      setTabBarShow(show);
    },
    setBottomContainerShow: (show) => {
      // No need in web ver
    },
  };

  StateChangeTimerOn(stateChangeTimerOnCallbacks);
  StateChangeSectionId(stateChangeSectionIdCallbacks);
  StateChangeHidableBtnsShow(stateChangeHidableBtnsShowCallbacks);

  // Other useEffects

  useEffect(() => {
    setTabBarShow(true);
    if (useTimerSetupState.timerSetup.workoutSetup.updated) {
      setFlatListArray(
        useTimerSetupState.timerSetup.workoutSetup.flatListArray
      );
      setTimeData(useTimerSetupState.timerSetup.workoutSetup.workoutArray);
      reset(resetTimerCallbacks);
      useTimerSetupState.timerSetup.workoutSetup.updated = false;
      useTimerSetupState.setTimerSetup(useTimerSetupState.timerSetup);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCenterContainerItemsValues(createCenterContainerItemsValues() as any);
  }, [sectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const ImgContainerSide: React.FC<ImgContainerProps> = (props) => {
    const { btnShow, btnOnClick, icon, status } = props;

    const btnClassName = "btn-skip" + (btnShow ? "" : " btn-skip--hide");

    const Btn: React.FC = () => (
      <button className={btnClassName} onClick={btnOnClick}>
        <div className="icon-bg" />
        {icon}
      </button>
    );

    const ReturnWithImg: React.FC = () => (
      <div className={"img-container img-container--" + props.type}>
        <Btn />
        <img
          src={props.imgSrc ? props.imgSrc : undefined}
          alt={"img" + props.type}
        />
      </div>
    );

    const ReturnNoImg: React.FC = () => (
      <div className={"img-container img-container--" + props.type}>
        <Btn />
        <p className="text-when-no-img">{props.textWhenNoImg}</p>
      </div>
    );

    const ReturnHidden: React.FC = () => (
      <div className={"img-container img-container--hidden"} />
    );

    const ReturnItem: React.FC = () => {
      switch (status) {
        case "hide":
          return <ReturnHidden />;
        case "img":
          return <ReturnWithImg />;
        case "no-img":
          return <ReturnNoImg />;
      }
    };

    return <ReturnItem />;
  };

  useEffect(() => {
    if (soundsLoaded) {
      setBtnPressable(true);
    }
  }, [soundsLoaded]);

  const heightCal = (n: number): string =>
    `${(n * 100) / workoutArray[sectionId].duration}vh`;

  const secRemainCal = (n: number): number =>
    Math.ceil(workoutArray[sectionId].duration - n);

  return (
    <>
      <animated.div
        id="timer-animation-bg-block"
        style={{
          height: sectionSeconds.to(_.throttle(heightCal, 10) as any),
          backgroundColor: "white",
          ...props,
        }}
      />
      <div
        id="timer-bg"
        className={"section-type--" + workoutArray[sectionId].type}
      />
      <MainContainerMid customClassName="in-timer-screen">
        <div className="container-top">
          <animated.div
            id="timer-animetion-seconds-remain"
            className={"section-type--" + workoutArray[sectionId].type}
            style={{ opacity: secondsOpacity }}
          >
            {sectionSeconds.to(_.throttle(secRemainCal, 100))}
          </animated.div>
          <animated.div
            id="timer-animetion-section-type"
            className={"section-type--" + workoutArray[sectionId].type}
            style={{ position: "absolute", opacity: textOpacity }}
          >
            {sectionTypeTextTrans(timeData[sectionId].type)}
          </animated.div>
        </div>
        <div className="container-mid">
          <div className="container-mid__container">
            <ImgContainerSide
              icon={<Icon.SkipPreviousCircle />}
              type="left"
              imgSrc={centerContainerItemsValues?.lt?.imageUri}
              status={centerContainerItemsValues?.lt?.status}
              btnOnClick={() => {
                setWorkoutPlusOrMinus(false);
              }}
              btnShow={hidableBtnsShow}
              textWhenNoImg={
                typeof centerContainerItemsValues?.lt?.index === "number"
                  ? centerContainerItemsValues?.lt?.index + 1
                  : ""
              }
            />
          </div>
          <div className="container-mid__container">
            <div className="img-container img-container--mid">
              {centerContainerItemsValues?.mi?.imageUri ? (
                <img
                  src={
                    centerContainerItemsValues?.mi?.imageUri
                      ? centerContainerItemsValues?.mi?.imageUri
                      : ""
                  }
                  alt="mi-img"
                />
              ) : typeof centerContainerItemsValues?.mi?.index === "number" ? (
                <p className="text-when-no-img">
                  {centerContainerItemsValues?.mi?.index + 1}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="container-mid__container">
            <ImgContainerSide
              icon={<Icon.SkipNextCircle />}
              type="right"
              imgSrc={centerContainerItemsValues?.rt?.imageUri}
              status={centerContainerItemsValues?.rt?.status}
              btnOnClick={() => {
                setWorkoutPlusOrMinus(true);
              }}
              btnShow={hidableBtnsShow}
              textWhenNoImg={
                typeof centerContainerItemsValues?.rt?.index === "number"
                  ? centerContainerItemsValues?.rt?.index + 1
                  : ""
              }
            />
          </div>
        </div>
        <div className="container-btm">
          <div className="container-btm__container">
            <FractionTimerScreen
              title={t("timerScreen.fractionDisplayTitleLeft")}
              textTop={timeData[sectionId].setNo.toString()}
              textBtm={useTimerSetupState.timerSetup.sets.value.toString()}
            />
          </div>
          <div className="container-btm__container">
            <button onClick={toggle} disabled={!btnPressable}>
              {timerOn ? <Icon.PauseCircle /> : <Icon.PlayCircle />}
            </button>
          </div>
          <div className="container-btm__container">
            <FractionTimerScreen
              title={t("timerScreen.fractionDisplayTitleRight")}
              textTop={timeData[sectionId].workoutNo.toString()}
              textBtm={useTimerSetupState.timerSetup.workouts.value.toString()}
            />
          </div>
        </div>
      </MainContainerMid>
      <MainContainerBtm show={hidableBtnsShow}>
        <button onClick={() => setPlusOrMinus(true, setPlusOrMinusCallbacks)}>
          <Icon.AddCircle />
        </button>
        <button onClick={() => setPlusOrMinus(false, setPlusOrMinusCallbacks)}>
          <Icon.RemoveCircle />
        </button>
        <button
          onClick={() => {
            const confirmed = window.confirm(t("timerScreen.resetAlertMsg"));
            if (confirmed) {
              reset(resetTimerCallbacks);
            }
          }}
        >
          <Icon.RestartAlt />
        </button>
        <button
          onClick={() => {
            if (mutedForReact && !soundsLoaded) {
              setBtnPressable(false);
              loadSounds();
            }
            setMutedForReact(!mutedForReact);
          }}
        >
          {!mutedForReact ? <Icon.VolumeUp /> : <Icon.VolumeOff />}
        </button>
      </MainContainerBtm>
    </>
  );
};

export default TimerScreen;
