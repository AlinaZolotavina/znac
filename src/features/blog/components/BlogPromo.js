import { useLocation } from "react-router-dom";
import Social from "./Social";

function BlogPromo() {
  const location = useLocation();
  return (
    <div className="blog-promo">
      <div className="blog-promo__image" />
      <div className="blog-promo__info">
        {location.pathname === "/alina" && (
          <h1 className="blog-promo__text blog-promo__text_location_main-page">
            Hi there!
            <br />
            I'm <span className="blog-promo__highlighted-text">Alina</span>
          </h1>
        )}
        {location.pathname === "/alina/about" && (
          <h1 className="blog-promo__text blog-promo__text_location_about">
            Hi! My name is Alina. I'm a Frontend Developer who enjoys building
            modern web applications with React, TypeScript and JavaScript. In my
            free time I create vector graphic in AI, do some{" "}
            <a
              className="blog-promo__highlighted-text blog-promo__highlighted-text_type_link"
              href="https://www.behance.net/gallery/133689531/Enjoy-your-Korea"
              target="_blank"
              rel="noopener noreferrer"
            >
              print designs
            </a>
            , read books and take care of{" "}
            <a
              className="blog-promo__highlighted-text blog-promo__highlighted-text_type_link"
              href="https://www.instagram.com/fasya_the_cat?igsh=MWthZjFjNDR4eXZ0OA=="
              target="_blank"
              rel="noopener noreferrer"
            >
              my cat
            </a>
            .
          </h1>
        )}
        <Social />
      </div>
    </div>
  );
}

export default BlogPromo;
