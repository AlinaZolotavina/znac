import CV from "./CV";

function CVs() {
  function downloadEnglishCV() {
    window.open(
      "https://drive.google.com/uc?id=1SmrEQZna7aXwhAEstin6K50kvS207xJT&export=download",
      "_blank",
    );
  }

  function downloadGermanCV() {
    window.open(
      "https://drive.google.com/uc?id=14mxeBWftSW8PZESXdrls6G4hq-xWeJkW&export=download",
      "_blank",
    );
  }

  function downloadRussianCV() {
    window.open(
      "https://drive.google.com/uc?id=1HthVfkCUE3jgD1bIQkvGDax2WtqZxMrA&export=download",
      "_blank",
    );
  }

  return (
    <div className="background_color_blue">
      <section className="cv">
        <h2 className="section-title cv__title">CV</h2>
        <ul className="cv__container">
          <CV cvVerssion="Resume - English" onCvClick={downloadEnglishCV} />
          <CV cvVerssion="Lebenslauf - Deutsch" onCvClick={downloadGermanCV} />
          <CV cvVerssion="Резюме - русский" onCvClick={downloadRussianCV} />
        </ul>
      </section>
    </div>
  );
}

export default CVs;
