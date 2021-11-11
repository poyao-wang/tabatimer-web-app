import { useEffect, useState } from "react";
import { MainContext_Timer } from "../config/MainContext";
import { ItemWorkoutArrayProps } from "../config/timerSetupDefaultData";

export interface SetPlusOrMinusCBs {
  setTotalSecAndUpdateInput: (newSectionId: number) => void;
  resetSectionSeconds: () => void;
  picturesScrollToHead: () => void;
  updateSetInput: (newSectionId: number) => void;
  resetBgAnime: () => void;
}

export interface ResetTimerCBs {
  resetTotalSecAndInput: () => void;
  resetSectionSeconds: () => void;
  picturesScrollToHead: () => void;
  resetSetInput: () => void;
  resetSectionSecondsRemainsInput: () => void;
  resetBgAnime: () => void;
}

export interface ScrollingChangeSectionCBs {
  readWorkoutNo: () => number;
  setTotalSecAndUpdateInput: (newSectionId: number) => void;
  resetSectionSeconds: () => void;
  updateSectionSecondsRemainsInput: () => void;
  updateSetInput: (newSectionId: number) => void;
  resetBgAnime: () => void;
}

export interface StateChangeHidableBtnsShowCBs {
  setNavBarShow: (show: boolean) => void;
  setBottomContainerShow: (show: boolean) => void;
}

export interface StateChangeWorkoutArrayDataCBs {
  resetSectionSeconds: () => void;
  resetSectionSecondsRemainsInput: () => void;
}

export interface StateChangeSectionIdCBs {
  changeBgColor: (sectionId: "prepare" | "workout" | "rest") => void;
  picturesScrollToIndex: (index: number) => void;
  resetSectionSeconds: () => void;
  resetBackgroundAnimationValue: () => void;
  updateSetInput: (newSectionId: number) => void;
  startNewSectionAnimeLoop: () => void;
}

export interface StateChangeTimerOnCBs {
  playStartingSound: () => void;
  startAnimeLoop: () => void;
  stopAnimeLoop: () => void;
  stopAllSounds: () => void;
}

const useTimerControl = (
  workoutArray: ItemWorkoutArrayProps[],
  useTimerSetupState: MainContext_Timer
) => {
  const [timerOn, setTimerOn] = useState(false);
  const [sectionId, setSectionId] = useState(0);
  const [hidableBtnsShow, setHidableBtnsShow] = useState(true);

  function toggle() {
    setTimerOn(!timerOn);
    setHidableBtnsShow(timerOn);
  }

  function setPlusOrMinus(plus: boolean, callbacks: SetPlusOrMinusCBs) {
    // Determine SetNo
    function determineSetNo() {
      let setNo = workoutArray[sectionId].setNo;
      if (setNo === 0) setNo = 1;
      setNo = plus ? setNo + 1 : setNo - 1;

      return setNo;
    }
    const setNo = determineSetNo();

    // Read totalSetAmt
    const totalSetAmt = useTimerSetupState.timerSetup.sets.value;

    // If SetNo is out of range, exit the function
    if (setNo <= 0 || setNo > totalSetAmt) return;

    // Calc newSectionId
    const totalWorkoutAmt = useTimerSetupState.timerSetup.workouts.value;
    const newSectionId = 1 + (setNo - 1) * 2 * totalWorkoutAmt;

    // CB: Set totalSeconds and update totalSecondsInput display text
    callbacks.setTotalSecAndUpdateInput(newSectionId);

    // CB: Reset sectionSeconds
    callbacks.resetSectionSeconds();

    // CB: Pictures scroll to head
    callbacks.picturesScrollToHead();

    // CB: Update setInput display text
    callbacks.updateSetInput(newSectionId);

    // CB: Reset Bg anime
    callbacks.resetBgAnime();

    setSectionId(newSectionId);
  }

  function reset(callbacks: ResetTimerCBs) {
    setTimerOn(false);
    setHidableBtnsShow(true);

    // CB: reset totalSeconds and totalSecondsInput display text
    callbacks.resetTotalSecAndInput();

    // CB: reset sectionSeconds
    callbacks.resetSectionSeconds();

    // CB: Pictures scroll to head
    callbacks.picturesScrollToHead();

    // CB: Reset setInput display text
    callbacks.resetSetInput();

    // CB: Reset sectionSecondsRemainsInput display text
    callbacks.resetSectionSecondsRemainsInput();

    // CB: Reset Bg anime
    callbacks.resetBgAnime();

    setSectionId(0);
  }

  function scrollingChangeSection(callbacks: ScrollingChangeSectionCBs) {
    // Determine setNo
    let setNo = workoutArray[sectionId].setNo;
    if (setNo <= 0) setNo = 1;

    // CB: Read workoutNo
    const workoutNo = callbacks.readWorkoutNo();

    // Read totalWorkoutAmt
    const totalWorkoutAmt = useTimerSetupState.timerSetup.workouts.value;

    // Calc new newSectionId
    const newSectionId =
      1 + (setNo - 1) * 2 * totalWorkoutAmt + (workoutNo - 1) * 2;

    // CB: Set totalSeconds and update totalSecondsInput text
    callbacks.setTotalSecAndUpdateInput(newSectionId);

    // CB: Reset sectionSeconds
    callbacks.resetSectionSeconds();

    // Update sectionSecondsRemainsInput text
    callbacks.updateSectionSecondsRemainsInput();

    // Update setInput text
    callbacks.updateSetInput(newSectionId);

    // Reset Bg anime
    callbacks.resetBgAnime();

    setSectionId(newSectionId);
  }

  function StateChangeHidableBtnsShow(
    callbacks: StateChangeHidableBtnsShowCBs
  ) {
    useEffect(() => {
      // CB: Set nav bar show/hide
      callbacks.setNavBarShow(hidableBtnsShow);

      // CB: Set bottom container show/hide
      callbacks.setBottomContainerShow(hidableBtnsShow);
    }, [hidableBtnsShow]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  function StateChangeWorkoutArray(callbacks: StateChangeWorkoutArrayDataCBs) {
    useEffect(() => {
      //CB: Reset sectionSeconds
      callbacks.resetSectionSeconds();

      // Reset sectionSecondsRemainsInput text
      callbacks.resetSectionSecondsRemainsInput();
    }, [workoutArray]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  function StateChangeSectionId(callbacks: StateChangeSectionIdCBs) {
    useEffect(() => {
      // CB: change bg color by section type
      callbacks.changeBgColor(workoutArray[sectionId].type);

      if (timerOn) {
        // Read current workoutListIndex
        let workoutListIndex = workoutArray[sectionId].workoutNo - 1;
        if (workoutListIndex < 0) workoutListIndex = 0;

        // CB: Pictures scroll to current workoutListIndex
        callbacks.picturesScrollToIndex(workoutListIndex);

        // CB: Reset sectionSeconds
        callbacks.resetSectionSeconds();

        // CB: Reset backgroundAnimation value
        callbacks.resetBackgroundAnimationValue();

        // CB: Update setInput text
        callbacks.updateSetInput(sectionId);

        // CB: Start new section anime loop
        callbacks.startNewSectionAnimeLoop();
      }
    }, [sectionId]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  function StateChangeTimerOn(callbacks: StateChangeTimerOnCBs) {
    useEffect(() => {
      if (timerOn) {
        callbacks.playStartingSound();
        // CB: Start anime loop
        callbacks.startAnimeLoop();
      } else {
        callbacks.stopAllSounds();
        // CB: Stop anime loop
        callbacks.stopAnimeLoop();
      }
    }, [timerOn]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  return {
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
  };
};

export default useTimerControl;
