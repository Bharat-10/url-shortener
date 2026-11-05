import { Navigate } from "react-router"
import { getAccessToken } from "./api/token"

function ProtectedRoute({ children }) {
    if (!getAccessToken()) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRoute