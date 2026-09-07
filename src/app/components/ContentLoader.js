function ContentLoader({
  label = "Loading content",
  tone = "blog",
  className = "",
  announce = true,
}) {
  return (
    <div
      className={`content-loader content-loader_tone_${tone} ${className}`.trim()}
      {...(announce ? { role: "status", "aria-label": label } : { "aria-hidden": true })}
    >
      <span className="content-loader__spinner" aria-hidden="true" />
    </div>
  );
}

export default ContentLoader;
