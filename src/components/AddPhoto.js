import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import Form from "./Form";
import Input from "./Input";
import { useState } from "react";
import BurgerMenuBtn from "./BurgerMenuBtn";
import { useEffect } from "react";

function AddPhoto({ 
    loggedIn,
    onGalleryClick,
    onContactClick,
    pcDownloadCheck,
    linkDownloadCheck,
    onPcDownloadClick,
    onLinkDownloadClick,
    onMenuClick,
    isSendingReq,
    onAddPhoto,
    }) {
    const [isClicked, setIsClicked] = useState(false);
    const [dropdownText, setDropdownText] = useState('Select download type');
    const [photoLink, setPhotoLink] = useState('');
    const [photoLinkError, setPhotoLinkError] = useState('');
    const [photoFile, setPhotoFile] = useState({});
    const [spanText, setSpanText] = useState('Attach photo');
    const [hashtags, setHashtags] = useState('');
    const [hashtagsError, setHashtagsError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [photoInputClassname, setPhotoInputClassname] = useState('photo-input');

    function handlePhotoLinkChange(e) {
        // eslint-disable-next-line no-useless-escape
        const regex = /^(https?:\/\/)(w{3})?([\da-z\.\-]+)\.([a-z\.]{2,6})([\w\.\-\_~:\/?#\[\]@!$&\'()*\+,;=])*#?\/?$/;
        if (!regex.test(e.target.value)) {
            setPhotoLinkError('Invalid url');
        } else if (!e.target.value) {
            setPhotoLinkError('You missed this field')
        } else {
            setPhotoLinkError('');
        }
        setPhotoLink(e.target.value);
    }
    
    function handlePhotoAttach(e) {
        setPhotoFile(e.target.files[0]);
        setSpanText('File was choosen');
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
        if ((photoLink || photoFile) && (dropdownText === 'PC download' || dropdownText === 'Link download') && hashtags && !photoLinkError && !hashtagsError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [photoLink, photoFile, photoLinkError, hashtags, hashtagsError, dropdownText]);

    function handleDropdownClick() {
        setIsClicked(!isClicked);
    }

    function handlePcDownloadClick() {
        setDropdownText('PC download');
        setPhotoInputClassname('photo-input_visible');
        onPcDownloadClick();
        setIsClicked(false);
    }

    function handleLinkDownloadClick() {
        setDropdownText('Link download');
        setPhotoInputClassname('photo-input_visible');
        onLinkDownloadClick();
        setIsClicked(false);
        setPhotoFile({});
        setSpanText('Attach file');
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAddPhoto({
            link: photoLink,
            hashtags: hashtags,
            views: "123",
        });
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
                <LogoutButton className='logout-btn' />
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
                <label className='input dropdown'>
                    Download type
                    <div
                        className={`input__field dropdown__btn ${isClicked && 'dropdown__btn_active'}`}
                        onClick={handleDropdownClick}
                    >
                        {dropdownText}
                    </div>
                    <div className={`dropdown__icon ${isClicked && 'dropdown__icon_clicked'}`}/>
                    <div className={`dropdown__options ${isClicked && 'dropdown__options_visible'}`}>
                        <div
                            className={`dropdown__option ${pcDownloadCheck && 'dropdown__option_selected'}`}
                            onClick={handlePcDownloadClick}
                        >
                            Download from PC
                            <div className={`dropdown__check-icon ${pcDownloadCheck && 'dropdown__check-icon_active'}`}/>
                        </div>
                        <div
                            className={`dropdown__option ${linkDownloadCheck && 'dropdown__option_selected'}`}
                            onClick={handleLinkDownloadClick}
                        >
                            Insert photo link
                            <div className={`dropdown__check-icon ${linkDownloadCheck && 'dropdown__check-icon_active'} `}/>
                        </div>
                    </div> 
                </label>
                {dropdownText === 'PC download' ?
                    <div className='photo-upload'>
                        <input
                            className='photo-upload__input'
                            type='file'
                            name='photo'
                            id='photo'
                            accept='.jpg, .jpeg, .png'
                            onChange={handlePhotoAttach}
                        />
                        <label className='photo-upload__label'>
                            <div className='photo-upload__icon' />
                            <span className='photo-upload__span'>{spanText}</span>
                        </label>
                    </div>
                    :
                    <Input
                        labelClassname={photoInputClassname}
                        inputLabel='Photo'
                        classname='input__field'
                        placeholder='Paste image link'
                        inputType='url'
                        value={photoLink}
                        onChange={handlePhotoLinkChange}
                        isSendingReq={isSendingReq}
                        error={photoLinkError}
                    />
                }            
                <Input 
                    inputLabel='Hastags'
                    placeholder='Enter hastags separated by spaces'
                    classname='input__field'
                    inputType='text'
                    value={hashtags}
                    onChange={handleHashtagsChange}
                    isSendingReq={isSendingReq}
                    error={hashtagsError}
                />
            </Form>
        </section>
    );
}

export default AddPhoto;