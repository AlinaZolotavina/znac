import { forwardRef } from "react";
import Navigation from "../../../app/components/Navigation";
import LogoutButton from "../../../app/components/LogoutButton";
import Search from "./Search";
import MainPageHashtags from "./MainPageHashtags";
import Gallery from "./Gallery";
import More from "./More";

const Main = forwardRef(function Main(
  {
    photos,
    loggedIn,
    onHomeClick,
    onBlogClick,
    onGalleryClick,
    onContactClick,
    onPhotoClick,
    onDeleteBtnClick,
    onHashtagClick,
    hashtag,
    photoHashtags,
    hashtagSetter,
    onSearch,
    onClearSearch,
    photosQuantity,
    hasMorePhotos,
    onShowMore,
    email,
    onLogout,
    isSendingReq,
    isSearching,
  },
  ref,
) {
  return (
    <main className="main section" id="main" ref={ref}>
      <div className="main__navigation main__navigation_fixed">
        <Navigation
          loggedIn={loggedIn}
          onHomeClick={onHomeClick}
          onBlogClick={onBlogClick}
          onGalleryClick={onGalleryClick}
          onContactClick={onContactClick}
        />
        {loggedIn && (
          <LogoutButton
            className="logout-btn logout-btn_position_nav"
            email={email}
            onLogout={onLogout}
          />
        )}
      </div>
      <Search
        onSubmit={onSearch}
        onClearSearch={onClearSearch}
        isLoading={isSendingReq}
        hashtag={hashtag}
        hashtagSetter={hashtagSetter}
      />
      <MainPageHashtags
        photoHashtags={photoHashtags}
        onClick={onHashtagClick}
      />
      <Gallery
        loggedIn={loggedIn}
        photos={photos}
        onDeleteBtnClick={onDeleteBtnClick}
        onPhotoClick={onPhotoClick}
        photosQuantity={photosQuantity}
        isSearching={isSearching}
      />
      {hasMorePhotos && <More onShowMore={onShowMore} />}
    </main>
  );
});

export default Main;
