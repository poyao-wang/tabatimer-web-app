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

function App() {
  const [tabBarShow, setTabBarShow] = useState(true);
  const [timerSetup, setTimerSetup] = useState(timerSetupDefaultData);

  return (
    <div className="App">
      <MainContext.Provider
        value={{
          tabBar: { tabBarShow, setTabBarShow },
          timer: { timerSetup, setTimerSetup },
        }}
      >
        <div className="screen-container">
          <div className="top-container">
            <NavBar />
          </div>
          <Switch>
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
              path="/workout-list"
              render={(props) => <WorkoutListScreen {...props} />}
            />
            <Redirect from="/" exact to="/timer" />
          </Switch>
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default App;
