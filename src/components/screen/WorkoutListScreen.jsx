import React, { useContext, useState } from "react";
import { MainContext } from "../config/MainContext";

import "./WorkoutListScreen.css";

function WorkoutListScreen(props) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const [data, setData] = useState(mainData.workoutSetup.flatListArray);

  const renderItem = (item, key) => {
    let imageUri = item.image;
    return (
      <div className="workout-list-item">
        <div className="reorder-icon-container">
          <button>↑</button>
          <button>↓</button>
        </div>
        <div className="workout-index-container">
          {key + 1 + "."}
          {"\n"}
          {item.name}
        </div>
        <div className="workout-image"></div>
        <div className="workout-image-add-icon">
          <button>{"+"}</button>
        </div>
        <div className="workout-image-delete-icon">
          <button>{"delete"}</button>
        </div>
      </div>
    );
  };

  console.log(data);

  return (
    <>
      <div className="center-container workout-list-screen-center-container">
        {data.map((item, key) => renderItem(item, key))}
      </div>
      <div className="bottom-container editor-screen-bottom-container">
        <div className="bottom-container-item">
          <button>delete all</button>
        </div>
      </div>
    </>
  );
}

export default WorkoutListScreen;
