import ContactButton from './ContactButton';

function BlogHeader ({
    activePage,
    onHomeClick,
    onPostsClick,
    onProjectsClick,
    onAboutClick,
    onContactClick,
    onBlogMenuClick,
 }) {
    return (
        <div className='blog-header'>
            <div className='blog-header__links'>
                <button className={`blog-header__link ${activePage === 'Home' && 'blog-header__link_state_active'}`} onClick={onHomeClick}>Home</button>
                <button className={`blog-header__link ${activePage === 'posts' && 'blog-header__link_state_active'}`} onClick={onPostsClick}>Posts</button>
                <button className={`blog-header__link ${activePage === 'projects' && 'blog-header__link_state_active'}`} onClick={onProjectsClick}>Projects</button>
                <button className={`blog-header__link ${activePage === 'about' && 'blog-header__link_state_active'}`} onClick={onAboutClick}>About</button>
            </div>
            <button className='blog-burger-menu' onClick={onBlogMenuClick} />
            <ContactButton onClick={onContactClick}/>
        </div>
    )
}

export default BlogHeader;