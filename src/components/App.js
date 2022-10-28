import Home from './Home';
import Main from './Main';
import Footer from './Footer';
import PhotoPopup from './PhotoPopup';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Profile from './Profile';
import AddPhoto from './AddPhoto';

import { useState } from 'react';
import { Switch, Route } from 'react-router-dom';


function App() {
    const [isPhotoPopupOpen, setIsPhotoPopupOpened] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState({});

    function handlePhotoClick(photo) {
        setIsPhotoPopupOpened(true);
        setSelectedPhoto(photo);
    }

    function closeAllPopups() {
        setIsPhotoPopupOpened(false);
    }

    return (
        <>
            <Switch>
                <Route exact path='/'>
                    <Home />
                    <Main onPhotoClick={handlePhotoClick} />
                    <Footer />
                </Route>

                <Route path='/signin'>
                    <SignIn />
                </Route>

                <Route path='/signup'>
                    <SignUp />
                </Route>

                <Route path='/passwordreset'>

                </Route>

                <ProtectedRoute
                    component={Profile}
                    loggedIn={true}
                    path='/profile'
                />

                <ProtectedRoute
                    component={AddPhoto}
                    loggedIn={true}
                    path='/addphoto'
                />



            </Switch>

            {/* <PhotoPopup isOpen={isPhotoPopupOpen} photo={selectedPhoto} onClose={closeAllPopups} /> */}
            
        </>
    );
}

export default App;