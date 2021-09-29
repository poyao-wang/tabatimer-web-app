import React from "react";
import "./BtnAccountScreen.css";
import Icon from "./Icon";

const Signin: React.FC = (props) => {
  return (
    <button className="btn-account-screen btn-account-screen--sign-in">
      <Icon.Login />
      Sign in
    </button>
  );
};

const Apple: React.FC = (props) => {
  return (
    <button className="btn-account-screen btn-account-screen--apple">
      <Icon.Apple />
      Sign in with Apple
    </button>
  );
};

const Google: React.FC = (props) => {
  return (
    <button className="btn-account-screen btn-account-screen--google">
      <Icon.Google />
      Sign in with Google
    </button>
  );
};

const BtnAccountScreen = {
  SignIn: Signin,
  Apple: Apple,
  Google: Google,
};

export default BtnAccountScreen;
