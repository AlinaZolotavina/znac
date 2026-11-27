import { matchPath } from "react-router-dom";
import Seo, { DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE } from "./Seo";

export default function RouteSeo({ pathname }) {
  const normalizedPath = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  const pages = {
    "/": {
      title: DEFAULT_SEO_TITLE,
      description: DEFAULT_SEO_DESCRIPTION,
    },
    "/journal": {
      title: "Journal — ZNAC",
      description: "Thoughts, web design notes and frontend experiments.",
    },
    "/journal/posts": {
      title: "Posts — ZNAC",
      description: "Browse journal posts about web design, frontend development and everyday creative work.",
    },
    "/journal/projects": {
      title: "Projects — ZNAC",
      description: "Explore frontend projects, experiments and creative work.",
    },
    "/journal/about": {
      title: "About — ZNAC",
      description: "A frontend developer who builds responsive web applications with React, TypeScript and JavaScript.",
    },
    "/gallery": {
      title: "Photo gallery — ZNAC",
      description: "Explore photographs from everyday life, travel and creative projects.",
    },
  };
  const page = pages[normalizedPath];

  if (page) {
    return <Seo {...page} canonicalPath={normalizedPath} />;
  }

  // The post page owns its metadata throughout loading, success and errors.
  if (matchPath("/journal/posts/:id", pathname)) return null;

  const servicePages = [
    ["/signin", "Sign in — ZNAC", "Sign in to your ZNAC account."],
    ["/signup", "Sign up — ZNAC", "Create your ZNAC account."],
    ["/signin/recovery", "Recover password — ZNAC", "Request a password reset for your ZNAC account."],
    ["/reset-password/:token", "Reset password — ZNAC", "Set a new password for your ZNAC account."],
    ["/password-changed", "Password changed — ZNAC", "Your ZNAC account password has been changed."],
    ["/profile", "Profile — ZNAC", "Manage your ZNAC account settings."],
    ["/profile/update-email/:token", "Confirm email change — ZNAC", "Confirm the new email address for your ZNAC account."],
  ];
  const servicePage = servicePages.find(([path]) => matchPath(path, pathname));

  if (servicePage) {
    return <Seo title={servicePage[1]} description={servicePage[2]} indexable={false} />;
  }

  return (
    <Seo
      title="Page not found — ZNAC"
      description="The requested page could not be found."
      indexable={false}
    />
  );
}

