class Api {
    constructor(data) {
        this._serverUrl = data.serverUrl;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    }

    getInitialPhotos() {
        return fetch(`${this._serverUrl}/photos`, {
            method: 'GET',
        })
        .then((res) => this._checkResponse(res));
    }

    findPhoto(data) {
        return fetch(`${this._serverUrl}/photos/found`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyWord: data })
        })
        .then((res) => this._checkResponse(res));
    }
 
    addPhoto(data) {
        return fetch(`${this._serverUrl}/photos`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                link: data.link,
                hashtags: data.hashtags,
                views: data.views,
            })
        })
        .then((res) => this._checkResponse(res));
    }

    // uploadPhoto(data) {
    //     return fetch(`${this._serverUrl}/photos`)
    // }

    increaseViews(photoId) {
        return fetch(`${this._serverUrl}/photos/${photoId}/views`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },

        })
        .then(res => this._checkResponse(res));
    }

    editHashtags(photoId, hashtags) {
        return fetch(`${this._serverUrl}/photos/${photoId}/hashtags`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newHashtags: hashtags,
            })
        })
        .then(res => this._checkResponse(res));
    }

    deletePhoto(data) {
        return fetch(`${this._serverUrl}/photos/${data}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then((res) => this._checkResponse(res));
    }

    getHashtags = () => {
        return fetch(`${this._serverUrl}/hashtags`, {
            method: 'GET',
        })
        .then((res) => this._checkResponse(res));
    }

    addHashtag = (hashtag) => {
        return fetch(`${this._serverUrl}/hashtags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newHashtag: hashtag,
            })
        })
        .then((res) => this._checkResponse(res));
    }

    // deleteHashtag = (hashtag) => {
    //     return fetch(`${this._serverUrl}/hashtags`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             hashtagName: hashtag,
    //         })
    //     })
    //     .then((res) => this._checkResponse(res));
    // }

    updateHashtag = (hashtag) => {
        return fetch(`${this._serverUrl}/hashtags`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hashtagName: hashtag,
            })
        })
        .then((res) => this._checkResponse(res));
    }

    getUserData() {
        return fetch(`${this._serverUrl}/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((res) => this._checkResponse(res));
    }

    requestEmailUpdate(newEmail, oldEmail) {
        return fetch(`${this._serverUrl}/profile/update-email`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newEmail: newEmail,
                oldEmail: oldEmail,
            })
        })
        .then((res) => this._checkResponse(res));
    }

    updateEmail(updateEmailLink, newEmail) {
        return fetch(`${this._serverUrl}/profile/update-email/${updateEmailLink}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newEmail })
        })
        .then((res) => this._checkResponse(res));
    }

    updatePassword(data) {
        return fetch(`${this._serverUrl}/profile/update-password`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            })
        })
        .then((res) => this._checkResponse(res));
    }

    getInitialData() {
        return Promise.all([this.getInitialPhotos(), this.getHashtags()]);
    }
}

const api = new Api({
    serverUrl: 'https://api.znac.org',
    // serverUrl: 'http://localhost:4000',
});

export default api;