import { Routes, Route } from "react-router-dom";
import GalleryRoot from "./GalleryRoot.js";
import BlogMainPage from "./blog/BlogMainPage.js";
import PostsPage from "./blog/PostsPage.js";
import ProjectsPage from "./blog/ProjectsPage.js";
import AboutPage from "./blog/AboutPage.js";
import GamesPage from "./blog/GamesPage.js";
import ResetPassword from "./ResetPassword";
import PasswordChanged from "./PasswordChanged";
import NotFound from "./NotFound";
import SignIn from "./SignIn";
import ForgotPassword from "./ForgotPassword";
import CurrentPostPage from "./blog/CurrentPostPage.js";

function AppRoutes({
  loggedIn,
  currentUser,
  homeRef,
  mainRef,
  footerRef,
  handleSignin,
  handleSignout,
  handleHomeClick,
  handleBlogClick,
  handleGalleryClick,
  handleContactClick,
  handleMenuClick,
  isLoading,
  photosToRender,
  handlePhotoOpen,
  handleDeletePhotoModalOpen,
  handlePhotoHashtagClick,
  hashtag,
  lastHashtags,
  setHashtag,
  handlePhotoSearch,
  handleClearPhotoSearch,
  currentPhotosNumber,
  hasMorePhotos,
  showMorePhotos,
  handleEditHashtags,
  postsToRender,
  projectsToRender,
  handleBlogMenuClick,
  handleBlogContactClick,
  handleNewPostPopupOpen,
  handleNewProjectPopupOpen,
  viewAllPostsClick,
  viewAllProjectsClick,
  handlePostClick,
  openModal,
  handleEditPostPopupOpen,
  handleDeletePostModalOpen,
  handleEditProjectPopupOpen,
  handleDeleteProjectModalOpen,
  moveToHomePage,
  moveToPostsPage,
  moveToProjectsPage,
  moveToAboutPage,
  activeBlogPage,
  handlePostsSearch,
  hasMorePosts,
  currentPostsNumber,
  showMorePosts,
  query,
  setQuery,
  handlePostHashtagClick,
  activePostHashtag,
  moveToPreviousPage,
  postVersion,
  projectHashtags,
  activeProjectHashtag,
  hasMoreProjects,
  currentProjectsNumber,
  showMoreProjects,
  handleProjectHashtagClick,
  handleGamesClick,
  handleMusicClick,
  moveToTicTacToePage,
  handleReceiveResetPasswordLink,
  handleResetPassword,
  handleEditEmailBtnClick,
  handleEditPasswordBtnClick,
  handleUpdateEmail,
  handleAddPhotoViaLink,
  handleAddPhotoFromPc,
}) {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <GalleryRoot
            loggedIn={loggedIn}
            currentUser={currentUser}
            homeRef={homeRef}
            mainRef={mainRef}
            footerRef={footerRef}
            handleSignout={handleSignout}
            handleHomeClick={handleHomeClick}
            handleBlogClick={handleBlogClick}
            handleGalleryClick={handleGalleryClick}
            handleContactClick={handleContactClick}
            handleMenuClick={handleMenuClick}
            isLoading={isLoading}
            photosToRender={photosToRender}
            handlePhotoOpen={handlePhotoOpen}
            handleDeletePhotoModalOpen={handleDeletePhotoModalOpen}
            handlePhotoHashtagClick={handlePhotoHashtagClick}
            hashtag={hashtag}
            lastHashtags={lastHashtags}
            setHashtag={setHashtag}
            handlePhotoSearch={handlePhotoSearch}
            handleClearPhotoSearch={handleClearPhotoSearch}
            currentPhotosNumber={currentPhotosNumber}
            hasMorePhotos={hasMorePhotos}
            showMorePhotos={showMorePhotos}
            handleEditHashtags={handleEditHashtags}
            handleEditEmailBtnClick={handleEditEmailBtnClick}
            handleEditPasswordBtnClick={handleEditPasswordBtnClick}
            handleUpdateEmail={handleUpdateEmail}
            handleAddPhotoViaLink={handleAddPhotoViaLink}
            handleAddPhotoFromPc={handleAddPhotoFromPc}
          />
        }
      />
      <Route
        path="/alina"
        element={
          <BlogMainPage
            loggedIn={loggedIn}
            postsToRender={postsToRender}
            projectsToRender={projectsToRender}
            projectsQuantity={2}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onNewPostClick={handleNewPostPopupOpen}
            onNewProjectClick={handleNewProjectPopupOpen}
            onViewAllPostsClick={viewAllPostsClick}
            onViewAllProjectsClick={viewAllProjectsClick}
            onPostClick={handlePostClick}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            onEditProjectButtonClick={handleEditProjectPopupOpen}
            onDeleteProjectButtonClick={handleDeleteProjectModalOpen}
            onHomeClick={moveToHomePage}
            onPostsClick={moveToPostsPage}
            onProjectsClick={moveToProjectsPage}
            onAboutClick={moveToAboutPage}
          />
        }
      />

      <Route
        path="/alina/posts"
        element={
          <PostsPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            postsToRender={postsToRender}
            onNewPostClick={handleNewPostPopupOpen}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onPostsSearch={handlePostsSearch}
            onPostClick={handlePostClick}
            hasMorePosts={hasMorePosts}
            postsQuantity={currentPostsNumber}
            onShowMorePosts={showMorePosts}
            isLoading={isLoading}
            query={query}
            querySetter={setQuery}
            onPostHashtagClick={handlePostHashtagClick}
            activeHashtag={activePostHashtag}
          />
        }
      />

      <Route
        path="/alina/posts/:id"
        element={
          <CurrentPostPage
            activePage="posts"
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onBackButtonClick={moveToPreviousPage}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            loggedIn={loggedIn}
            postVersion={postVersion}
            openModal={openModal}
          />
        }
      />

      <Route
        path="/alina/projects"
        element={
          <ProjectsPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            hashtags={projectHashtags}
            activeProjectHashtag={activeProjectHashtag}
            projectsToRender={projectsToRender}
            hasMoreProjects={hasMoreProjects}
            onNewProjectClick={handleNewProjectPopupOpen}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            projectsQuantity={currentProjectsNumber}
            onShowMoreProjects={showMoreProjects}
            onEditProjectButtonClick={handleEditProjectPopupOpen}
            onDeleteProjectButtonClick={handleDeleteProjectModalOpen}
            onProjectHashtagClick={handleProjectHashtagClick}
          />
        }
      />

      <Route
        path="/alina/about"
        element={
          <AboutPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            projectsToRender={projectsToRender}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onAddProjectClick={handleNewProjectPopupOpen}
            onGamesClick={handleGamesClick}
            onMusicClick={handleMusicClick}
          />
        }
      />

      <Route
        path="/alina/games"
        element={<GamesPage onTicTacToeClick={moveToTicTacToePage} />}
      />

      <Route
        path="/signin"
        element={<SignIn onSignin={handleSignin} isSendingReq={isLoading} />}
      />

      {/* New users registration is disabled*/}
      {/* <Route path="/signup" element={
          <SignUp onSignup={handleSignup} isSendingReq={isLoading} />
        } /> */}

      <Route
        path="/signin/recovery"
        element={
          <ForgotPassword
            onReceiveEmail={handleReceiveResetPasswordLink}
            isSendingReq={isLoading}
          />
        }
      />

      <Route
        path="/reset-password/:resetPasswordLink"
        element={
          <ResetPassword
            onResetPassword={handleResetPassword}
            isSendingReq={isLoading}
          />
        }
      />

      <Route path="/password-changed" element={<PasswordChanged />} />

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
