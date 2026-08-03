function CV({ cvVerssion, language, onCvClick }) {
  return (
    <li className="cv__item">
      <div className="cv__icon" />
      <div className="cv__info">
        <h3 className="cv__role">Frontend Developer</h3>
        <p className="cv__version">{cvVerssion || language}</p>
        <button className="cv__download-button" type="button" onClick={onCvClick}>
          Download
        </button>
      </div>
    </li>
  );
}

export default CV;
