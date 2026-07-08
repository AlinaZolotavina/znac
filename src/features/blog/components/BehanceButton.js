function BehanceButton({ classname }) {
  return (
    <a
      className={`${classname && `social__button_location_${classname}`} behance-button social__button`}
      href="https://www.behance.net/abekmetovadbab"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="visually-hidden">Behance profile</span>
    </a>
  );
}

export default BehanceButton;
