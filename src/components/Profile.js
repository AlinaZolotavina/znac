import Input from "./Input";
import EditButton from "./EditButton";
import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import BurgerMenuBtn from "./BurgerMenuBtn";

function Profile({ loggedIn, onGalleryClick, onContactClick, onEditEmailBtnClick, onEditPasswordBtnClick, onMenuClick }) {
    return (
        <section className='profile'>
            <Header className='header admin-header'>
                <Navigation
                    loggedIn={loggedIn}
                    onHomeClick={() => {}}
                    onGalleryClick={onGalleryClick}
                    onContactClick={onContactClick}
                />
                <LogoutButton className='logout-btn'/>
            </Header>
            <BurgerMenuBtn onMenuClick={onMenuClick} />
            <div className='profile__container'>
                <div className='profile__email'>
                    <Input
                        inputLabel='E-mail'
                        placeholder=''
                        classname='input__field profile__input'
                    />
                    <EditButton classname='edit-btn edit-profile-btn' onClick={onEditEmailBtnClick} />
                </div>
                <div className='profile__password'>
                    <Input
                        inputLabel='Password'
                        placeholder=''
                        classname='input__field profile__input'
                    />
                    <EditButton classname='edit-btn edit-profile-btn' onClick={onEditPasswordBtnClick} />
                </div> 
            </div>
                       
        </section>
        
    );
}

export default Profile;