import CV from "./CV";

function CVs() {
  function downloadEnglishCV() {
    window.open(
      "https://drive.google.com/uc?id=1kV4ToweZH7tR0xR1whYc4IaNcwIUNcAI&export=download",
      "_blank",
    );
  }

  function downloadGermanCV() {
    window.open(
      "https://drive.google.com/uc?id=1YUy6-jv6Or-Vec7JTUUYKT6vn2Y06GH_&export=download",
      "_blank",
    );
  }

  function downloadRussianCV() {
    window.open(
      "https://drive.google.com/uc?id=1us5tWTE8tMQKbFv08dlnQ7E6EqMmDq0C&export=download",
      "_blank",
    );
  }

  return (
    <div className="background_color_blue">
      <div className="cv">
        <h2 className="section-title cv__title">CV</h2>
        <ul className="cv__container">
          <CV cvVerssion="English version" onCvClick={downloadEnglishCV} />
          <CV cvVerssion="German version" onCvClick={downloadGermanCV} />
          <CV cvVerssion="Russian version" onCvClick={downloadRussianCV} />
        </ul>
      </div>
    </div>
  );
}

export default CVs;
