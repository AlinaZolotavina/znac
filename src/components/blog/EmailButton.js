function EmailButton({ classname }) {
  return (
    <a
      className={`${classname && `social__button_location_${classname}`} email-button social__button`}
      href="mailto:albekmerus@gmail.com"
    >
      <span className="visually-hidden">Send email</span>
    </a>
  );
}

export default EmailButton;
