import AuxiliaryButtons from "./AuxiliaryButtons";
import Post from "./Post";
import ContentNotFound from "./ContentNotFound";

function LatestPosts({
  loggedIn,
  posts,
  onPostClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  onAddPostClick,
  onViewAllClick,
}) {
  const date = Date.now();

  return (
    <div className="background_color_blue">
      <div className="latest-posts">
        <div className="latest-posts__menu">
          <h2 className="section-title latest-posts__title">Latest Posts</h2>
          {posts.length !== 0 && (
            <AuxiliaryButtons
              loggedIn={loggedIn}
              onViewAllClick={onViewAllClick}
              onAddButtonClick={onAddPostClick}
              isThereMoreContent={posts.length > 3}
            />
          )}
        </div>
        {posts.length !== 0 ? (
          <ul className="latest-posts__container">
            {posts.slice(0, 3).map((post) => (
              <Post
                key={`${post._id}${date}`}
                post={post}
                onPostClick={onPostClick}
                onEditPostButtonClick={onEditPostButtonClick}
                onDeletePostButtonClick={onDeletePostButtonClick}
                loggedIn={loggedIn}
                location="main-page"
              />
            ))}
          </ul>
        ) : (
          <ContentNotFound
            loggedIn={loggedIn}
            altText="posts not found icon"
            text="Sorry, there are no posts yet"
            buttonText="Add post"
            onClick={onAddPostClick}
          />
        )}
      </div>
    </div>
  );
}

export default LatestPosts;
