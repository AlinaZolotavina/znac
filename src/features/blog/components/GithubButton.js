function GithubButton({ classname }) {
  return (
    <a
      className={`${classname && `social__button_location_${classname}`} github-button social__button`}
      href="https://github.com/alinazolotavina/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="visually-hidden">Github profile</span>
    </a>
  );
}

export default GithubButton;
