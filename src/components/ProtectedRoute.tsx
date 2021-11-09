import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { RouteProps } from "react-router";

const ProtectedRoute: React.FC<RouteProps> = ({
  path,
  component: Component,
  render,
  ...rest
}) => {
  let history = useHistory();
  console.log(history.action);
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        console.log(props);
        if (history.action === "POP") {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          );
        }
        return Component ? (
          <Component {...props} />
        ) : render ? (
          render(props)
        ) : undefined;
      }}
    />
  );
};

export default ProtectedRoute;
