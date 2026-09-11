function SkipLink({ targetId, label = "Skip to main content" }) {
  return (
    <a className="skip-link" href={`#${targetId}`}>
      {label}
    </a>
  );
}

export default SkipLink;
