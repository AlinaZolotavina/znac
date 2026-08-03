import CV from "./CV";

function CVs() {
  function downloadEnglishCV() {
    window.open(
      "https://drive.google.com/uc?id=1SLXRyFphK55S_LhoLQ1WOS2XIewMpkB-&export=download",
      "_blank",
    );
  }

  function downloadGermanCV() {
    window.open(
      "https://drive.google.com/uc?id=1rmyyPEx9k3mJqcAUzyu9ZYov9ssyufCZ&export=download",
      "_blank",
    );
  }

  function downloadRussianCV() {
    window.open(
      "https://drive.google.com/uc?id=1-o5qJEB6CTYC0ijDhi__t5VaP5SSpbF_&export=download",
      "_blank",
    );
  }

  return (
    <div className="background_color_blue">
      <div className="cv">
        <h2 className="section-title cv__title">CV</h2>
        <ul className="cv__container">
          <CV cvVerssion="Resume - English" onCvClick={downloadEnglishCV} />
          <CV cvVerssion="Lebenslauf - Deutsch" onCvClick={downloadGermanCV} />
          <CV cvVerssion="Резюме - русский" onCvClick={downloadRussianCV} />
        </ul>
      </div>
    </div>
  );
}

export default CVs;
