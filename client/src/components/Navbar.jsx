import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Home, Bell, Menu, X } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import GlowButton from './GlowButton'

const Navbar = ({ onMobileMenuToggle }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileSidebarToggle = () => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle()
    }
  }

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={handleMobileSidebarToggle}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-neon-blue hover:bg-neon-blue/10 transition-all"
            >
              <Menu size={20} />
            </button>

            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">C</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent leading-tight">
                  <span className="text-neon-blue">Co</span>
                  <span className="text-neon-purple">NN</span>
                  <span className="text-neon-blue">exto</span>
                </span>
                <span className="text-xs text-gray-400 leading-tight hidden sm:block">Connect • Grow • Succeed</span>
              </div>
            </Link>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-sm text-gray-400">
                    Welcome, {user?.name}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <GlowButton
                    onClick={handleLogout}
                    variant="outline"
                    glowColor="red"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </GlowButton>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={toggleMobileMenu}
                  className="sm:hidden p-2 rounded-lg text-gray-300 hover:text-neon-blue hover:bg-neon-blue/10 transition-all"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <GlowButton
                  as={Link}
                  to="/login"
                  variant="outline"
                  glowColor="blue"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">Sign In</span>
                </GlowButton>
                <GlowButton
                  as={Link}
                  to="/register"
                  variant="primary"
                  glowColor="purple"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Register</span>
                  <span className="sm:hidden">Sign Up</span>
                </GlowButton>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="sm:hidden border-t border-dark-700 bg-dark-800/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 p-3 bg-dark-700/50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </div>

              {/* Mobile Logout */}
              <GlowButton
                onClick={handleLogout}
                variant="outline"
                glowColor="red"
                size="sm"
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </GlowButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 