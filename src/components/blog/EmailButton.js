/* eslint-disable jsx-a11y/anchor-has-content */
function EmailButton({ classname }) {
  return (
    <a
      className={`${classname && `social__button_location_${classname}`} email-button social__button`}
      href='mailto:albekmerus@gmail.com"'
    />
  );
}

export default EmailButton;
