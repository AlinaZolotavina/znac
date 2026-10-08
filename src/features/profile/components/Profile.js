import { useContext, useEffect, useRef, useState } from "react";
import Input from "../../../app/components/Input";
import EditButton from "../../../app/components/EditButton";
import Header from "../../../app/components/Header";
import MainNav from "../../../app/components/MainNav";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
import {
  useSiteSettingsQuery,
  useUpdateAccentColorMutation,
  useUpdateHeroImageMutation,
  useUpdateSignupEnabledMutation,
} from "../../../shared/queries/siteSettingsQueries";
import mainHeroFallback from "../../../app/assets/main-hero.webp";
import editIcon from "../../../app/assets/blog-edit-btn.svg";
import galleryHeroFallback from "../../gallery/assets/gallery-hero.webp";
import colorsIcon from "../assets/colors-icon.svg";
import imagesIcon from "../assets/images-icon.svg";
import settingsIcon from "../assets/settings-icon.svg";

const DEFAULT_ACCENT_COLOR = "#c5e7bc";
const MAX_HERO_IMAGE_SIZE = 30 * 1024 * 1024;
const allowedHeroImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function HeroImageCard({ title, slot, imageUrl }) {
  const inputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const updateHeroImageMutation = useUpdateHeroImageMutation();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const isLoading = updateHeroImageMutation.isPending;
  const heroImageUrl = previewUrl || uploadedImageUrl || imageUrl;

  function clearPreviewUrl({ resetState = true } = {}) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (resetState) {
      setPreviewUrl(null);
    }
  }

  function handleReplaceClick() {
    if (isLoading) {
      return;
    }

    inputRef.current?.click();
  }

  async function handleFileChange(event) {
    if (isLoading) {
      event.target.value = "";
      return;
    }

    const [file] = event.target.files;

    if (!file) {
      return;
    }

    if (!allowedHeroImageTypes.has(file.type)) {
      clearPreviewUrl();
      setStatus("error");
      setError("Use JPEG, PNG or WEBP image");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_HERO_IMAGE_SIZE) {
      clearPreviewUrl();
      setStatus("error");
      setError("Image must be 30 MB or smaller");
      event.target.value = "";
      return;
    }

    clearPreviewUrl();

    const nextPreviewUrl = URL.createObjectURL(file);
    const formData = new FormData();

    formData.append("image", file);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    setStatus(null);
    setError("");

    try {
      const updatedHeroImage = await updateHeroImageMutation.mutateAsync({
        slot,
        formData,
      });
      setUploadedImageUrl(updatedHeroImage?.url || null);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not replace image");
    } finally {
      clearPreviewUrl();
      event.target.value = "";
    }
  }

  useEffect(
    () => () => {
      clearPreviewUrl({ resetState: false });
    },
    [],
  );

  useEffect(() => {
    setUploadedImageUrl((currentUploadedImageUrl) =>
      currentUploadedImageUrl === imageUrl ? null : currentUploadedImageUrl,
    );
  }, [imageUrl]);

  return (
    <article className="profile__hero-card">
      <h3 className="profile__hero-card-title">{title}</h3>
      <div className="profile__hero-preview">
        <img className="profile__hero-image" src={heroImageUrl} alt="" />
      </div>
      <input
        ref={inputRef}
        className="profile__hero-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isLoading}
        aria-label={`Replace ${title}`}
      />
      <button
        className="profile__hero-button"
        type="button"
        onClick={handleReplaceClick}
        disabled={isLoading}
      >
        <img className="profile__button-icon" src={editIcon} alt="" />
        {isLoading ? "Replacing..." : "Replace image"}
      </button>
      <p
        className={`profile__hero-status ${
          status ? `profile__hero-status_state_${status}` : ""
        }`}
        role={status === "error" ? "alert" : "status"}
      >
        {status === "success" && "Image updated"}
        {status === "error" && error}
      </p>
    </article>
  );
}

function Profile({
  loggedIn,
  onEditEmailBtnClick,
  onEditPasswordBtnClick,
  onMenuClick,
  onLogout,
  isMenuOpen,
  menuId,
  onContactClick,
}) {
  const currentUser = useContext(CurrentUserContext);
  const isAdmin = currentUser?.role === "admin";
  const { data: siteSettings } = useSiteSettingsQuery();
  const updateAccentColorMutation = useUpdateAccentColorMutation();
  const updateSignupEnabledMutation = useUpdateSignupEnabledMutation();
  const colorPickerRef = useRef(null);
  const [signupStatus, setSignupStatus] = useState(null);
  const [signupError, setSignupError] = useState("");
  const mainHeroUrl = siteSettings?.heroes.main?.url || mainHeroFallback;
  const galleryHeroUrl = siteSettings?.heroes.gallery?.url || galleryHeroFallback;
  const savedAccentColor =
    siteSettings?.colors?.accent?.value || DEFAULT_ACCENT_COLOR;
  const signupEnabled = Boolean(siteSettings?.auth.signupEnabled);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
  const [accentStatus, setAccentStatus] = useState(null);
  const [accentError, setAccentError] = useState("");
  const isAccentColorChanged =
    accentColor.toLowerCase() !== savedAccentColor.toLowerCase();

  useEffect(() => {
    setUserEmail(currentUser.email);
    setPassword("********");
  }, [currentUser]);

  useEffect(() => {
    setAccentColor(savedAccentColor);
  }, [savedAccentColor]);

  useEffect(() => {
    function handlePointerDown(event) {
      const colorPicker = colorPickerRef.current;

      if (
        colorPicker &&
        document.activeElement === colorPicker &&
        !colorPicker.contains(event.target)
      ) {
        colorPicker.blur();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignupToggle() {
    setSignupStatus(null);
    setSignupError("");

    try {
      await updateSignupEnabledMutation.mutateAsync(!signupEnabled);
      setSignupStatus("success");
    } catch (err) {
      setSignupStatus("error");
      setSignupError(err.message || "Could not update sign up setting");
    }
  }

  function handleAccentColorChange(event) {
    setAccentColor(event.target.value);
    setAccentStatus(null);
    setAccentError("");
  }

  function handleAccentColorReset() {
    setAccentColor(savedAccentColor);
    setAccentStatus(null);
    setAccentError("");
  }

  async function handleAccentColorSubmit(event) {
    event.preventDefault();
    setAccentStatus(null);
    setAccentError("");

    if (!hexColorPattern.test(accentColor)) {
      setAccentStatus("error");
      setAccentError("Use HEX format, for example #c5e7bc");
      return;
    }

    try {
      await updateAccentColorMutation.mutateAsync(accentColor);
      setAccentStatus("success");
    } catch (err) {
      setAccentStatus("error");
      setAccentError(err.message || "Could not update accent color");
    }
  }

  return (
    <div className={`profile ${isAdmin ? "profile_admin" : ""}`}>
      <Header className="header admin-header header_type_main-nav">
        <MainNav
          loggedIn={loggedIn}
          onLogout={onLogout}
          onMenuClick={onMenuClick}
          isMenuOpen={isMenuOpen}
          menuId={menuId}
          onContactClick={onContactClick}
        />
      </Header>
      <main className="profile__container">
        {!isAdmin ? (
          <>
            <h1 className="profile__title">Profile</h1>
            <div className="profile__email">
              <Input
                inputLabel="E-mail"
                placeholder=""
                classname="input__field profile__input"
                inputValue={userEmail}
                inputType="text"
                isSendingReq={true}
                hideError
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
                inputType="text"
                isSendingReq={true}
                hideError
              />
              <EditButton
                classname="edit-btn edit-profile-btn"
                onClick={onEditPasswordBtnClick}
                ariaLabel="Edit password"
              />
            </div>
          </>
        ) : (
          <>
            <div className="profile__intro">
              <h1 className="profile__title">Profile & Settings</h1>
            </div>

            <section className="profile__section">
              <div className="profile__section-header">
                <span
                  className="profile__section-icon profile__section-icon_type_profile"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="profile__section-title">Profile</h2>
                  <p className="profile__section-description">
                    Manage your account information.
                  </p>
                </div>
              </div>
              <div className="profile__divider" />
              <div className="profile__field-row">
                <Input
                  inputLabel="E-mail"
                  placeholder=""
                  classname="input__field profile__input"
                  inputValue={userEmail}
                  inputType="text"
                  isSendingReq={true}
                  hideError
                />
                <EditButton
                  classname="edit-btn edit-profile-btn"
                  onClick={onEditEmailBtnClick}
                  ariaLabel="Edit email"
                />
              </div>
              <div className="profile__field-row">
                <Input
                  inputLabel="Password"
                  placeholder=""
                  classname="input__field profile__input"
                  inputValue={password}
                  inputType="text"
                  isSendingReq={true}
                  hideError
                />
                <EditButton
                  classname="edit-btn edit-profile-btn"
                  onClick={onEditPasswordBtnClick}
                  ariaLabel="Edit password"
                />
              </div>
            </section>

            <section className="profile__section">
              <div className="profile__section-header">
                <img
                  className="profile__section-icon"
                  src={imagesIcon}
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <h2 className="profile__section-title">Hero Images</h2>
                  <p className="profile__section-description">
                    Upload and manage hero images for different pages.
                  </p>
                </div>
              </div>
              <div className="profile__divider" />
              <div className="profile__hero-grid">
                <HeroImageCard
                  title="Main page hero"
                  slot="main"
                  imageUrl={mainHeroUrl}
                />
                <HeroImageCard
                  title="Gallery hero"
                  slot="gallery"
                  imageUrl={galleryHeroUrl}
                />
              </div>
            </section>

            <section className="profile__section">
              <div className="profile__section-header">
                <img
                  className="profile__section-icon"
                  src={colorsIcon}
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <h2 className="profile__section-title">Colors</h2>
                  <p className="profile__section-description">
                    Configure the main page accent color.
                  </p>
                </div>
              </div>
              <div className="profile__divider" />
              <form
                className="profile__color-form"
                onSubmit={handleAccentColorSubmit}
              >
                <label className="profile__color-field">
                  <span className="profile__setting-title">Accent color</span>
                  <span className="profile__setting-description">
                    Used for main page tags, buttons and accent text.
                  </span>
                  <span className="profile__color-controls">
                    <input
                      ref={colorPickerRef}
                      className="profile__color-picker"
                      type="color"
                      value={accentColor}
                      onChange={handleAccentColorChange}
                      aria-label="Accent color picker"
                    />
                    <input
                      className="profile__color-input"
                      type="text"
                      value={accentColor}
                      onChange={handleAccentColorChange}
                      maxLength="7"
                      spellCheck="false"
                      aria-label="Accent color hex value"
                    />
                  </span>
                </label>
                <div className="profile__color-actions">
                  <button
                    className="profile__hero-button profile__color-submit"
                    type="submit"
                    disabled={
                      updateAccentColorMutation.isPending ||
                      !isAccentColorChanged
                    }
                  >
                    {updateAccentColorMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="profile__hero-button profile__color-reset"
                    type="button"
                    onClick={handleAccentColorReset}
                    disabled={
                      updateAccentColorMutation.isPending ||
                      !isAccentColorChanged
                    }
                  >
                    Reset
                  </button>
                </div>
                <p
                  className={`profile__hero-status ${
                    accentStatus
                      ? `profile__hero-status_state_${accentStatus}`
                      : ""
                  }`}
                  role={accentStatus === "error" ? "alert" : "status"}
                >
                  {accentStatus === "success" && "Color updated"}
                  {accentStatus === "error" && accentError}
                </p>
              </form>
            </section>

            <section className="profile__section">
              <div className="profile__section-header">
                <img
                  className="profile__section-icon"
                  src={settingsIcon}
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <h2 className="profile__section-title">Site Settings</h2>
                  <p className="profile__section-description">
                    Configure general site settings.
                  </p>
                </div>
              </div>
              <div className="profile__divider" />
              <div className="profile__setting-row">
                <div>
                  <h3 className="profile__setting-title">Sign up</h3>
                  <p className="profile__setting-description">
                    Allow new users to create an account.
                  </p>
                  <p
                    className={`profile__hero-status ${
                      signupStatus
                        ? `profile__hero-status_state_${signupStatus}`
                        : ""
                    }`}
                    role={signupStatus === "error" ? "alert" : "status"}
                  >
                    {signupStatus === "success" && "Setting updated"}
                    {signupStatus === "error" && signupError}
                  </p>
                </div>
                <button
                  className={`profile__switch ${
                    signupEnabled ? "profile__switch_checked" : ""
                  }`}
                  type="button"
                  role="switch"
                  aria-checked={signupEnabled}
                  onClick={handleSignupToggle}
                  disabled={updateSignupEnabledMutation.isPending}
                >
                  <span className="profile__switch-thumb" />
                  <span className="profile__switch-label">
                    {signupEnabled ? "Enabled" : "Disabled"}
                  </span>
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
