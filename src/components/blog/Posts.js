import Post from "./Post";
import notFound from '../../images/blog-not-found-icon.svg';

function Posts ({
    loggedIn,
    posts,
    postsQuantity,
    onPostClick,
    onEditPostButtonClick,
    onDeletePostButtonClick 
}) {
    const date = Date.now();
    return (
        <>
            {
                posts.length === 0 ?
                <div className='posts-not-found'>
                    <img className='posts-not-found__icon' src={notFound} alt='posts not found icon'/>
                    <p className='posts-not-found__text'>Nothing was found! Try another keyword</p>
                </div>
                : <ul className='posts-container'>
                    {posts
                        .slice(0, postsQuantity)
                        .map(post => (
                            <Post 
                                key={`${post._id}${date}`}
                                post={post}
                                onPostClick={onPostClick}
                                onEditPostButtonClick={onEditPostButtonClick}
                                onDeletePostButtonClick={onDeletePostButtonClick}
                                loggedIn={loggedIn}
                                location='posts'
                            />
                        ))
                    }
                </ul>
            }
        </>
    )
}

export default Posts;