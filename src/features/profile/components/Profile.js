import { useContext, useEffect, useState } from "react";
import Input from "../../../app/components/Input";
import EditButton from "../../../app/components/EditButton";
import Header from "../../../app/components/Header";
import Navigation from "../../../app/components/Navigation";
import LogoutButton from "../../../app/components/LogoutButton";
import BurgerMenuBtn from "../../../app/components/BurgerMenuBtn";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";

function Profile({
  loggedIn,
  onHomeClick,
  onBlogClick,
  onGalleryClick,
  onContactClick,
  onEditEmailBtnClick,
  onEditPasswordBtnClick,
  onMenuClick,
  email,
  onLogout,
}) {
  const currentUser = useContext(CurrentUserContext);
  useEffect(() => {
    setUserEmail(currentUser.email);
    setPassword("********");
  }, [currentUser]);

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="profile">
      <Header className="header admin-header">
        <Navigation
          loggedIn={loggedIn}
          onHomeClick={onHomeClick}
          onBlogClick={onBlogClick}
        />
        {loggedIn && (
          <LogoutButton
            className="logout-btn logout-btn_position_nav"
            email={email}
            onLogout={onLogout}
          />
        )}
      </Header>
      <BurgerMenuBtn onMenuClick={onMenuClick} />
      <div className="profile__container">
        <div className="profile__email">
          <Input
            inputLabel="E-mail"
            placeholder=""
            classname="input__field profile__input"
            inputValue={userEmail}
            inputType="text"
            isSendingReq={true}
          />
          <EditButton
            classname="edit-btn edit-profile-btn"
            onClick={onEditEmailBtnClick}
          />
        </div>
        <div className="profile__password">
          <Input
            inputLabel="Password"
            placeholder=""
            classname="input__field profile__input"
            inputValue={password}
            inputType="password"
            isSendingReq={true}
          />
          <EditButton
            classname="edit-btn edit-profile-btn"
            onClick={onEditPasswordBtnClick}
          />
        </div>
      </div>
    </section>
  );
}

export default Profile;
