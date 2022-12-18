export const BASE_URL = 'https://api.znac.org';

function checkResponse(res) {
    if (res.ok) {
        return res.json();
    } else {
        return Promise.reject(`Ошибка: ${res.status}`);
    }
}

export const signup = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })
    .then((res) => checkResponse(res));
}

export const signin = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })
    .then((res) => checkResponse(res));
}

export const signout = (email) => {
    return fetch(`${BASE_URL}/signout`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'email': email,
        }),
    })
    .then((res) => checkResponse(res));
}

export const getContent = () => {
    return fetch(`${BASE_URL}/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((res) => checkResponse(res));
}

export const forgotPassword = (email) => {
    return fetch(`${BASE_URL}/forgot-password`, {
        method: 'PUT', 
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email})
    })
    .then((res) => checkResponse(res));
}

export const resetPassword = (newPassword, confirmPassword, resetPasswordLink) => {
    return fetch(`${BASE_URL}/reset-password/${resetPasswordLink}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({newPassword, confirmPassword})
    })
    .then((res) => checkResponse(res));
}