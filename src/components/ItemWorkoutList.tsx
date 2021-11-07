import React, { createRef, useContext, useState } from "react";

import "./ItemWorkoutList.css";
import { MainContext } from "../config/MainContext";
import BtnListOrder from "./BtnListOrder";
import Icon from "./Icon";

interface ItemWorkoutListProps {
  item?: any;
  index: number;
}

const ItemWorkoutList: React.FC<ItemWorkoutListProps> = ({ item, index }) => {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext as any);

  const [imageSrc, setImageSrc] = useState(
    mainData.workoutSetup.flatListArray[index].imgSrcForReact
  );

  const inputRef = createRef<HTMLInputElement>();

  return (
    <div className="item-workout-list">
      <div className="list-order-btns">
        <button>
          <BtnListOrder.Up />
        </button>
        <button>
          <BtnListOrder.Top />
        </button>
        <button>
          <BtnListOrder.Down />
        </button>
        <button>
          <BtnListOrder.Bottom />
        </button>
      </div>
      <div className="item-workout-list__number-container">
        <p className="item-workout-list__number">{index + 1 + ". "}</p>
      </div>
      <div className="img-workout-container">
        <img className="workout-image" src={imageSrc} alt="" />
      </div>
      <button className="icon-add-image">
        <Icon.AddPhotoAlternate />
      </button>
    </div>
  );
};

export default ItemWorkoutList;

// Add and delete image btns

// import Jimp from "jimp";

/* <div className="workout-image-add-icon">
<input
  ref={inputRef}
  type="file"
  style={{ display: "none" }}
  accept="image/png, image/jpeg"
  onChange={addImage}
/>
<button
  onClick={() => {
    inputRef.current?.click();
  }}
>
  +
</button>
</div>
<div className="workout-image-delete-icon">
<button onClick={deleteImage}>{"delete"}</button>
</div> */

// function addImage(e: any) {
//   let file = e.target.files[0];
//   let reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = () => {
//     Jimp.read(reader.result as string, (err, image) => {
//       if (err) throw err;
//       else {
//         image
//           .background(0xffffffff)
//           .contain(300, 300)
//           .quality(70)
//           .getBase64(Jimp.MIME_JPEG, function (err, src) {
//             setImageSrc(src);
//             mainData.workoutSetup.flatListArray[item.id].image = src;
//             mainData.workoutSetup.updated = true;
//             setMainData(mainData);
//           });
//       }
//     });
//   };
// }

// function deleteImage() {
//   setImageSrc("");
//   mainData.workoutSetup.flatListArray[item.id].image = "";
//   mainData.workoutSetup.updated = true;
//   setMainData(mainData);
// }
