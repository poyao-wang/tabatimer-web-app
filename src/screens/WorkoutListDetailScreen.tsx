import { RouteComponentProps, StaticContext } from "react-router";
import Jimp from "jimp";
import React, { ChangeEvent, createRef, useContext, useState } from "react";

import "./WorkoutListDetailScreen.css";
import { ItemFlatListArrayProps } from "../config/timerSetupDefaultData";
import { MainContext } from "../config/MainContext";
import cache from "../config/cache";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";

const WorkoutListDetailScreen: React.FC<
  RouteComponentProps<
    {},
    StaticContext,
    {
      item: ItemFlatListArrayProps;
      index: number;
    }
  >
> = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    tabBar: { setTabBarShow },
  } = useContext(MainContext);

  const { storeToCache } = cache;

  const [imgSrc, setImgSrc] = useState(props.location.state.item.image);
  const [loading, setLoading] = useState(false);

  const item = props.location.state.item;
  const title = props.location.state.index + 1 + ".";

  setTabBarShow(false);

  const inputRef = createRef<HTMLInputElement>();

  function addImage(e: ChangeEvent<HTMLInputElement>) {
    let file = (e.target.files as FileList)[0];
    let reader = new FileReader();

    setLoading(true);
    reader.readAsDataURL(file);
    reader.onload = () => {
      timeDataSetupFunctions.getImageOrientation(file, (srcOrientation) => {
        let rotateDegree = 0;

        switch (srcOrientation) {
          case 3:
            rotateDegree = 180;
            break;
          case 5:
            rotateDegree = 90;
            break;
          case 6:
            rotateDegree = 90;
            break;
          case 7:
            rotateDegree = 90;
            break;
          case 8:
            rotateDegree = -90;
            break;
          default:
            break;
        }

        Jimp.read(reader.result as string, (err, image) => {
          if (err) throw err;
          else {
            image
              .background(0xffffffff)
              .contain(300, 300)
              .quality(30)
              .rotate(rotateDegree)
              .getBase64(Jimp.MIME_JPEG, function (err, src) {
                if (err) throw err;
                setImgSrc(src);
                mainData.workoutSetup.flatListArray[item.id].image = src;
                mainData.workoutSetup.updated = true;
                setMainData(mainData);
                storeToCache(mainData);
                setLoading(false);
              });
          }
        });
      });
    };
  }

  function deleteImage() {
    setLoading(true);
    setImgSrc("");
    mainData.workoutSetup.flatListArray[item.id].image = "";
    mainData.workoutSetup.updated = true;
    setMainData(mainData);
    storeToCache(mainData);
    setLoading(false);
  }

  return (
    <>
      <MainContainerMid customClassName="in-workout-list-detail-screen">
        <p className="screen-title">{title}</p>
        <div className="img-workout-container">
          {loading && <Loader />}
          {!loading && imgSrc && (
            <button className="btn-delete-img" onClick={deleteImage}>
              <Icon.Delete />
            </button>
          )}
          {!loading && imgSrc && (
            <img className="workout-image" src={imgSrc} alt="" />
          )}
          {!loading && !imgSrc && (
            <>
              <input
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
                accept="image/png, image/jpeg"
                onChange={addImage}
              />
              <button
                className="btn-add"
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                <Icon.Add />
              </button>
            </>
          )}
        </div>
        <button
          className="btn-back"
          onClick={() => {
            props.history.push("/workout-list");
          }}
        >
          <Icon.ArrowCircleLeft />
        </button>
      </MainContainerMid>
      <MainContainerBtm />
    </>
  );
};

export default WorkoutListDetailScreen;
