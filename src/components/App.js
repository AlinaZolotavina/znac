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
    // SUCCESSFUL_SIGNUP_MSG,
    // SUCCESSFUL_PROFILE_UPDATE_MSG,
} from '../utils/constants';
import ResetPassword from './ResetPassword';
import EmailSentModal from './EmailSentModal';
import PasswordChanged from './PasswordChanged';
import NotFound from './NotFound';


function App() {
    const [currentUser, setCurrentUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

    const history = useHistory();
    const location = useLocation();

   let photos = localStorage.getItem('photos');
    const [photosToRender, setPhotosToRender] = useState([]);

    const [hashtag, setHashtag] = useState('');

    const [isSendingReq, setIsSendingReq] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
    const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
    const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
    const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState({});

    const [pcDownloadCheck, setPcDownloadCheck] = useState(false);
    const [linkDownloadCheck, setLinkDownloadCheck] = useState(false);

    // if logged in, get and set current user; if not logged in, check token
    useEffect(() => {
        if (loggedIn) {
            api.getInitialData()
                .then(data => {
                    console.log(data);
                    const [userData, photosData] = data;
                    setCurrentUser(userData);
                    setPhotosToRender(photosData);
            })
                .catch(err => console.log(err));
        }
    }, [loggedIn]);

    useEffect(() => {
        if (!loggedIn) {
            checkToken();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function checkToken() {
        auth.getContent()
            .then((res) => {
                console.log(res);
                const userData = res;
                setLoggedIn(true);
                setCurrentUser(userData);
            })
            .catch(err => console.log(err));
    }

    function handleSignup(name, email, password) {
        setIsSendingReq(true);
        auth.signup(name, email, password)
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

    function handlePhotoClick(photo) {
        setIsPhotoPopupOpen(!isPhotoPopupOpen);
        setSelectedPhoto(photo);
    }

    function handlePhotoDelete(photo) {
        setIsDeletePhotoModalOpen(!isDeletePhotoModalOpen);
        setSelectedPhoto(photo);
    }

    function handleEditEmailBtnClick() {
        setIsEditEmailModalOpen(!isEditEmailModalOpen);
    }

    function handleEditPasswordBtnClick() {
        setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
    }

    function handleMenuClick() {
        setIsMenuOpen(!isMenuOpen);
    };

    function handlePcDownloadClick() {
        setLinkDownloadCheck(false);
        setPcDownloadCheck(!pcDownloadCheck);
    }

    function handleLinkDownloadClick() {
        setPcDownloadCheck(false);
        setLinkDownloadCheck(!linkDownloadCheck);
    }

    function handleAddPhoto(newPhoto) {
        setIsSendingReq(true);
        api.addPhoto(newPhoto)
            .then(newPhoto => {
                setPhotosToRender([newPhoto, ...photos]);
            })
            .catch(err => console.log(err))
            .finally(() => setIsSendingReq(false));
    }

    const [home, setHome] = useState(document.querySelector('home'));
    const [main, setMain] = useState(document.querySelector('main'));
    const [footer, setFooter] = useState(document.querySelector('footer'));

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
            block: 'nearest',
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

    function handleHashtagClick(hashtag) {
        if (location.pathname !== '/') {
            history.push('/');
        }
        setHashtag(hashtag);
        handleSearch(hashtag);
    }

    useEffect((e) => {
        const handleEscClose = (e) => {
            if (e.keyCode === 27) {
                closeAllPopups();
            }
        }

        window.addEventListener('keydown', handleEscClose);
        return () => window.removeEventListener('keydown', handleEscClose);
    }, []);

    function closeAllPopups() {
        setIsPhotoPopupOpen(false);
        setIsDeletePhotoModalOpen(false);
        setIsEditEmailModalOpen(false);
        setIsEditPasswordModalOpen(false);
    };

    function closeMenu() {
        setIsMenuOpen(false);
    };

    function closeModals() {
        setIsModalOpen(false);
        setIsEmailSentModalOpen(false);
    };

    function handleError(errorText) {
        setIsSuccess(false);
        setIsModalOpen(true);
        setModalMessage(errorText); 
    };

    function handleEmailChangeRequest(newEmail) {
        setIsSendingReq(true);
        api.requestEmailUpdate(newEmail)
            .then(() => {
                console.log('request email change');
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsSendingReq(false);
            });
    };

    function handleSearch(hashtag) {
        const keyWord = new RegExp(hashtag, "gi");

        if(!photos) {
            api.getInitialPhotos()
                .then(data => {
                    const photosData = data;
                    localStorage.setItem('photos', JSON.stringify(photosData));
                })
                .then(() => {
                    photos = localStorage.getItem('photos');
                })
                .catch(err => {
                    console.log(err);
                })
        }

        const foundPhotos = JSON.parse(photos).filter((photo) => {
            return (keyWord.test(photo.hashtags));
        })

        if (foundPhotos.length === 0) {
            console.log('nothing found');
            // вывести сообщение, что ничего не найдено
        } else {
            setPhotosToRender(foundPhotos);
        }
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Switch>
                <Route exact path='/'>
                    <Home
                        loggedIn={loggedIn}
                        onHomeClick={handleHomeClick}
                        onGalleryClick={handleGalleryClick}
                        onContactClick={handleContactClick}
                        onMenuClick={handleMenuClick}
                        onSignout={handleSignout}
                        isSendingReq={isSendingReq}
                    />
                    <Main
                        photos={photosToRender}
                        loggedIn={loggedIn}
                        onPhotoClick={handlePhotoClick}
                        onDeleteBtnClick={handlePhotoDelete}
                        onHomeClick={handleHomeClick}
                        onGalleryClick={handleGalleryClick}
                        onContactClick={handleContactClick}
                        onHashtagClick={handleHashtagClick}
                        hashtag={hashtag}
                        hashtagSetter={setHashtag}
                        onSearch={handleSearch}
                    />
                    <Footer />
                </Route>

                <Route path='/signin'>
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

                <Route path='/forgot-password'>
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
                    path='/profile'
                    loggedIn={loggedIn}
                    onGalleryClick={handleGalleryClick}
                    onContactClick={handleContactClick}
                    onEditEmailBtnClick={handleEditEmailBtnClick}
                    onEditPasswordBtnClick={handleEditPasswordBtnClick}
                    onMenuClick={handleMenuClick}
                    onSignout={handleSignout}
                    isSendingReq={isSendingReq}
                />

                <ProtectedRoute
                    component={AddPhoto}
                    path='/addphoto'
                    loggedIn={loggedIn}
                    onGalleryClick={handleGalleryClick}
                    onContactClick={handleContactClick}
                    pcDownloadCheck={pcDownloadCheck}
                    linkDownloadCheck={linkDownloadCheck}
                    onPcDownloadClick={handlePcDownloadClick}
                    onLinkDownloadClick={handleLinkDownloadClick}
                    onMenuClick={handleMenuClick}
                    onSignout={handleSignout}
                    isSendingReq={isSendingReq}
                    onAddPhoto={handleAddPhoto}
                />

                <Route path='/*'>
                    <NotFound />
                </Route>
            </Switch>

            <PhotoPopup
                loggedIn={loggedIn}
                isOpen={isPhotoPopupOpen}
                photo={selectedPhoto}
                onClose={closeAllPopups}
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
                isOpen={isDeletePhotoModalOpen}
                onClose={closeAllPopups}
            />

            <Menu
                isOpen={isMenuOpen}
                loggedIn={loggedIn}
                onHomeClick={handleHomeClick}
                onProfileClick={handleProfileClick}
                onAddPhotoClick={handleAddPhotoClick}
                onClose={closeMenu}
            />

            <Modal 
                isOpen={isModalOpen}
                isSuccess={isSuccess}
                onClose={closeModals}
                message={modalMessage}
            />

            <EmailSentModal 
                isOpen={isEmailSentModalOpen}
                isSuccess={isSuccess}
                onClose={closeModals}
                message={modalMessage}
            />
        </CurrentUserContext.Provider>
    );
}

export default App;