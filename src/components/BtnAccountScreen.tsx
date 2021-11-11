import React from "react";
import firebase from "firebase";

import "./BtnAccountScreen.css";
import { providerApple, providerGoogle } from "../App";
import { useAuth } from "../auth/AuthContext";
import Icon from "./Icon";

interface BtnProps {
  btnText: string;
}

interface SignInProps extends BtnProps {
  onClick: () => void;
}
interface SignOutProps extends BtnProps {
  onClick: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onClick, btnText }) => {
  return (
    <button
      className="btn-account-screen btn-account-screen--sign-in"
      onClick={onClick}
    >
      <Icon.Login />
      {btnText}
    </button>
  );
};

const SignOut: React.FC<SignOutProps> = ({ onClick, btnText }) => {
  return (
    <button
      className="btn-account-screen btn-account-screen--sign-out"
      onClick={onClick}
    >
      <Icon.Logout />
      {btnText}
    </button>
  );
};

const Apple: React.FC<BtnProps> = ({ btnText }) => {
  const { setLoading } = useAuth();

  const firebaseSignIn = async () => {
    try {
      setLoading(true);
      await firebase.auth().signInWithPopup(providerApple);

      const result = await firebase.auth().getRedirectResult();
      setLoading(true);

      await firebase
        .database()
        .ref("/users/" + result.user!.uid)
        .update({
          additionalUserInfo: result.additionalUserInfo,
        });
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  return (
    <button
      className="btn-account-screen btn-account-screen--apple"
      onClick={() => {
        firebaseSignIn();
      }}
    >
      <Icon.Apple />
      {btnText}
    </button>
  );
};

const Google: React.FC<BtnProps> = ({ btnText }) => {
  const { setLoading } = useAuth();

  const firebaseSignIn = async () => {
    try {
      setLoading(true);
      await firebase.auth().signInWithRedirect(providerGoogle);

      const result = await firebase.auth().getRedirectResult();
      setLoading(true);

      await firebase
        .database()
        .ref("/users/" + result.user!.uid)
        .update({
          additionalUserInfo: result.additionalUserInfo,
        });
    } catch (error) {
      alert(error);
      setLoading(false);
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
      {btnText}
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
