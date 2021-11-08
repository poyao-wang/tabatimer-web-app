import { useState } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import "./App.css";
import { MainContext } from "./config/MainContext";
import AccountScreen from "./screens/AccountScreen";
import EditorScreen from "./screens/EditorScreen";
import TimerScreen from "./screens/TimerScreen";
import timerSetupDefaultData from "./config/timerSetupDefaultData";
import WorkoutListScreen from "./screens/WorkoutListScreen";
import NavBar from "./components/NavBar";
import ImgWorkout from "./components/ImgWorkout";
import EditorDetailScreen from "./screens/EditorDetailScreen";
import WorkoutListDetailScreen from "./screens/WorkoutListDetailScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

function App() {
  const [tabBarShow, setTabBarShow] = useState(true);
  const [timerSetup, setTimerSetup] = useState(timerSetupDefaultData);

  const topContainerClassName =
    "top-container" + (tabBarShow ? "" : " top-container--hide");

  return (
    <div className="App">
      <MainContext.Provider
        value={{
          tabBar: { tabBarShow, setTabBarShow },
          timer: { timerSetup, setTimerSetup },
        }}
      >
        <div className="screen-container">
          <div className={topContainerClassName}>
            <NavBar />
          </div>
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => <WelcomeScreen {...props} />}
            />
            <Route
              path="/timer"
              render={(props) => <TimerScreen {...props} />}
            />
            <Route
              path="/account"
              render={(props) => <AccountScreen {...props} />}
            />
            <Route
              path="/editor"
              render={(props) => <EditorScreen {...props} />}
            />
            <Route
              path="/editor-detail"
              render={(props) => <EditorDetailScreen {...props} />}
            />
            <Route
              path="/workout-list"
              render={(props) => <WorkoutListScreen {...props} />}
            />
            <Route
              path="/workout-list-detail"
              render={(props) => <WorkoutListDetailScreen {...props} />}
            />
          </Switch>
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default App;
