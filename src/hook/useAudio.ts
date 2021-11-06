import { useEffect, useState } from "react";
import { StateChangeTimerOnCBs } from "./useTimerControl";

type SoundType =
  | "workOutStart"
  | "countDown"
  | "countDownRest"
  | "countDownStart"
  | "rest"
  | "finished"
  | "tick"
  | null;

type CountDownSoundType = "countDown" | "countDownRest" | "countDownStart";

type PlaySoundAsyncFn = (type: SoundType, playSound: boolean) => Promise<void>;
type PlayCountDownSoundAsyncFn = (
  type: CountDownSoundType,
  playSound: boolean,
  startTime: number
) => Promise<void>;

const useAudio = () => {
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);

  const [soundTick, setSoundTick] = useState<HTMLAudioElement>();
  const [soundCountDown, setSoundCountDown] = useState<HTMLAudioElement>();
  const [soundCountDownStart, setSoundCountDownStart] =
    useState<HTMLAudioElement>();
  const [soundCountDownRest, setSoundCountDownRest] =
    useState<HTMLAudioElement>();
  const [soundWorkOutStart, setSoundWorkOutStart] =
    useState<HTMLAudioElement>();
  const [soundRest, setSoundRest] = useState<HTMLAudioElement>();
  const [soundFinished, setSoundFinished] = useState<HTMLAudioElement>();

  // These 2 lines prevents Safari loading sound files slowly
  const AudioContext = window.AudioContext;
  const audioCtx = new AudioContext();
  //

  useEffect(() => {
    if (
      !soundsLoaded &&
      soundTick &&
      soundCountDown &&
      soundCountDownStart &&
      soundCountDownRest &&
      soundWorkOutStart &&
      soundRest &&
      soundFinished
    ) {
      setSoundsLoaded(true);
    }
  }, [
    soundsLoaded,
    soundTick,
    soundCountDown,
    soundCountDownStart,
    soundWorkOutStart,
    soundCountDownRest,
    soundRest,
    soundFinished,
  ]);

  useEffect(() => {
    if (soundsLoaded) {
      console.log("All sounds loaded");
    }
  }, [soundsLoaded]);

  const checkIfAnySoundIsPlaying = (): boolean | undefined => {
    return (
      (soundTick && !soundTick.paused) ||
      (soundCountDown && !soundCountDown.paused) ||
      (soundCountDownStart && !soundCountDownStart.paused) ||
      (soundCountDownRest && !soundCountDownRest.paused) ||
      (soundWorkOutStart && !soundWorkOutStart.paused) ||
      (soundRest && !soundRest.paused) ||
      (soundFinished && !soundFinished.paused)
    );
  };

  const pauseAllSounds = () => {
    const pauseAndResetSingleSound = (sound: HTMLAudioElement | undefined) => {
      if (sound && !sound.paused) sound.pause();
      if (sound) sound.currentTime = 0;
    };

    pauseAndResetSingleSound(soundTick);
    pauseAndResetSingleSound(soundCountDown);
    pauseAndResetSingleSound(soundCountDownStart);
    pauseAndResetSingleSound(soundCountDownRest);
    pauseAndResetSingleSound(soundWorkOutStart);
    pauseAndResetSingleSound(soundRest);
    pauseAndResetSingleSound(soundFinished);
  };

  const loadSingleSound = (
    soundStoredFromState: HTMLAudioElement | undefined,
    setSoundFromState: React.Dispatch<
      React.SetStateAction<HTMLAudioElement | undefined>
    >,
    src: string
  ) => {
    const _sound = new Audio(src);
    _sound.load();
    _sound.addEventListener(
      "canplaythrough",
      () => {
        console.log(`loaded ${Object.keys({ soundStoredFromState })[0]}`);
        setSoundFromState(_sound);
      },
      { once: true }
    );
  };

  const loadSounds = () => {
    loadSingleSound(soundTick, setSoundTick, "/assets/audio/tick.mp3");
    loadSingleSound(
      soundCountDown,
      setSoundCountDown,
      "/assets/audio/count-down-x3.mp3"
    );
    loadSingleSound(
      soundCountDownStart,
      setSoundCountDownStart,
      "/assets/audio/count-down-x3-start.mp3"
    );
    loadSingleSound(
      soundCountDownRest,
      setSoundCountDownRest,
      "/assets/audio/count-down-x3-rest.mp3"
    );
    loadSingleSound(
      soundWorkOutStart,
      setSoundWorkOutStart,
      "/assets/audio/workout-start.mp3"
    );
    loadSingleSound(soundRest, setSoundRest, "/assets/audio/rest-bell.mp3");
    loadSingleSound(
      soundFinished,
      setSoundFinished,
      "/assets/audio/finished.mp3"
    );
  };

  const playCountDownSound: PlayCountDownSoundAsyncFn = async (
    type,
    playSound,
    startTime
  ) => {
    try {
      if (
        !playSound ||
        (soundCountDown && !soundCountDown.paused) ||
        (soundCountDownStart && !soundCountDownStart.paused) ||
        (soundCountDownRest && !soundCountDownRest.paused)
      )
        return;
      const sound =
        type === "countDown"
          ? soundCountDown
          : type === "countDownStart"
          ? soundCountDownStart
          : type === "countDownRest"
          ? soundCountDownRest
          : null;
      if (sound && startTime !== 0) {
        sound.currentTime = startTime;
      }
      if (sound) await sound.play();
    } catch (error) {
      console.log(error);
    }
  };

  const playSound: PlaySoundAsyncFn = async (type, playSound) => {
    try {
      if (!playSound) return;
      const sound =
        type === "workOutStart"
          ? soundWorkOutStart
          : type === "countDown"
          ? soundCountDown
          : type === "countDownStart"
          ? soundCountDownStart
          : type === "countDownRest"
          ? soundCountDownRest
          : type === "rest"
          ? soundRest
          : type === "finished"
          ? soundFinished
          : null;

      if (sound) await sound.play();
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error);
    }
  };

  return {
    soundsLoaded,
    loadSounds,
    playSound,
    playCountDownSound,
    checkIfAnySoundIsPlaying,
    pauseAllSounds,
  };
};

export default useAudio;
