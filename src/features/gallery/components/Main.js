import { forwardRef } from "react";
import MainNav from "../../../app/components/MainNav";
import Search from "./Search";
import MainPageHashtags from "./MainPageHashtags";
import Gallery from "./Gallery";
import More from "./More";
import ContentLoader from "../../../app/components/ContentLoader";

const Main = forwardRef(function Main(
  {
    photos,
    loggedIn,
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
    isSendingReq,
    isPhotosLoading,
    isSearching,
    onMenuClick,
    onLogout,
    onSubsectionClick,
    isMenuOpen,
    menuId,
  },
  ref,
) {
  return (
    <main className="main section" id="main" ref={ref}>
      <div className="main__navigation main__navigation_fixed">
        <MainNav
          activeSection="photos"
          activeSubsection="photos"
          loggedIn={loggedIn}
          onLogout={onLogout}
          onMenuClick={onMenuClick}
          onSubsectionClick={onSubsectionClick}
          isMenuOpen={isMenuOpen}
          menuId={menuId}
        />
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
      {isPhotosLoading && photos.length === 0 ? (
        <ContentLoader label="Loading photos" tone="gallery" />
      ) : (
        <>
          <Gallery
            loggedIn={loggedIn}
            photos={photos}
            onDeleteBtnClick={onDeleteBtnClick}
            onPhotoClick={onPhotoClick}
            photosQuantity={photosQuantity}
            isSearching={isSearching}
          />
          {hasMorePhotos && <More onShowMore={onShowMore} />}
        </>
      )}
    </main>
  );
});

export default Main;
