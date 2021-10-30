import React from "react";

import "./FractionTimerScreen.css";

interface FractionTimerScreenProps {
  title: string;
  textTop: string;
  textBtm: string;
}

const FractionTimerScreen: React.FC<FractionTimerScreenProps> = ({
  title,
  textTop,
  textBtm,
}) => {
  return (
    <div className="fraction-timer-screen">
      <div>
        <p className="fraction-title">{title}</p>
      </div>
      <p className="fraction-text-top">{textTop}</p>
      <p className="fraction-text-btm">{textBtm}</p>
    </div>
  );
};

export default FractionTimerScreen;
