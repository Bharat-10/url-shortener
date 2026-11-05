import { useState } from "react";
import { createShortUrl } from "./api/urls";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clearTokens } from "./api/token";
import { useNavigate } from "react-router";
import UrlList from "./UrlList";

function ShortenForm() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [longUrl, setLongUrl] = useState("")
    const [copied, setCopied] = useState(false)
    const { mutate, isPending, data, error } = useMutation({
        mutationFn: createShortUrl,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] })
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        mutate(longUrl)
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(data.shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleLogout = () => {
        clearTokens()
        queryClient.clear()
        navigate("/login")
    }

    return <div className="mt-24 mx-auto max-w-xl px-4">
        <div className="flex justify-between">
            <h1 className="text-3xl font-bold">URL Shortener</h1>
            <button onClick={handleLogout} className="border border-gray-300 rounded px-3 py-1 text-sm" >Log out</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <input
                className="flex-1 border rounded border-gray-300 py-2 px-3"
                type="text"
                required
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/a/very/long/link"
            />
            <button disabled={isPending} className="disabled:opacity-50 bg-blue-600 text-white rounded px-4">{isPending ? "Shortening..." : "Shorten"}</button>
        </form>
        {data && <div className="mt-4 flex items-center gap-2">
            <span>Short URL:</span>
            <a className="text-blue-600 underline" href={data.shortUrl} target="_blank">{data.shortUrl}</a>
            <button onClick={handleCopy} className="border border-gray-300 rounded px-3 py-1 text-sm">{copied ? "Copied!" : "Copy"}</button>
        </div>}
        {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
        <UrlList />
    </div>
}

export default ShortenForm;