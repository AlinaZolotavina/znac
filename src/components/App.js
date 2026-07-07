import { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

import GalleryRoot from "./GalleryRoot.js";
import BlogRoot from "./BlogRoot.js";
import ResetPassword from "./ResetPassword";
import PasswordChanged from "./PasswordChanged";
import SignIn from "./SignIn";
import ForgotPassword from "./ForgotPassword";
import NotFound from "./NotFound";

import Menu from "./Menu";
import Modal from "./Modal";

import * as auth from "../utils/auth.js";
import * as messages from "../utils/messages";

import useAuth from "../hooks/useAuth";
import useRequestState from "../hooks/useRequestStatus";
import ProfileRoot from "./ProfileRoot.js";

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

  const openModal = ({ status, message, type = "default" }) => {
    setModalState({
      isOpen: true,
      status,
      type,
      message,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      status: null,
      type: "default",
      message: "",
    });
  };

  function openMenu(e) {
    setIsMenuOpen(true);
    e.target.blur();
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const menuLinkClick = (linkName) => {
    navigate(linkName);
    closeMenu();
  };

  function handleReceiveResetPasswordLink(email) {
    startLoading();
    auth
      .forgotPassword(email)
      .then(() => {
        openModal({
          status: "success",
          type: "email",
          message: messages.RESET_PASSWORD_EMAIL_SENT_MSG,
        });
      })
      .then(() => navigate("/"))
      .catch(() => {
        openModal({
          status: "error",
          message: messages.DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  // password reset
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
          message: err.message || messages.DEFAULT_ERROR_MSG,
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
          path="/*"
          element={
            <GalleryRoot
              loggedIn={loggedIn}
              isAuthInitialized={isAuthInitialized}
              currentUser={currentUser}
              handleSignout={handleSignout}
              isLoading={isLoading}
              openModal={openModal}
              startLoading={startLoading}
              stopLoading={stopLoading}
              screenWidth={screenWidth}
              setScreenWidth={setScreenWidth}
              closeModal={closeModal}
              onMenuClick={openMenu}
              onMenuClose={closeMenu}
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
          path="/alina/*"
          element={
            <BlogRoot
              loggedIn={loggedIn}
              currentUser={currentUser}
              isLoading={isLoading}
              openModal={openModal}
              startLoading={startLoading}
              stopLoading={stopLoading}
              screenWidth={screenWidth}
              setScreenWidth={setScreenWidth}
              modalState={modalState}
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

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Menu
        isOpen={isMenuOpen}
        loggedIn={loggedIn}
        onHomeClick={() => menuLinkClick("/")}
        onProfileClick={() => menuLinkClick("profile")}
        onAddPhotoClick={() => menuLinkClick("addphoto")}
        onBlogClick={() => menuLinkClick("/alina")}
        onClose={closeMenu}
        onLogout={handleSignout}
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
