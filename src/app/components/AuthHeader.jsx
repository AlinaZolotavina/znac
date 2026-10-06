import ContactButton from "./ContactButton";

function AuthHeader({ onContactClick }) {
  return (
    <header className="auth-header">
      <ContactButton onClick={onContactClick} theme="main" />
    </header>
  );
}

export default AuthHeader;
