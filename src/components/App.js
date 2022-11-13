import Home from './Home';
import Main from './Main';
import Footer from './Footer';
import PhotoPopup from './PhotoPopup';
import DeletePhotoModal from './DeletePhotoModal';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Profile from './Profile';
import PasswordRecovery from './PasswordRecovery';
import AddPhoto from './AddPhoto';
import EditEmailModal from './EditEmailModal';
import EditPasswordModal from './EditPasswordModal';
import Menu from './Menu';

import { useState } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { useEffect } from 'react';


function App() {
    const history = useHistory();
    const location = useLocation();

    const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
    const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
    const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
    const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState({});

    const [pcDownloadCheck, setPcDownloadCheck] = useState(false);
    const [linkDownloadCheck, setLinkDownloadCheck] = useState(false);

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

    return (
        <>
            <Switch>
                <Route exact path='/'>
                    <Home
                        loggedIn={true}
                        onHomeClick={handleHomeClick}
                        onGalleryClick={handleGalleryClick}
                        onContactClick={handleContactClick}
                        onMenuClick={handleMenuClick}
                    />
                    <Main
                        loggedIn={true}
                        onPhotoClick={handlePhotoClick}
                        onDeleteBtnClick={handlePhotoDelete}
                        onHomeClick={handleHomeClick}
                        onGalleryClick={handleGalleryClick}
                        onContactClick={handleContactClick}
                    />
                    <Footer />
                </Route>

                <Route exact path='/signin'>
                    <SignIn />
                </Route>

                <Route path='/signup'>
                    <SignUp />
                </Route>

                <Route exact path='/signin/recovery'>
                    <PasswordRecovery />
                </Route>

                <ProtectedRoute
                    component={Profile}
                    path='/profile'
                    loggedIn={true}
                    onGalleryClick={handleGalleryClick}
                    onContactClick={handleContactClick}
                    onEditEmailBtnClick={handleEditEmailBtnClick}
                    onEditPasswordBtnClick={handleEditPasswordBtnClick}
                    onMenuClick={handleMenuClick}
                />

                <ProtectedRoute
                    component={AddPhoto}
                    path='/addphoto'
                    loggedIn={true}
                    onGalleryClick={handleGalleryClick}
                    onContactClick={handleContactClick}
                    pcDownloadCheck={pcDownloadCheck}
                    linkDownloadCheck={linkDownloadCheck}
                    onPcDownloadClick={handlePcDownloadClick}
                    onLinkDownloadClick={handleLinkDownloadClick}
                    onMenuClick={handleMenuClick}
                />



            </Switch>

            <PhotoPopup
                loggedIn={true}
                isOpen={isPhotoPopupOpen}
                photo={selectedPhoto}
                onClose={closeAllPopups}
            />

            <EditEmailModal
                isOpen={isEditEmailModalOpen}
                onClose={closeAllPopups}
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
                onHomeClick={handleHomeClick}
                onProfileClick={handleProfileClick}
                onAddPhotoClick={handleAddPhotoClick}
                onClose={closeMenu}
            />
        </>
    );
}

export default App;