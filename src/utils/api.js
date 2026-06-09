import { createRequest } from "./request";
class Api {
  constructor(data) {
    this._serverUrl = data.serverUrl;
    this._request = createRequest(this._serverUrl);
  }

  getInitialPhotos() {
    return this._request("/photos", {
      method: "GET",
    });
  }

  findPhoto(data) {
    return this._request("/photos/found", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyWord: data }),
    });
  }

  addPhoto(data) {
    return this._request("/photos", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link: data.link,
        hashtags: data.hashtags,
        views: data.views,
      }),
    });
  }

  uploadPhoto(data) {
    if (!data) {
      return;
    }
    return this._request("/public", {
      method: "POST",
      credentials: "include",
      body: data,
    });
  }

  increaseViews(photoId) {
    return this._request(`/photos/${photoId}/views`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  editHashtags(photoId, hashtags) {
    return this._request(`/photos/${photoId}/hashtags`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newHashtags: hashtags,
      }),
    });
  }

  deletePhoto(data) {
    return this._request(`/photos/${data}`, {
      method: "DELETE",
    });
  }

  getHashtags = () => {
    return this._request("/hashtags", {
      method: "GET",
    });
  };

  addHashtag = (hashtag) => {
    return this._request("/hashtags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newHashtag: hashtag,
      }),
    });
  };

  // deleteHashtag = (hashtag) => {
  //     return this._request("/hashtags", {
  //         method: 'DELETE',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //             hashtagName: hashtag,
  //         })
  //     })
  // }

  updateHashtag = (hashtag) => {
    return this._request("/hashtags", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hashtagName: hashtag,
      }),
    });
  };

  getUserData() {
    return this._request("/profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  requestEmailUpdate(newEmail, oldEmail) {
    return this._request("/profile/update-email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newEmail: newEmail,
        oldEmail: oldEmail,
      }),
    });
  }

  updateEmail(updateEmailLink, newEmail) {
    return this._request(`/profile/update-email/${updateEmailLink}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newEmail }),
    });
  }

  updatePassword(data) {
    return this._request("/profile/update-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    });
  }

  ////////////////////////
  ///////   BLOG  ////////
  ////////////////////////
  getInitialPosts() {
    return this._request("/posts", {
      method: "GET",
    });
  }

  ///////// Don't need it, because post search works on the client side
  ///////// But still can be useful someday though :)

  //   findPost(data) {
  //     return this._request("/posts/found", {
  //         method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ keyWord: data.query, selectedTheme: data.theme })
  //     })
  //   }

  addPost(data) {
    return this._request("/posts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        theme: data.theme,
        icon: data.icon,
        title: data.title,
        photoLink: data.photoLink,
        hashtags: data.hashtags,
        text: data.text,
      }),
    });
  }

  editPost(postId, data) {
    return this._request(`/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newTheme: data.theme,
        newIcon: data.icon,
        newTitle: data.title,
        newPhotoLink: data.photoLink,
        newHashtags: data.hashtags,
        newText: data.text,
      }),
    });
  }

  deletePost(data) {
    return this._request(`/posts/${data}`, {
      method: "DELETE",
    });
  }

  getInitialPRojects() {
    return this._request("/projects", {
      method: "GET",
    });
  }

  addProject(data) {
    return this._request("/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        hashtags: data.hashtags,
        text: data.text,
        link: data.link,
      }),
    });
  }

  editProject(projectId, data) {
    return this._request(`/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newTitle: data.title,
        newHashtags: data.hashtags,
        newText: data.text,
        newLink: data.link,
      }),
    });
  }

  deleteProject(data) {
    return this._request(`/projects/${data}`, {
      method: "DELETE",
    });
  }

  getProjectHashtags = () => {
    return this._request("/projecthashtags", {
      method: "GET",
    });
  };

  getInitialData() {
    return Promise.all([
      this.getInitialPhotos(),
      this.getHashtags(),
      this.getInitialPosts(),
      this.getInitialPRojects(),
      this.getProjectHashtags(),
    ]);
  }
}

const api = new Api({
  serverUrl: "https://api.znac.org",
  // serverUrl: "http://localhost:4000",
});

export default api;
