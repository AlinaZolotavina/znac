/* eslint-disable jsx-a11y/anchor-has-content */
function GithubButton({ classname }) {
  return (
    <a
      className={`${classname && `social__button_location_${classname}`} github-button social__button`}
      href="https://github.com/alinazolotavina/"
      target="_blank"
      rel="noreferrer"
    />
  );
}

export default GithubButton;
