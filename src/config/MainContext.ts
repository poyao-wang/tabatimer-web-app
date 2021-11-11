import { createContext, Dispatch } from "react";

import { ItemLang } from "./uiTextDefaultData";
import { WorkoutSetupProps } from "./timerSetupDefaultData";

export interface MainContext_Timer {
  timerSetup: WorkoutSetupProps;
  setTimerSetup: Dispatch<WorkoutSetupProps>;
}

interface MainContextProps {
  tabBar: { tabBarShow: boolean; setTabBarShow: Dispatch<boolean> };
  timer: MainContext_Timer;
  language?: { uiText: ItemLang; setLanguage: Dispatch<string> }; // Optional for web ver
}

export const MainContext = createContext({} as MainContextProps);
