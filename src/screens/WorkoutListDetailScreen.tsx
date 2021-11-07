import React, { useContext, useState } from "react";
import { RouteComponentProps, StaticContext } from "react-router";

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
      title: string;
    }
  >
> = (props) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const [title, setTitle] = useState("title");
  const [imgSrc, setImgSrc] = useState("/assets/plank-side-L.jpg");
  // const [imgSrc, setImgSrc] = useState("");

  // const title = props.location.state.title ? props.location.state.title : "no";

  return (
    <>
      <MainContainerMid customClassName="in-workout-list-detail-screen">
        <p className="screen-title">{title}</p>
        <div className="img-workout-container">
          {imgSrc && (
            <button className="btn-delete-img">
              <Icon.Delete />
            </button>
          )}
          {imgSrc ? (
            <img className="workout-image" src={imgSrc} alt="" />
          ) : (
            <button className="btn-back">
              <Icon.Add />
            </button>
          )}
        </div>
        <button className="btn-back">
          <Icon.ArrowCircleLeft />
        </button>
      </MainContainerMid>
      <MainContainerBtm></MainContainerBtm>
    </>
  );
};

export default WorkoutListDetailScreen;
