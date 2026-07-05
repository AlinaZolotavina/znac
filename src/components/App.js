import React, { useState, useEffect, useRef } from "react";

import useAuth from "../hooks/useAuth";
import useRequestState from "../hooks/useRequestStatus";
import usePhotos from "../hooks/usePhotos.js";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Home from "./Home";
import Main from "./Main";
import Footer from "./Footer";
import PhotoPopup from "./PhotoPopup";
import DeletePhotoModal from "./DeletePhotoModal";
import ProtectedRoute from "./ProtectedRoute";
import SignIn from "./SignIn";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import AddPhoto from "./AddPhoto";
import EditEmailModal from "./EditEmailModal";
import EditPasswordModal from "./EditPasswordModal";
import Menu from "./Menu";
import Modal from "./Modal";
import ConfirmEmailUpdate from "./ConfirmEmailUpdate";
import api from "../utils/api";
import scrollToRef from "../utils/scrollToRef";
import * as auth from "../utils/auth.js";

import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import { LARGE_SCREEN_WIDTH, MIDDLE_SCREEN_WIDTH } from "../utils/constants";
import * as messages from "../utils/messages";

import ResetPassword from "./ResetPassword";
import PasswordChanged from "./PasswordChanged";
import NotFound from "./NotFound";

import BlogMainPage from "./blog/BlogMainPage.js";
import PostsPage from "./blog/PostsPage.js";
import ProjectsPage from "./blog/ProjectsPage.js";
import AboutPage from "./blog/AboutPage.js";
import BlogMenu from "./blog/BlogMenu.js";
import GetInTouchPopup from "./blog/GetInTouchPopup.js";
import NewProjectPopup from "./blog/NewProjectPopup.js";
import NewPostPopup from "./blog/NewPostPopup.js";
import EditPostPopup from "./blog/EditPostPopup.js";
import EditProjectPopup from "./blog/EditProjectPopup.js";
import DeletePostModal from "./blog/DeletePostModal.js";
import DeleteProjectModal from "./blog/DeleteProjectModal.js";

import getCurrentActivePage from "../utils/getCurrentActivePage.js";

import CurrentPostPage from "./blog/CurrentPostPage.js";
import GamesPage from "./blog/GamesPage.js";
import { handlePhotoUpload } from "../utils/photoUploadActions.js";
import useProjects from "../hooks/useProjects.js";

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

  // history & location
  const history = useHistory();
  const location = useLocation();
  const isAlinaRoute = location.pathname.startsWith("/alina");

  // everything related to photos (including screen width, on which depends the photos to render count)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // popups & modals
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: null, // 'success' | 'error' | null
    type: "default", // 'default' | 'email'
    message: "",
  });
  const [hashtag, setHashtag] = useState(""); // search input
  const [lastHashtags, setLastHashtags] = useState([]);

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
  const [allPosts, setAllPosts] = useState([]);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [postsToRender, setPostsToRender] = useState([]);
  const [currentPostsNumber, setCurrentPostsNumber] = useState(3);
  const [postsToAdd, setPostsToAdd] = useState(0);
  const [postsPage, setPostsPage] = useState(1);
  const [postsPages, setPostsPages] = useState(1);
  const hasMorePosts =
    currentPostsNumber < allPosts.length || postsPage < postsPages;
  const [postToEdit, setPostToEdit] = useState({});
  const [postToDelete, setPostToDelete] = useState({});
  const [postVersion, setPostVersion] = useState(0);
  const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);

  const [projectHashtags, setProjectHashtags] = useState([]);
  const [activePostHashtag, setActivePostHashtag] = useState("All");
  const [activeProjectHashtag, setActiveProjectHashtag] = useState("All");
  const [activeBlogPage, setActiveBlogPage] = useState("Home");

  const {
    selectedPhoto,
    hashtagsOfSelectedPhoto,
    viewsOfSelectedPhoto,
    areHashtagsEditing,
    handleEditHashtagsBtnClick,
    handleEditHashtags,
    isLeftFlipDisabled,
    isRightFlipDisabled,
    handlePhotoFlip,
    handleAddPhotoViaLink,
    handlePhotoDelete,
    calculatePhotosCount,
    photosToRender,
    currentPhotosNumber,
    hasMorePhotos,
    showMorePhotos,
    handlePhotoSearch,
    handleClearPhotoSearch,
    handlePhotoHashtagClick,
    addPhotosToGallery,
    handlePhotoOpen,
    handleDeletePhotoModalOpen,
  } = usePhotos({
    openModal,
    startLoading,
    stopLoading,
    closeAllPopups,
    screenWidth,
    setScreenWidth,
    hashtag,
    setHashtag,
    lastHashtags,
    setLastHashtags,
    closeAllPopups,
    location,
    setIsPhotoPopupOpen,
    setIsDeletePhotoModalOpen,
  });

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

  useEffect(() => {
    setPostsToRender(allPosts.slice(0, currentPostsNumber));
  }, [allPosts, currentPostsNumber]);

  useEffect(() => {
    if (!isAlinaRoute || allPosts.length > 0) {
      return;
    }
    loadPosts();
  }, [isAlinaRoute, loadedPosts.length]);

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
    calculatePhotosCount();
    calculatePostsCount();
    calculateProjectsCount();
  }, [screenWidth]);

  const calculatePostsCount = () => {
    let initialPostsNumber;
    let nextPostsToAdd;
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      initialPostsNumber = 6;
      nextPostsToAdd = 4;
    } else if (screenWidth >= MIDDLE_SCREEN_WIDTH) {
      initialPostsNumber = 3;
      nextPostsToAdd = 3;
    } else {
      initialPostsNumber = 3;
      nextPostsToAdd = 2;
    }
    setPostsToAdd(nextPostsToAdd);
    setCurrentPostsNumber((current) => Math.max(current, initialPostsNumber));
  };

  function loadPosts({
    page = 1,
    append = false,
    search = "",
    theme = "All",
  } = {}) {
    const normalizedSearch = search.trim();
    const hasSearch = Boolean(normalizedSearch);
    const hasThemeFilter = theme && theme !== "All";
    const hasFilters = hasSearch || hasThemeFilter;

    return api
      .getPosts(page, 8, {
        search: normalizedSearch,
        theme,
      })
      .then((response) => {
        const { data, page: responsePage, pages } = response;

        // The current list is standard or filtering results
        setAllPosts((previousPosts) =>
          append ? [...previousPosts, ...data] : data,
        );

        // Update the source list cache only there are no filters
        if (!hasFilters) {
          setLoadedPosts((previousPosts) =>
            append ? [...previousPosts, ...data] : data,
          );
        }

        setPostsPage(responsePage);
        setPostsPages(pages);

        // For a new set of results (search / theme), use an adaptive initial quantity
        if (!append) {
          setCurrentPostsNumber((current) => Math.max(current, 3));
        }

        return response;
      })
      .catch(console.error);
  }

  function showMorePosts() {
    const nextVisibleCount = currentPostsNumber + postsToAdd;

    if (nextVisibleCount <= allPosts.length) {
      setCurrentPostsNumber(nextVisibleCount);
      return;
    }

    if (postsPage >= postsPages) {
      setCurrentPostsNumber(allPosts.length);
      return;
    }

    loadPosts({
      page: postsPage + 1,
      append: true,
      search: query,
      theme: activePostHashtag,
    }).then(() => {
      setCurrentPostsNumber((current) =>
        Math.min(current + postsToAdd, allPosts.length),
      );
    });
  }

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
      .then(() => history.push("/"))
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
        history.push("/password-changed");
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
        updateUser(data.user);
        history.push("/profile");
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
    history.push("/");

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
    history.push("/profile");
  }

  function handleAddPhotoClick() {
    closeMenu();
    history.push("/addphoto");
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
  const handleKeyPress = (e) => {
    const { keyCode } = e;
    if (keyCode === 27) {
      closeAllPopups();
      closeAllBlogPopups();
      closeMenu();
      closeBlogMenu();
    }
    if (isPhotoPopupOpen) {
      if (keyCode === 37 && !isLeftFlipDisabled) {
        handlePhotoFlip("left");
      }
      if (keyCode === 39 && !isRightFlipDisabled) {
        handlePhotoFlip("right");
      }
    }
    if (keyCode === 13 && isDeletePhotoModalOpen) {
      handlePhotoDelete(selectedPhoto);
    }
  };

  const handleOverlayClickClose = (e) => {
    if (
      e.target.classList.contains("popup_is-opened") ||
      e.target.classList.contains("popup__close-btn")
    ) {
      closeAllPopups();
      closeAllBlogPopups();
    }
  };

  useEffect(
    (e) => {
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("mousedown", handleOverlayClickClose);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
        window.removeEventListener("mousedown", handleOverlayClickClose);
      };
    },
    [
      photosToRender,
      selectedPhoto,
      isLeftFlipDisabled,
      isRightFlipDisabled,
      isPhotoPopupOpen,
      isDeletePhotoModalOpen,
    ],
  );

  function closeAllPopups() {
    setIsPhotoPopupOpen(false);
    setIsDeletePhotoModalOpen(false);
    setIsEditEmailModalOpen(false);
    setIsEditPasswordModalOpen(false);
    // setIsModalOpen(false);
    closeModal();
    // setIsEmailSentModalOpen(false);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  ////////////////////////////  BLOG  ///////////////////////////////////////

  function viewAllPostsClick() {
    history.push("./alina/posts");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function viewAllProjectsClick() {
    history.push("./alina/projects");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleNewPostPopupOpen() {
    setIsPostPopupOpen(true);
  }

  function handleEditPostPopupOpen(post) {
    setIsEditPostPopupOpen(true);
    setPostToEdit(post);
  }

  function handleNewProjectPopupOpen() {
    setIsNewProjectPopupOpen(true);
  }

  function handleBlogContactClick() {
    setIsGetInTouchPopupOpen(true);
  }

  function closeAllBlogPopups() {
    setIsPostPopupOpen(false);
    setIsEditPostPopupOpen(false);
    setIsEditProjectPopupOpen(false);
    setIsNewProjectPopupOpen(false);
    setIsDeletePostModalOpen(false);
    setIsDeleteProjectModalOpen(false);
    setRedirectAfterDelete(false);
  }

  const closeGetInTouchPopup = () => {
    setIsGetInTouchPopupOpen(false);
  };

  function handleBlogMenuClick(e) {
    setIsBlogMenuOpen(!isBlogMenuOpen);
    e.target.blur();
  }

  function closeBlogMenu() {
    setIsBlogMenuOpen(false);
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

  function handlePostsSearch(nextQuery) {
    const normalizedQuery = nextQuery.trim();
    const hasThemeFilter = activePostHashtag && activePostHashtag !== "All";

    setQuery(nextQuery);

    if (!normalizedQuery && !hasThemeFilter) {
      if (loadedPosts.length > 0) {
        setAllPosts(loadedPosts);
        setPostsPage(1);
        setPostsPages(Math.ceil(loadedPosts.length / 8));
        setCurrentPostsNumber(loadedPosts.length);
      } else {
        loadPosts({
          page: 1,
          search: "",
          theme: "All",
        });
      }

      return;
    }

    loadPosts({
      page: 1,
      search: normalizedQuery,
      theme: activePostHashtag,
    });
  }

  function handlePostHashtagClick(theme) {
    setActivePostHashtag(theme);
    loadPosts({
      page: 1,
      search: query,
      theme,
    });
  }

  async function handleAddPost(props) {
    startLoading();

    try {
      const addedPosts = [];

      const createPost = async (photoData = {}) => {
        const data = {
          theme: props.theme,
          icon: props.icon,
          title: props.title,
          hashtags: props.hashtags,
          text: props.text,
          ...photoData,
        };

        const newPost = await api.addPost(data);

        addedPosts.push(newPost);
      };

      if (props.photoData[0]?.length) {
        for (const file of props.photoData[0]) {
          const formData = new FormData();
          formData.append("images", file);

          const response = await api.uploadPhoto(formData, "/posts/image");

          const [{ filename }] = response.data;

          await createPost({
            photoFilename: filename,
          });
        }
      } else {
        await createPost();
      }

      setAllPosts((prev) => [...addedPosts, ...prev]);
      setPostsToRender((prev) => [...addedPosts, ...prev]);

      openModal({
        status: "success",
        message:
          addedPosts.length === 1
            ? messages.POST_ADDED_SUCCESSFULLY_MSG
            : `${addedPosts.length} posts were added successfully`,
      });

      closeAllBlogPopups();
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: err.message || messages.POST_ADD_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  }

  function handleEditPost(postId, props) {
    startLoading();

    const updatePost = (photoData = {}) => {
      const data = {
        theme: props.theme,
        icon: props.icon,
        title: props.title,
        hashtags: props.hashtags,
        text: props.text,
        ...photoData,
      };

      if (props.removePhoto && !data.newPhotoFilename && !data.newPhotoLink) {
        data.removePhoto = true;
      }

      return api.editPost(postId, data);
    };

    const request = props.photoData[0]?.length
      ? (() => {
          const formData = new FormData();
          formData.append("images", props.photoData[0][0]);

          return api.uploadPhoto(formData, "/posts/image").then((response) =>
            updatePost({
              newPhotoFilename: response.data[0].filename,
            }),
          );
        })()
      : updatePost();

    request
      .then((updatedPost) => {
        setAllPosts((prev) =>
          prev.map((p) => (p._id === postId ? updatedPost : p)),
        );

        setPostsToRender((prev) =>
          prev.map((p) => (p._id === postId ? updatedPost : p)),
        );

        setPostVersion((v) => v + 1);

        openModal({
          status: "success",
          message: messages.POST_EDITED_SUCCESSFULLY_MSG,
        });
      })
      .catch((err) => {
        console.error(err);

        openModal({
          status: "error",
          message: err.message || messages.POST_EDIT_ERROR_MSG,
        });
      })
      .finally(() => {
        stopLoading();
        closeAllBlogPopups();
      });
  }

  function handleDeletePostModalOpen(post, shouldRedirect = false) {
    setPostToDelete(post);
    setRedirectAfterDelete(shouldRedirect);
    setIsDeletePostModalOpen(true);
  }

  function handlePostDelete(post) {
    api
      .deletePost(post._id)
      .then(() => {
        setPostsToRender((state) =>
          state.filter((p) => p._id !== post._id && p),
        );
        setAllPosts((state) => state.filter((p) => p._id !== post._id && p));
        if (redirectAfterDelete) {
          history.replace("/alina/posts");
        }
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => {
        closeAllBlogPopups();
      });
  }

  function handlePostClick(post) {
    history.push(`/alina/posts/${post._id}`);
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
    history.push("/alina");
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
    history.goBack();
  }

  function handleBlogClick() {
    window.scrollTo(0, 0);
    closeMenu();
  }
  function handleGamesClick() {
    history.push("/alina/games");
  }

  function moveToTicTacToePage() {
    history.push("/alina/games/tic-tac-toe");
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

  const { currentUser, loggedIn, handleSignin, handleSignout, updateUser } =
    useAuth({
      history,
      location,
      openModal,
      startLoading,
      stopLoading,
    });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route exact path="/">
          <Home
            loggedIn={loggedIn}
            ref={homeRef}
            onHomeClick={handleHomeClick}
            onBlogClick={handleBlogClick}
            onGalleryClick={handleGalleryClick}
            onContactClick={handleContactClick}
            onMenuClick={handleMenuClick}
            onSignout={handleSignout}
            isSendingReq={isLoading}
            email={currentUser.email}
            onLogout={handleSignout}
          />
          <Main
            photos={photosToRender}
            loggedIn={loggedIn}
            ref={mainRef}
            onPhotoClick={handlePhotoOpen}
            onDeleteBtnClick={handleDeletePhotoModalOpen}
            onHomeClick={handleHomeClick}
            onBlogClick={handleBlogClick}
            onGalleryClick={handleGalleryClick}
            onContactClick={handleContactClick}
            onHashtagClick={handlePhotoHashtagClick}
            hashtag={hashtag}
            photoHashtags={lastHashtags || []}
            hashtagSetter={setHashtag}
            onSearch={handlePhotoSearch}
            onClearSearch={handleClearPhotoSearch}
            photosQuantity={currentPhotosNumber}
            hasMorePhotos={hasMorePhotos}
            onShowMore={showMorePhotos}
            email={currentUser.email}
            onLogout={handleSignout}
            areHashtagsEditing={false}
            onEditHashtags={handleEditHashtags}
            isSendingReq={isLoading}
            hashtagsNumber={10}
          />
          <Footer ref={footerRef} />
        </Route>

        <Route exact path="/alina">
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
        </Route>

        <Route exact path="/alina/posts">
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
        </Route>

        <Route exact path="/alina/posts/:id">
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
        </Route>

        <Route exact path="/alina/projects">
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
        </Route>

        <Route exact path="/alina/about">
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
        </Route>

        <Route exact path="/alina/games">
          <GamesPage onTicTacToeClick={moveToTicTacToePage} />
        </Route>

        <Route exact path="/signin">
          <SignIn onSignin={handleSignin} isSendingReq={isLoading} />
        </Route>

        {/* New users registration is disabled*/}
        {/* <Route path="/signup">
          <SignUp onSignup={handleSignup} isSendingReq={isLoading} />
        </Route> */}

        <Route path="/signin/recovery">
          <ForgotPassword
            onReceiveEmail={handleReceiveResetPasswordLink}
            isSendingReq={isLoading}
          />
        </Route>

        <Route path="/reset-password/:resetPasswordLink">
          <ResetPassword
            onResetPassword={handleResetPassword}
            isSendingReq={isLoading}
          />
        </Route>

        <Route path="/password-changed">
          <PasswordChanged />
        </Route>

        <ProtectedRoute
          component={Profile}
          exact
          path="/profile"
          loggedIn={loggedIn}
          onHomeClick={handleHomeClick}
          onBlogClick={handleBlogClick}
          onGalleryClick={handleGalleryClick}
          onContactClick={handleContactClick}
          onEditEmailBtnClick={handleEditEmailBtnClick}
          onEditPasswordBtnClick={handleEditPasswordBtnClick}
          onMenuClick={handleMenuClick}
          onSignout={handleSignout}
          isSendingReq={isLoading}
          email={currentUser.email}
          onLogout={handleSignout}
        />

        <ProtectedRoute
          component={ConfirmEmailUpdate}
          path="/profile/update-email/:updateEmailLink"
          loggedIn={loggedIn}
          onUpdateEmail={handleUpdateEmail}
        />

        <ProtectedRoute
          component={AddPhoto}
          path="/addphoto"
          loggedIn={loggedIn}
          onHomeClick={handleHomeClick}
          onBlogClick={handleBlogClick}
          nGalleryClick={handleGalleryClick}
          onContactClick={handleContactClick}
          onMenuClick={handleMenuClick}
          onSignout={handleSignout}
          isSendingReq={isLoading}
          onAddPhotoViaLink={handleAddPhotoViaLink}
          onUploadPhotoToServer={(photoData, hashtags, views) =>
            handlePhotoUpload({
              photoData,
              hashtags,
              views,
              startLoading,
              stopLoading,
              addPhotosToGallery,
              openModal,
            })
          }
          email={currentUser.email}
          onLogout={handleSignout}
        />

        <Route path="/*">
          <NotFound />
        </Route>
      </Switch>

      <PhotoPopup
        loggedIn={loggedIn}
        isOpen={isPhotoPopupOpen}
        photo={selectedPhoto}
        photoHashtags={hashtagsOfSelectedPhoto || []}
        views={viewsOfSelectedPhoto}
        onClose={closeAllPopups}
        onHashtagClick={handlePhotoHashtagClick}
        areHashtagsEditing={areHashtagsEditing}
        onEditHashtags={handleEditHashtags}
        isSendingReq={isLoading}
        onEditHashtagsBtnClick={handleEditHashtagsBtnClick}
        onPhotoFlip={handlePhotoFlip}
        isLeftFlipDisabled={isLeftFlipDisabled}
        isRightFlipDisabled={isRightFlipDisabled}
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

      <DeletePhotoModal
        photo={selectedPhoto}
        isOpen={isDeletePhotoModalOpen}
        onClose={closeAllPopups}
        onDeletePhoto={handlePhotoDelete}
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
