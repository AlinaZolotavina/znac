import { useContext, useEffect, useState } from "react";
import Input from "../../../app/components/Input";
import EditButton from "../../../app/components/EditButton";
import Header from "../../../app/components/Header";
import MainNav from "../../../app/components/MainNav";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";

function Profile({
  loggedIn,
  onEditEmailBtnClick,
  onEditPasswordBtnClick,
  onMenuClick,
  onLogout,
  isMenuOpen,
  menuId,
}) {
  const currentUser = useContext(CurrentUserContext);
  useEffect(() => {
    setUserEmail(currentUser.email);
    setPassword("********");
  }, [currentUser]);

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="profile">
      <Header className="header admin-header header_type_main-nav">
        <MainNav
          activeSection="photos"
          activeSubsection="profile"
          loggedIn={loggedIn}
          onLogout={onLogout}
          onMenuClick={onMenuClick}
          isMenuOpen={isMenuOpen}
          menuId={menuId}
        />
      </Header>
      <main className="profile__container">
        <h1 className="profile__title">Profile</h1>
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
            ariaLabel="Edit email"
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
            ariaLabel="Edit password"
          />
        </div>
      </main>
    </div>
  );
}

export default Profile;
