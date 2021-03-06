import {
  ItemFlatListArrayProps,
  ItemWorkoutArrayProps,
  WorkoutSetupProps,
} from "./timerSetupDefaultData";

// Imports for React Native
// import Constants from "expo-constants";

// Imports for React
const currentAppVer = process.env.REACT_APP_VERSION as string;

const makeWorkoutsArray: (
  mainData: WorkoutSetupProps
) => ItemWorkoutArrayProps[] = (mainData) => {
  let newArray: ItemWorkoutArrayProps[] = [];
  const setAmt = mainData.sets.value;
  const workoutAmt = mainData.workouts.value;
  const workoutTime = mainData.workoutTime.value;
  const restTime = mainData.restTime.value;
  const restTimeSets = mainData.restTimeSets.value;

  let id = 0;
  let end = mainData.prepareTime.value;

  newArray.push({
    id: id,
    setNo: 1,
    workoutNo: 0,
    type: "prepare",
    duration: mainData.prepareTime.value,
    start: 0,
    end: end,
  });
  id++;

  for (let i = 1; i <= setAmt; i++) {
    for (let j = 1; j <= workoutAmt; j++) {
      newArray.push({
        id: id,
        setNo: i,
        workoutNo: j,
        type: "workout",
        duration: workoutTime,
        start: end,
        end: end + workoutTime,
      });
      end = end + workoutTime;
      id++;

      if (j !== workoutAmt) {
        newArray.push({
          id: id,
          setNo: i,
          workoutNo: j,
          type: "rest",
          duration: restTime,
          start: end,
          end: end + restTime,
        });
        end = end + restTime;
        id++;
      }
    }

    if (i !== setAmt) {
      newArray.push({
        id: id,
        setNo: i + 1,
        workoutNo: 0,
        type: "prepare",
        duration: restTimeSets,
        start: end,
        end: end + restTimeSets,
      });
      end = end + restTimeSets;
      id++;
    }
  }

  return newArray;
};

const makeFlatListArray: (
  mainData: WorkoutSetupProps,
  workoutAmt: number
) => ItemFlatListArrayProps[] = (mainData, workoutAmt) => {
  let newArray = [...mainData.workoutSetup.flatListArray];
  let arrayLength = newArray.length;
  if (arrayLength > workoutAmt) {
    for (let i = 0; i < arrayLength - workoutAmt; i++) {
      newArray.pop();
    }
  } else if (arrayLength < workoutAmt) {
    for (let i = 0; i < workoutAmt - arrayLength; i++) {
      newArray.push({
        id: i,
        image: null,
        imgSrcForReact: "",
        name: "new",
      });
    }
  }

  for (let i = 0; i < newArray.length; i++) {
    newArray[i].id = i;
    if (!newArray[i].name) newArray[i].name = `workout${i + 1}`;
    if (!newArray[i].image) newArray[i].image = null;
  }

  return newArray;
};

const resetFlatListArray: (
  mainData: WorkoutSetupProps,
  workoutAmt: number
) => ItemFlatListArrayProps[] = (mainData, workoutAmt) => {
  let newArray = [...mainData.workoutSetup.flatListArray];
  let arrayLength = newArray.length;
  if (arrayLength > workoutAmt) {
    for (let i = 0; i < arrayLength - workoutAmt; i++) {
      newArray.pop();
    }
  } else if (arrayLength < workoutAmt) {
    for (let i = 0; i < workoutAmt - arrayLength; i++) {
      newArray.push({
        id: i,
        image: null,
        imgSrcForReact: "",
        name: "new",
      });
    }
  }

  for (let i = 0; i < newArray.length; i++) {
    newArray[i].id = i;
    if (!newArray[i].name) newArray[i].name = `workout${i + 1}`;
    newArray[i].image = null;
  }

  return newArray;
};

const resetMainData: (mainData: WorkoutSetupProps) => void = (mainData) => {
  mainData.prepareTime.value = 15;
  mainData.workoutTime.value = 30;
  mainData.restTime.value = 10;
  mainData.restTimeSets.value = 30;
  mainData.sets.value = 3;
  mainData.workouts.value = 6;

  mainData.settings = {
    playSound: true,
    language: "en",
    appVer: currentAppVer,
  };
  mainData.workoutSetup.updated = true;
  mainData.workoutSetup.workoutArray = makeWorkoutsArray(mainData);
  mainData.workoutSetup.flatListArray = makeFlatListArray(
    mainData,
    mainData.workouts.value
  );
};

const totalSecToMinAndSec: (totalSec: number) => {
  min: number;
  sec: number;
  displayText: string;
  mixedText: string;
} = (totalSec) => {
  const min = Math.floor(totalSec / 60);
  const sec = totalSec - 60 * min;
  const displayText = ("00" + min).slice(-2) + ":" + ("00" + sec).slice(-2);
  const mixedText = totalSec <= 60 ? totalSec.toString() : displayText;
  return { min, sec, displayText, mixedText };
};

const checkImageUri = (uri: any) => {
  let source = typeof uri === "string" ? { uri } : uri;

  if (!uri) source = null;
  return source;
};

const getImageOrientation = (
  file: File,
  callback: (number: number) => void
) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    if (
      event !== null &&
      event.target !== null &&
      event.target.result !== null
    ) {
      var view = new DataView(event.target.result as ArrayBuffer);

      if (view.getUint16(0, false) !== 0xffd8) return callback(-2);

      var length = view.byteLength,
        offset = 2;

      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return callback(-1);
          }
          var little = view.getUint16((offset += 6), false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;

          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + i * 12, little) === 0x0112)
              return callback(view.getUint16(offset + i * 12 + 8, little));
        } else if ((marker & 0xff00) !== 0xff00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    }
  };

  reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};

const timeDataSetupFunctions = {
  checkImageUri,
  makeWorkoutsArray,
  makeFlatListArray,
  resetFlatListArray,
  resetMainData,
  totalSecToMinAndSec,
  getImageOrientation,
};

export default timeDataSetupFunctions;
