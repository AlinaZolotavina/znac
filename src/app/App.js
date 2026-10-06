import { useState, useCallback } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
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
import GetInTouchPopup from "./components/GetInTouchPopup.js";

import * as auth from "../shared/utils/auth.js";
import {
  CONTACT_MESSAGE_ERROR_MSG,
  CONTACT_MESSAGE_SENT_MSG,
  DEFAULT_ERROR_MSG,
  RESET_PASSWORD_EMAIL_SENT_MSG,
} from "../shared/utils/messages.js";
import api from "../shared/utils/api.js";

import useAuth from "../features/auth/hooks/useAuth.js";
import useRequestState from "../shared/hooks/useRequestStatus.js";

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoading, startLoading, stopLoading } = useRequestState();
  const {
    isLoading: isContactSending,
    startLoading: startContactSending,
    stopLoading: stopContactSending,
  } = useRequestState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGetInTouchPopupOpen, setIsGetInTouchPopupOpen] = useState(false);
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

  const openGetInTouchPopup = useCallback(() => {
    setIsGetInTouchPopupOpen(true);
  }, []);

  const closeGetInTouchPopup = useCallback(() => {
    setIsGetInTouchPopupOpen(false);
  }, []);

  const handleSendContactMessage = useCallback(
    ({ name, email, message }) => {
      startContactSending();

      return api
        .sendContactMessage({ name, email, message })
        .then(() => {
          openModal({
            status: "success",
            message: CONTACT_MESSAGE_SENT_MSG,
          });

          return true;
        })
        .catch((err) => {
          openModal({
            status: "error",
            message: err.message || CONTACT_MESSAGE_ERROR_MSG,
          });

          return false;
        })
        .finally(() => {
          stopContactSending();
        });
    },
    [openModal, startContactSending, stopContactSending],
  );

  // password reset
  function handleReceiveResetPasswordLink(email) {
    startLoading();
    auth
      .forgotPassword(email)
      .then(() => {
        // С‚СѓС‚ РЅР°РґРѕ РѕС‚РєСЂС‹С‚СЊ СЃРІРѕР№ РјРѕРґР°Р» РёР»Рё СѓРґР°Р»РёС‚СЊ РµРіРѕ, РµСЃР»Рё РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ СѓРЅРёРІРµСЂСЃР°Р»СЊРЅС‹Р№
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
  const getInTouchTheme = pathname.startsWith("/journal") ? "blog" : "main";

  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserContext.Provider value={currentUser}>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                loggedIn={loggedIn}
                handleSignout={handleSignout}
                isLoading={isLoading}
                openModal={openModal}
                startLoading={startLoading}
                stopLoading={stopLoading}
                onContactClick={openGetInTouchPopup}
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
                isMenuOpen={isMenuOpen}
                onContactClick={openGetInTouchPopup}
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
                isMenuOpen={isMenuOpen}
                onContactClick={openGetInTouchPopup}
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
                onContactClick={openGetInTouchPopup}
              />
            }
          />

          <Route
            path="/signin"
            element={
              <SignIn
                loggedIn={loggedIn}
                onLogout={handleSignout}
                onMenuClick={openMenu}
                isMenuOpen={isMenuOpen}
                menuId="app-main-menu"
                onSignin={handleSignin}
                isSendingReq={isLoading}
                onContactClick={openGetInTouchPopup}
              />
            }
          />

          {/* New users registration is disabled*/}
          {/* <Route path="/signup" element={
            <SignUp
              loggedIn={loggedIn}
              onLogout={handleSignout}
              onMenuClick={openMenu}
              isMenuOpen={isMenuOpen}
              menuId="app-main-menu"
              onSignup={handleSignup}
              isSendingReq={isLoading}
              onContactClick={openGetInTouchPopup}
            />
          } /> */}

          <Route
            path="/signin/recovery"
            element={
              <ForgotPassword
                loggedIn={loggedIn}
                onLogout={handleSignout}
                onMenuClick={openMenu}
                isMenuOpen={isMenuOpen}
                menuId="app-main-menu"
                onReceiveEmail={handleReceiveResetPasswordLink}
                isSendingReq={isLoading}
                onContactClick={openGetInTouchPopup}
              />
            }
          />

          <Route
            path="/reset-password/:resetPasswordLink"
            element={
              <ResetPassword
                loggedIn={loggedIn}
                onLogout={handleSignout}
                onMenuClick={openMenu}
                isMenuOpen={isMenuOpen}
                menuId="app-main-menu"
                onResetPassword={handleResetPassword}
                isSendingReq={isLoading}
                onContactClick={openGetInTouchPopup}
              />
            }
          />

          <Route
            path="/password-changed"
            element={
              <PasswordChanged
                loggedIn={loggedIn}
                onLogout={handleSignout}
                onMenuClick={openMenu}
                isMenuOpen={isMenuOpen}
                menuId="app-main-menu"
                onContactClick={openGetInTouchPopup}
              />
            }
          />
        </Routes>

        <MainMenu
          isOpen={isMenuOpen}
          loggedIn={loggedIn}
          onClose={closeMenu}
          onLogout={() => {
            closeMenu();
            handleSignout();
          }}
          theme="main"
          menuId="app-main-menu"
        />

        <Modal
          isOpen={modalState.isOpen}
          status={modalState.status}
          type={modalState.type}
          onClose={closeModal}
          message={modalState.message}
        />

        <GetInTouchPopup
          isOpen={isGetInTouchPopupOpen}
          isSendingReq={isContactSending}
          onClose={closeGetInTouchPopup}
          onSubmit={handleSendContactMessage}
          theme={getInTouchTheme}
        />
      </CurrentUserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
