import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Main from "./Main";
import Footer from "./Footer";
import BlogMainPage from "./blog/BlogMainPage.js";
import PostsPage from "./blog/PostsPage.js";
import ProjectsPage from "./blog/ProjectsPage.js";
import AboutPage from "./blog/AboutPage.js";
import GamesPage from "./blog/GamesPage.js";
import ResetPassword from "./ResetPassword";
import PasswordChanged from "./PasswordChanged";
import NotFound from "./NotFound";
import ProtectedRoute from "./ProtectedRoute";
import SignIn from "./SignIn";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import AddPhoto from "./AddPhoto";
import ConfirmEmailUpdate from "./ConfirmEmailUpdate";
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
        path="/"
        element={
          <>
            <Home
              loggedIn={loggedIn}
              ref={homeRef}
              onHomeClick={handleHomeClick}
              onBlogClick={handleBlogClick}
              onGalleryClick={handleGalleryClick}
              onContactClick={handleContactClick}
              onMenuClick={handleMenuClick}
              onSignout={handleSignout}
              isSendingReq={isLoading}
              email={currentUser.email}
              onLogout={handleSignout}
            />
            <Main
              photos={photosToRender}
              loggedIn={loggedIn}
              ref={mainRef}
              onPhotoClick={handlePhotoOpen}
              onDeleteBtnClick={handleDeletePhotoModalOpen}
              onHomeClick={handleHomeClick}
              onBlogClick={handleBlogClick}
              onGalleryClick={handleGalleryClick}
              onContactClick={handleContactClick}
              onHashtagClick={handlePhotoHashtagClick}
              hashtag={hashtag}
              photoHashtags={lastHashtags || []}
              hashtagSetter={setHashtag}
              onSearch={handlePhotoSearch}
              onClearSearch={handleClearPhotoSearch}
              photosQuantity={currentPhotosNumber}
              hasMorePhotos={hasMorePhotos}
              onShowMore={showMorePhotos}
              email={currentUser.email}
              onLogout={handleSignout}
              areHashtagsEditing={false}
              onEditHashtags={handleEditHashtags}
              isSendingReq={isLoading}
              hashtagsNumber={10}
            />
            <Footer ref={footerRef} />
          </>
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

      <Route
        path="/profile"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <Profile
              loggedIn={loggedIn}
              onHomeClick={handleHomeClick}
              onBlogClick={handleBlogClick}
              onGalleryClick={handleGalleryClick}
              onContactClick={handleContactClick}
              onEditEmailBtnClick={handleEditEmailBtnClick}
              onEditPasswordBtnClick={handleEditPasswordBtnClick}
              onMenuClick={handleMenuClick}
              onSignout={handleSignout}
              isSendingReq={isLoading}
              email={currentUser.email}
              onLogout={handleSignout}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/update-email/:updateEmailLink"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <ConfirmEmailUpdate
              loggedIn={loggedIn}
              onUpdateEmail={handleUpdateEmail}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/addphoto"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <AddPhoto
              loggedIn={loggedIn}
              onHomeClick={handleHomeClick}
              onBlogClick={handleBlogClick}
              nGalleryClick={handleGalleryClick}
              onContactClick={handleContactClick}
              onMenuClick={handleMenuClick}
              onSignout={handleSignout}
              isSendingReq={isLoading}
              onAddPhotoViaLink={handleAddPhotoViaLink}
              onUploadPhotoToServer={handleAddPhotoFromPc}
              email={currentUser.email}
              onLogout={handleSignout}
            />
          </ProtectedRoute>
        }
      />

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
