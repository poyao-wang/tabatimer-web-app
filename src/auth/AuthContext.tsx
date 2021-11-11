import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
} from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router";

interface AuthContextProps {
  currentUser: firebase.User | null;
  logout: () => void;
  loading: boolean;
  setLoading: Dispatch<boolean>;
}

const AuthContext = createContext({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState<boolean>(
    window.location?.pathname === "/account/login" ? true : false
  );

  const history = useHistory();

  const logout = () => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
      if (window.location?.pathname === "/account/login") {
        history.push("/account");
      }
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    currentUser,
    logout,
    loading,
    setLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
