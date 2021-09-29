import React from "react";

type ImageTypeFromReact = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

const ImgWorkout = {
  PlankElbow: (): ImageTypeFromReact => (
    <img src="/assets/images/workouts/plank-elbow.png" alt="" />
  ),
  PlankFull: (): ImageTypeFromReact => (
    <img src="/assets/images/workouts/plank-full.png" alt="" />
  ),
  PlankSideLeft: (): ImageTypeFromReact => (
    <img src="/assets/images/workouts/plank-side-left.png" alt="" />
  ),
  PlankSideRight: (): ImageTypeFromReact => (
    <img src="/assets/images/workouts/plank-side-right.png" alt="" />
  ),
};

export default ImgWorkout;
