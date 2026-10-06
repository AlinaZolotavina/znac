function ContactButton({ className = "", onClick, theme = "main" }) {
  return (
    <button
      className={`contact-button contact-button_theme_${theme} ${className}`}
      type="button"
      onClick={onClick}
      aria-label="Contact me"
    >
      <span className="contact-button__icon" aria-hidden="true" />
    </button>
  );
}

export default ContactButton;
