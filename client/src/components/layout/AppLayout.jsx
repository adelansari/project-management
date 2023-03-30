import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { setUser } from '../../redux/features/userSlice'

// Defining AppLayout component
const AppLayout = () => {
  // Getting navigate function from useNavigate hook
  const navigate = useNavigate()
  // Getting dispatch function from useDispatch hook
  const dispatch = useDispatch()
  // Defining loading state variable
  const [loading, setLoading] = useState(true)

  // Using useEffect hook to check authentication on mount
  useEffect(() => {
    // Defining checkAuth function to check authentication
    const checkAuth = async () => {
      // Checking if user is authenticated using authUtils
      const user = await authUtils.isAuthenticated()
      // If user is not authenticated, navigate to login page
      if (!user) {
        navigate('/login')
      } else {
        // If user is authenticated, dispatch setUser action with user data
        dispatch(setUser(user))
        // Set loading state to false
        setLoading(false)
      }
    }
    // Calling checkAuth function
    checkAuth()
  }, [navigate, dispatch])

  // Returning JSX code for AppLayout component
  return (
    // If loading state is true, render Loading component
    loading ? (
      <Loading fullHeight />
    ) : (
      // If loading state is false, render app layout with Sidebar and Outlet components
      <Box sx={{
        display: 'flex'
      }}>
        
        <Box sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content'
        }}>
          <Outlet />
        </Box>
        <Sidebar />
      </Box>
    )
  )
}

export default AppLayout