import { useContext, useEffect, useState } from 'react';
import Input from "./Input";
import EditButton from "./EditButton";
import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import BurgerMenuBtn from "./BurgerMenuBtn";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Profile({
    loggedIn,
    onGalleryClick,
    onContactClick,
    onEditEmailBtnClick,
    onEditPasswordBtnClick,
    onMenuClick,
    email,
    onLogout
    }) {
    const currentUser = useContext(CurrentUserContext);
    useEffect(() => {
        setUserEmail(currentUser.email);
        setPassword('********');
    }, [currentUser]);

    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    
    return (
        <section className='profile'>
            <Header className='header admin-header'>
                <Navigation
                    loggedIn={loggedIn}
                    onHomeClick={() => {}}
                    onGalleryClick={onGalleryClick}
                    onContactClick={onContactClick}
                />
                <LogoutButton
                    className='logout-btn'
                    email={email}
                    onLogout={onLogout}
                />
            </Header>
            <BurgerMenuBtn onMenuClick={onMenuClick} />
            <div className='profile__container'>
                <div className='profile__email'>
                    <Input
                        inputLabel='E-mail'
                        placeholder=''
                        classname='input__field profile__input'
                        inputValue={userEmail}
                        inputType='text'
                        isSendingReq={true}
                    />
                    <EditButton classname='edit-btn edit-profile-btn' onClick={onEditEmailBtnClick} />
                </div>
                <div className='profile__password'>
                    <Input
                        inputLabel='Password'
                        placeholder=''
                        classname='input__field profile__input'
                        inputValue={password}
                        inputType='password'
                        isSendingReq={true}
                    />
                    <EditButton classname='edit-btn edit-profile-btn' onClick={onEditPasswordBtnClick} />
                </div> 
            </div>
                       
        </section>
        
    );
}

export default Profile;