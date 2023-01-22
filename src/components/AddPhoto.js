import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import Form from "./Form";
import Input from "./Input";
import { useState } from "react";
import BurgerMenuBtn from "./BurgerMenuBtn";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AddPhoto({ 
    loggedIn,
    onGalleryClick,
    onContactClick,
    onMenuClick,
    isSendingReq,
    onAddPhotoViaLink,
    email,
    onLogout,
    }) {
    const [photoLink, setPhotoLink] = useState('');
    const [photoLinkError, setPhotoLinkError] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [hashtagsError, setHashtagsError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const location = useLocation();

    useEffect(() => {
        clearInputs();
    }, [location.pathname]);

    function clearInputs() {
        setPhotoLink('');
        setPhotoLinkError('');
        setHashtags('');
        setHashtagsError('');
    }

    function handlePhotoLinkChange(e) {
        // eslint-disable-next-line no-useless-escape
        const regex = /^(https?:\/\/)(w{3})?([\da-z\.\-]+)\.([a-z\.]{2,6})([\w\.\-\_~:\/?#\[\]@!$&\'()*\+,;=])*#?\/?$/;
        if (!regex.test(e.target.value) && e.target.value.length !== 0) {
            setPhotoLinkError('Invalid url');
        } else if (e.target.value.length === 0) {
            setPhotoLinkError('You missed this field')
        } else {
            setPhotoLinkError('');
        }
        setPhotoLink(e.target.value);
    }

    function handleHashtagsChange(e) {
        const regex = /^[A-Za-zА-Яа-я0-9 _]*$/;
        if(e.target.value.length === 0) {
            setHashtagsError('You must add at least one hashtag')
        } else if (!regex.test(e.target.value)) {
            setHashtagsError('Only letters, numbers and underscores are allowed')
        } else {
            setHashtagsError('');
        }
        setHashtags(e.target.value);
    }

    useEffect(() => {
        if (photoLink && hashtags && !photoLinkError && !hashtagsError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [photoLink, photoLinkError, hashtags, hashtagsError]);

    function handleSubmit(e) {
        e.preventDefault();
        onAddPhotoViaLink({
            link: photoLink,
            hashtags: hashtags,
            views: 0,
        });
        clearInputs();
    }

    return (
        <section className='add-photo'>
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
            <Form
                formName='add-photo'
                formClassname='form add-photo__form'
                titleClassname='form__title'
                title='Add new photo'
                buttonClassname='form__submit-btn'
                buttonText='Add photo'
                isFormValid={isFormValid}
                isSendingReq={isSendingReq}
                onSubmit={handleSubmit}
            >            
                <Input
                    labelClassname=''
                    inputLabel='Photo'
                    classname='input__field'
                    placeholder='Paste image link'
                    inputType='url'
                    inputValue={photoLink}
                    onChange={handlePhotoLinkChange}
                    isSendingReq={isSendingReq}
                    error={photoLinkError}
                />         
                <Input 
                    inputLabel='Hashtags'
                    placeholder='Enter hashtags separated by spaces'
                    classname='input__field'
                    inputType='text'
                    inputValue={hashtags}
                    onChange={handleHashtagsChange}
                    isSendingReq={isSendingReq}
                    error={hashtagsError}
                />
            </Form>
        </section>
    );
}

export default AddPhoto;