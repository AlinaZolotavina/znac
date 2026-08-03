import Social from "./Social";

function BlogPromo() {
  return (
    <div className="blog-promo">
      <div className="blog-promo__info">
        <>
          <h1 className="blog-promo__text blog-promo__text_location_main-page">
            Hi there!
            <br />
            I'm <span className="blog-promo__name">Alina.</span>
          </h1>
          <p className="blog-promo__description">
            Frontend developer building clean, user-friendly web experiences. I
            love code, design, books and taking care of{" "}
            <a
              className="blog-promo__highlighted-text  blog-promo__highlighted-text_type_link"
              href="https://www.instagram.com/fasya_the_cat?igsh=MWthZjFjNDR4eXZ0OA=="
              target="_blank"
              rel="noopener noreferrer"
            >
              my cat
            </a>
            .
          </p>
        </>
        <Social />
      </div>
      <div className="blog-promo__image" />
    </div>
  );
}

export default BlogPromo;
