import { Routes, Route } from "react-router"
import ShortenForm from "./ShortenForm"
import Login from "./Login"
import ProtectedRoute from "./ProtectedRoute"
import Signup from "./Signup"

function App() {
  return <Routes>
    <Route path="/" element={<ProtectedRoute><ShortenForm /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="*" element={<p className="mt-24 text-center">Page not found</p>} />
  </Routes>
}

export default App
