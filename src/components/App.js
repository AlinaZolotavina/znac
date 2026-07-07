import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

import GalleryRoot from "./GalleryRoot.js";
import BlogRoot from "./BlogRoot.js";
import ResetPassword from "./ResetPassword";
import PasswordChanged from "./PasswordChanged";
import SignIn from "./SignIn";
import ForgotPassword from "./ForgotPassword";

import EditEmailModal from "./EditEmailModal";
import EditPasswordModal from "./EditPasswordModal";
import Modal from "./Modal";

import useAuth from "../hooks/useAuth";
import useRequestState from "../hooks/useRequestStatus";

import api from "../utils/api";
import * as auth from "../utils/auth.js";
import * as messages from "../utils/messages";

function App() {
  const { isLoading, startLoading, stopLoading } = useRequestState();

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

  function closeAppPopups() {
    setIsEditEmailModalOpen(false);
    setIsEditPasswordModalOpen(false);
  }

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // history & location
  const navigate = useNavigate();

  // popups & modals
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: null, // 'success' | 'error' | null
    type: "default", // 'default' | 'email'
    message: "",
  });

  // password reset
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

  // e-mail change
  function handleEditEmailBtnClick() {
    setIsEditEmailModalOpen(!isEditEmailModalOpen);
  }

  function handleEmailChangeRequest(newEmail) {
    startLoading();
    localStorage.setItem("email", JSON.stringify(newEmail));
    api
      .requestEmailUpdate(newEmail.email, currentUser.email)
      .then(() => {
        openModal({
          status: "success",
          message: messages.UPDATE_EMAIL_EMAIL_SENT_MSG,
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.EMAIL_UPDATE_REQUEST_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  function handleUpdateEmail(updateEmailLink, newEmail) {
    api
      .updateEmail(updateEmailLink, newEmail)
      .then((data) => {
        setCurrentUser(data.user);
        navigate("/profile");
        openModal({
          status: "success",
          message: messages.EMAIL_UPDATED_SUCCESSFULLY_MSG,
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.EMAIL_UPDATE_ERROR_MSG,
        });
      });
  }

  // handle app navigation & mark active navigation block / page
  function handleEditPasswordBtnClick() {
    setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
  }

  const { currentUser, loggedIn, handleSignin, handleSignout, setCurrentUser } =
    useAuth({
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
              currentUser={currentUser}
              handleSignout={handleSignout}
              isLoading={isLoading}
              handleEditEmailBtnClick={handleEditEmailBtnClick}
              handleEditPasswordBtnClick={handleEditPasswordBtnClick}
              handleUpdateEmail={handleUpdateEmail}
              openModal={openModal}
              startLoading={startLoading}
              stopLoading={stopLoading}
              screenWidth={screenWidth}
              setScreenWidth={setScreenWidth}
              closeModal={closeModal}
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
      </Routes>

      <EditEmailModal
        isOpen={isEditEmailModalOpen}
        onClose={closeAppPopups}
        isSendingReq={isLoading}
        onRequestEmailChange={handleEmailChangeRequest}
      />

      <EditPasswordModal
        isOpen={isEditPasswordModalOpen}
        onClose={closeAppPopups}
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
