import React, { useContext, useEffect, useState } from "react";

import "./AccountScreen.css";
import { MainContext } from "../config/MainContext";
import { useAuth } from "../auth/AuthContext";
import { WorkoutSetupProps } from "../config/timerSetupDefaultData";
import BtnAccountScreen from "../components/BtnAccountScreen";
import cache from "../config/cache";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import { RouteComponentProps, StaticContext } from "react-router";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import Loader from "../components/Loader";
import cloudDbFunctions from "../auth/cloudDbFunctions";

const AccountScreen: React.FC<
  RouteComponentProps<
    {
      [x: string]: string | undefined;
    },
    StaticContext,
    unknown
  >
> = (props) => {
  const [trackingAuthorized, setTrackingAuthorized] = useState(false);

  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  const { currentUser, logout, loading, setLoading } = useAuth();

  const mainDataToString: (mainData: WorkoutSetupProps) => string | null = (
    mainData
  ) => {
    if (mainData) {
      const prepareTime = mainData?.prepareTime?.value;
      const restTimeSets = mainData?.restTimeSets?.value;
      const restTime = mainData?.restTime?.value;
      const sets = mainData?.sets?.value;
      const workouts = mainData?.workouts?.value;
      const workoutList = mainData?.workoutSetup?.flatListArray;
      const workoutTime = mainData?.workoutTime?.value;
      const returnObj = {
        prepareTime,
        restTimeSets,
        restTime,
        sets,
        workouts,
        workoutList,
        workoutTime,
      };
      return JSON.stringify(returnObj);
    }
    return null;
  };

  const stringToSetMainData = (inputText: string) => {
    if (!inputText) throw new Error("noData");
    const parsedObject = JSON.parse(inputText);
    const {
      prepareTime,
      restTime,
      restTimeSets,
      sets,
      workoutList,
      workouts,
      workoutTime,
    } = parsedObject;

    mainData.prepareTime.value = prepareTime;
    mainData.restTime.value = restTime;
    mainData.restTimeSets.value = restTimeSets;
    mainData.sets.value = sets;
    mainData.workouts.value = workouts;
    mainData.workoutTime.value = workoutTime;
    mainData.workoutSetup.flatListArray = workoutList;

    mainData.workoutSetup.updated = true;
    mainData.workoutSetup.workoutArray =
      timeDataSetupFunctions.makeWorkoutsArray(mainData);
    setMainData(mainData);
    cache.storeToCache(mainData);
  };

  const SubTitle: React.FC = () => {
    const providerText = () => {
      const textFeomFirebaseAuth = currentUser!.providerData[0]?.providerId;
      if (textFeomFirebaseAuth === "apple.com") return "Apple";
      if (textFeomFirebaseAuth === "facebook.com") return "Facebook";
      if (textFeomFirebaseAuth === "google.com") return "Google";
    };

    return (
      <p className="account-screen__subtitle">
        {/* {!currentUser
          ? translationText.subtitle.noUser
          : !currentUser.displayName
          ? translationText.subtitle.withUserNameNotAvailable
          : currentUser.displayName}
        {currentUser
          ? translationText.subtitle.withUserBeforeProvidor +
            providerText() +
            translationText.subtitle.withUserAfterProvidor
          : null} */}
        Sign in for upload / download settings
      </p>
    );
  };

  const PermissionBtns: React.FC = () => {
    return (
      <div className="account-screen-btns">
        <BtnAccountScreen.SignIn
          onClick={async () => {
            try {
              setTrackingAuthorized(true);
            } catch (error) {
              alert(error);
            }
          }}
        />
      </div>
    );
  };

  const SigninBtns: React.FC = () => {
    return (
      <div className="account-screen-btns">
        <BtnAccountScreen.Apple />
        <BtnAccountScreen.Google />
      </div>
    );
  };

  const SignOutBtns: React.FC = () => {
    return (
      <div className="account-screen-btns">
        <BtnAccountScreen.SignOut
          onClick={() => {
            logout();
          }}
        />
      </div>
    );
  };

  const LoadingView: React.FC = () => {
    return (
      <div className="account-screen-btns">
        <Loader />
      </div>
    );
  };

  const handleUploadClick = () => {
    const confirmed = window.confirm("translationText.uploadBtn.alertMainMsg");

    const upload = async () => {
      try {
        setLoading(true);

        const stringTrans = mainDataToString(mainData);

        if (!currentUser || !stringTrans) {
          throw new Error("test");
        } else {
          await cloudDbFunctions.upload(currentUser!.uid, stringTrans);
        }

        setLoading(false);
        alert(
          "translationText.uploadBtn.alertSucceedTitle" +
            "translationText.uploadBtn.alertSucceedMsg"
        );
      } catch (error) {
        alert("translationText.uploadBtn.alertErrorTitle" + error);
        setLoading(false);
      }
    };

    if (confirmed) {
      upload();
    }
  };

  const handleDownloadClick = () => {
    const confirmed = window.confirm(
      "translationText.downloadBtn.alertMainTitle" +
        "translationText.downloadBtn.alertMainMsg"
    );

    const download = async () => {
      try {
        setLoading(true);

        if (!currentUser) {
          throw new Error("no user");
        } else {
          const result = await cloudDbFunctions.download(currentUser.uid);
          if (result) {
            stringToSetMainData(result.val());
          } else {
            throw new Error("no data");
          }
        }
        setLoading(false);
        alert(
          "translationText.downloadBtn.alertSucceedTitle" +
            "translationText.downloadBtn.alertSucceedMsg"
        );
      } catch (error) {
        alert("translationText.downloadBtn.alertErrorTitle" + error);
        setLoading(false);
      }
    };

    if (confirmed) {
      download();
    }
  };

  useEffect(() => {
    setTabBarShow(true);
  }, []);

  return (
    <>
      <MainContainerMid>
        <p className="account-screen__title">User Account</p>
        <SubTitle />
        <>
          {loading && <LoadingView />}
          {!loading && currentUser && <SignOutBtns />}
          {!loading && !currentUser && !trackingAuthorized && (
            <PermissionBtns />
          )}
          {!loading && !currentUser && trackingAuthorized && <SigninBtns />}
        </>
      </MainContainerMid>
      <MainContainerBtm>
        <button
          onClick={handleUploadClick}
          disabled={!currentUser || loading}
          className={!currentUser || loading ? "disabled" : ""}
        >
          <Icon.CloudUpload />
        </button>
        <button
          onClick={handleDownloadClick}
          disabled={!currentUser || loading}
          className={!currentUser || loading ? "disabled" : ""}
        >
          <Icon.CloudDownload />
        </button>
      </MainContainerBtm>
    </>
  );
};

export default AccountScreen;
