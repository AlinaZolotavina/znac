import { useState, useEffect } from "react";
import * as auth from "../utils/auth";

export default function useAuth({
  history,
  location,
  openModal,
  messages,
  startLoading,
  stopLoading,
}) {
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔐 проверка токена
  const checkToken = () => {
    auth
      .getContent()
      .then((userData) => {
        setLoggedIn(true);
        setCurrentUser(userData);

        if (
          location.pathname === "/signin" ||
          location.pathname === "/signup"
        ) {
          history.push("/");
        }
      })
      .catch((err) => {
        if (err.type === "AUTH_ERROR") {
          setLoggedIn(false);
          setCurrentUser({});
          return;
        }

        // остальные ошибки — не обязательно логинить/разлогинивать
        console.error(err);
      });
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line
  }, []);

  // 🔑 login
  const handleSignin = async (email, password) => {
    startLoading();
    try {
      const data = await auth.signin(email, password);
      setLoggedIn(true);
      setCurrentUser(data.user);
      history.push("/");
    } catch (err) {
      openModal({
        status: "error",
        message: messages.AUTHORIZATION_FAILED_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  };

  // 📝 signup
  const handleSignup = async (email, password) => {
    startLoading();
    try {
      await auth.signup(email, password);
      await handleSignin(email, password);

      openModal({
        status: "success",
        message: messages.SUCCESSFUL_SIGNUP_MSG,
      });
    } catch (err) {
      openModal({
        status: "error",
        message: messages.SIGNUP_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  };

  // 🚪 logout
  const handleSignout = async () => {
    try {
      await auth.signout();
      setLoggedIn(false);
      setCurrentUser({});
      history.push("/");
    } catch (err) {
      openModal({
        status: "error",
        message: messages.SIGNOUT_ERROR_MSG,
      });
      console.log(err);
    } finally {
      setLoggedIn(false);
      setCurrentUser({});
      history.push("/");
    }
  };

  const updateUser = (user) => {
    setCurrentUser(user);
  };

  return {
    currentUser,
    loggedIn,
    handleSignin,
    handleSignup,
    handleSignout,
    updateUser,
  };
}
