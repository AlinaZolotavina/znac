import React, { useState, useEffect, useRef, useCallback } from "react";

import useAuth from "../hooks/useAuth";
import useRequestState from "../hooks/useRequestStatus";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditEmailModal from "./EditEmailModal";
import EditPasswordModal from "./EditPasswordModal";
import Menu from "./Menu";
import Modal from "./Modal";
import api from "../utils/api";
import scrollToRef from "../utils/scrollToRef";
import * as auth from "../utils/auth.js";

import { useLocation, useNavigate } from "react-router-dom";

import * as messages from "../utils/messages";

import BlogMenu from "./blog/BlogMenu.js";
import GetInTouchPopup from "./blog/GetInTouchPopup.js";
import NewProjectPopup from "./blog/NewProjectPopup.js";
import NewPostPopup from "./blog/NewPostPopup.js";
import EditPostPopup from "./blog/EditPostPopup.js";
import EditProjectPopup from "./blog/EditProjectPopup.js";
import DeletePostModal from "./blog/DeletePostModal.js";
import DeleteProjectModal from "./blog/DeleteProjectModal.js";

import getCurrentActivePage from "../utils/getCurrentActivePage.js";

import AppRoutes from "./AppRoutes.js";

import useProjects from "../hooks/useProjects.js";
import usePosts from "../hooks/usePosts.js";

function App() {
  const { isLoading, startLoading, stopLoading } = useRequestState();
  const {
    isLoading: isContactSending,
    startLoading: startContactSending,
    stopLoading: stopContactSending,
  } = useRequestState();

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

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // history & location
  const navigate = useNavigate();
  const location = useLocation();
  const isAlinaRoute = location.pathname.startsWith("/alina");

  // popups & modals
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: null, // 'success' | 'error' | null
    type: "default", // 'default' | 'email'
    message: "",
  });

  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);
  const [isGetInTouchPopupOpen, setIsGetInTouchPopupOpen] = useState(false);
  const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);
  const [isEditPostPopupOpen, setIsEditPostPopupOpen] = useState(false);
  const [isEditProjectPopupOpen, setIsEditProjectPopupOpen] = useState(false);
  const [isNewProjectPopupOpen, setIsNewProjectPopupOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
    useState(false);
  const [query, setQuery] = useState("");
  const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);

  const [projectHashtags, setProjectHashtags] = useState([]);
  const [activePostHashtag, setActivePostHashtag] = useState("All");
  const [activeProjectHashtag, setActiveProjectHashtag] = useState("All");
  const [activeBlogPage, setActiveBlogPage] = useState("Home");

  const closeAllBlogPopups = useCallback(() => {
    setIsPostPopupOpen(false);
    setIsEditPostPopupOpen(false);
    setIsEditProjectPopupOpen(false);
    setIsNewProjectPopupOpen(false);
    setIsDeletePostModalOpen(false);
    setIsDeleteProjectModalOpen(false);
    setRedirectAfterDelete(false);
  }, []);

  const closeAllPopups = useCallback(() => {
    setIsEditEmailModalOpen(false);
    setIsEditPasswordModalOpen(false);
    closeModal();
  }, []);

  const closeBlogMenu = useCallback(() => {
    setIsBlogMenuOpen(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const {
    projectsToRender,
    currentProjectsNumber,
    hasMoreProjects,
    calculateProjectsCount,
    showMoreProjects,
    handleProjectHashtagClick,
    handleAddProject,
    handleEditProject,
    handleEditProjectPopupOpen,
    projectToEdit,
    handleProjectDelete,
    handleDeleteProjectModalOpen,
    projectToDelete,
  } = useProjects({
    screenWidth,
    isAlinaRoute,
    openModal,
    activeProjectHashtag,
    setActiveProjectHashtag,
    startLoading,
    stopLoading,
    closeAllBlogPopups,
    setIsEditProjectPopupOpen,
    setIsDeleteProjectModalOpen,
  });

  const {
    allPosts,
    postsToRender,
    setPostsToRender,
    currentPostsNumber,
    hasMorePosts,
    calculatePostsCount,
    showMorePosts,
    handlePostHashtagClick,
    handlePostsSearch,
    handleAddPost,
    handleEditPostPopupOpen,
    postToEdit,
    handleEditPost,
    handleDeletePostModalOpen,
    handlePostDelete,
    postToDelete,
    postVersion,
  } = usePosts({
    screenWidth,
    isAlinaRoute,
    query,
    setQuery,
    activePostHashtag,
    setActivePostHashtag,
    startLoading,
    stopLoading,
    openModal,
    closeAllBlogPopups,
    setIsEditPostPopupOpen,
    setIsDeletePostModalOpen,
    setRedirectAfterDelete,
    redirectAfterDelete,
  });

  useEffect(() => {
    if (!isAlinaRoute || projectHashtags.length > 0) {
      return;
    }
    api
      .getProjectHashtags()
      .then((hashtags) => {
        setProjectHashtags(hashtags);
      })
      .catch(console.error);
  }, [isAlinaRoute, projectHashtags.length]);

  // calculate photos count depending on screen demensions
  // (including when changing the screen resolution)
  useEffect(() => {
    calculatePostsCount();
    calculateProjectsCount();
  }, [screenWidth]);

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
  const homeRef = useRef(null);
  const mainRef = useRef(null);
  const footerRef = useRef(null);

  function handleHomeClick() {
    navigate("/");

    requestAnimationFrame(() => {
      scrollToRef(homeRef);
    });
  }

  function handleGalleryClick() {
    scrollToRef(mainRef);
  }

  function handleContactClick() {
    scrollToRef(footerRef);
  }

  function handleProfileClick() {
    closeMenu();
    navigate("/profile");
  }

  function handleAddPhotoClick() {
    closeMenu();
    navigate("/addphoto");
  }

  function handleEditPasswordBtnClick() {
    setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
  }

  function handleMenuClick(e) {
    setIsMenuOpen(!isMenuOpen);
    e.target.blur();
  }

  // close popups and modals by close btn, ESC and overlay click;
  // flip photos by keyboard arrows;
  // close menu;
  const handleKeyPress = useCallback(
    (e) => {
      const { keyCode } = e;
      if (keyCode === 27) {
        closeAllPopups();
        closeAllBlogPopups();
        closeMenu();
        closeBlogMenu();
      }
    },
    [closeAllPopups, closeAllBlogPopups, closeMenu, closeBlogMenu],
  );

  const handleOverlayClickClose = useCallback(
    (e) => {
      if (
        e.target.classList.contains("popup_is-opened") ||
        e.target.classList.contains("popup__close-btn")
      ) {
        closeAllPopups();
        closeAllBlogPopups();
      }
    },
    [closeAllPopups, closeAllBlogPopups],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleOverlayClickClose);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleOverlayClickClose);
    };
  }, [handleKeyPress, handleOverlayClickClose]);

  ////////////////////////////  BLOG  ///////////////////////////////////////

  function viewAllPostsClick() {
    navigate("./alina/posts");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function viewAllProjectsClick() {
    navigate("./alina/projects");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleNewPostPopupOpen() {
    setIsPostPopupOpen(true);
  }

  function handleNewProjectPopupOpen() {
    setIsNewProjectPopupOpen(true);
  }

  function handleBlogContactClick() {
    setIsGetInTouchPopupOpen(true);
  }

  const closeGetInTouchPopup = () => {
    setIsGetInTouchPopupOpen(false);
  };

  function handleBlogMenuClick(e) {
    setIsBlogMenuOpen(!isBlogMenuOpen);
    e.target.blur();
  }

  useEffect(() => {
    setQuery("");
    setActivePostHashtag("All");
    setActiveProjectHashtag("All");
  }, [location.pathname]);

  useEffect(() => {
    if ((query === "" || !query) && activePostHashtag === "All") {
      setPostsToRender(allPosts);
    } else if ((query === "" || !query) && activePostHashtag !== "All") {
      setPostsToRender(
        allPosts.filter((post) => post.theme === activePostHashtag),
      );
    }
  }, [query, activePostHashtag]);

  function handlePostClick(post) {
    navigate(`/alina/posts/${post._id}`);
  }

  useEffect(() => {
    const currentPage = getCurrentActivePage(location.pathname);
    if (currentPage === "alina") {
      setActiveBlogPage("Home");
    } else {
      setActiveBlogPage(currentPage);
    }
  }, [location.pathname]);

  function moveToHomePage() {
    navigate("/alina");
    closeBlogMenu();
  }
  function moveToPostsPage() {
    closeBlogMenu();
  }
  function moveToProjectsPage() {
    closeBlogMenu();
  }

  function moveToAboutPage() {
    closeBlogMenu();
  }
  function moveToPreviousPage() {
    navigate(-1);
  }

  function handleBlogClick() {
    window.scrollTo(0, 0);
    closeMenu();
  }
  function handleGamesClick() {
    navigate("/alina/games");
  }

  function moveToTicTacToePage() {
    navigate("/alina/games/tic-tac-toe");
  }

  function handleMusicClick() {
    window.open(
      "https://open.spotify.com/playlist/6jhUvEAvi9laleDSaEenSK?si=m-_cgJDpRH-buMRqXpS6WA&pi=e-5IWoIJ-1TL-8",
      "_blank",
      "noopener,noreferrer",
    );
  }

  const handleSendContactMessage = ({ name, email, message }) => {
    startContactSending();

    return api
      .sendContactMessage({ name, email, message })
      .then(() => {
        setModalState({
          isOpen: true,
          status: "success",
          type: "default",
          message: messages.CONTACT_MESSAGE_SENT_MSG,
        });

        return true;
      })
      .catch((err) => {
        setModalState({
          isOpen: true,
          status: "error",
          type: "default",
          message: err.message || messages.CONTACT_MESSAGE_ERROR_MSG,
        });

        return false;
      })
      .finally(() => {
        stopContactSending();
      });
  };

  const { currentUser, loggedIn, handleSignin, handleSignout, setCurrentUser } =
    useAuth({
      openModal,
      startLoading,
      stopLoading,
    });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <AppRoutes
        loggedIn={loggedIn}
        currentUser={currentUser}
        homeRef={homeRef}
        mainRef={mainRef}
        footerRef={footerRef}
        handleSignin={handleSignin}
        handleSignout={handleSignout}
        handleHomeClick={handleHomeClick}
        handleBlogClick={handleBlogClick}
        handleGalleryClick={handleGalleryClick}
        handleContactClick={handleContactClick}
        handleMenuClick={handleMenuClick}
        isLoading={isLoading}
        postsToRender={postsToRender}
        projectsToRender={projectsToRender}
        handleBlogMenuClick={handleBlogMenuClick}
        handleBlogContactClick={handleBlogContactClick}
        handleNewPostPopupOpen={handleNewPostPopupOpen}
        handleNewProjectPopupOpen={handleNewProjectPopupOpen}
        viewAllPostsClick={viewAllPostsClick}
        viewAllProjectsClick={viewAllProjectsClick}
        handlePostClick={handlePostClick}
        openModal={openModal}
        handleEditPostPopupOpen={handleEditPostPopupOpen}
        handleDeletePostModalOpen={handleDeletePostModalOpen}
        handleEditProjectPopupOpen={handleEditProjectPopupOpen}
        handleDeleteProjectModalOpen={handleDeleteProjectModalOpen}
        moveToHomePage={moveToHomePage}
        moveToPostsPage={moveToPostsPage}
        moveToProjectsPage={moveToProjectsPage}
        moveToAboutPage={moveToAboutPage}
        activeBlogPage={activeBlogPage}
        handlePostsSearch={handlePostsSearch}
        hasMorePosts={hasMorePosts}
        currentPostsNumber={currentPostsNumber}
        showMorePosts={showMorePosts}
        query={query}
        setQuery={setQuery}
        handlePostHashtagClick={handlePostHashtagClick}
        activePostHashtag={activePostHashtag}
        moveToPreviousPage={moveToPreviousPage}
        postVersion={postVersion}
        projectHashtags={projectHashtags}
        activeProjectHashtag={activeProjectHashtag}
        hasMoreProjects={hasMoreProjects}
        currentProjectsNumber={currentProjectsNumber}
        showMoreProjects={showMoreProjects}
        handleProjectHashtagClick={handleProjectHashtagClick}
        handleGamesClick={handleGamesClick}
        handleMusicClick={handleMusicClick}
        moveToTicTacToePage={moveToTicTacToePage}
        handleReceiveResetPasswordLink={handleReceiveResetPasswordLink}
        handleResetPassword={handleResetPassword}
        handleEditEmailBtnClick={handleEditEmailBtnClick}
        handleEditPasswordBtnClick={handleEditPasswordBtnClick}
        handleUpdateEmail={handleUpdateEmail}
        startLoading={startLoading}
        stopLoading={stopLoading}
        screenWidth={screenWidth}
        setScreenWidth={setScreenWidth}
        location={location}
      />

      <EditEmailModal
        isOpen={isEditEmailModalOpen}
        onClose={closeAllPopups}
        isSendingReq={isLoading}
        onRequestEmailChange={handleEmailChangeRequest}
      />

      <EditPasswordModal
        isOpen={isEditPasswordModalOpen}
        onClose={closeAllPopups}
      />

      <Menu
        isOpen={isMenuOpen}
        loggedIn={loggedIn}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onAddPhotoClick={handleAddPhotoClick}
        onGalleryClick={handleGalleryClick}
        onContactClick={handleContactClick}
        onBlogClick={handleBlogClick}
        onClose={closeMenu}
        onLogout={handleSignout}
      />

      <Modal
        isOpen={modalState.isOpen}
        status={modalState.status}
        type={modalState.type}
        onClose={closeAllPopups}
        message={modalState.message}
      />

      <BlogMenu
        isOpen={isBlogMenuOpen}
        activeBlogPage={activeBlogPage}
        onHomeClick={moveToHomePage}
        onPostsClick={moveToPostsPage}
        onProjectsClick={moveToProjectsPage}
        onAboutClick={moveToAboutPage}
        onClose={closeBlogMenu}
      />

      <GetInTouchPopup
        isOpen={isGetInTouchPopupOpen}
        isSendingReq={isContactSending}
        onClose={closeGetInTouchPopup}
        onSubmit={handleSendContactMessage}
      />

      <NewProjectPopup
        isOpen={isNewProjectPopupOpen}
        onClose={closeAllBlogPopups}
        onAddProject={handleAddProject}
        isSendingReq={isLoading}
      />

      <NewPostPopup
        isOpen={isPostPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isLoading}
        onAddPost={handleAddPost}
      />

      <EditPostPopup
        isOpen={isEditPostPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isLoading}
        post={postToEdit}
        onEditPost={handleEditPost}
      />
      <EditProjectPopup
        isOpen={isEditProjectPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isLoading}
        project={projectToEdit}
        onEditProject={handleEditProject}
      />

      <DeletePostModal
        post={postToDelete}
        isOpen={isDeletePostModalOpen}
        onClose={closeAllBlogPopups}
        onDeletePost={handlePostDelete}
      />

      <DeleteProjectModal
        project={projectToDelete}
        isOpen={isDeleteProjectModalOpen}
        onClose={closeAllBlogPopups}
        onDeleteProject={handleProjectDelete}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
