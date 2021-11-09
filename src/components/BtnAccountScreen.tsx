import React from "react";
import firebase from "firebase";

import { useAuth } from "../auth/AuthContext";
import { providerGoogle } from "../App";

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
  const { setLoading } = useAuth();

  const firebaseSignIn = async () => {
    try {
      setLoading(true);

      const result = await firebase.auth().signInWithPopup(providerGoogle);

      await firebase
        .database()
        .ref("/users/" + result.user!.uid)
        .update({
          additionalUserInfo: result.additionalUserInfo,
        });
    } catch (error) {
      alert(error);
    }
  };
  return (
    <button
      className="btn-account-screen btn-account-screen--google"
      onClick={() => {
        firebaseSignIn();
      }}
    >
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
