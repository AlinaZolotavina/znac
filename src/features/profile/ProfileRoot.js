import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Profile from "./components/Profile";
import ConfirmEmailUpdate from "./components/ConfirmEmailUpdate";
import NotFound from "../../app/components/NotFound";
import ProtectedRoute from "../../app/components/ProtectedRoute";

import EditEmailModal from "./components/EditEmailModal";
import EditPasswordModal from "./components/EditPasswordModal";

import api from "../../shared/utils/api";
import * as messages from "../../shared/utils/messages";

function ProfileRoot({
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

  function closeProfilePopups() {
    setIsEditEmailModalOpen(false);
    setIsEditPasswordModalOpen(false);
  }

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
        closeProfilePopups();
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

  function handleEditPasswordBtnClick() {
    setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
  }

  function handleUpdatePassword(passwordData) {
    startLoading();

    api
      .updatePassword(passwordData)
      .then((data) => {
        closeProfilePopups();
        openModal({
          status: "success",
          message: data.message || messages.PASSWORD_UPDATED_SUCCESSFULLY_MSG,
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.PASSWORD_UPDATE_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  return (
    <>
      <Routes>
        <Route
          index
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
        <Route path="*" element={<NotFound />} />
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
        isSendingReq={isLoading}
        onUpdatePassword={handleUpdatePassword}
      />
    </>
  );
}

export default ProfileRoot;
