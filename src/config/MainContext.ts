import { createContext, Dispatch } from "react";

import { WorkoutSetupProps } from "./timerSetupDefaultData";
import { ItemLang } from "./uiTextDefaultData";

export interface MainContext_Timer {
  timerSetup: WorkoutSetupProps;
  setTimerSetup: Dispatch<WorkoutSetupProps>;
}

interface MainContextProps {
  tabBar: { tabBarShow: boolean; setTabBarShow: Dispatch<boolean> };
  timer: MainContext_Timer;
  language: { uiText: ItemLang; setLanguage: Dispatch<string> };
}

export const MainContext = createContext({} as MainContextProps);
