import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthNavigation from "../../../app/components/AuthNavigation";
import api from "../../../shared/utils/api";
import updateEmailIcon from "../assets/update-email-icon.svg";

function ConfirmEmailUpdate({
  loggedIn,
  onLogout,
  onMenuClick,
  isMenuOpen,
  menuId,
  onUpdateEmail,
  onContactClick,
}) {
  const { token } = useParams();
  const [state, setState] = useState("checking");
  const [details, setDetails] = useState(null);
  const [retry, setRetry] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let expiryTimer;
    setState("checking");
    setError("");
    api
      .validateEmailChangeLink(token, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setDetails(result);
        setState("ready");
        expiryTimer = setTimeout(
          () => setState("invalid"),
          Math.max(0, new Date(result.expiresAt).getTime() - Date.now()),
        );
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState(
          err.code === "EMAIL_CHANGE_LINK_INVALID" ? "invalid" : "error",
        );
      });
    return () => {
      controller.abort();
      clearTimeout(expiryTimer);
    };
  }, [token, retry]);

  async function confirm() {
    if (sending) return;
    setSending(true);
    setError("");
    try {
      const result = await onUpdateEmail(token);
      if (!result.completed) setState("waiting");
    } catch (err) {
      if (err.code === "EMAIL_CHANGE_LINK_INVALID") setState("invalid");
      else
        setError(
          err.message || "Unable to confirm your email. Please try again.",
        );
    } finally {
      setSending(false);
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
        <img className="forgot-password__image" src={updateEmailIcon} alt="" />
        <section className="form confirm-email-update__form" aria-live="polite">
          <h1 className="form__title forgot-password__title">
            {state === "checking" && "Checking confirmation link..."}
            {state === "ready" && "Confirm your email change"}
            {state === "waiting" && "Email address confirmed"}
            {state === "invalid" && "Link expired or already used"}
            {state === "error" && "Unable to check confirmation link"}
          </h1>
          {state === "ready" && (
            <>
              <p className="form__subtitle">
                Confirm your {details.address} email address to change your
                account email to {details.pendingEmail}. Both inboxes must be
                confirmed.
              </p>
              {error && (
                <p className="form__subtitle" role="alert">
                  {error}
                </p>
              )}
              <button
                className="form__submit-btn"
                disabled={sending}
                onClick={confirm}
              >
                {sending ? "Confirming..." : "Confirm"}
              </button>
            </>
          )}
          {state === "waiting" && (
            <p className="form__subtitle">
              Open the other confirmation email to finish the change. Your
              account email stays unchanged until both addresses are confirmed.
            </p>
          )}
          {state === "invalid" && (
            <p className="form__subtitle">
              This link is no longer valid or belongs to another account. Sign
              in to the correct account or request a new email change from your
              profile.
            </p>
          )}
          {state === "error" && (
            <button
              className="form__submit-btn"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          )}
          {state !== "checking" && (
            <Link className="confirm-email-update__link" to="/profile">
              Back to profile
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}

export default ConfirmEmailUpdate;
