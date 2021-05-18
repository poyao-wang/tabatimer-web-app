import { useState } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import "./App.css";
import { MainContext } from "./components/config/MainContext";
import AccountScreen from "./components/screen/AccountScreen";
import EditorScreen from "./components/screen/EditorScreen";
import TimerScreen from "./components/screen/TimerScreen";
import timerSetupDefaultData from "./components/config/timerSetupDefaultData";
import WorkoutListScreen from "./components/screen/WorkoutListScreen";
import NavBar from "./components/NavBar";

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
