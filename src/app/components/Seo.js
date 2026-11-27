import { useEffect } from "react";

export const SITE_ORIGIN = "https://znac.org";
export const DEFAULT_SEO_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;
export const DEFAULT_SEO_TITLE = "ZNAC — photographs, journal and projects";
export const DEFAULT_SEO_DESCRIPTION =
  "ZNAC is a space for photographs, thoughts, web design and frontend projects.";

function setMetaAttribute(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(path) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!path) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.append(element);
  }

  element.setAttribute("href", new URL(path, SITE_ORIGIN).href);
}

function getImageUrl(image) {
  if (!image) return DEFAULT_SEO_IMAGE;

  try {
    const url = new URL(image, SITE_ORIGIN);

    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : DEFAULT_SEO_IMAGE;
  } catch {
    return DEFAULT_SEO_IMAGE;
  }
}

function Seo({
  title = DEFAULT_SEO_TITLE,
  description = DEFAULT_SEO_DESCRIPTION,
  canonicalPath,
  image,
  type = "website",
  indexable = true,
}) {
  useEffect(() => {
    const canonicalUrl = canonicalPath
      ? new URL(canonicalPath, SITE_ORIGIN).href
      : undefined;

    document.title = title;
    setMetaAttribute("name", "description", description);
    setMetaAttribute("name", "robots", indexable ? "index,follow" : "noindex,follow");
    setCanonical(indexable ? canonicalPath : undefined);

    setMetaAttribute("property", "og:title", title);
    setMetaAttribute("property", "og:description", description);
    setMetaAttribute("property", "og:type", type);
    setMetaAttribute("property", "og:image", getImageUrl(image));

    if (canonicalUrl && indexable) {
      setMetaAttribute("property", "og:url", canonicalUrl);
    } else {
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
  }, [canonicalPath, description, image, indexable, title, type]);

  return null;
}

export function getPostDescription(text) {
  const normalizedText = String(text || "").replace(/\s+/g, " ").trim();

  if (normalizedText.length <= 160) return normalizedText || DEFAULT_SEO_DESCRIPTION;

  return `${normalizedText.slice(0, 157).trimEnd()}...`;
}

export default Seo;
