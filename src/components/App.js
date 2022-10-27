import Home from './Home';
import Main from './Main';
import Footer from './Footer';
import PhotoPopup from './PhotoPopup';

import { useState } from 'react';

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
            <Home />
            <Main onPhotoClick={handlePhotoClick} />
            <Footer />
            <PhotoPopup isOpen={isPhotoPopupOpen} photo={selectedPhoto} onClose={closeAllPopups} />
        </>
    );
}

export default App;