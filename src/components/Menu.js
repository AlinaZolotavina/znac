import CloseButton from './CloseButton';
import LogoutButton from './LogoutButton';

function Menu({ isOpen, loggedIn, onHomeClick, onProfileClick, onAddPhotoClick, onClose }) {
    return (
        <div className={`menu ${isOpen && 'menu_visible'}`}>
            <button className='menu__link' onClick={onHomeClick} >HOME</button>
            <button className='menu__link'onClick={onProfileClick} >PROFILE</button>
            <button className='menu__link' onClick={onAddPhotoClick} >ADD PHOTO</button>
            {loggedIn && <LogoutButton className='logout-btn' />}  
            <CloseButton classname='close-btn menu__close-btn' onClick={onClose} />
        </div>
    );
}

export default Menu;