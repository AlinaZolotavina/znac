function PageHero({
  title,
  subtitle,
  heroId,
  className = "",
  contentClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  illustrationClassName = "",
  children,
}) {
  return (
    <section
      className={`page-hero ${className}`.trim()}
      aria-labelledby={heroId}
    >
      <div className={`page-hero__content ${contentClassName}`.trim()}>
        <h1 className={`page-hero__title ${titleClassName}`.trim()} id={heroId}>
          {title}
        </h1>
        <p className={`page-hero__subtitle ${subtitleClassName}`.trim()}>
          {subtitle}
        </p>
        {children}
      </div>
      <div
        className={`page-hero__illustration ${illustrationClassName}`.trim()}
        aria-hidden="true"
      />
    </section>
  );
}

export default PageHero;
