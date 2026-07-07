import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import BlogMainPage from "./blog/BlogMainPage.js";
import PostsPage from "./blog/PostsPage.js";
import ProjectsPage from "./blog/ProjectsPage.js";
import AboutPage from "./blog/AboutPage.js";
import GamesPage from "./blog/GamesPage.js";
import CurrentPostPage from "./blog/CurrentPostPage.js";
import BlogMenu from "./blog/BlogMenu.js";
import GetInTouchPopup from "./blog/GetInTouchPopup.js";
import NewProjectPopup from "./blog/NewProjectPopup.js";
import NewPostPopup from "./blog/NewPostPopup.js";
import EditPostPopup from "./blog/EditPostPopup.js";
import EditProjectPopup from "./blog/EditProjectPopup.js";
import DeletePostModal from "./blog/DeletePostModal.js";
import DeleteProjectModal from "./blog/DeleteProjectModal.js";

import api from "../utils/api";
import * as messages from "../utils/messages";

import useProjects from "../hooks/useProjects.js";
import usePosts from "../hooks/usePosts.js";
import useRequestState from "../hooks/useRequestStatus";

import getCurrentActivePage from "../utils/getCurrentActivePage.js";

function BlogRoot({
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
      .catch(console.error);
  }, [isAlinaRoute, projectHashtags.length]);

  // calculate photos count depending on screen demensions
  // (including when changing the screen resolution)
  useEffect(() => {
    calculatePostsCount();
    calculateProjectsCount();
  }, [screenWidth]);

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

export default BlogRoot;
