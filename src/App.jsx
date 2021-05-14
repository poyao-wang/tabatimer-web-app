import { Route, Redirect, Switch } from "react-router-dom";

import "./App.css";
import TimerScreen from "./components/screen/TimerScreen";
import AccountScreen from "./components/screen/AccountScreen";
import EditorScreen from "./components/screen/EditorScreen";
import WorkoutListScreen from "./components/screen/WorkoutListScreen";

function App() {
  return (
    <div className="App">
      <main className="container">
        <Switch>
          <Route path="/timer" render={(props) => <TimerScreen {...props} />} />
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
      </main>
    </div>
  );
}

export default App;
