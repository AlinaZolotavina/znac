import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Profile from "./Profile";
import ConfirmEmailUpdate from "./ConfirmEmailUpdate";
import ProtectedRoute from "./ProtectedRoute";

import EditEmailModal from "./EditEmailModal";
import EditPasswordModal from "./EditPasswordModal";

import api from "../utils/api";
import * as messages from "../utils/messages";

function ProFileRoot({
  loggedIn,
  isAuthInitialized,
  currentUser,
  setCurrentUser,
  isLoading,
  startLoading,
  stopLoading,
  openModal,
  onMenuClick,
  handleSignout,
}) {
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleEditEmailBtnClick() {
    setIsEditEmailModalOpen(!isEditEmailModalOpen);
  }

  function handleEditPasswordBtnClick() {
    setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
  }

  function closeProfilePopups() {
    setIsEditEmailModalOpen(false);
    setIsEditPasswordModalOpen(false);
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
  return (
    <>
      <Routes>
        <Route
          path="profile/*"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              isAuthInitialized={isAuthInitialized}
            >
              <Profile
                loggedIn={loggedIn}
                onHomeClick={() => navigate("/")}
                onBlogClick={() => navigate("/alina")}
                onEditEmailBtnClick={handleEditEmailBtnClick}
                onEditPasswordBtnClick={handleEditPasswordBtnClick}
                onMenuClick={onMenuClick}
                onSignout={handleSignout}
                isSendingReq={isLoading}
                email={currentUser.email}
                onLogout={handleSignout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="update-email/:updateEmailLink"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              isAuthInitialized={isAuthInitialized}
            >
              <ConfirmEmailUpdate
                loggedIn={loggedIn}
                onUpdateEmail={handleUpdateEmail}
              />
            </ProtectedRoute>
          }
        />
      </Routes>

      <EditEmailModal
        isOpen={isEditEmailModalOpen}
        onClose={closeProfilePopups}
        isSendingReq={isLoading}
        onRequestEmailChange={handleEmailChangeRequest}
      />

      <EditPasswordModal
        isOpen={isEditPasswordModalOpen}
        onClose={closeProfilePopups}
      />
    </>
  );
}

export default ProFileRoot;
