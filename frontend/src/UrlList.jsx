import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUrls, deleteUrl, getQr } from "./api/urls"

function UrlList() {
    const queryClient = useQueryClient()

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["urls"],
        queryFn: getUrls
    })

    const { mutate: removeUrl } = useMutation({
        mutationFn: deleteUrl,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] })
        }
    })

    const { mutate: showQr, data: qrSrc, variables: qrId } = useMutation({
        mutationFn: getQr
    })

    if (isPending) return <p className="mt-2 text-sm"> Loading your links</p>
    if (isError) return <p className="mt-2 text-sm text-red-600">{error.message}</p>

    return <div className="mt-8">
        <h2 className="text-xl font-bold">My URLs</h2>
        {data.length == 0 && <p className="mt-2 text-sm text-gray-500">No links yet.</p>}
        <ul className="mt-2 flex flex-col gap-2">
            {
                data.map((url) => <li className="border border-gray-300 rounded px-3 py-2" key={url.id}>
                    <div className="flex gap-3 items-center ">
                        <a className="text-blue-600 underline" href={url.shortUrl} target="_blank">{url.shortCode}</a>
                        <span className="flex-1 truncate text-sm text-gray-500">{url.longUrl}</span>
                        <span className="text-sm">{url.clicks} Clicks</span>
                        <button onClick={() => showQr(url.id)} className="border border-gray-300 rounded px-3 py-1 text-sm">QR</button>
                        <button className="border border-gray-300 rounded px-3 py-1 text-sm" onClick={() => removeUrl(url.id)}>Delete</button>
                    </div>
                    {qrSrc && qrId === url.id && <img src={qrSrc} />}
                </li>)
            }
        </ul>
    </div>

}


export default UrlList