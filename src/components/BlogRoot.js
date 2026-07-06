import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import BlogMainPage from "./blog/BlogMainPage.js";
import PostsPage from "./blog/PostsPage.js";
import ProjectsPage from "./blog/ProjectsPage.js";
import AboutPage from "./blog/AboutPage.js";
import GamesPage from "./blog/GamesPage.js";
import CurrentPostPage from "./blog/CurrentPostPage.js";

function BlogRoot({
  loggedIn,
  currentUser,
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
    <>
      <Routes>
        <Route
          index
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
          path="posts"
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
          path="posts/:id"
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
          path="projects"
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
          path="about"
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
          path="games"
          element={<GamesPage onTicTacToeClick={moveToTicTacToePage} />}
        />
      </Routes>
    </>
  );
}

export default BlogRoot;
