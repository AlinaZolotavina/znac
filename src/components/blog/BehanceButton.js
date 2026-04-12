/* eslint-disable jsx-a11y/anchor-has-content */
function BehanceButton({ classname }) {
  return (
    <a
      className={`${classname && `social__button_location_${classname}`} behance-button social__button`}
      href="https://www.behance.net/abekmetovadbab"
      target="_blank"
      rel="noreferrer"
    />
  );
}

export default BehanceButton;
