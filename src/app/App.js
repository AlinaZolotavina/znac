import { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

import GalleryRoot from "../features/gallery/GalleryRoot";
import ProfileRoot from "../features/profile/ProfileRoot";
import BlogRoot from "../features/blog/BlogRoot";
import ResetPassword from "../features/auth/components/ResetPassword";
import PasswordChanged from "../features/auth/components/PasswordChanged";
import SignIn from "../features/auth/components/SignIn";
import ForgotPassword from "../features/auth/components/ForgotPassword";

import MainMenu from "./components/MainMenu.jsx";
import Modal from "./components/Modal.js";
import MainPage from "./components/MainPage.jsx";

import * as auth from "../shared/utils/auth.js";
import {
  DEFAULT_ERROR_MSG,
  RESET_PASSWORD_EMAIL_SENT_MSG,
} from "../shared/utils/messages.js";

import useAuth from "../features/auth/hooks/useAuth.js";
import useRequestState from "../shared/hooks/useRequestStatus.js";

function App() {
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = useRequestState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: null, // 'success' | 'error' | null
    type: "default", // 'default' | 'email'
    message: "",
  });

  const openModal = useCallback(({ status, message, type = "default" }) => {
    setModalState({
      isOpen: true,
      status,
      type,
      message,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      status: null,
      type: "default",
      message: "",
    });
  }, []);

  function openMenu() {
    setIsMenuOpen(true);
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // password reset
  function handleReceiveResetPasswordLink(email) {
    startLoading();
    auth
      .forgotPassword(email)
      .then(() => {
        // тут надо открыть свой модал или удалить его, если используется универсальный
        openModal({
          status: "success",
          type: "email",
          message: RESET_PASSWORD_EMAIL_SENT_MSG,
        });
      })
      .then(() => navigate("/"))
      .catch(() => {
        openModal({
          status: "error",
          message: DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  function handleResetPassword(
    newPassword,
    confirmPassword,
    resetPasswordLink,
  ) {
    startLoading();
    auth
      .resetPassword(newPassword, confirmPassword, resetPasswordLink)
      .then(() => {
        navigate("/password-changed");
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  const {
    currentUser,
    loggedIn,
    isAuthInitialized,
    handleSignin,
    handleSignout,
    setCurrentUser,
  } = useAuth({
    openModal,
    startLoading,
    stopLoading,
  });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              loggedIn={loggedIn}
              currentUser={currentUser}
              handleSignout={handleSignout}
            />
          }
        />

        <Route
          path="/gallery/*"
          element={
            <GalleryRoot
              loggedIn={loggedIn}
              isAuthInitialized={isAuthInitialized}
              handleSignout={handleSignout}
              isLoading={isLoading}
              openModal={openModal}
              startLoading={startLoading}
              stopLoading={stopLoading}
              screenWidth={screenWidth}
              setScreenWidth={setScreenWidth}
              closeModal={closeModal}
              onMenuClick={openMenu}
            />
          }
        />

        <Route
          path="/profile/*"
          element={
            <ProfileRoot
              loggedIn={loggedIn}
              isAuthInitialized={isAuthInitialized}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              isLoading={isLoading}
              startLoading={startLoading}
              stopLoading={stopLoading}
              openModal={openModal}
              onMenuClick={openMenu}
              handleSignout={handleSignout}
            />
          }
        />

        <Route
          path="/journal/*"
          element={
            <BlogRoot
              loggedIn={loggedIn}
              currentUser={currentUser}
              handleSignout={handleSignout}
              isLoading={isLoading}
              openModal={openModal}
              startLoading={startLoading}
              stopLoading={stopLoading}
              screenWidth={screenWidth}
              setModalState={setModalState}
            />
          }
        />

        <Route
          path="/signin"
          element={<SignIn onSignin={handleSignin} isSendingReq={isLoading} />}
        />

        {/* New users registration is disabled*/}
        {/* <Route path="/signup" element={
          <SignUp onSignup={handleSignup} isSendingReq={isLoading} />
        } /> */}

        <Route
          path="/signin/recovery"
          element={
            <ForgotPassword
              onReceiveEmail={handleReceiveResetPasswordLink}
              isSendingReq={isLoading}
            />
          }
        />

        <Route
          path="/reset-password/:resetPasswordLink"
          element={
            <ResetPassword
              onResetPassword={handleResetPassword}
              isSendingReq={isLoading}
            />
          }
        />

        <Route path="/password-changed" element={<PasswordChanged />} />
      </Routes>

      <MainMenu
        isOpen={isMenuOpen}
        loggedIn={loggedIn}
        onClose={closeMenu}
        onLogout={() => {
          closeMenu();
          handleSignout();
        }}
      />

      <Modal
        isOpen={modalState.isOpen}
        status={modalState.status}
        type={modalState.type}
        onClose={closeModal}
        message={modalState.message}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
