import Home from './Home';
import Main from './Main';
import Footer from './Footer';
import PhotoPopup from './PhotoPopup';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Profile from './Profile';
import PasswordRecovery from './PasswordRecovery';
import AddPhoto from './AddPhoto';
import EditEmailModal from './EditEmailModal';
import EditPasswordModal from './EditPasswordModal';

import { useState } from 'react';
import { Switch, Route } from 'react-router-dom';


function App() {
    const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
    const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
    const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState({});

    const [pcDownloadCheck, setPcDownloadCheck] = useState(false);
    const [linkDownloadCheck, setLinkDownloadCheck] = useState(false);

    function handlePhotoClick(photo) {
        setIsPhotoPopupOpen(!isPhotoPopupOpen);
        setSelectedPhoto(photo);
    }

    function handleEditEmailBtnClick() {
        setIsEditEmailModalOpen(!isEditEmailModalOpen);
    }

    function handleEditPasswordBtnClick() {
        setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
    }

    function handlePcDownloadClick() {
        setLinkDownloadCheck(false);
        setPcDownloadCheck(!pcDownloadCheck);
    }

    function handleLinkDownloadClick() {
        setPcDownloadCheck(false);
        setLinkDownloadCheck(!linkDownloadCheck);
    }

    function closeAllPopups() {
        setIsPhotoPopupOpen(false);
        setIsEditEmailModalOpen(false);
        setIsEditPasswordModalOpen(false);
    }

    return (
        <>
            <Switch>
                <Route exact path='/'>
                    <Home loggedIn={true}/>
                    <Main
                        loggedIn={true}
                        onPhotoClick={handlePhotoClick}
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
                    onEditEmailBtnClick={handleEditEmailBtnClick}
                    onEditPasswordBtnClick={handleEditPasswordBtnClick}
                />

                <ProtectedRoute
                    component={AddPhoto}
                    path='/addphoto'
                    loggedIn={true}
                    pcDownloadCheck={pcDownloadCheck}
                    linkDownloadCheck={linkDownloadCheck}
                    onPcDownloadClick={handlePcDownloadClick}
                    onLinkDownloadClick={handleLinkDownloadClick}
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
        </>
    );
}

export default App;