const currentAppVer = "0.0.0";

const setAmt = 3;
const workoutAmt = 3;
const workoutTime = 2;
const restTime = 2;
const restTimeSets = 2;
const prepareTime = 2;

const makeWorkoutsArray = () => {
  let newArray = [];

  let id = 0;
  let end = prepareTime;

  newArray.push({
    id: id,
    setNo: 1,
    workoutNo: 0,
    type: "prepare",
    duration: prepareTime,
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

const timerSetupDefaultData = {
  workoutSetup: {
    updated: false,
    workoutArray: makeWorkoutsArray(),
    flatListArray: [
      {
        id: 0,
        image: "",
        name: "workout1",
      },
      {
        id: 1,
        image: "",
        name: "workout2",
      },
      {
        id: 2,
        image: "",
        name: "workout3",
      },
      {
        id: 3,
        image: "",
        name: "workout4",
      },
      {
        id: 4,
        image: "",
        name: "workout5",
      },
      {
        id: 5,
        image: "",
        name: "workout6",
      },
    ],
  },
  settings: { playSound: true, language: "en", appVer: currentAppVer },
  prepareTime: {
    type: "time",
    value: prepareTime,
  },
  workoutTime: {
    type: "time",
    value: workoutTime,
  },
  restTime: {
    type: "time",
    value: restTime,
  },
  restTimeSets: {
    type: "time",
    value: restTimeSets,
  },
  sets: {
    type: "number",
    value: setAmt,
  },
  workouts: {
    type: "number",
    value: workoutAmt,
  },
};
export default timerSetupDefaultData;
