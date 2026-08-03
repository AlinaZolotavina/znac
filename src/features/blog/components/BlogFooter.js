function BlogFooter() {
  return (
    <footer className="blog-footer">
      <p className="blog-footer__item blog-footer__paragraph">
        © {new Date().getFullYear()} Alina Zolotavina
      </p>
      <a
        className="blog-footer__item blog-footer__link"
        href="mailto:albekmerus@gmail.com"
      >
        <div className="blog-footer__email-icon" />
        albekmerus@gmail.com
      </a>
    </footer>
  );
}

export default BlogFooter;
