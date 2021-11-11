import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  const translationText = t("accountScreen", { returnObjects: true }) as any;

  const pathname = (props as any).location?.pathname; // TODO: fix any

  const [trackingAuthorized, setTrackingAuthorized] = useState(
    pathname === "/account/login" ? true : false
  );

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
        {!currentUser
          ? translationText.subtitle.noUser
          : !currentUser.displayName
          ? translationText.subtitle.withUserNameNotAvailable
          : currentUser.displayName}
        {currentUser
          ? translationText.subtitle.withUserBeforeProvidor +
            providerText() +
            translationText.subtitle.withUserAfterProvidor
          : null}
      </p>
    );
  };

  const PermissionBtns: React.FC = () => {
    return (
      <div className="account-screen-btns">
        <BtnAccountScreen.SignIn
          btnText={translationText.trackingPermission.btnText}
          onClick={async () => {
            try {
              setTrackingAuthorized(true);
              props.history.push("/account/login");
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
        <BtnAccountScreen.Apple btnText="Sign in with Apple" />
        <BtnAccountScreen.Google btnText="Sign in with Google" />
      </div>
    );
  };

  const SignOutBtns: React.FC = () => {
    return (
      <div className="account-screen-btns">
        <BtnAccountScreen.SignOut
          btnText={translationText.signOutBtnText}
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
    const confirmed = window.confirm(translationText.uploadBtn.alertMainMsg);

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
        alert(translationText.uploadBtn.alertSucceedMsg);
      } catch (error) {
        alert(translationText.uploadBtn.alertErrorTitle + error);
        setLoading(false);
      }
    };

    if (confirmed) {
      upload();
    }
  };

  const handleDownloadClick = () => {
    const confirmed = window.confirm(translationText.downloadBtn.alertMainMsg);

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
        alert(translationText.downloadBtn.alertSucceedMsg);
      } catch (error) {
        alert(translationText.downloadBtn.alertErrorTitle + error);
        setLoading(false);
      }
    };

    if (confirmed) {
      download();
    }
  };

  useEffect(() => {
    setTabBarShow(true);
    if (pathname === "/account/login") {
      setLoading(true);
    }
  }, []);

  return (
    <>
      <MainContainerMid>
        <p className="account-screen__title">{translationText.title}</p>
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
          <p className="icon-text">{translationText.uploadBtn.textBelow}</p>
        </button>
        <button
          onClick={handleDownloadClick}
          disabled={!currentUser || loading}
          className={!currentUser || loading ? "disabled" : ""}
        >
          <Icon.CloudDownload />
          <p className="icon-text">{translationText.downloadBtn.textBelow}</p>
        </button>
      </MainContainerBtm>
    </>
  );
};

export default AccountScreen;
