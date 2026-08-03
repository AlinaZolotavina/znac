import Social from "./Social";

function AboutHero() {
  return (
    <section
      className="page-hero about-hero"
      aria-labelledby="about-hero-title"
    >
      <div className="page-hero__content about-hero__content">
        <h1
          className="page-hero__title about-hero__title"
          id="about-hero-title"
        >
          About me
        </h1>
        <div className="about-hero__text">
          <p>
            Hi! I'm Alina, a frontend developer passionate about building clean,
            responsive, and user-friendly web applications.
          </p>
          <p>
            I build modern applications with React, TypeScript, and JavaScript,
            including the full-stack platform you're exploring right now.
          </p>
          <p>
            When I'm not coding, I create illustrations in Adobe Illustrator,
            explore new destinations, read books and take care of{" "}
            <a
              className="about-hero__link"
              href="https://www.instagram.com/fasya_the_cat?igsh=MWthZjFjNDR4eXZ0OA=="
              target="_blank"
              rel="noopener noreferrer"
            >
              my cat
            </a>
            .
          </p>
        </div>
        <Social />
      </div>
      <div
        className="page-hero__illustration about-hero__illustration"
        aria-hidden="true"
      />
    </section>
  );
}

export default AboutHero;
