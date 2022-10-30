import Input from "./Input";
import EditButton from "./EditButton";
import Header from "./Header";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";

function Profile({ onEditEmailBtnClick, onEditPasswordBtnClick }) {
    return (
        <section className='profile'>
            <Header className='header admin-header'>
                <Navigation
                    className="nav"
                    firstLink='HOME'
                    secondLink='PROFILE'
                    thirdLink='ADD PHOTO'
                />
                <LogoutButton />
            </Header>
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