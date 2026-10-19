import isValidUrl from "../../../shared/utils/isValidUrl";

function PostExternalLink({ post }) {
  if (!post.externalLink || !isValidUrl(post.externalLink)) return null;

  return (
    <a
      className="post__external-link"
      href={post.externalLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {post.externalLinkButtonText || "Open resource"}
    </a>
  );
}

export default PostExternalLink;
