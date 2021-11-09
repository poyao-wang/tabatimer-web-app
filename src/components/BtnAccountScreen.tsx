import React from "react";
import firebase from "firebase";

import { useAuth } from "../auth/AuthContext";
import { providerGoogle } from "../App";

import "./BtnAccountScreen.css";
import Icon from "./Icon";

interface SignInProps {
  onClick: () => void;
}
const SignIn: React.FC<SignInProps> = ({ onClick }) => {
  return (
    <button
      className="btn-account-screen btn-account-screen--sign-in"
      onClick={onClick}
    >
      <Icon.Login />
      Sign in
    </button>
  );
};

const SignOut: React.FC = (props) => {
  return (
    <button className="btn-account-screen btn-account-screen--sign-out">
      <Icon.Logout />
      Sign out
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
  SignIn: SignIn,
  SignOut: SignOut,
  Apple: Apple,
  Google: Google,
};

export default BtnAccountScreen;
