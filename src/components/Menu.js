import CloseButton from './CloseButton';
import LogoutButton from './LogoutButton';

function Menu({
    isOpen,
    loggedIn,
    onHomeClick, 
    onProfileClick,
    onAddPhotoClick,
    onGalleryClick,
    onContactClick,
    onClose,
    onLogout
    }) {
    function handleGalleryClick() {
        onClose();
        onGalleryClick();
    };

    function handleContactClick() {
        onClose();
        onContactClick();
    };
    
    return (
        <div className={`menu ${isOpen && 'menu_visible'}`}>
            <button className='menu__link' onClick={onHomeClick} >HOME</button>
            {loggedIn ? 
                <button className='menu__link' onClick={onProfileClick} >PROFILE</button>
                : <button className='menu__link' onClick={handleGalleryClick} >GALLERY</button>
            }
            {loggedIn ? 
                <button className='menu__link' onClick={onAddPhotoClick} >ADD PHOTO</button>
                : <button className='menu__link' onClick={handleContactClick} >CONTACT</button>
            }
            {loggedIn && <LogoutButton className='logout-btn' onLogout={onLogout} />}  
            <CloseButton classname='close-btn menu__close-btn' onClick={onClose} />
        </div>
    );
}

export default Menu;