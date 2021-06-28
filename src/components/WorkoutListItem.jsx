import React, { createRef, useContext, useState } from "react";
import Jimp from "jimp";

import "./WorkoutListItem.css";
import { MainContext } from "../config/MainContext";

function WorkoutListItem({ item, index }) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const [imageSrc, setImageSrc] = useState(
    mainData.workoutSetup.flatListArray[index].image
  );

  const inputRef = createRef();

  function addImage(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      Jimp.read(reader.result, (err, image) => {
        if (err) throw err;
        else {
          image
            .background(0xffffffff)
            .contain(300, 300)
            .quality(70)
            .getBase64(Jimp.MIME_JPEG, function (err, src) {
              setImageSrc(src);
              mainData.workoutSetup.flatListArray[item.id].image = src;
              mainData.workoutSetup.updated = true;
              setMainData(mainData);
            });
        }
      });
    };
  }

  function deleteImage() {
    setImageSrc("");
    mainData.workoutSetup.flatListArray[item.id].image = "";
    mainData.workoutSetup.updated = true;
    setMainData(mainData);
  }

  return (
    <div className="workout-list-item">
      <div className="reorder-icon-container">
        <button>↑</button>
        <button>↓</button>
      </div>
      <div className="workout-index-container">
        {index + 1 + ". "}
        {item.name}
      </div>
      <div className="workout-image-container">
        <img className="workout-image" src={imageSrc} alt="" />
      </div>
      <div className="workout-image-add-icon">
        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          accept="image/png, image/jpeg"
          onChange={addImage}
        />
        <button
          onClick={() => {
            inputRef.current.click();
          }}
        >
          +
        </button>
      </div>
      <div className="workout-image-delete-icon">
        <button onClick={deleteImage}>{"delete"}</button>
      </div>
    </div>
  );
}

export default WorkoutListItem;
