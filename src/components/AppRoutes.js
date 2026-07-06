import { Routes, Route } from "react-router-dom";
import GalleryRoot from "./GalleryRoot.js";
import BlogRoot from "./BlogRoot.js";
import ResetPassword from "./ResetPassword";
import PasswordChanged from "./PasswordChanged";
import SignIn from "./SignIn";
import ForgotPassword from "./ForgotPassword";

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
  startLoading,
  stopLoading,
  screenWidth,
  setScreenWidth,
  location,
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
            handleEditEmailBtnClick={handleEditEmailBtnClick}
            handleEditPasswordBtnClick={handleEditPasswordBtnClick}
            handleUpdateEmail={handleUpdateEmail}
            openModal={openModal}
            startLoading={startLoading}
            stopLoading={stopLoading}
            screenWidth={screenWidth}
            setScreenWidth={setScreenWidth}
            location={location}
          />
        }
      />

      <Route
        path="/alina/*"
        element={
          <BlogRoot
            loggedIn={loggedIn}
            currentUser={currentUser}
            isLoading={isLoading}
            postsToRender={postsToRender}
            projectsToRender={projectsToRender}
            handleBlogMenuClick={handleBlogMenuClick}
            handleBlogContactClick={handleBlogContactClick}
            handleNewPostPopupOpen={handleNewPostPopupOpen}
            handleNewProjectPopupOpen={handleNewProjectPopupOpen}
            viewAllPostsClick={viewAllPostsClick}
            viewAllProjectsClick={viewAllProjectsClick}
            handlePostClick={handlePostClick}
            openModal={openModal}
            handleEditPostPopupOpen={handleEditPostPopupOpen}
            handleDeletePostModalOpen={handleDeletePostModalOpen}
            handleEditProjectPopupOpen={handleEditProjectPopupOpen}
            handleDeleteProjectModalOpen={handleDeleteProjectModalOpen}
            moveToHomePage={moveToHomePage}
            moveToPostsPage={moveToPostsPage}
            moveToProjectsPage={moveToProjectsPage}
            moveToAboutPage={moveToAboutPage}
            activeBlogPage={activeBlogPage}
            handlePostsSearch={handlePostsSearch}
            hasMorePosts={hasMorePosts}
            currentPostsNumber={currentPostsNumber}
            showMorePosts={showMorePosts}
            query={query}
            setQuery={setQuery}
            handlePostHashtagClick={handlePostHashtagClick}
            activePostHashtag={activePostHashtag}
            moveToPreviousPage={moveToPreviousPage}
            postVersion={postVersion}
            projectHashtags={projectHashtags}
            activeProjectHashtag={activeProjectHashtag}
            hasMoreProjects={hasMoreProjects}
            currentProjectsNumber={currentProjectsNumber}
            showMoreProjects={showMoreProjects}
            handleProjectHashtagClick={handleProjectHashtagClick}
            handleGamesClick={handleGamesClick}
            handleMusicClick={handleMusicClick}
            moveToTicTacToePage={moveToTicTacToePage}
            handleReceiveResetPasswordLink={handleReceiveResetPasswordLink}
            handleResetPassword={handleResetPassword}
            handleEditEmailBtnClick={handleEditEmailBtnClick}
            handleEditPasswordBtnClick={handleEditPasswordBtnClick}
            handleUpdateEmail={handleUpdateEmail}
            startLoading={startLoading}
            stopLoading={stopLoading}
            screenWidth={screenWidth}
            setScreenWidth={setScreenWidth}
            location={location}
          />
        }
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
    </Routes>
  );
}

export default AppRoutes;
