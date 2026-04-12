// строка 889

import React, { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Home from "./Home";
import Main from "./Main";
import Footer from "./Footer";
import PhotoPopup from "./PhotoPopup";
import DeletePhotoModal from "./DeletePhotoModal";
import ProtectedRoute from "./ProtectedRoute";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
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
  UNAUTHORIZED_ERROR_MSG,
  BAD_REQUEST_ERROR_MSG,
  CONFLICT_SIGNUP_EMAIL_ERROR_MSG,
  SUCCESSFUL_SIGNUP_MSG,
  // CONFLICT_UPDATE_EMAIL_ERROR_MSG,
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
import EmailSentModal from "./EmailSentModal";
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

import FindPair from "./find-pair/FindPair.js";

import GameSettings from "./tic-tac-toe/GameSettings.js";
import Board from "./tic-tac-toe/Board";
import ShapeSelection from "./tic-tac-toe/ShapeSelection";
import Firework from "./tic-tac-toe/Firework";
import CurrentPostPage from "./blog/CurrentPostPage.js";
import GamesPage from "./blog/GamesPage.js";

function App() {
  // user info
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  // const [theWantedNewEmail, setTheWantedNewEmail] = useState('');

  // history & location
  const history = useHistory();
  const location = useLocation();

  // everything related to photos (including screen width, on which depends the photos to render count)
  const [allPhotos, setAllPhotos] = useState([]);
  const [photosToRender, setPhotosToRender] = useState([]);
  const [photosToAdd, setPhotosToAdd] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentPhotosNumber, setCurrentPhotosNumber] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState({});
  const [photoIndex, setPhotoIndex] = useState(0);
  const [hashtagsOfSelectedPhoto, setHashtagsOfSelectedPhoto] = useState("");
  const [areHashtagsEditing, setAreHashtagsEditing] = useState(false);
  const [viewsOfSelectedPhoto, setViewsOfSelectedPhoto] = useState(0);
  const [isLeftFlipDisabled, setIsLeftFlipDisabled] = useState(false);
  const [isRightFlipDisabled, setIsRightFlipDisabled] = useState(false);

  // popups & modals
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [hashtag, setHashtag] = useState(""); // search input
  const [lastHashtags, setLastHashtags] = useState([]);

  const [isSendingReq, setIsSendingReq] = useState(false);

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
  const [currentPostsNumber, setCurrentPostsNumber] = useState(0);
  const [postsToAdd, setPostsToAdd] = useState(0);
  const [currentProjectsNumber, setCurrentProjectsNumber] = useState(0);
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

  // const updateHomepageHashtags = (hashtags, resentHashtags) => {
  //     hashtags.split('').forEach(h => {
  //         for (let i = 0; i < resentHashtags.length; i++) {
  //             if (resentHashtags[i] === h) {
  //                  setLastHashtags(state => state.push(h));
  //             };
  //         }});
  // }

  // get photos to render
  useEffect(() => {
    setHomeActive("nav__link_active");
    api
      .getInitialData()
      .then((data) => {
        const [
          photosData,
          hashtagsData,
          postsData,
          projectsData,
          projectHashtagsData,
        ] = data;
        setAllPhotos(photosData);
        setPhotosToRender(photosData.reverse());
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

  // if logged in, get and set current user
  useEffect(() => {
    if (loggedIn) {
      api
        .getUserData(currentUser._id)
        .then((data) => {
          const userData = data;
          setCurrentUser(userData);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) {
      checkToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  function checkToken() {
    auth
      .getContent()
      .then((res) => {
        const userData = res;
        setLoggedIn(true);
        if (location.pathname === "signin" || location.pathname === "signup") {
          history.push("/");
        } else {
          history.push(location.pathname);
        }
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err));
  }

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

  function handleSignup(email, password) {
    setIsSendingReq(true);
    auth
      .signup(email, password)
      .then((res) => {
        if (res) {
          handleSignin(email, password);
          setIsModalOpen(true);
          setIsSuccess(true);
          setModalMessage(SUCCESSFUL_SIGNUP_MSG);
        }
      })
      .catch((err) => {
        if (err.status === "Ошибка: 400") {
          handleError(BAD_REQUEST_ERROR_MSG);
        } else if (err.status === "Ошибка: 409") {
          handleError(CONFLICT_SIGNUP_EMAIL_ERROR_MSG);
        } else {
          handleError(DEFAULT_ERROR_MSG);
        }
      })
      .finally(() => setIsSendingReq(false));
  }

  function handleSignin(email, password) {
    setIsSendingReq(true);
    auth
      .signin(email, password)
      .then((data) => {
        setLoggedIn(true);
        setCurrentUser(data.user);
        history.push("/");
      })
      .catch((err) => {
        if (err.status === "Ошибка: 404") {
          handleError(USER_NOT_FOUND_ERROR_MSG);
        } else if (err.status === "Ошибка: 401") {
          handleError(AUTHORIZATION_FAILED_ERROR_MSG);
        } else {
          handleError(DEFAULT_ERROR_MSG);
        }
      })
      .finally(() => setIsSendingReq(false));
  }

  function handleSignout(email) {
    auth
      .signout(email)
      .then(() => {
        setLoggedIn(false);
        history.push("/");
        setCurrentUser({});
      })
      .catch((err) => {
        console.log(err);
        if (err.status === "Ошибка: 404") {
          handleError(USER_NOT_FOUND_ERROR_MSG);
        } else if (err.status === "Ошибка: 401") {
          handleError(UNAUTHORIZED_ERROR_MSG);
        } else {
          handleError(DEFAULT_ERROR_MSG);
        }
      });
  }

  // password reset
  function handleReceiveResetPasswordLink(email) {
    setIsSendingReq(true);
    auth
      .forgotPassword(email)
      .then(() => {
        setIsEmailSentModalOpen(true);
        setIsSuccess(true);
        setModalMessage(
          "E-mail has been sent, please follow the instructions.",
        );
      })
      .then(() => history.push("/"))
      .catch((err) => {
        if (err === "Ошибка: 404") {
          handleError(USER_NOT_FOUND_ERROR_MSG);
        } else {
          handleError(DEFAULT_ERROR_MSG);
        }
      })
      .finally(() => setIsSendingReq(false));
  }

  function handleResetPassword(
    newPassword,
    confirmPassword,
    resetPasswordLink,
  ) {
    setIsSendingReq(true);
    auth
      .resetPassword(newPassword, confirmPassword, resetPasswordLink)
      .then(() => {
        history.push("/password-changed");
      })
      .catch((err) => {
        console.log(err);
        if (err === "Ошибка: 401") {
          handleError("Wrong reset link or it was expired");
        }
        if (err === "Ошибка: 400") {
          handleError("The entered passwords do not match");
        }
        if (err === "Ошибка: 409") {
          handleError(
            "Your new password must not be the same as the previous one",
          );
        }
        if (err === "Ошибка: 404") {
          handleError("Nothing found");
        }
        // handleError(DEFAULT_ERROR_MSG);
      });
  }

  // e-mail change
  function handleEditEmailBtnClick() {
    setIsEditEmailModalOpen(!isEditEmailModalOpen);
  }

  function handleEmailChangeRequest(newEmail) {
    console.log(currentUser.email);
    setIsSendingReq(true);
    localStorage.setItem("email", JSON.stringify(newEmail));
    api
      .requestEmailUpdate(newEmail.email, currentUser.email)
      .then(() => {
        setIsEmailSentModalOpen(true);
        setIsSuccess(true);
        setModalMessage(
          "E-mail has been sent, please follow the instructions.",
        );
      })
      .catch((err) => {
        setIsSuccess(false);
        setIsModalOpen(true);
        setModalMessage("Error! E-mail change request failed");
      })
      .finally(() => {
        setIsSendingReq(false);
      });
  }

  function handleUpdateEmail(updateEmailLink, newEmail) {
    api
      .updateEmail(updateEmailLink, newEmail)
      .then((data) => {
        setCurrentUser(data.user);
        history.push("/profile");
        setIsSuccess(true);
        setIsModalOpen(true);
        setModalMessage("E-mail has been successfully updated");
      })
      .catch(() => {
        setIsSuccess(false);
        setIsModalOpen(true);
        setModalMessage("Error! E-mail has not been updated");
      });
  }

  // open photo popup, handle photo flip
  useEffect(() => {
    const selectedPhotoIndex = findPhotoIndex(selectedPhoto);
    setPhotoIndex(selectedPhotoIndex);
  }, [selectedPhoto]);

  useEffect(() => {
    setHashtagsOfSelectedPhoto(selectedPhoto.hashtags);
    setViewsOfSelectedPhoto(selectedPhoto.views);
  }, [selectedPhoto]);

  useEffect(() => {
    if (photoIndex === photosToRender.length - 1) {
      setIsRightFlipDisabled(true);
    } else {
      setIsRightFlipDisabled(false);
    }
    if (photoIndex === 0) {
      setIsLeftFlipDisabled(true);
    } else {
      setIsLeftFlipDisabled(false);
    }
  }, [photoIndex, photosToRender]);

  function handlePhotoClick(photo) {
    setIsPhotoPopupOpen(true);
    setSelectedPhoto(photo);
    setHashtagsOfSelectedPhoto(photo.hashtags);
    setViewsOfSelectedPhoto(photo.views);
    increaseViewsNumber(photo._id);
    const selectedPhotoIndex = findPhotoIndex(photo);
    setPhotoIndex(selectedPhotoIndex);
  }

  function findPhotoIndex(photo) {
    for (let i = 0; i < photosToRender.length; i++) {
      if (photosToRender[i]._id === photo._id) {
        return i;
      }
    }
  }

  function handlePhotoFlip(direction) {
    if (direction === "right") {
      const rightPhoto = photosToRender[photoIndex + 1];
      setSelectedPhoto(rightPhoto);
      increaseViewsNumber(rightPhoto._id);
      setPhotoIndex((state) => state + 1);
      setAreHashtagsEditing(false);
    } else if (direction === "left") {
      const leftPhoto = photosToRender[photoIndex - 1];
      setSelectedPhoto(leftPhoto);
      increaseViewsNumber(leftPhoto._id);
      setPhotoIndex((state) => state - 1);
      setAreHashtagsEditing(false);
    }
  }

  // add photo
  function handleAddPhotoViaLink(newPhoto) {
    setIsSendingReq(true);
    api
      .addPhoto(newPhoto)
      .then((newPhoto) => {
        setIsModalOpen(true);
        setIsSuccess(true);
        setModalMessage("Photo was added successfully");
        setAllPhotos([newPhoto, ...allPhotos]);
        setPhotosToRender([newPhoto, ...photosToRender]);
      })
      .catch((err) => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setModalMessage("Photo cannot be added");
      })
      .finally(() => setIsSendingReq(false));
  }

  async function handlePhotoUpload(photoData, hashtags, views) {
    setIsSendingReq(true);
    const files = photoData[0];
    const addedPhotos = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.uploadPhoto(formData);
      const data = {
        link: response.data.path,
        hashtags,
        views,
      };
      await api
        .addPhoto(data)
        .then((newPhoto) => {
          setIsModalOpen(true);
          setIsSuccess(true);
          setModalMessage("Photo was added successfully");
          addedPhotos.push(newPhoto);
          setAllPhotos([newPhoto, ...allPhotos]);
          setPhotosToRender([newPhoto, ...photosToRender]);
        })
        .catch((err) => {
          console.log(err);
          setIsModalOpen(false);
          setIsSuccess(false);
          setModalMessage("Something went wrong");
        });
    }
    setAllPhotos([...addedPhotos, ...allPhotos]);
    setPhotosToRender([...addedPhotos, ...photosToRender]);
    setIsSendingReq(false);
  }

  // delete photo
  function handleDeletePhotoModalOpen(photo) {
    setIsDeletePhotoModalOpen(!isDeletePhotoModalOpen);
    setSelectedPhoto(photo);
  }

  function handlePhotoDelete(photo) {
    api
      .deletePhoto(photo._id)
      .then(() => {
        setPhotosToRender((state) =>
          state.filter((p) => p._id !== photo._id && p),
        );
        setAllPhotos((state) => state.filter((p) => p._id !== photo._id && p));
      })
      .catch((err) => console.log(err))
      .finally(() => closeAllPopups());
  }

  // increase views (when open photo popup, when flip photo by buttons' click)
  function increaseViewsNumber(photoId) {
    api
      .increaseViews(photoId)
      .then((newPhoto) => {
        setAllPhotos((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
        setPhotosToRender((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
        setSelectedPhoto(newPhoto);
      })
      .catch((err) => console.log(err));
  }

  // edit photo hashtags
  function handleEditHashtagsBtnClick() {
    setAreHashtagsEditing(!areHashtagsEditing);
  }

  function handleEditHashtags(photoId, hashtags) {
    api
      .editHashtags(photoId, hashtags)
      .then((newPhoto) => {
        setAllPhotos((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
        setPhotosToRender((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
        setSelectedPhoto(newPhoto);
      })
      .then(() => {
        setAreHashtagsEditing(false);
      })
      .catch((err) => console.log(err));
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
      photoIndex,
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
    setIsModalOpen(false);
    setIsEmailSentModalOpen(false);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  // handle errors
  function handleError(errorText) {
    setIsSuccess(false);
    setIsModalOpen(true);
    setModalMessage(errorText);
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

  // function viewAllPostsClick() {
  //     history.push('./alina/posts');
  //     window.scrollTo({
  //         top: 0,
  //         behavior: 'smooth',
  //     });
  // }

  // function viewAllProjectsClick() {
  //     history.push('./alina/projects');
  //     window.scrollTo({
  //         top: 0,
  //         behavior: 'smooth',
  //     });
  // }

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

  function handleContactClick() {
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
    setIsSendingReq(true);
    api
      .addProject(newProject)
      .then((newProject) => {
        setIsModalOpen(true);
        setIsSuccess(true);
        setModalMessage("Project was successfully added");
        setAllProjects([newProject, ...allProjects]);
        setProjectsToRender([newProject, ...projectsToRender]);
      })
      .catch((err) => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setModalMessage("Project cannot be added");
      })
      .finally(() => {
        setIsSendingReq(false);
        closeAllBlogPopups();
      });
  }

  function handleEditProject(projectId, props) {
    setIsSendingReq(true);
    const data = {
      title: props.title,
      hashtags: props.hashtags,
      text: props.text,
      link: props.link,
    };
    api
      .editProject(projectId, data)
      .then((newProject) => {
        setIsModalOpen(true);
        setIsSuccess(true);
        setModalMessage("Project was  successfully edited");
        setAllProjects((state) =>
          state.map((p) => (p._id === projectId ? newProject : p)),
        );
        setProjectsToRender((state) =>
          state.map((p) => (p._id === projectId ? newProject : p)),
        );
      })
      .catch((err) => {
        setIsModalOpen(true);
        setIsSuccess(false);
        setModalMessage("Editing error, please try again later");
      })
      .finally(() => {
        setIsSendingReq(false);
        closeAllBlogPopups();
      });
  }

  async function handleAddPost(props) {
    setIsSendingReq(true);
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
            setIsModalOpen(true);
            setIsSuccess(true);
            setModalMessage("Post was successfully added");
            addedPosts.push(newPost);
            setAllPosts([newPost, ...allPosts]);
            setPostsToRender([newPost, ...postsToRender]);
          })
          .catch((err) => {
            console.log(err);
            setIsModalOpen(false);
            setIsSuccess(false);
            setModalMessage("Post cannot be added");
          })
          .finally(() => {
            setIsSendingReq(false);
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
          setIsModalOpen(true);
          setIsSuccess(true);
          setModalMessage("Post was successfully added");
          addedPosts.push(newPost);
          setAllPosts([newPost, ...allPosts]);
          setPostsToRender([newPost, ...postsToRender]);
        })
        .catch((err) => {
          console.log(err);
          setIsModalOpen(false);
          setIsSuccess(false);
          setModalMessage("Post cannot be added");
        })
        .finally(() => {
          setIsSendingReq(false);
          closeAllBlogPopups();
        });
    }
    setAllPosts([...addedPosts, ...allPosts]);
    setPostsToRender([...addedPosts, ...postsToRender]);
    setIsSendingReq(false);
  }

  async function handleEditPost(postId, props) {
    setIsSendingReq(true);

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
            setIsModalOpen(true);
            setIsSuccess(true);
            setModalMessage("Post was successfully edited");
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
            setIsModalOpen(false);
            setIsSuccess(false);
            setModalMessage("Editing error, please try again later");
          })
          .finally(() => {
            setIsSendingReq(false);
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
          setIsSendingReq(false);
          closeAllBlogPopups();
        });
    }
    setIsSendingReq(false);
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
    history.push("/alina/posts");
    setSelectedPost({});
    closeBlogMenu();
  }
  function moveToPreviousPage() {
    history.goBack();
    setSelectedPost({});
  }
  function moveToProjectsPage() {
    history.push("/alina/projects");
    setSelectedPost({});
    closeBlogMenu();
  }
  function moveToAboutPage() {
    history.push("/alina/about");
    setSelectedPost({});
    closeBlogMenu();
  }

  function handleGamesClick() {
    history.push("/alina/games");
  }

  function moveToTicTacToePage() {
    history.push("/alina/games/tic-tac-toe");
  }

  function moveToFindPairPage() {
    console.log("find pair");
    history.push("/alina/games/find-pair");
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route exact path="/">
          <Home
            loggedIn={loggedIn}
            homeActive={homeActive}
            onHomeClick={handleHomeClick}
            onGalleryClick={handleGalleryClick}
            onContactClick={handleContactClick}
            onMenuClick={handleMenuClick}
            onSignout={handleSignout}
            isSendingReq={isSendingReq}
            email={currentUser.email}
            onLogout={handleSignout}
          />
          <Main
            photos={photosToRender}
            loggedIn={loggedIn}
            homeActive={homeActive}
            onPhotoClick={handlePhotoClick}
            onDeleteBtnClick={handleDeletePhotoModalOpen}
            onHomeClick={handleHomeClick}
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
            isSendingReq={isSendingReq}
            hashtagsNumber={10}
          />
          <Footer />
        </Route>

        <Route exact path="/alina">
          <BlogMainPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            postsToRender={postsToRender}
            projectsToRender={projectsToRender}
            projectsQuantity={2}
            onBlogMenuClick={handleBlogMenuClick}
            onHomeClick={moveToHomePage}
            onPostsClick={moveToPostsPage}
            onProjectsClick={moveToProjectsPage}
            onAboutClick={moveToAboutPage}
            onContactClick={handleContactClick}
            onNewPostClick={handleNewPostPopupOpen}
            onNewProjectClick={handleNewProjectPopupOpen}
            onViewAllPostsClick={moveToPostsPage}
            onViewAllProjectsClick={moveToProjectsPage}
            onPostClick={handlePostClick}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            onEditProjectButtonClick={handleEditProjectPopupOpen}
            onDeleteProjectButtonClick={handleDeleteProjectModalOpen}
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
            onHomeClick={moveToHomePage}
            onPostsClick={moveToPostsPage}
            onProjectsClick={moveToProjectsPage}
            onAboutClick={moveToAboutPage}
            onContactClick={handleContactClick}
            onPostsSearch={handlePostsSearch}
            onPostClick={handlePostClick}
            postsQuantity={currentPostsNumber}
            onShowMorePosts={showMorePosts}
            isLoading={isSendingReq}
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
            onHomeClick={moveToHomePage}
            onPostsClick={moveToPostsPage}
            onProjectsClick={moveToProjectsPage}
            onAboutClick={moveToAboutPage}
            onContactClick={handleContactClick}
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
            onHomeClick={moveToHomePage}
            onPostsClick={moveToPostsPage}
            onProjectsClick={moveToProjectsPage}
            onAboutClick={moveToAboutPage}
            onContactClick={handleContactClick}
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
            onHomeClick={moveToHomePage}
            onPostsClick={moveToPostsPage}
            onProjectsClick={moveToProjectsPage}
            onAboutClick={moveToAboutPage}
            onContactClick={handleContactClick}
            onAddProjectClick={handleNewProjectPopupOpen}
            onGamesClick={handleGamesClick}
            onMusicClick={handleMusicClick}
          />
        </Route>

        <Route exact path="/alina/games">
          <GamesPage
            onTicTacToeClick={moveToTicTacToePage}
            onFindPairClick={moveToFindPairPage}
          />
        </Route>

        <Route exact path="/alina/games/find-pair">
          <FindPair />
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
              screenWidth={screenWidth}
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
          <SignIn onSignin={handleSignin} isSendingReq={isSendingReq} />
        </Route>

        <Route path="/signup">
          <SignUp onSignup={handleSignup} isSendingReq={isSendingReq} />
        </Route>

        <Route path="/signin/recovery">
          <ForgotPassword
            onReceiveEmail={handleReceiveResetPasswordLink}
            isSendingReq={isSendingReq}
          />
        </Route>

        <Route path="/reset-password/:resetPasswordLink">
          <ResetPassword
            onResetPassword={handleResetPassword}
            isSendingReq={isSendingReq}
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
          isSendingReq={isSendingReq}
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
          isSendingReq={isSendingReq}
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
        isSendingReq={isSendingReq}
        onEditHashtagsBtnClick={handleEditHashtagsBtnClick}
        onPhotoFlip={handlePhotoFlip}
        isLeftFlipDisabled={isLeftFlipDisabled}
        isRightFlipDisabled={isRightFlipDisabled}
      />

      <EditEmailModal
        isOpen={isEditEmailModalOpen}
        onClose={closeAllPopups}
        isSendingReq={isSendingReq}
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
        onClose={closeMenu}
        onLogout={handleSignout}
      />

      <Modal
        isOpen={isModalOpen}
        isSuccess={isSuccess}
        onClose={closeAllPopups}
        message={modalMessage}
      />

      <EmailSentModal
        isOpen={isEmailSentModalOpen}
        isSuccess={isSuccess}
        onClose={closeAllPopups}
        message={modalMessage}
      />

      <BlogMenu
        isOpen={isBlogMenuOpen}
        activeBlogPage={activeBlogPage}
        onHomeClick={moveToHomePage}
        onPostsClick={moveToPostsPage}
        onProjestsClick={moveToProjectsPage}
        onAboutClick={moveToAboutPage}
        onClose={closeBlogMenu}
      />

      <GetInTouchPopup
        isOpen={isGetInTouchPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isSendingReq}
      />

      <NewProjectPopup
        isOpen={isNewProjectPopupOpen}
        onClose={closeAllBlogPopups}
        onAddProject={handleAddProject}
        isSendingReq={isSendingReq}
      />

      <NewPostPopup
        isOpen={isPostPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isSendingReq}
        onAddPost={handleAddPost}
      />

      <EditPostPopup
        isOpen={isEditPostPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isSendingReq}
        post={postToEdit}
        onEditPost={handleEditPost}
      />
      <EditProjectPopup
        isOpen={isEditProjectPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isSendingReq}
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
