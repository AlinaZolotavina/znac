import { createRequest } from "./request";
class Api {
  constructor(data) {
    this._serverUrl = data.serverUrl;
    this._request = createRequest(this._serverUrl);
  }

  getPhotos(page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this._request(`/photos?${params.toString()}`, {
      method: "GET",
    });
  }

  findPhoto(keyWord, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return this._request(`/photos/found?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyWord }),
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

  getHashtags = (page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this._request(`/hashtags?${params.toString()}`, {
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
  getPosts(page = 1, limit = 8, { search = "", theme = "All" } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (theme && theme !== "All") {
      params.set("theme", theme);
    }

    return this._request(`/posts?${params.toString()}`, {
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

  getProjects(page = 1, limit = 12, { hashtag = "" } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (hashtag.trim()) {
      params.set("hashtag", hashtag.trim());
    }

    return this._request(`/projects?${params.toString()}`, {
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

  getProjectHashtags(limit = 20) {
    const params = new URLSearchParams({
      limit: String(limit),
    });

    return this._request(`/projecthashtags?${params.toString()}`, {
      method: "GET",
    });
  }
}

const api = new Api({
  serverUrl: process.env.REACT_APP_API_URL,
});

export default api;
