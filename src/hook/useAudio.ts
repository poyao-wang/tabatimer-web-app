import { useEffect, useState } from "react";

type SoundType =
  | "workOutStart"
  | "countDown"
  | "rest"
  | "finished"
  | "tick"
  | null;

type PlaySoundAsyncFn = (type: SoundType, playSound: boolean) => Promise<void>;

const useAudio = () => {
  const [tickSound, setTickSound] = useState<HTMLAudioElement>(
    new Audio("/assets/audio/tick.mp3")
  );
  const [countDownSound, setCountDownSound] = useState<HTMLAudioElement>(
    new Audio("/assets/audio/count-down.mp3")
  );
  const [workOutStartSound, setWorkOutStartSound] = useState<HTMLAudioElement>(
    new Audio("/assets/audio/workout-start.mp3")
  );
  const [restSound, setRestSound] = useState<HTMLAudioElement>(
    new Audio("/assets/audio/rest-bell.mp3")
  );
  const [finishedSound, setFinishedSound] = useState<HTMLAudioElement>(
    new Audio("/assets/audio/finished.mp3")
  );

  const playTickingSound: PlaySoundAsyncFn = async (type, playSound) => {
    try {
      if (!playSound) return;
      const sound =
        type === "tick"
          ? tickSound
          : type === "countDown"
          ? countDownSound
          : null;
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
          ? workOutStartSound
          : type === "countDown"
          ? countDownSound
          : type === "rest"
          ? restSound
          : type === "finished"
          ? finishedSound
          : null;

      if (sound) await sound.play();
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error);
    }
  };

  return {
    playSound,
    playTickingSound,
  };
};

export default useAudio;
