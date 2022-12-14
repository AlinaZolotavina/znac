class Api {
    constructor(data) {
        this._serverUrl = data._serverUrl;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    }

    getInitialPhotos() {
        return fetch(`${this._serverUrl}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(this._checkResponse);
    }

    addPhoto(data) {
        return fetch(`${this._serverUrl}`, {
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

    deletePhoto(data) {
        return fetch(`${this._serverUrl}${data}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then((res) => this._checkResponse(res));
    }

    getUserData() {
        return fetch(`${this._serverUrl}profile`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((res) => this._checkResponse(res));
    }

    requestEmailUpdate(data) {
        return fetch(`${this._serverUrl}profile/update-email`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
            })
        })
        .then((res) => this._checkResponse(res));
    }

    updateEmail(data) {
        return fetch(`${this._serverUrl}profile/update-email/${data.updateEmailLink}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newEmail: data.newEmail,
            })
        })
        .then((res) => this._checkResponse(res));
    }

    updatePassword(data) {
        return fetch(`${this._serverUrl}profile/update-password`, {
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
}

const api = new Api({
    serverUrl: 'http://znac.org/',
});

export default api;