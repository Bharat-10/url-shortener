import { apiFetch } from "./client";

export function createShortUrl(longUrl) {
    return apiFetch("/api/urls", {
        method: "POST",
        body: JSON.stringify({ longUrl })
    })
}

export function getUrls() {
    return apiFetch("/api/urls")
}

export function deleteUrl(id) {
    return apiFetch(`/api/urls/${id}`, {
        method: "DELETE"
    })
}

export async function getQr(id) {
    const blob = await apiFetch(`/api/urls/${id}/qr`)
    return URL.createObjectURL(blob)
}