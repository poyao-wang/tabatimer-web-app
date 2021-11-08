import React, { createRef, useContext, useState } from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import Jimp from "jimp";

import "./WorkoutListDetailScreen.css";
import { ItemFlatListArrayProps } from "../config/timerSetupDefaultData";
import { MainContext } from "../config/MainContext";
import Icon from "../components/Icon";
import MainContainerBtm from "../components/MainContainerBtm";
import MainContainerMid from "../components/MainContainerMid";

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

  const [imgSrc, setImgSrc] = useState(props.location.state.item.image);

  const item = props.location.state.item;
  const title = props.location.state.index + 1 + ".";

  setTabBarShow(false);

  const inputRef = createRef<HTMLInputElement>();

  function addImage(e: any) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      Jimp.read(reader.result as string, (err, image) => {
        if (err) throw err;
        else {
          image
            .background(0xffffffff)
            .contain(300, 300)
            .quality(70)
            .getBase64(Jimp.MIME_JPEG, function (err, src) {
              setImgSrc(src);
              mainData.workoutSetup.flatListArray[item.id].image = src;
              mainData.workoutSetup.updated = true;
              setMainData(mainData);
              // TODO: Implement cache
            });
        }
      });
    };
  }

  function deleteImage() {
    setImgSrc("");
    mainData.workoutSetup.flatListArray[item.id].image = "";
    mainData.workoutSetup.updated = true;
    setMainData(mainData);
    // TODO: Implement cache
  }

  return (
    <>
      <MainContainerMid customClassName="in-workout-list-detail-screen">
        <p className="screen-title">{title}</p>
        <div className="img-workout-container">
          {imgSrc && (
            <button className="btn-delete-img" onClick={deleteImage}>
              <Icon.Delete />
            </button>
          )}
          {imgSrc ? (
            <img className="workout-image" src={imgSrc} alt="" />
          ) : (
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
