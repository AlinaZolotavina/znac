import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import Form from "./Form";
import Input from "./Input";
import { useState } from "react";
import BurgerMenuBtn from "./BurgerMenuBtn";
import UploadFileInfo from "./UploadFileInfo";
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
    const [photoLink, setPhotoLink] = useState('');
    const [photoLinkError, setPhotoLinkError] = useState('');
    const [photoFiles, setPhotoFiles] = useState([]);
    const [fileInfo, setFileInfo] = useState('Photo not selected');
    const [hashtags, setHashtags] = useState('');
    const [hashtagsError, setHashtagsError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [pcDownloadCheck, setPcDownloadCheck] = useState(true);
    const [linkDownloadCheck, setLinkDownloadCheck] = useState(false);
    const [googleDownloadCheck, setGoogleDownloadCheck] = useState(false);
    const [googlePhotoId, setGooglePhotoId] = useState('');
    const location = useLocation();
    const views = 0;
    let fileName;
    const [fileNames, setFileNames] = useState([]);
    
    useEffect(() => {
        clearInputs();
    }, [location.pathname]);

    useEffect(() => {
        if (photoFiles.length === 0) {
            setFileInfo('Photo not selected');
        } else {
            setFileInfo('');
        }
    }, [photoFiles])

    function clearInputs() {
        setPhotoLink('');
        setPhotoLinkError('');
        setHashtags('');
        setHashtagsError('');
        setLinkDownloadCheck(false);
        setGoogleDownloadCheck(false);
        setPcDownloadCheck(true);
        setFileNames([]);
        setFileInfo('Photo not selected');
        setPhotoFiles([]);
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
        if ((photoLink && hashtags && !photoLinkError && !hashtagsError) || (photoFiles.lenght !== 0 && hashtags && !hashtagsError)) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [photoLink, photoLinkError, hashtags, hashtagsError, photoFiles]);

    function handlePcDownloadClick() {
        setPcDownloadCheck(true);
        setGoogleDownloadCheck(false);
        setLinkDownloadCheck(false);
    }

    function handleLinkDownloadClick() {
        setPcDownloadCheck(false);
        setGoogleDownloadCheck(false);
        setLinkDownloadCheck(true);
    }

    function handleGoogleDownloadClick() {
        setPcDownloadCheck(false);
        setGoogleDownloadCheck(true);
        setLinkDownloadCheck(false);
    }

    async function handleUploadFromPc(e) {
        let addedFiles = [];
        let names = []
        const files = Array.from(e.target.files);
        for (const item of files) {
            fileName = await item.name.slice(0, -4);
            const webPFile = await convert(item, 50);
            names.push(`${fileName}.jpg`);
            addedFiles.push(webPFile);
            setPhotoFiles([addedFiles, ...photoFiles]);
            setFileNames(names);
        };
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
            onUploadPhotoToServer(photoFiles, hashtags, views);
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
                <div className='radio-buttons-container'>
                    <div
                        className={`radio-btn ${pcDownloadCheck ? 'radio-btn_state_active' : 'radio-btn_state_inactive'}`}
                        onClick={handlePcDownloadClick}
                    >
                        <input
                            type='radio'
                            className='radio-btn__input'
                        />
                        <label className='radio-btn__label radio-btn__label_type_pc' />
                        <span className='radio-btn__tooltip'>Upload photo from PC</span>
                    </div>
                    <div
                        className={`radio-btn ${googleDownloadCheck ? 'radio-btn_state_active' : 'radio-btn_state_inactive'}`}
                        onClick={handleGoogleDownloadClick}
                    >
                        <input
                            type='radio'
                            className='radio-btn__input'
                        />
                        <label className='radio-btn__label radio-btn__label_type_google-drive' />
                        <span className='radio-btn__tooltip'>Add photo via its Google Drive link</span>
                    </div>
                    <div
                        className={`radio-btn ${linkDownloadCheck ? 'radio-btn_state_active' : 'radio-btn_state_inactive'}`}
                        onClick={handleLinkDownloadClick}
                    >
                        <input 
                            type='radio'
                            className='radio-btn__input'
                        />
                        <label className='radio-btn__label radio-btn__label_type_link' />
                        <span className='radio-btn__tooltip'>Add photo via link</span>
                    </div>
                </div>
                {pcDownloadCheck ?
                    <div className='upload-container'>
                        <label className='upload-file'>
                            <input
                                name='photoFile'
                                className='upload-file__input'
                                type='file'
                                multiple
                                accept='.jpg'
                                onChange={handleUploadFromPc}
                            />
                            <span className='upload-file__btn'>
                                <div className='upload-file__icon'/>
                                Select photo
                            </span>
                            {/* <span className='upload-file__info'>{fileInfo}</span> */}
                        </label>
                        <ul className='upload-file__info'>
                            {photoFiles.length === 0 ?
                            <li className='upload-file__info_empty'>{fileInfo}</li>
                            : fileNames.map(n => (
                                <UploadFileInfo fileName={n} key={n}/>
                            ))}
                        </ul>
                    </div>
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