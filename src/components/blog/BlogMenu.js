import CloseButton from '../CloseButton';

function BlogMenu({
    isOpen,
    activeBlogPage,
    onHomeClick, 
    onPostsClick,
    onProjestsClick,
    onAboutClick,
    onClose,
    }) {
    return (
        <div className={`blog-menu ${isOpen && 'blog-menu_visible'}`}>
            <button className={`blog-menu__link ${activeBlogPage === 'Home' && 'blog-menu__link_active'}`} onClick={onHomeClick} >Home</button>
            <button className={`blog-menu__link ${activeBlogPage === 'posts' && 'blog-menu__link_active'}`} onClick={onPostsClick} >Posts</button>
            <button className={`blog-menu__link ${activeBlogPage === 'projects' && 'blog-menu__link_active'}`} onClick={onProjestsClick} >Projests</button>
            <button className={`blog-menu__link ${activeBlogPage === 'about' && 'blog-menu__link_active'}`} onClick={onAboutClick} >About</button>
            <CloseButton classname='close-btn blog-menu__close-btn' onClick={onClose} />
        </div>
    );
}

export default BlogMenu;