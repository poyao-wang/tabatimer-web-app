import semver from "semver";
import _ from "lodash";

import timeDataSetupFunctions from "./timeDataSetupFunctions";
import { WorkoutSetupProps } from "./timerSetupDefaultData";

const cacheKeyName = "mainData";
const currentAppVer = process.env.REACT_APP_VERSION as string;
const deviceLanguage = "ja";

const storeToCache = async (object: {}) => {
  try {
    await localStorage.setItem(cacheKeyName, JSON.stringify(object));
  } catch (error) {
    alert(error);
  }
};

const getFromCache = async () => {
  try {
    const value = await localStorage.getItem(cacheKeyName);
    const object = value ? JSON.parse(value) : null;

    return object;
  } catch (error) {
    alert(error);
  }
};

const getCacheAndSet = async (
  mainData: WorkoutSetupProps,
  setMainData: React.Dispatch<WorkoutSetupProps>
) => {
  try {
    const result = await getFromCache();
    console.log(result);
    if (result) {
      const ifcacheAppVerValid = semver.valid(result.settings?.appVer);
      const cacheAppVer = ifcacheAppVerValid
        ? result.settings?.appVer
        : "0.0.0";
      const currGtCache = semver.gt(currentAppVer, cacheAppVer);
      console.log("current:", "v" + currentAppVer);
      console.log("cache:", "v" + cacheAppVer);
      console.log("current > cache:", currGtCache);

      const cacheLan = result.settings?.language;
      const lanToSet =
        cacheLan === "cht"
          ? "zh_Hant_TW"
          : cacheLan === "jpn"
          ? "ja"
          : cacheLan === "eng"
          ? "en"
          : cacheLan
          ? cacheLan
          : deviceLanguage;

      // console.log("cacheLan", cacheLan);
      // console.log("lanToSet", lanToSet);

      if (currGtCache) {
        mainData.prepareTime.value = result.prepareTime.value;
        mainData.restTime.value = result.restTime.value;
        mainData.restTimeSets.value = result.restTimeSets.value;
        mainData.sets.value = result.sets.value;
        mainData.workouts.value = result.workouts.value;
        mainData.workoutTime.value = result.workoutTime.value;
        mainData.workoutSetup.flatListArray = result.workoutSetup.flatListArray;
        mainData.workoutSetup.workoutArray =
          timeDataSetupFunctions.makeWorkoutsArray(result);
        mainData.settings.language = lanToSet;

        storeToCache(mainData);
        const dataClone = _.cloneDeep(mainData);

        setMainData(dataClone);
      } else {
        const dataClone = _.cloneDeep(result);
        setMainData(dataClone);
      }
      // setLanguage(lanToSet); // TODO: Set lang
    } else {
      // setLanguage(deviceLanguage); // TODO: Set lang
    }
  } catch (error) {
    alert(error);
  }
};

const cache = { storeToCache, getFromCache, getCacheAndSet };

export default cache;
