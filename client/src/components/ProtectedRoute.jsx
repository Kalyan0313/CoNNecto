import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector(state => state.auth)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute 