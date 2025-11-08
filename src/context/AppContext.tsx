// Import necessary React hooks and libraries
import { createContext, ReactNode, useEffect } from "react"; // React context and hooks
import { useState } from "react"; // State management hook
import { toast } from "react-toastify"; // Notification library

// TypeScript interface defining the shape of our context data
// This ensures type safety and helps with autocomplete
interface AppContextType {
  backendUrl: string;                           // URL of our backend server
  isLoggedin: boolean;                         // Whether user is logged in
  setIsLoggedin: (value: boolean) => void;     // Function to update login status
  userData: any;                               // User's profile data
  setUserData: (value: any) => void;          // Function to update user data
  getUserData: () => Promise<void>;            // Function to fetch user data from server
}

// Create React Context - this allows us to share data across all components
// without having to pass props down through every level (prop drilling)
export const AppContent = createContext<AppContextType | undefined>(undefined);

// Context Provider component - wraps our entire app to provide global state
export const AppContentProvider = (props: { children: ReactNode }) => {

    // Get backend URL from environment variables (set in .env file)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // State for login status - initialize from localStorage for persistence
    // This means user stays logged in even after page refresh
    const [isLoggedin,setIsLoggedin] = useState(() => {
        return localStorage.getItem('isLoggedin') === 'true'
    })
    
    // State for user data - also initialize from localStorage
    const [userData,setUserData] = useState(() => {
        const saved = localStorage.getItem('userData')
        return saved ? JSON.parse(saved) : null // Parse JSON or return null
    })
    
    // Effect to save login status to localStorage whenever it changes
    // This ensures persistence across browser sessions
    useEffect(() => {
        localStorage.setItem('isLoggedin', isLoggedin.toString())
    }, [isLoggedin]) // Only runs when isLoggedin changes
    
    // Effect to save user data to localStorage whenever it changes
    useEffect(() => {
        if (userData) {
            // Save user data as JSON string
            localStorage.setItem('userData', JSON.stringify(userData))
        } else {
            // Remove from localStorage if no user data
            localStorage.removeItem('userData')
        }
    }, [userData]) // Only runs when userData changes
    
    // Effect to check login status when app first loads
    // If user is logged in but we don't have their data, fetch it
    useEffect(() => {
        if (isLoggedin && !userData) {
            getUserData() // Fetch fresh user data from server
        }
    }, []) // Empty dependency array means this only runs once on mount
    
    // Function to fetch user data from the server
    const getUserData = async () => {
        try {
            // Make API call to get user data
            // credentials: 'include' sends cookies (authentication token) with request
            const response = await fetch(backendUrl + '/api/user/get-user-data', {
                method: 'POST',
                credentials: 'include' // Include authentication cookies
            })
            const data = await response.json() // Parse JSON response
            
            if(data.success) {
                // If successful, save user data to state
                setUserData(data.userData)
            } else {
                // If token is invalid/expired, clear login state
                setIsLoggedin(false)
                setUserData(null)
            }
        } catch (error) {
            // Handle network errors or other issues
            toast.error('Error loading user data')
            console.log(error)
        }
    }
    
    // Create the context value object containing all shared data and functions
    const value = {
        backendUrl,      // Server URL for API calls
        isLoggedin,      // Current login status
        setIsLoggedin,   // Function to update login status
        userData,        // Current user's data
        setUserData,     // Function to update user data
        getUserData      // Function to fetch user data from server
    }
    
    // Provide the context value to all child components
    // Any component wrapped by this provider can access these values
    return (
    <AppContent.Provider value={value}>
      {props.children} {/* Render all child components */}
    </AppContent.Provider>
  );
};

// Export the provider component as default export
export default AppContentProvider;