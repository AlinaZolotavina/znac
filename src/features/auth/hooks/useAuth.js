import { useState, useEffect, useCallback } from "react";
import * as auth from "../../../shared/utils/auth";
import {
  AUTHORIZATION_FAILED_ERROR_MSG,
  SIGNOUT_ERROR_MSG,
  SIGNUP_ERROR_MSG,
  SUCCESSFUL_SIGNOUT_MSG,
  SUCCESSFUL_SIGNUP_MSG,
} from "../../../shared/utils/messages";
import { useNavigate, useLocation } from "react-router-dom";

export default function useAuth({ openModal, startLoading, stopLoading }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const checkToken = useCallback(() => {
    auth
      .getContent()
      .then((userData) => {
        setLoggedIn(true);
        setCurrentUser(userData);

        if (
          location.pathname === "/signin" ||
          location.pathname === "/signup"
        ) {
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.type === "AUTH_ERROR") {
          setLoggedIn(false);
          setCurrentUser({});
          return;
        }

        console.error(err);
      })
      .finally(() => {
        setIsAuthInitialized(true);
      });
  }, [navigate, location.pathname]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const handleSignin = async (email, password) => {
    startLoading();
    try {
      const data = await auth.signin(email, password);
      setLoggedIn(true);
      setCurrentUser(data.user);
      navigate("/");
    } catch (err) {
      openModal({
        status: "error",
        message: AUTHORIZATION_FAILED_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  };

  const handleSignup = async (email, password) => {
    startLoading();
    try {
      await auth.signup(email, password);

      openModal({
        status: "success",
        message: SUCCESSFUL_SIGNUP_MSG,
      });

      await handleSignin(email, password);
    } catch (err) {
      openModal({
        status: "error",
        message: SIGNUP_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  };

  const handleSignout = async () => {
    try {
      await auth.signout();

      openModal({
        status: "success",
        message: SUCCESSFUL_SIGNOUT_MSG,
      });
    } catch (err) {
      openModal({
        status: "error",
        message: SIGNOUT_ERROR_MSG,
      });

      console.error(err);
    } finally {
      setLoggedIn(false);
      setCurrentUser({});
      navigate("/");
    }
  };

  return {
    currentUser,
    loggedIn,
    isAuthInitialized,
    handleSignin,
    handleSignup,
    handleSignout,
    setCurrentUser,
  };
}
