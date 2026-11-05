import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./token"

const API_URL = import.meta.env.VITE_API_URL

function request(path, options) {
    const headers = { "Content-Type": "application/json" }
    const token = getAccessToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    return fetch(API_URL + path,
        {
            ...options,
            headers
        }
    )
}

export async function apiFetch(path, options) {

    let res = await request(path, options)
    if (res.status === 401 && getRefreshToken()) {
        const refreshed = await refreshToken()
        if (refreshed) {
            res = await request(path, options)
        } else {
            clearTokens()
            window.location.href = "/login"
        }
    }
    if (res.status === 204) {
        return null
    }

    if (res.headers.get("Content-Type") === "image/png") {
        const blob = await res.blob()
        return blob
    }

    const body = await res.json()
    if (!res.ok) {
        throw new Error(body.error ?? Object.values(body)[0])
    }
    return body
}


async function refreshToken() {
    const res = await fetch(API_URL + "/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: getRefreshToken() })
    })

    if (!res.ok) {
        return false
    }
    const tokens = await res.json()
    saveTokens(tokens)
    return true
}