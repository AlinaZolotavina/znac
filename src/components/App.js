import React, { useState, useEffect } from 'react';
import { CurrentUserContext  } from '../contexts/CurrentUserContext';
import Home from './Home';
import Main from './Main';
import Footer from './Footer';
import PhotoPopup from './PhotoPopup';
import DeletePhotoModal from './DeletePhotoModal';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Profile from './Profile';
import ForgotPassword from './ForgotPassword';
import AddPhoto from './AddPhoto';
import EditEmailModal from './EditEmailModal';
import EditPasswordModal from './EditPasswordModal';
import Menu from './Menu';
import Modal from './Modal';
import ConfirmEmailUpdate from './ConfirmEmailUpdate';
import api from '../utils/api';
import * as auth from '../utils/auth.js';

import { Switch, Route, useLocation, useHistory } from 'react-router-dom';

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
} from '../utils/constants';
import {
    LARGE_SCREEN_WIDTH,
    MIDDLE_SCREEN_WIDTH, 
    SMALL_SCREEN_WIDTH,
} from '../utils/constants';
import {
    LARGE_SCREEN_PHOTOS_NUMBER,
    MIDDLE_SCREEN_PHOTOS_NUMBER,
    SMALL_SCREEN_PHOTOS_NUMBER,
    LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER,
    MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER,
    SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER,
} from '../utils/constants';

import ResetPassword from './ResetPassword';
import EmailSentModal from './EmailSentModal';
import PasswordChanged from './PasswordChanged';
import NotFound from './NotFound';

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
    const [hashtagsOfSelectedPhoto, setHashtagsOfSelectedPhoto] = useState('');
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
    const [modalMessage, setModalMessage] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [hashtag, setHashtag] = useState(''); // search input
    const [lastHashtags, setLastHashtags] = useState([]);

    const [isSendingReq, setIsSendingReq] = useState(false); 

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
        setHomeActive('nav__link_active');
        api.getInitialData()
            .then(data => {
                const [photosData, hashtagsData] = data;
                setAllPhotos(photosData);
                setPhotosToRender(photosData.reverse());
                setLastHashtags(hashtagsData);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

   // if logged in, get and set current user
    useEffect(() => {
        if (loggedIn) {
            api.getUserData(currentUser._id)
                .then(data => {
                    const userData = data;
                    setCurrentUser(userData);
            })
                .catch(err => console.log(err));
        }
    }, [loggedIn]);

    useEffect(() => {
        if (!loggedIn) {
            checkToken();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn]);

    function checkToken() {
        auth.getContent()
            .then((res) => {
                const userData = res;
                setLoggedIn(true);
                if (location.pathname === 'signin' || location.pathname === 'signup') {
                    history.push('/');
                } else {
                    history.push(location.pathname);
                }
                setCurrentUser(userData);
            })
            .catch(err => console.log(err));
    }

    // calculate photos count depending on screen demensions
    // (including when changing the screen resolution)
    useEffect(() => {
        window.addEventListener('resize', updateDemensions);
        return () => window.removeEventListener('resize', updateDemensions);
    }, []);

    useEffect(() => {
        calculatePhotosCount();
    }, [currentPhotosNumber, screenWidth]);

    const updateDemensions = () => {
        let resizeTimeout;
        if(!resizeTimeout) {
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null;
                setScreenWidth(window.innerWidth);
            }, 150);
        };
    }

    const calculatePhotosCount = () => {
        let initialPhotosNumber;
        if(screenWidth >= LARGE_SCREEN_WIDTH) {
            initialPhotosNumber = LARGE_SCREEN_PHOTOS_NUMBER;
            setPhotosToAdd(LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER);
        } 
        if(screenWidth < MIDDLE_SCREEN_WIDTH) {
            initialPhotosNumber = MIDDLE_SCREEN_PHOTOS_NUMBER;
            setPhotosToAdd(MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER);
        }
        if(screenWidth < SMALL_SCREEN_WIDTH) {
            initialPhotosNumber = SMALL_SCREEN_PHOTOS_NUMBER;
            setPhotosToAdd(SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER);
        }
        if (currentPhotosNumber < initialPhotosNumber) {
            setCurrentPhotosNumber(initialPhotosNumber);
        }
    }

    function showMorePhotos() {
        setCurrentPhotosNumber((prev) => prev + photosToAdd);
    };

    function handleSignup(email, password) {
        setIsSendingReq(true);
        auth.signup(email, password)
            .then((res) => {
                if (res) {
                    handleSignin(email, password);
                    setIsModalOpen(true);
                    setIsSuccess(true);
                    setModalMessage(SUCCESSFUL_SIGNUP_MSG);
                }
            })
            .catch((err) => {
                if (err.status === 'Ошибка: 400') {
                    handleError(BAD_REQUEST_ERROR_MSG);
                } else if (err.status === 'Ошибка: 409') {
                    handleError(CONFLICT_SIGNUP_EMAIL_ERROR_MSG);
                } else {
                    handleError(DEFAULT_ERROR_MSG);
                };
            })
            .finally(() => setIsSendingReq(false));
    };

    function handleSignin(email, password) {
        setIsSendingReq(true);
        auth.signin(email, password)
            .then((data) => {
                setLoggedIn(true);
                setCurrentUser(data.user);
                history.push('/');
            })
            .catch((err) => {
                if (err.status === 'Ошибка: 404') {
                    handleError(USER_NOT_FOUND_ERROR_MSG);
                } else if (err.status === 'Ошибка: 401') {
                    handleError(AUTHORIZATION_FAILED_ERROR_MSG);
                } else {
                    handleError(DEFAULT_ERROR_MSG);
                };
            })
            .finally(() => setIsSendingReq(false));
    };

    function handleSignout(email) {
        auth.signout(email)
            .then(() => {
                setLoggedIn(false);
                history.push('/');
                setCurrentUser({});
            })
            .catch((err) => {
                console.log(err);
                if (err.status === 'Ошибка: 404') {
                    handleError(USER_NOT_FOUND_ERROR_MSG);
                } else if (err.status === 'Ошибка: 401') {
                    handleError(UNAUTHORIZED_ERROR_MSG);
                } else {
                    handleError(DEFAULT_ERROR_MSG);
                };
            });
    };
    
    // password reset
    function handleReceiveResetPasswordLink(email) {
        setIsSendingReq(true);
        auth.forgotPassword(email)
            .then(() => {
                setIsEmailSentModalOpen(true);
                setIsSuccess(true);
                setModalMessage('E-mail has been sent, please follow the instructions.');
            })
            .then(() => history.push('/'))
            .catch((err) => {
                if (err === 'Ошибка: 404') {
                    handleError(USER_NOT_FOUND_ERROR_MSG);
                } else {
                    handleError(DEFAULT_ERROR_MSG)
                }
            })            
            .finally(() => setIsSendingReq(false));
    };

    function handleResetPassword(newPassword, confirmPassword, resetPasswordLink) {
        setIsSendingReq(true);
        auth.resetPassword(newPassword, confirmPassword, resetPasswordLink)
            .then(() => {
                history.push('/password-changed');
            })
            .catch((err) => {
                console.log(err);
                if (err === 'Ошибка: 401') {
                    handleError('Wrong reset link or it was expired');
                } 
                if (err === 'Ошибка: 400') {
                    handleError('The entered passwords do not match');
                } 
                if (err === 'Ошибка: 409') {
                    handleError('Your new password must not be the same as the previous one');
                } 
                if (err === 'Ошибка: 404') {
                    handleError('Nothing found');
                }
                // handleError(DEFAULT_ERROR_MSG);
            })
    }

    // e-mail change
    function handleEditEmailBtnClick() {
        setIsEditEmailModalOpen(!isEditEmailModalOpen);
    }

    function handleEmailChangeRequest(newEmail) {
        console.log(currentUser.email);
        setIsSendingReq(true);
        localStorage.setItem('email', JSON.stringify(newEmail));
        api.requestEmailUpdate(newEmail.email, currentUser.email)
            .then(() => {
                setIsEmailSentModalOpen(true);
                setIsSuccess(true);
                setModalMessage('E-mail has been sent, please follow the instructions.');
            })
            .catch((err) => {
                setIsSuccess(false);
                setIsModalOpen(true);
                setModalMessage('Error! E-mail change request failed')
            })
            .finally(() => {
                setIsSendingReq(false);
            });
    };

    function handleUpdateEmail(updateEmailLink, newEmail) {
        api.updateEmail(updateEmailLink, newEmail)
            .then((data) => {
                setCurrentUser(data.user);
                history.push('/profile');
                setIsSuccess(true);
                setIsModalOpen(true);
                setModalMessage('E-mail has been successfully updated');
            })
            .catch(() => {
                setIsSuccess(false);
                setIsModalOpen(true);
                setModalMessage('Error! E-mail has not been updated');
            });
    };

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
            };
        };
    };

    function handlePhotoFlip(direction) {   
        if (direction === 'right') {
            const rightPhoto = photosToRender[photoIndex + 1];
            setSelectedPhoto(rightPhoto);
            increaseViewsNumber(rightPhoto._id);
            setPhotoIndex(state => state + 1);
            setAreHashtagsEditing(false);
        } else if (direction === 'left') {
            const leftPhoto = photosToRender[photoIndex - 1];
            setSelectedPhoto(leftPhoto);
            increaseViewsNumber(leftPhoto._id);
            setPhotoIndex(state => state - 1);
            setAreHashtagsEditing(false);
        } 
    };

    // add photo
    function handleAddPhotoViaLink(newPhoto) {
        setIsSendingReq(true);
        api.addPhoto(newPhoto)
            .then(newPhoto => {
                setIsModalOpen(true);
                setIsSuccess(true);
                setModalMessage('Photo was added successfully');
                setAllPhotos([newPhoto, ...allPhotos]);
                setPhotosToRender([newPhoto, ...photosToRender]);
            })
            .catch(err => {
                setIsModalOpen(false);
                setIsSuccess(false);
                setModalMessage('Photo cannot be added');
            })
            .finally(() => setIsSendingReq(false));
    }

    async function handlePhotoUpload(photoData, hashtags, views) {
        setIsSendingReq(true);
        const files = photoData[0];
        console.log(`photo data`, photoData);
        console.log(`files`, files);
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            const response = await api.uploadPhoto(formData);
            const data = {
                link: response.data.path,
                hashtags,
                views,
            }
            api.addPhoto(data)
                .then(newPhoto => {
                    setIsModalOpen(true);
                    setIsSuccess(true);
                    setModalMessage('Photo was added successfully');
                    setAllPhotos([newPhoto, ...allPhotos]);
                    setPhotosToRender([newPhoto, ...photosToRender]);
                })
                .catch(err => {
                    console.log(err);
                    setIsModalOpen(false);
                    setIsSuccess(false);
                    setModalMessage('Something went wrong');
                })
                .finally(() => {

                    setIsSendingReq(false);
                })
        }
        // const response = await api.uploadPhoto(photoData);
        // const data = {
        //     link: response.data.path,
        //     hashtags,
        //     views,
        // }
        // api.addPhoto(data)
        //     .then(newPhoto => {
        //         setIsModalOpen(true);
        //         setIsSuccess(true);
        //         setModalMessage('Photo was added successfully');
        //         setAllPhotos([newPhoto, ...allPhotos]);
        //         setPhotosToRender([newPhoto, ...photosToRender]);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         setIsModalOpen(false);
        //         setIsSuccess(false);
        //         setModalMessage('Something went wrong');
        //     })
        //     .finally(() => setIsSendingReq(false));
    }

    // delete photo
    function handleDeletePhotoModalOpen(photo) {
        setIsDeletePhotoModalOpen(!isDeletePhotoModalOpen);
        setSelectedPhoto(photo);
    }

    function handlePhotoDelete(photo) {
        api.deletePhoto(photo._id)
            .then(() => {
                setPhotosToRender((state) => state.filter((p) => p._id !== photo._id && p));
                setAllPhotos((state) => state.filter((p) => p._id !== photo._id && p));
            })
            .catch(err => console.log(err));
        closeAllPopups();
    }    

    // increase views (when open photo popup, when flip photo by buttons' click)
    function increaseViewsNumber(photoId) {
        api.increaseViews(photoId)
            .then(newPhoto => {
                setAllPhotos(state => state.map(p => p._id === photoId ? newPhoto : p));
                setPhotosToRender(state => state.map(p => p._id === photoId ? newPhoto : p));
                setSelectedPhoto(newPhoto);
            })
            .catch(err => console.log(err));
    }

    // edit photo hashtags
    function handleEditHashtagsBtnClick() {
            setAreHashtagsEditing(!areHashtagsEditing);
        }

    function handleEditHashtags(photoId, hashtags) {
        api.editHashtags(photoId, hashtags)
            .then(newPhoto => {
                setAllPhotos(state => state.map(p => p._id === photoId ? newPhoto : p));
                setPhotosToRender(state => state.map(p => p._id === photoId ? newPhoto : p));
                setSelectedPhoto(newPhoto);
            })
            .then(() => {
                setAreHashtagsEditing(false);
            })            
            .catch(err => console.log(err));
    }

    // handle app navigation & mark active navigation block / page
    const [home, setHome] = useState(document.querySelector('home'));
    const [main, setMain] = useState(document.querySelector('main'));
    const [footer, setFooter] = useState(document.querySelector('footer'));
    const [homeActive, setHomeActive] = useState('');

    useEffect(() => {
        setHome(document.querySelector('.home'));
        setMain(document.querySelector('.main'));
        setFooter(document.querySelector('.footer'));
    }, [location, home, main, footer])

    useEffect(() => {
        const markLinkActiveDependingOnScroll = () => {
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('button.nav__link');
            let current = '';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (sectionTop === 0) {
                    current = 'home';
                }
                if (window.scrollY >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    current = 'footer';
                }
            })

            navLinks.forEach((link) => {
                link.classList.remove('nav__link_active');
                if (link.classList.contains(`${current}-link`)) {
                    link.classList.add('nav__link_active');
                }
            })
        }
        window.addEventListener('scroll', markLinkActiveDependingOnScroll);
        return () => window.removeEventListener('scroll', markLinkActiveDependingOnScroll);
    }, [])

    function handleHomeClick() {
        closeMenu();
        history.push('/');
        home.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
        });
    };
    
    function handleGalleryClick() {
        main.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
        });
    };

    function handleContactClick() {
        footer.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
        });
    };

    function handleProfileClick() {
        closeMenu();
        history.push('/profile');
    };

    function handleAddPhotoClick() {
        closeMenu();
        history.push('/addphoto');
    }

    function handleEditPasswordBtnClick() {
        setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
    } 

    function handleMenuClick() {
        setIsMenuOpen(!isMenuOpen);
    };

    // close popups and modals by close btn, ESC and overlay click;
    // flip photos by keyboard arrows;
    // close menu;
    useEffect((e) => {
        const handleEscClose = (e) => {
            if (e.keyCode === 27) {
                closeAllPopups();
            }
            if (e.keyCode === 37 && !isLeftFlipDisabled && location.pathname === 'addphoto') {
                handlePhotoFlip('left');
            } 
            if (e.keyCode === 39 && !isRightFlipDisabled && location.pathname === 'addphoto') {
                handlePhotoFlip('right');
            }
        }
        
        const handleOverlayClickClose = (e) => {
            if (e.target.classList.contains('popup_is-opened') || e.target.classList.contains('popup__close-btn')) {
                closeAllPopups();
            }
        }
        window.addEventListener('keydown', handleEscClose);
        window.addEventListener('mousedown', handleOverlayClickClose);
        return () => {
            window.removeEventListener('keydown', handleEscClose);
            window.removeEventListener('mousedown', handleOverlayClickClose);
        };
    }, [photoIndex, photosToRender, selectedPhoto, isLeftFlipDisabled, isRightFlipDisabled]);

    function closeAllPopups() {
        setIsPhotoPopupOpen(false);
        setIsDeletePhotoModalOpen(false);
        setIsEditEmailModalOpen(false);
        setIsEditPasswordModalOpen(false);
        setIsModalOpen(false);
        setIsEmailSentModalOpen(false);
    };

    function closeMenu() {
        setIsMenuOpen(false);
    };

    // handle errors
    function handleError(errorText) {
        setIsSuccess(false);
        setIsModalOpen(true);
        setModalMessage(errorText); 
    };

    // handle search (also by hashtag's click)
    useEffect(() => {
        setHashtag('');
    }, [location.pathname]);

    useEffect(() => {
        if (hashtag === '' || !hashtag) {
            setPhotosToRender(allPhotos);
        }
    }, [hashtag]);

    function checkUniqueness (obj, arr) {
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
        api.findPhoto(hashtag.toLowerCase())
            .then(data => {
                const photosData = data.reverse();
                setPhotosToRender(photosData);
                const isHashtagUniq = checkUniqueness(hashtag, lastHashtags);
                if (photosData.length !== 0) {
                    if (isHashtagUniq) {
                        api.addHashtag(hashtag)
                        .then(data => {
                            setLastHashtags([
                                { name: data.name, _id: data._id, __v: data.__v, createdAt: data.createdAt },
                                ...lastHashtags
                            ]);
                        })
                        .catch(err => console.log(err));
                    } else {
                        const hashtagsArr = [...lastHashtags].filter(h => h.name.toString() !== hashtag.toString());
                        api.updateHashtag(hashtag)
                        .then((data) => {
                            setLastHashtags([
                                { name: data.name, _id: data._id, __v: data.__v, createdAt: data.createdAt },
                                ...hashtagsArr
                            ]);
                        })
                    }
                }
            })
            .catch(err => console.log(err));
    };

    function handleHashtagClick(hashtag) {
        closeAllPopups();
        setHashtag(hashtag);
        handleSearch(hashtag);
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Switch>
                <Route exact path='/'>
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

                <Route exact path='/signin'>
                    <SignIn 
                        onSignin={handleSignin}
                        isSendingReq={isSendingReq}
                    />
                </Route>

                <Route path='/signup'>
                    <SignUp 
                        onSignup={handleSignup}
                        isSendingReq={isSendingReq}
                    />
                </Route>

                <Route path='/signin/recovery'>
                    <ForgotPassword
                        onReceiveEmail={handleReceiveResetPasswordLink}
                        isSendingReq={isSendingReq}
                    />
                </Route>

                <Route path='/reset-password/:resetPasswordLink'>
                    <ResetPassword 
                        onResetPassword={handleResetPassword}
                        isSendingReq={isSendingReq}
                    />
                </Route>

                <Route path='/password-changed'>
                    <PasswordChanged />
                </Route>

                <ProtectedRoute
                    component={Profile}
                    exact path='/profile'
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
                    path='/profile/update-email/:updateEmailLink'
                    loggedIn={loggedIn}
                    onUpdateEmail={handleUpdateEmail}
                />

                <ProtectedRoute
                    component={AddPhoto}
                    path='/addphoto'
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

                <Route path='/*'>
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
        </CurrentUserContext.Provider>
    );
}

export default App;