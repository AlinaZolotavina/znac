import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import BlogMainPage from "./components/BlogMainPage.js";
import PostsPage from "./components/PostsPage.js";
import ProjectsPage from "./components/ProjectsPage.js";
import AboutPage from "./components/AboutPage.js";
import GamesPage from "./components/GamesPage.js";
import CurrentPostPage from "./components/CurrentPostPage.js";
import ComingSoon from "./components/ComingSoon.js";
import NotFound from "../../app/components/NotFound.js";

import BlogMenu from "./components/BlogMenu.js";
import GetInTouchPopup from "./components/GetInTouchPopup.js";
import NewProjectPopup from "./components/NewProjectPopup.js";
import NewPostPopup from "./components/NewPostPopup.js";
import EditPostPopup from "./components/EditPostPopup.js";
import EditProjectPopup from "./components/EditProjectPopup.js";
import DeletePostModal from "./components/DeletePostModal.js";
import DeleteProjectModal from "./components/DeleteProjectModal.js";

import api from "../../shared/utils/api.js";
import {
  CONTACT_MESSAGE_ERROR_MSG,
  CONTACT_MESSAGE_SENT_MSG,
} from "../../shared/utils/messages.js";

import useProjects from "./hooks/useProjects.js";
import usePosts from "./hooks/usePosts.js";
import useRequestState from "../../shared/useRequestStatus.js";

import getCurrentActivePage from "./utils/getCurrentActivePage.js";

function BlogLayout({
  loggedIn,
  currentUser,
  isLoading,
  openModal,
  startLoading,
  stopLoading,
  screenWidth,
  setScreenWidth,
  modalState,
  setModalState,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);
  const [isGetInTouchPopupOpen, setIsGetInTouchPopupOpen] = useState(false);
  const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);
  const [isEditPostPopupOpen, setIsEditPostPopupOpen] = useState(false);
  const [isEditProjectPopupOpen, setIsEditProjectPopupOpen] = useState(false);
  const [isNewProjectPopupOpen, setIsNewProjectPopupOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
    useState(false);
  const isAlinaRoute = location.pathname.startsWith("/alina");
  const [projectHashtags, setProjectHashtags] = useState([]);
  const [activePostHashtag, setActivePostHashtag] = useState("All");
  const [activeProjectHashtag, setActiveProjectHashtag] = useState("All");
  const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);
  const [query, setQuery] = useState("");
  const [activeBlogPage, setActiveBlogPage] = useState("Home");

  useEffect(() => {
    if (!isAlinaRoute || projectHashtags.length > 0) {
      return;
    }
    api
      .getProjectHashtags()
      .then((hashtags) => {
        setProjectHashtags(hashtags);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isAlinaRoute, projectHashtags.length]);

  useEffect(() => {
    setQuery("");
    setActivePostHashtag("All");
    setActiveProjectHashtag("All");
  }, [location.pathname]);

  useEffect(() => {
    const currentPage = getCurrentActivePage(location.pathname);
    if (currentPage === "alina") {
      setActiveBlogPage("Home");
    } else {
      setActiveBlogPage(currentPage);
    }
  }, [location.pathname]);

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

  function handlePostClick(post) {
    navigate(`/alina/posts/${post._id}`);
  }

  function moveToPreviousPage() {
    navigate(-1);
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

  const closeAllBlogPopups = useCallback(() => {
    setIsPostPopupOpen(false);
    setIsEditPostPopupOpen(false);
    setIsEditProjectPopupOpen(false);
    setIsNewProjectPopupOpen(false);
    setIsDeletePostModalOpen(false);
    setIsDeleteProjectModalOpen(false);
    setRedirectAfterDelete(false);
  }, []);

  const closeBlogMenu = useCallback(() => {
    setIsBlogMenuOpen(false);
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
    postsToRender,
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

  const {
    isLoading: isContactSending,
    startLoading: startContactSending,
    stopLoading: stopContactSending,
  } = useRequestState();

  const handleKeyPress = useCallback(
    (e) => {
      const { keyCode } = e;
      if (keyCode === 27) {
        closeAllBlogPopups();
      }
    },
    [closeAllBlogPopups],
  );

  const handleOverlayClickClose = useCallback(
    (e) => {
      if (
        e.target.classList.contains("popup_is-opened") ||
        e.target.classList.contains("popup__close-btn")
      ) {
        closeAllBlogPopups();
      }
    },
    [closeAllBlogPopups],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleOverlayClickClose);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleOverlayClickClose);
    };
  }, [handleKeyPress, handleOverlayClickClose]);

  useEffect(() => {
    calculatePostsCount();
    calculateProjectsCount();
  }, [calculatePostsCount, calculateProjectsCount]);

  const handleSendContactMessage = ({ name, email, message }) => {
    startContactSending();

    return api
      .sendContactMessage({ name, email, message })
      .then(() => {
        setModalState({
          isOpen: true,
          status: "success",
          type: "default",
          message: CONTACT_MESSAGE_SENT_MSG,
        });

        return true;
      })
      .catch((err) => {
        setModalState({
          isOpen: true,
          status: "error",
          type: "default",
          message: err.message || CONTACT_MESSAGE_ERROR_MSG,
        });

        return false;
      })
      .finally(() => {
        stopContactSending();
      });
  };
  return (
    <>
      <Routes>
        <Route
          index
          element={
            <BlogMainPage
              loggedIn={loggedIn}
              postsToRender={postsToRender}
              projectsToRender={projectsToRender}
              projectsQuantity={2}
              onBlogMenuClick={handleBlogMenuClick}
              onContactClick={handleBlogContactClick}
              onNewPostClick={handleNewPostPopupOpen}
              onNewProjectClick={handleNewProjectPopupOpen}
              onViewAllPostsClick={viewAllPostsClick}
              onViewAllProjectsClick={viewAllProjectsClick}
              onPostClick={handlePostClick}
              onEditPostButtonClick={handleEditPostPopupOpen}
              onDeletePostButtonClick={handleDeletePostModalOpen}
              onEditProjectButtonClick={handleEditProjectPopupOpen}
              onDeleteProjectButtonClick={handleDeleteProjectModalOpen}
              onHomeClick={moveToHomePage}
              onPostsClick={moveToPostsPage}
              onProjectsClick={moveToProjectsPage}
              onAboutClick={moveToAboutPage}
            />
          }
        />

        <Route
          path="posts"
          element={
            <PostsPage
              loggedIn={loggedIn}
              activePage={activeBlogPage}
              postsToRender={postsToRender}
              onNewPostClick={handleNewPostPopupOpen}
              onEditPostButtonClick={handleEditPostPopupOpen}
              onDeletePostButtonClick={handleDeletePostModalOpen}
              onBlogMenuClick={handleBlogMenuClick}
              onContactClick={handleBlogContactClick}
              onPostsSearch={handlePostsSearch}
              onPostClick={handlePostClick}
              hasMorePosts={hasMorePosts}
              postsQuantity={currentPostsNumber}
              onShowMorePosts={showMorePosts}
              isLoading={isLoading}
              query={query}
              querySetter={setQuery}
              onPostHashtagClick={handlePostHashtagClick}
              activeHashtag={activePostHashtag}
            />
          }
        />

        <Route
          path="posts/:id"
          element={
            <CurrentPostPage
              activePage="posts"
              onBlogMenuClick={handleBlogMenuClick}
              onContactClick={handleBlogContactClick}
              onBackButtonClick={moveToPreviousPage}
              onEditPostButtonClick={handleEditPostPopupOpen}
              onDeletePostButtonClick={handleDeletePostModalOpen}
              loggedIn={loggedIn}
              postVersion={postVersion}
              openModal={openModal}
            />
          }
        />

        <Route
          path="projects"
          element={
            <ProjectsPage
              loggedIn={loggedIn}
              activePage={activeBlogPage}
              hashtags={projectHashtags}
              activeProjectHashtag={activeProjectHashtag}
              projectsToRender={projectsToRender}
              hasMoreProjects={hasMoreProjects}
              onNewProjectClick={handleNewProjectPopupOpen}
              onBlogMenuClick={handleBlogMenuClick}
              onContactClick={handleBlogContactClick}
              projectsQuantity={currentProjectsNumber}
              onShowMoreProjects={showMoreProjects}
              onEditProjectButtonClick={handleEditProjectPopupOpen}
              onDeleteProjectButtonClick={handleDeleteProjectModalOpen}
              onProjectHashtagClick={handleProjectHashtagClick}
            />
          }
        />

        <Route
          path="about"
          element={
            <AboutPage
              loggedIn={loggedIn}
              activePage={activeBlogPage}
              projectsToRender={projectsToRender}
              onBlogMenuClick={handleBlogMenuClick}
              onContactClick={handleBlogContactClick}
              onAddProjectClick={handleNewProjectPopupOpen}
              onGamesClick={handleGamesClick}
              onMusicClick={handleMusicClick}
            />
          }
        />

        <Route
          path="games"
          element={<GamesPage onTicTacToeClick={moveToTicTacToePage} />}
        />

        <Route path="games/tic-tac-toe" element={<ComingSoon />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

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
    </>
  );
}

export default BlogLayout;
