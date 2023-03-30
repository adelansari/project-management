import authApi from "../api/authApi"

const authUtils = {
  // Helper function to check if the user is authenticated
  isAuthenticated: async () => {
    // Get the token from local storage
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
      // Verify the token using the auth API
      const res = await authApi.verifyToken()
      return res.user
    } catch {
      return false
    }
  }
}

export default authUtils