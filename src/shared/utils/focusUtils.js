const focusableSelector = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function isVisible(element) {
  if (element.hidden || element.closest("[hidden]")) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function isFocusable(element) {
  if (element.disabled || element.getAttribute("aria-hidden") === "true") {
    return false;
  }

  if (element.tagName === "INPUT" && element.type === "hidden") {
    return false;
  }

  return isVisible(element);
}

export function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll(focusableSelector)).filter(
    isFocusable,
  );
}
