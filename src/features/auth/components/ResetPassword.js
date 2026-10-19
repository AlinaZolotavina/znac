import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { validateResetPasswordLink } from "../../../shared/utils/auth";
import Form from "../../../app/components/Form";
import Input from "../../../app/components/Input";
import AuthNavigation from "../../../app/components/AuthNavigation";
import newPasswordIcon from "../assets/new-password-icon.svg";

function ResetPassword({
  loggedIn,
  onLogout,
  onMenuClick,
  isMenuOpen,
  menuId,
  onResetPassword,
  isSendingReq,
  onContactClick,
}) {
  let { resetPasswordLink } = useParams();
  const [linkState, setLinkState] = useState("checking");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let expiryTimer;
    setLinkState("checking");
    validateResetPasswordLink(resetPasswordLink, controller.signal)
      .then(({ expiresAt }) => {
        if (controller.signal.aborted) return;
        setLinkState("valid");
        expiryTimer = setTimeout(
          () => setLinkState("invalid"),
          Math.max(0, new Date(expiresAt).getTime() - Date.now()),
        );
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setLinkState(err.code === "RESET_LINK_INVALID" ? "invalid" : "error");
      });
    return () => {
      controller.abort();
      clearTimeout(expiryTimer);
    };
  }, [resetPasswordLink, retry]);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  function handlePasswordChange(e) {
    if (e.target.value.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long");
    } else {
      setNewPasswordError("");
    }
    setNewPassword(e.target.value);
  }

  const [confirmPassword, setconfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  function handleConfirmPasswordChange(e) {
    if (e.target.value.length < 8) {
      setConfirmPasswordError("Password must be at least 8 characters long");
    } else {
      setConfirmPasswordError("");
    }
    setconfirmPassword(e.target.value);
  }

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (
      newPassword &&
      !newPasswordError &&
      confirmPassword &&
      !confirmPasswordError
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newPassword, newPasswordError, confirmPassword, confirmPasswordError]);

  async function handleReceiveEmail(e) {
    e.preventDefault();
    try {
      await onResetPassword(newPassword, confirmPassword, resetPasswordLink);
    } catch (err) {
      if (err.code === "RESET_LINK_INVALID") {
        setLinkState("invalid");
        setNewPassword("");
        setconfirmPassword("");
      }
    }
  }

  return (
    <main className="forgot-password">
      <AuthNavigation
        loggedIn={loggedIn}
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        isMenuOpen={isMenuOpen}
        menuId={menuId}
        onContactClick={onContactClick}
      />
      <div className="forgot-password__container">
        <img
          className="forgot-password__image"
          src={`${newPasswordIcon}`}
          alt="icon"
        />
        {linkState === "valid" ? (
          <Form
            formName="forgot-password"
            formClassname="form"
            titleClassname="form__title forgot-password__title"
            title="Create new password"
            titleTag="h1"
            buttonClassname="form__submit-btn"
            buttonText="Reset password"
            isFormValid={isFormValid}
            isSendingReq={isSendingReq}
            onSubmit={handleReceiveEmail}
          >
            <p className="form__subtitle">
              New password must be different from previously used one
            </p>
            <Input
              inputLabel="New password"
              placeholder="Enter new password"
              classname="input__field"
              inputType="password"
              inputValue={newPassword}
              onChange={handlePasswordChange}
              isSendingReq={isSendingReq}
              error={newPasswordError}
            />
            <Input
              inputLabel="Confirm password"
              placeholder="Enter new password again"
              classname="input__field"
              inputType="password"
              inputValue={confirmPassword}
              onChange={handleConfirmPasswordChange}
              isSendingReq={isSendingReq}
              error={confirmPasswordError}
            />
          </Form>
        ) : (
          <section className="form" aria-live="polite">
            <h1 className="form__title forgot-password__title">
              {linkState === "checking" && "Checking reset link…"}
              {linkState === "invalid" && "Link expired or already used"}
              {linkState === "error" && "Unable to check reset link"}
            </h1>
            {linkState === "invalid" && (
              <Link className="form__submit-btn" to="/signin/recovery">
                Request a new link
              </Link>
            )}
            {linkState === "error" && (
              <button
                className="form__submit-btn"
                onClick={() => setRetry((value) => value + 1)}
              >
                Try again
              </button>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default ResetPassword;
