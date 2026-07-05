import { useState, useEffect, useCallback } from "react";
import * as auth from "../utils/auth";
import * as messages from "../utils/messages";
import { useNavigate, useLocation } from "react-router-dom";

export default function useAuth({ openModal, startLoading, stopLoading }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  // проверка токена
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
      });
  }, [navigate, location.pathnamee]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  // login
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
        message: messages.AUTHORIZATION_FAILED_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  };

  // signup
  const handleSignup = async (email, password) => {
    startLoading();
    try {
      await auth.signup(email, password);

      openModal({
        status: "success",
        message: messages.SUCCESSFUL_SIGNUP_MSG,
      });

      await handleSignin(email, password);
    } catch (err) {
      openModal({
        status: "error",
        message: messages.SIGNUP_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  };

  // logout
  const handleSignout = async () => {
    try {
      await auth.signout();

      openModal({
        status: "success",
        message: messages.SUCCESSFUL_SIGNOUT_MSG,
      });
    } catch (err) {
      openModal({
        status: "error",
        message: messages.SIGNOUT_ERROR_MSG,
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
    handleSignin,
    handleSignup,
    handleSignout,
    setCurrentUser,
  };
}
