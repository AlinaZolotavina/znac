import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import Form from "./Form";
import Input from "./Input";
import { useState } from "react";
import BurgerMenuBtn from "./BurgerMenuBtn";
import { useEffect  } from "react";
import { useLocation } from "react-router-dom";

function AddPhoto({ 
    loggedIn,
    onGalleryClick,
    onContactClick,
    onMenuClick,
    isSendingReq,
    onAddPhotoViaLink,
    onUploadPhotoToServer,
    email,
    onLogout,
    }) {
    const [isClicked, setIsClicked] = useState(false);
    const [dropdownText, setDropdownText] = useState('Select download type');
    const [photoLink, setPhotoLink] = useState('');
    const [photoLinkError, setPhotoLinkError] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [fileInfo, setFileInfo] = useState('Photo not selected');
    const [hashtags, setHashtags] = useState('');
    const [hashtagsError, setHashtagsError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [pcDownloadCheck, setPcDownloadCheck] = useState(false);
    const [linkDownloadCheck, setLinkDownloadCheck] = useState(false);
    const [googleDownloadCheck, setGoogleDownloadCheck] = useState(false);
    const [googlePhotoId, setGooglePhotoId] = useState('');
    const location = useLocation();
    const views = 0;
    let fileName;
    
    useEffect(() => {
        clearInputs();
    }, [location.pathname]);

    function clearInputs() {
        setPhotoLink('');
        setPhotoLinkError('');
        setDropdownText('Select download type');
        setIsClicked(false);
        setHashtags('');
        setHashtagsError('');
        setLinkDownloadCheck(false);
        setGoogleDownloadCheck(false);
        setPcDownloadCheck(false);
        // setPhotoFile(null);
        setFileInfo('Photo not selected');
    }

    function handlePhotoLinkChange(e) {
        // eslint-disable-next-line no-useless-escape
        const regex = /^(https?:\/\/)(w{3})?([\da-z\.\-]+)\.([a-z\.]{2,6})([\w\.\-\_%~:\/?#\[\]@!$&\'()*\+,;=])*#?\/?$/;
        if (!regex.test(e.target.value) && e.target.value.length !== 0) {
            setPhotoLinkError('Invalid url');
        } else if (e.target.value.length === 0) {
            setPhotoLinkError('You missed this field')
        } else {
            setPhotoLinkError('');
        }
        setPhotoLink(e.target.value);
    }

    useEffect(() => {
        if (googleDownloadCheck) {
            setGooglePhotoId(photoLink.split('/')[5]);
        }
    }, [photoLink, googleDownloadCheck])

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
        if ((photoLink && hashtags && !photoLinkError && !hashtagsError) || (photoFile && hashtags && !hashtagsError)) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [photoLink, photoLinkError, hashtags, hashtagsError, photoFile]);

    function handleDropdownClick() {
        setIsClicked(!isClicked);
    }

    function handlePcDownloadClick() {
        setDropdownText('Upload from PC');
        setPcDownloadCheck(true);
        setGoogleDownloadCheck(false);
        setLinkDownloadCheck(false);
        setIsClicked(false);
    }

    function handleLinkDownloadClick() {
        setDropdownText('Link download');
        setPcDownloadCheck(false);
        setGoogleDownloadCheck(false);
        setLinkDownloadCheck(true);
        setIsClicked(false);
    }

    function handleGoogleDownloadClick() {
        setDropdownText('Download with Google Drive link');
        setPcDownloadCheck(false);
        setGoogleDownloadCheck(true);
        setLinkDownloadCheck(false);
        setIsClicked(false);
    
    }

    async function handleUploadFromPc(e) {
        setPhotoFile(e.target.files[0]);
        // convert(photoFile);
        fileName = e.target.files[0].name.slice(0, -4);
        setFileInfo(e.target.files[0].name);
        if (e.target.files[0]) {
            const webPFile = await convert(e.target.files[0], 50);
            console.log(webPFile);
            setPhotoFile(webPFile);
        } else {
            console.error('Error converting JPG to AVIF');
        }      
    }

    const convert = (jpgFile) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const webPData = reader.result;
                        const webPBlob = new Blob([webPData], { type: 'image/webp' });

                        const webPFile = new File([webPBlob], `${fileName}.webp`);
                        resolve(webPFile);
                    };
                    reader.onerror = reject;

                    reader.readAsArrayBuffer(blob);
                }, 'image/webp', .5);
            };
            img.onerror = reject;

            img.src = URL.createObjectURL(jpgFile);
        });
    }

    function handleSubmit(e) { 
        e.preventDefault();
        if (linkDownloadCheck) {
            onAddPhotoViaLink({
                link: photoLink,
                hashtags: hashtags,
                views,
            });
        } else if (googleDownloadCheck) {
            onAddPhotoViaLink({
                link: `https://drive.google.com/uc?export=view&id=${googlePhotoId}`,
                hashtags: hashtags,
                views,
            });
        } else if (pcDownloadCheck) {
            const formData = new FormData();
            if (photoFile) {
                formData.append('file', photoFile);
            }
            onUploadPhotoToServer(formData, hashtags, views);
        };
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
                            Upload from PC
                            <div className={`dropdown__check-icon ${pcDownloadCheck && 'dropdown__check-icon_active'}`}/>
                        </div>
                        <div
                            className={`dropdown__option ${googleDownloadCheck && 'dropdown__option_selected'}`}
                            onClick={handleGoogleDownloadClick}
                        >
                            Download with Google Drive link
                            <div className={`dropdown__check-icon ${googleDownloadCheck && 'dropdown__check-icon_active'}`}/>
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
                {pcDownloadCheck ?
                    <label className='upload-file'>
                        <input
                            name='photoFile'
                            className='upload-file__input'
                            type='file'
                            accept='.jpg'
                            onChange={handleUploadFromPc}
                        />
                        <span className='upload-file__btn'>
                            <div className='upload-file__icon'/>
                            Select photo
                        </span>
                        <span className='upload-file__info'>{fileInfo}</span>
                    </label>
                    : <Input
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
                }
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