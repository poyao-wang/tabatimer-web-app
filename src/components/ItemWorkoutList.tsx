import React from "react";

import "./ItemWorkoutList.css";
import { ItemFlatListArrayProps } from "../config/timerSetupDefaultData";
import { MoveOrderActionType } from "../screens/WorkoutListScreen";
import BtnListOrder from "./BtnListOrder";
import Icon from "./Icon";

interface ItemWorkoutListProps {
  item: ItemFlatListArrayProps;
  index: number;
  onMoveOrderAndSetData: (index: number, type: MoveOrderActionType) => void;
  onAddImgClicked: () => void;
}

const ItemWorkoutList: React.FC<ItemWorkoutListProps> = ({
  item,
  index,
  onMoveOrderAndSetData,
  onAddImgClicked,
}) => {
  const Img: React.FC = () => (
    <img
      className="workout-image"
      src={typeof item.image === "string" ? item.image : undefined}
      alt=""
    />
  );

  const IconNoImg: React.FC = () => (
    <div className="icon-no-img">
      <Icon.ImageNotSupported />
    </div>
  );

  return (
    <div className="item-workout-list">
      <div className="list-order-btns">
        <button
          onClick={() => {
            onMoveOrderAndSetData(index, "up");
          }}
        >
          <BtnListOrder.Up />
        </button>
        <button
          onClick={() => {
            onMoveOrderAndSetData(index, "upToTop");
          }}
        >
          <BtnListOrder.Top />
        </button>
        <button
          onClick={() => {
            onMoveOrderAndSetData(index, "down");
          }}
        >
          <BtnListOrder.Down />
        </button>
        <button
          onClick={() => {
            onMoveOrderAndSetData(index, "downToBtm");
          }}
        >
          <BtnListOrder.Bottom />
        </button>
      </div>
      <div className="item-workout-list__number-container">
        <p className="item-workout-list__number">{item.id + 1 + "."}</p>
      </div>
      <div className="img-workout-container">
        {item.image ? <Img /> : <IconNoImg />}
      </div>
      <button className="icon-add-image" onClick={onAddImgClicked}>
        <Icon.AddPhotoAlternate />
      </button>
    </div>
  );
};

export default ItemWorkoutList;
