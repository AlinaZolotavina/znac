function scrollToRef(ref) {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default scrollToRef;
