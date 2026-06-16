import React, { useState, useEffect } from "react";

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
// import SignUp from "./SignUp";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import AddPhoto from "./AddPhoto";
import EditEmailModal from "./EditEmailModal";
import EditPasswordModal from "./EditPasswordModal";
import Menu from "./Menu";
import Modal from "./Modal";
import ConfirmEmailUpdate from "./ConfirmEmailUpdate";
import api from "../utils/api";
import * as auth from "../utils/auth.js";

import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import {
  // INTERNAL_SERVER_ERROR_MSG,
  DEFAULT_ERROR_MSG,
  // NOT_FOUND_ERROR_MSG,
  USER_NOT_FOUND_ERROR_MSG,
  // PHOTO_NOT_FOUND_ERROR_MSG,
  AUTHORIZATION_FAILED_ERROR_MSG,
  // UNAUTHORIZED_ERROR_MSG,
  // BAD_REQUEST_ERROR_MSG,
  SUCCESSFUL_SIGNUP_MSG,
  SIGNUP_ERROR_MSG,
  SIGNOUT_ERROR_MSG,
  // PHOTO_FORBIDDEN_ERROR_MSG,
  // ADD_PHOTO_ERROR_MSG,
  // DELETE_PHOTO_ERROR_MSG,
  // SUCCESSFUL_PROFILE_UPDATE_MSG,
} from "../utils/constants";
import {
  LARGE_SCREEN_WIDTH,
  MIDDLE_SCREEN_WIDTH,
  SMALL_SCREEN_WIDTH,
} from "../utils/constants";
import {
  LARGE_SCREEN_PHOTOS_NUMBER,
  MIDDLE_SCREEN_PHOTOS_NUMBER,
  SMALL_SCREEN_PHOTOS_NUMBER,
  LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER,
} from "../utils/constants";

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

import GameSettings from "./tic-tac-toe/GameSettings.js";
import Board from "./tic-tac-toe/Board";
import ShapeSelection from "./tic-tac-toe/ShapeSelection";
import Firework from "./tic-tac-toe/Firework";
import CurrentPostPage from "./blog/CurrentPostPage.js";
import GamesPage from "./blog/GamesPage.js";

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

  // history & location
  const history = useHistory();
  const location = useLocation();

  // everything related to photos (including screen width, on which depends the photos to render count)
  const [allPhotos, setAllPhotos] = useState([]);
  const [photosToRender, setPhotosToRender] = useState([]);
  const [photosToAdd, setPhotosToAdd] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentPhotosNumber, setCurrentPhotosNumber] = useState(0);

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

  /////////////////////////////// BLOG /////////////////////////////
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
  const [postsToRender, setPostsToRender] = useState([]);
  const [postToEdit, setPostToEdit] = useState({});
  const [selectedPost, setSelectedPost] = useState({});
  const [postToDelete, setPostToDelete] = useState({});
  const [projectToEdit, setProjectToEdit] = useState({});
  const [projectToDelete, setProjectToDelete] = useState({});
  const [projectHashtags, setProjectHashtags] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [projectsToRender, setProjectsToRender] = useState([]);
  const [currentPostsNumber, setCurrentPostsNumber] = useState(3);
  const [postsToAdd, setPostsToAdd] = useState(0);
  const [currentProjectsNumber, setCurrentProjectsNumber] = useState(3);
  const [projectsToAdd, setProjectsToAdd] = useState(0);
  const [activePostHashtag, setActivePostHashtag] = useState("All");
  const [activeProjectHashtag, setActiveProjectHashtag] = useState("All");
  const [activeBlogPage, setActiveBlogPage] = useState("Home");

  // tic-tac-toe
  const [AI, setAI] = useState(false);
  const [aiShape, setAiShape] = useState("o");
  const [humanShape, setHumanShape] = useState("x");
  const [winner, setWinner] = useState(null);
  const [fireworkVisibility, setFireworkVisibility] = useState(false);

  // get photos to render
  useEffect(() => {
    setHomeActive("nav__link_active");
    api
      .getInitialData()
      .then((data) => {
        const [, hashtagsData, postsData, projectsData, projectHashtagsData] =
          data;
        setLastHashtags(hashtagsData);
        setAllPosts(postsData);
        setPostsToRender(postsData.reverse());
        setAllProjects(projectsData);
        setProjectsToRender(projectsData.reverse());
        setProjectHashtags(projectHashtagsData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // calculate photos count depending on screen demensions
  // (including when changing the screen resolution)
  useEffect(() => {
    window.addEventListener("resize", updateDemensions);
    return () => window.removeEventListener("resize", updateDemensions);
  }, []);

  useEffect(() => {
    calculatePhotosCount();
    calculatePostsCount();
    calculateProjectsCount();
  }, [
    currentPhotosNumber,
    currentPostsNumber,
    currentProjectsNumber,
    screenWidth,
  ]);

  const updateDemensions = () => {
    let resizeTimeout;
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        setScreenWidth(window.innerWidth);
      }, 150);
    }
  };

  const calculatePhotosCount = () => {
    let initialPhotosNumber;

    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      initialPhotosNumber = LARGE_SCREEN_PHOTOS_NUMBER;
      setPhotosToAdd(LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER);
    }
    if (screenWidth < MIDDLE_SCREEN_WIDTH) {
      initialPhotosNumber = MIDDLE_SCREEN_PHOTOS_NUMBER;
      setPhotosToAdd(MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER);
    }
    if (screenWidth < SMALL_SCREEN_WIDTH) {
      initialPhotosNumber = SMALL_SCREEN_PHOTOS_NUMBER;
      setPhotosToAdd(SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER);
    }
    if (currentPhotosNumber < initialPhotosNumber) {
      setCurrentPhotosNumber(initialPhotosNumber);
    }
  };

  const calculatePostsCount = () => {
    let initialPostsNumber;
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      initialPostsNumber = 6;
      setPostsToAdd(4);
    }
    if (screenWidth < MIDDLE_SCREEN_WIDTH) {
      initialPostsNumber = 3;
      setPostsToAdd(3);
    }
    if (screenWidth < SMALL_SCREEN_WIDTH) {
      initialPostsNumber = 3;
      setPostsToAdd(2);
    }
    if (currentPostsNumber < initialPostsNumber) {
      setCurrentPostsNumber(initialPostsNumber);
    }
  };

  const calculateProjectsCount = () => {
    let initialProjectsNumber;
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      initialProjectsNumber = 9;
      setProjectsToAdd(3);
    }
    if (screenWidth < MIDDLE_SCREEN_WIDTH) {
      initialProjectsNumber = 4;
      setProjectsToAdd(2);
    }
    if (screenWidth < SMALL_SCREEN_WIDTH) {
      initialProjectsNumber = 2;
      setProjectsToAdd(2);
    }
    if (currentProjectsNumber < initialProjectsNumber) {
      setCurrentProjectsNumber(initialProjectsNumber);
    }
  };

  function showMorePhotos() {
    setCurrentPhotosNumber((prev) => prev + photosToAdd);
  }

  function showMoreProjects() {
    setCurrentProjectsNumber((prev) => prev + projectsToAdd);
  }

  function showMorePosts() {
    setCurrentPostsNumber((prev) => prev + postsToAdd);
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
          message: "E-mail has been sent, please follow the instructions.",
        });
      })
      .then(() => history.push("/"))
      .catch((err) => {
        if (err === "Ошибка: 404") {
          openModal({
            status: "error",
            message: USER_NOT_FOUND_ERROR_MSG,
          });
        } else {
          openModal({
            status: "error",
            message: DEFAULT_ERROR_MSG,
          });
        }
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
        console.log(err);
        if (err === "Ошибка: 401") {
          openModal({
            status: "error",
            message: "Wrong reset link or it was expired",
          });
        }
        if (err === "Ошибка: 400") {
          openModal({
            status: "error",
            message: "The entered passwords do not match",
          });
        }
        if (err === "Ошибка: 409") {
          openModal({
            status: "error",
            message:
              "Your new password must not be the same as the previous one",
          });
        }
        if (err === "Ошибка: 404") {
          openModal({
            status: "error",
            message: "Nothing found",
          });
        }
        openModal({
          status: "error",
          message: DEFAULT_ERROR_MSG,
        });
      });
  }

  // e-mail change
  function handleEditEmailBtnClick() {
    setIsEditEmailModalOpen(!isEditEmailModalOpen);
  }

  function handleEmailChangeRequest(newEmail) {
    console.log(currentUser.email);
    startLoading();
    localStorage.setItem("email", JSON.stringify(newEmail));
    api
      .requestEmailUpdate(newEmail.email, currentUser.email)
      .then(() => {
        openModal({
          status: "success",
          message: "E-mail has been sent, please follow the instructions.",
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: "Error! E-mail change request failed",
        });
      })
      .finally(() => {
        stopLoading();
      });
  }

  function handleUpdateEmail(updateEmailLink, newEmail) {
    api
      .updateEmail(updateEmailLink, newEmail)
      .then((data) => {
        updateUser(data.user);
        history.push("/profile");
        openModal({
          status: "success",
          message: "E-mail has been successfully updated",
        });
      })
      .catch(() => {
        openModal({
          status: "error",
          message: "Error! E-mail has not been updated",
        });
      });
  }

  async function handlePhotoUpload(photoData, hashtags, views) {
    startLoading();

    try {
      const addedPhotos = [];

      for (const file of photoData) {
        const formData = new FormData();

        formData.append("file", file);

        const response = await api.uploadPhoto(formData);

        if (!response.data?.length) {
          throw new Error("Upload response is invalid");
        }

        const photoDataToSave = {
          link: response.data[0].path,
          hashtags,
          views,
        };

        const newPhoto = await api.addPhoto(photoDataToSave);

        addedPhotos.push(newPhoto);
      }

      setAllPhotos((prev) => [...addedPhotos, ...prev]);

      setPhotosToRender((prev) => [...addedPhotos, ...prev]);

      openModal({
        status: "success",
        message:
          addedPhotos.length === 1
            ? "Photo was added successfully"
            : `${addedPhotos.length} photos were added successfully`,
      });

      return addedPhotos;
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: "Something went wrong",
      });

      throw err;
    } finally {
      stopLoading();
    }
  }

  /////// NEW PHOTO LOGIC
  const {
    selectedPhoto,
    setSelectedPhoto,
    hashtagsOfSelectedPhoto,
    viewsOfSelectedPhoto,
    areHashtagsEditing,
    setAreHashtagsEditing,
    handleEditHashtags,
    isLeftFlipDisabled,
    isRightFlipDisabled,
    handlePhotoClick,
    handlePhotoFlip,
    handleAddPhotoViaLink,
    handlePhotoDelete,
  } = usePhotos({
    openModal,
    startLoading,
    stopLoading,
    closeAllPopups,
    setAllPhotos,
    photosToRender,
    setPhotosToRender,
  });

  // open photo popup
  const handlePhotoOpen = (photo) => {
    handlePhotoClick(photo);
    setIsPhotoPopupOpen(true);
  };
  // delete photo
  const handleDeletePhotoModalOpen = (photo) => {
    setSelectedPhoto(photo); // или selectPhoto
    setIsDeletePhotoModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedPhoto) return;
    handlePhotoDelete(selectedPhoto);
  };

  // edit photo hashtags
  function handleEditHashtagsBtnClick() {
    setAreHashtagsEditing(!areHashtagsEditing);
  }

  // handle app navigation & mark active navigation block / page
  const [home, setHome] = useState(document.querySelector("home"));
  const [main, setMain] = useState(document.querySelector("main"));
  const [footer, setFooter] = useState(document.querySelector("footer"));
  const [homeActive, setHomeActive] = useState("");

  useEffect(() => {
    setHome(document.querySelector(".home"));
    setMain(document.querySelector(".main"));
    setFooter(document.querySelector(".footer"));
  }, [location, home, main, footer]);

  useEffect(() => {
    const markLinkActiveDependingOnScroll = () => {
      const sections = document.querySelectorAll(".section");
      const navLinks = document.querySelectorAll("button.nav__link");
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (sectionTop === 0) {
          current = "home";
        }
        if (window.scrollY >= sectionTop - 60) {
          current = section.getAttribute("id");
        }
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          current = "footer";
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("nav__link_active");
        if (link.classList.contains(`${current}-link`)) {
          link.classList.add("nav__link_active");
        }
      });
    };
    window.addEventListener("scroll", markLinkActiveDependingOnScroll);
    return () =>
      window.removeEventListener("scroll", markLinkActiveDependingOnScroll);
  }, []);

  function handleHomeClick() {
    closeMenu();
    history.push("/");
    home.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }

  function handleGalleryClick() {
    main.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }

  function handleContactClick() {
    footer.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
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
      closeFindPairPopup();
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
      console.log("delete photo");
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
      closeFindPairPopup();
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

  // handle photo search (also by hashtag's click)
  useEffect(() => {
    setHashtag("");
  }, [location.pathname]);

  useEffect(() => {
    if (hashtag === "" || !hashtag) {
      setPhotosToRender(allPhotos);
    }
  }, [hashtag]);

  function checkUniqueness(obj, arr) {
    if (arr.length === 0) {
      return true;
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === obj) {
          return false;
        }
      }
    }
    return true;
  }

  function handleSearch(hashtag) {
    api
      .findPhoto(hashtag.toLowerCase())
      .then((data) => {
        const photosData = data.reverse();
        setPhotosToRender(photosData);
        const isHashtagUniq = checkUniqueness(hashtag, lastHashtags);
        if (photosData.length !== 0) {
          if (isHashtagUniq) {
            api
              .addHashtag(hashtag)
              .then((data) => {
                setLastHashtags([
                  {
                    name: data.name,
                    _id: data._id,
                    __v: data.__v,
                    createdAt: data.createdAt,
                  },
                  ...lastHashtags,
                ]);
              })
              .catch((err) => console.log(err));
          } else {
            const hashtagsArr = [...lastHashtags].filter(
              (h) => h.name.toString() !== hashtag.toString(),
            );
            api.updateHashtag(hashtag).then((data) => {
              setLastHashtags([
                {
                  name: data.name,
                  _id: data._id,
                  __v: data.__v,
                  createdAt: data.createdAt,
                },
                ...hashtagsArr,
              ]);
            });
          }
        }
      })
      .catch((err) => console.log(err));
  }

  function handleHashtagClick(hashtag) {
    closeAllPopups();
    setHashtag(hashtag);
    handleSearch(hashtag);
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

  function handleEditProjectPopupOpen(project) {
    setIsEditProjectPopupOpen(true);
    setProjectToEdit(project);
  }

  function handleBlogContactClick() {
    setIsGetInTouchPopupOpen(true);
  }

  function closeAllBlogPopups() {
    setIsGetInTouchPopupOpen(false);
    setIsPostPopupOpen(false);
    setIsEditPostPopupOpen(false);
    setIsEditProjectPopupOpen(false);
    setIsNewProjectPopupOpen(false);
    setIsDeletePostModalOpen(false);
    setIsDeleteProjectModalOpen(false);
  }

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

  function handlePostsSearch(query, theme) {
    const lowerCaseQuery = query.toLowerCase();
    const capitalizedQuery =
      query[0].toUpperCase() + query.substr(1, query.length);
    let foundPosts;
    if (theme === "All") {
      foundPosts = allPosts.filter(
        (post) =>
          post.theme.includes(lowerCaseQuery) ||
          post.theme.includes(query) ||
          post.theme.includes(capitalizedQuery) ||
          post.title.includes(lowerCaseQuery) ||
          post.title.includes(query) ||
          post.title.includes(capitalizedQuery) ||
          post.text.includes(lowerCaseQuery) ||
          post.text.includes(query) ||
          post.text.includes(capitalizedQuery),
      );
      setPostsToRender(foundPosts);
    } else {
      foundPosts = allPosts.filter(
        (post) =>
          post.theme === theme &&
          (post.theme.includes(lowerCaseQuery) ||
            post.title.includes(lowerCaseQuery) ||
            post.text.includes(lowerCaseQuery)),
      );
      setPostsToRender(foundPosts);
    }

    /////// no need to send a request to the server, because post search works on the client side
    /////// but still can be useful someday though :)

    // api.findPost({ query: modifiedQuery, theme })
    //     .then(data => {
    //         const postsData = data.reverse();
    //         setPostsToRender(postsData);
    //     })
    //     .catch(err => console.log(err));
  }

  function handleProjectsFilter(hashtag) {
    const lowerCaseHashtag = hashtag.toLowerCase();
    let filteredProjects;
    filteredProjects = allProjects.filter(
      (project) =>
        project.hashtags.includes(lowerCaseHashtag) ||
        project.hashtags.includes(hashtag),
    );
    setProjectsToRender(filteredProjects);
  }

  function handleProjectHashtagClick(hashtag) {
    // console.log(hashtag);
    if (hashtag === "All") {
      setProjectsToRender(allProjects);
      setActiveProjectHashtag("All");
    } else {
      handleProjectsFilter(hashtag);
      setActiveProjectHashtag(hashtag);
    }
  }

  function handlePostHashtagClick(theme, query) {
    let lowerCaseQuery;
    let capitalizedQuery;
    let selectedPosts;

    if (query) {
      lowerCaseQuery = query.toLowerCase();
      capitalizedQuery = query[0].toUpperCase() + query.substr(1, query.length);
      setActivePostHashtag(theme);
      if (theme !== "All") {
        selectedPosts = allPosts.filter(
          (post) =>
            post.theme === theme &&
            (post.theme.includes(lowerCaseQuery) ||
              post.theme.includes(query) ||
              post.theme.includes(capitalizedQuery) ||
              post.title.includes(lowerCaseQuery) ||
              post.title.includes(query) ||
              post.title.includes(capitalizedQuery) ||
              post.text.includes(lowerCaseQuery) ||
              post.text.includes(query) ||
              post.text.includes(capitalizedQuery)),
        );
        setPostsToRender(selectedPosts);
      } else {
        selectedPosts = allPosts.filter(
          (post) =>
            post.theme.includes(lowerCaseQuery) ||
            post.theme.includes(query) ||
            post.theme.includes(capitalizedQuery) ||
            post.title.includes(lowerCaseQuery) ||
            post.title.includes(query) ||
            post.title.includes(capitalizedQuery) ||
            post.text.includes(lowerCaseQuery) ||
            post.text.includes(query) ||
            post.text.includes(capitalizedQuery),
        );
        setPostsToRender(selectedPosts);
      }
    } else {
      console.log("no query");
      setActivePostHashtag(theme);
      selectedPosts = allPosts.filter((post) => post.theme === theme);
      setPostsToRender(selectedPosts);
    }
  }

  // function hadleProjectHashtagClick(hashtag) {

  // }

  function handleAddProject(newProject) {
    startLoading();
    api
      .addProject(newProject)
      .then((newProject) => {
        openModal({
          status: "success",
          message: "Project was successfully added",
        });
        setAllProjects([newProject, ...allProjects]);
        setProjectsToRender([newProject, ...projectsToRender]);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: "Project cannot be added",
        });
      })
      .finally(() => {
        stopLoading();
        closeAllBlogPopups();
      });
  }

  function handleEditProject(projectId, props) {
    startLoading();
    const data = {
      title: props.title,
      hashtags: props.hashtags,
      text: props.text,
      link: props.link,
    };
    api
      .editProject(projectId, data)
      .then((newProject) => {
        openModal({
          status: "success",
          message: "Project was successfully edited",
        });
        setAllProjects((state) =>
          state.map((p) => (p._id === projectId ? newProject : p)),
        );
        setProjectsToRender((state) =>
          state.map((p) => (p._id === projectId ? newProject : p)),
        );
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: "Editing error, please try again later",
        });
      })
      .finally(() => {
        stopLoading();
        closeAllBlogPopups();
      });
  }

  async function handleAddPost(props) {
    startLoading();
    const addedPosts = [];
    if (props.photoData[0]) {
      const files = props.photoData[0];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.uploadPhoto(formData);
        const data = {
          theme: props.theme,
          icon: props.icon,
          title: props.title,
          photoLink: response.data.path,
          hashtags: props.hashtags,
          text: props.text,
        };
        await api
          .addPost(data)
          .then((newPost) => {
            openModal({
              status: "success",
              message: "Post was successfully added",
            });
            addedPosts.push(newPost);
            setAllPosts([newPost, ...allPosts]);
            setPostsToRender([newPost, ...postsToRender]);
          })
          .catch((err) => {
            console.log(err);
            openModal({
              status: "error",
              message: "Post cannot be added",
            });
          })
          .finally(() => {
            stopLoading();
            closeAllBlogPopups();
          });
      }
    } else {
      const data = {
        theme: props.theme,
        icon: props.icon,
        title: props.title,
        hashtags: props.hashtags,
        text: props.text,
      };
      api
        .addPost(data)
        .then((newPost) => {
          openModal({
            status: "success",
            message: "Post was successfully added",
          });
          addedPosts.push(newPost);
          setAllPosts([newPost, ...allPosts]);
          setPostsToRender([newPost, ...postsToRender]);
        })
        .catch((err) => {
          console.log(err);
          openModal({
            status: "error",
            message: "Post cannot be added",
          });
        })
        .finally(() => {
          stopLoading();
          closeAllBlogPopups();
        });
    }
    setAllPosts([...addedPosts, ...allPosts]);
    setPostsToRender([...addedPosts, ...postsToRender]);
    stopLoading();
  }

  async function handleEditPost(postId, props) {
    startLoading();

    if (props.photoData[0]) {
      const files = props.photoData[0];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.uploadPhoto(formData);
        const data = {
          theme: props.theme,
          icon: props.icon,
          title: props.title,
          photoLink: response.data.path,
          hashtags: props.hashtags,
          text: props.text,
        };
        api
          .editPost(postId, data)
          .then((newPost) => {
            openModal({
              status: "success",
              message: "Post was successfully edited",
            });
            setAllPosts((state) =>
              state.map((p) => (p._id === postId ? newPost : p)),
            );
            setPostsToRender((state) =>
              state.map((p) => (p._id === postId ? newPost : p)),
            );
            setSelectedPost(newPost);
          })
          .catch((err) => {
            console.log(err);
            openModal({
              status: "error",
              message: "Editing error, please try again later",
            });
          })
          .finally(() => {
            stopLoading();
            closeAllBlogPopups();
          });
      }
    } else {
      const data = {
        theme: props.theme,
        icon: props.icon,
        title: props.title,
        photoLink: "",
        hashtags: props.hashtags,
        text: props.text,
      };
      api
        .editPost(postId, data)
        .then((newPost) => {
          setAllPosts((state) =>
            state.map((p) => (p._id === postId ? newPost : p)),
          );
          setPostsToRender((state) =>
            state.map((p) => (p._id === postId ? newPost : p)),
          );
          setSelectedPost(newPost);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          stopLoading();
          closeAllBlogPopups();
        });
    }
    stopLoading();
    closeAllBlogPopups();
  }

  function handleDeletePostModalOpen(post) {
    setIsDeletePostModalOpen(!isDeletePhotoModalOpen);
    setPostToDelete(post);
  }

  function handlePostDelete(post) {
    api
      .deletePost(post._id)
      .then(() => {
        setPostsToRender((state) =>
          state.filter((p) => p._id !== post._id && p),
        );
        setAllPosts((state) => state.filter((p) => p._id !== post._id && p));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        closeAllBlogPopups();
      });
  }

  function handlePostClick(post) {
    history.push(`/alina/posts/${post.title.replace(/\s+/g, "")}`);
    localStorage.setItem("currentPost", JSON.stringify(post));
    setSelectedPost(post);
  }

  function handleDeleteProjectModalOpen(project) {
    setIsDeleteProjectModalOpen(!isDeleteProjectModalOpen);
    setProjectToDelete(project);
  }

  function handleProjectDelete(project) {
    console.log(project);
    api
      .deleteProject(project._id)
      .then(() => {
        setProjectsToRender((state) =>
          state.filter((p) => p._id !== project._id && p),
        );
        setAllProjects((state) =>
          state.filter((p) => p.id !== project._is && p),
        );
      })
      .catch((err) => console.log(err))
      .finally(() => closeAllBlogPopups());
  }

  // ???? ???? ???? ????? ?????

  // function handleBackButtonClick() {
  //     history.push('/alina/posts');
  //     setSelectedPost({});
  // };

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
    setSelectedPost({});
    closeBlogMenu();
  }
  function moveToPostsPage() {
    setSelectedPost({});
    closeBlogMenu();
  }
  function moveToProjectsPage() {
    setSelectedPost({});
    closeBlogMenu();
  }

  function moveToAboutPage() {
    setSelectedPost({});
    closeBlogMenu();
  }
  function moveToPreviousPage() {
    history.goBack();
    setSelectedPost({});
  }

  function handleBlogClick() {
    console.log("blog click");
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
    );
  }

  //  TIC TAC TOE
  function handleTwoPlayersClick() {
    history.push("/alina/games/tic-tac-toe/new-game");
    setAI(false);
    setHumanShape("x");
    setAiShape("o");
  }

  function handleOnePlayerClick() {
    history.push("/alina/games/tic-tac-toe/shape-selection");
    setAI(true);
  }

  function handleShapeSelect(shape) {
    history.push("/alina/games/tic-tac-toe/new-game");
    setHumanShape(shape);
    if (shape === "x") {
      setAiShape("o");
    } else {
      setAiShape("x");
    }
  }

  //   function handleBackToSettingsBtnClick() {
  //     history.push("/alina/games/tic-tac-toe");
  //     setWinner(null);
  //     setFireworkVisibility(false);
  //   }

  //////////////// FIND PAIR ////////////
  const [findPairPlayerName, setFindPairPlayerName] = useState("");
  const [findPairGameResult, setFindPairGameResult] = useState(null);
  const [isFindPairGameFinished, setIsFindPairGameFinished] = useState(false);
  const [restartFindPairHandler, setRestarFindPairtHandler] = useState(null);
  const [isFindPairPopupOpen, setIsFindPairPopupOpen] = useState(false);

  function openFindPairPopup() {
    setIsFindPairPopupOpen(true);
  }

  function closeFindPairPopup() {
    setIsFindPairPopupOpen(false);
  }

  function restartFindPairGame() {
    setRestarFindPairtHandler?.();
    setIsFindPairPopupOpen(false);
  }

  ////////////////////////////////////////
  const {
    currentUser,
    loggedIn,
    handleSignin,
    handleSignup,
    handleSignout,
    updateUser,
  } = useAuth({
    history,
    location,
    openModal,
    messages: {
      AUTHORIZATION_FAILED_ERROR_MSG,
      SIGNUP_ERROR_MSG,
      SUCCESSFUL_SIGNUP_MSG,
      SIGNOUT_ERROR_MSG,
    },
    startLoading,
    stopLoading,
  });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route exact path="/">
          <Home
            loggedIn={loggedIn}
            homeActive={homeActive}
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
            homeActive={homeActive}
            onPhotoClick={handlePhotoOpen}
            onDeleteBtnClick={handleDeletePhotoModalOpen}
            onHomeClick={handleHomeClick}
            onBlogClick={handleBlogClick}
            onGalleryClick={handleGalleryClick}
            onContactClick={handleContactClick}
            onHashtagClick={handleHashtagClick}
            hashtag={hashtag}
            photoHashtags={lastHashtags || []}
            hashtagSetter={setHashtag}
            onSearch={handleSearch}
            photosQuantity={currentPhotosNumber}
            onShowMore={showMorePhotos}
            email={currentUser.email}
            onLogout={handleSignout}
            areHashtagsEditing={false}
            onEditHashtags={handleEditHashtags}
            isSendingReq={isLoading}
            hashtagsNumber={10}
          />
          <Footer />
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
            postsQuantity={currentPostsNumber}
            onShowMorePosts={showMorePosts}
            isLoading={isLoading}
            query={query}
            querySetter={setQuery}
            onPostHashtagClick={handlePostHashtagClick}
            activeHashtag={activePostHashtag}
          />
        </Route>

        <Route exact path="/alina/posts/:id" component={CurrentPostPage}>
          <CurrentPostPage
            activePage="posts"
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            post={selectedPost}
            onBackButtonClick={moveToPreviousPage}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            loggedIn={loggedIn}
          />
        </Route>

        <Route exact path="/alina/projects">
          <ProjectsPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            hashtags={projectHashtags}
            activeProjectHashtag={activeProjectHashtag}
            projectsToRender={projectsToRender}
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

        <Route exact path="/alina/games/tic-tac-toe">
          <GameSettings
            onTwoPlayersClick={handleTwoPlayersClick}
            onOnePlayerClick={handleOnePlayerClick}
            onShapeSelect={handleShapeSelect}
            // onBackToSettingsBtnClick={handleBackToSettingsBtnClick}
          />
        </Route>

        <Route exact path="/alina/games/tic-tac-toe/shape-selection">
          <ShapeSelection
            onShapeSelect={handleShapeSelect}
            onBlogBtnClick={moveToHomePage}
          />
        </Route>

        <Route path="/alina/games/tic-tac-toe/new-game">
          <div className="game">
            <Board
              AiMode={AI}
              ai={aiShape}
              human={humanShape}
              winnerSetter={setWinner}
              fireworkVisibilitySetter={setFireworkVisibility}
            />
            <Firework
              classname="firework_number_first"
              visible={fireworkVisibility}
              color="light-blue"
            />
            <Firework
              classname="firework_number_second"
              visible={fireworkVisibility}
              color="yellow"
            />
            <Firework
              classname="firework_number_third"
              visible={fireworkVisibility}
              color="pink"
            />
            <Firework
              classname="firework_number_fourth"
              visible={fireworkVisibility}
              color="green"
            />
            <Firework
              classname="firework_number_fifth"
              visible={fireworkVisibility}
              color="light-blue"
            />
            <Firework
              classname="firework_number_sixth"
              visible={fireworkVisibility}
              color="yellow"
            />
            <Firework
              classname="firework_number_seventh"
              visible={fireworkVisibility}
              color="pink"
            />
          </div>
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
          loggedIn={true}
          nGalleryClick={handleGalleryClick}
          onContactClick={handleContactClick}
          onMenuClick={handleMenuClick}
          onSignout={handleSignout}
          isSendingReq={isLoading}
          onAddPhotoViaLink={handleAddPhotoViaLink}
          onUploadPhotoToServer={handlePhotoUpload}
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
        onHashtagClick={handleHashtagClick}
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
        onClose={closeAllBlogPopups}
        isSendingReq={isLoading}
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
