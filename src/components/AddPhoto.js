import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import Form from "./Form";
import Input from "./Input";
import { useState } from "react";

function AddPhoto({ pcDownloadCheck, linkDownloadCheck, onPcDownloadClick, onLinkDownloadClick}) {
    const [isClicked, setIsClicked] = useState(false);

    function handleDropdownClick() {
        setIsClicked(!isClicked);
    }

    return (
        <section className='add-photo'>
            <Header className='header admin-header'>
                <Navigation
                    className="nav"
                    firstLink='HOME'
                    secondLink='PROFILE'
                    thirdLink='ADD PHOTO'
                />
                <LogoutButton />
            </Header>
            <Form
                formClassname='form'
                titleClassname='form__title'
                title='Add new photo'
                buttonClassname='form__submit-btn'
                buttonText='Add photo'
            >
                <label className='input dropdown'>
                    Download type
                    <div
                        className={`input__field dropdown__btn ${isClicked && 'dropdown__btn_active'}`}
                        onClick={handleDropdownClick}
                    >
                        Select download type
                    </div>
                    <div className={`dropdown__icon ${isClicked && 'dropdown__icon_clicked'}`}/>
                    <div className={`dropdown__options ${isClicked && 'dropdown__options_visible'}`}>
                        <div
                            className={`dropdown__option ${pcDownloadCheck && 'dropdown__option_selected'}`}
                            onClick={onPcDownloadClick}
                        >
                            Download from PC
                            <div className={`dropdown__check-icon ${pcDownloadCheck && 'dropdown__check-icon_active'}`}/>
                        </div>
                        <div
                            className={`dropdown__option ${linkDownloadCheck && 'dropdown__option_selected'}`}
                            onClick={onLinkDownloadClick}
                        >
                            Insert photo link
                            <div className={`dropdown__check-icon ${linkDownloadCheck && 'dropdown__check-icon_active'} `}/>
                        </div>
                    </div> 
                </label>               
                <Input 
                    inputLabel='Photo'
                    placeholder='Select image'
                    classname='input__field'
                />
                <Input 
                    inputLabel='Hastags'
                    placeholder='Enter hastags separated by spaces'
                    classname='input__field'
                />
            </Form>
        </section>
    );
}

export default AddPhoto;