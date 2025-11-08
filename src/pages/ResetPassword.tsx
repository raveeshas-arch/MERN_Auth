// Import necessary React hooks and libraries
import React, { useState, useContext } from 'react' // React hooks for state management
import { useNavigate } from 'react-router-dom' // Hook for navigation between pages
import { AppContent } from '@/context/AppContext' // Global app context for shared data
import { Button } from '@/components/ui/button' // Reusable button component
import { X } from 'lucide-react' // Close icon from lucide icon library
import axios from 'axios' // HTTP client for API requests
import { toast } from 'react-toastify' // Library for showing notifications
import bg1 from '../assets/hero.jpg' // Background image

// Main ResetPassword component - handles forgot password functionality
const ResetPassword = () => {
  // State variables to manage component data
  const [step, setStep] = useState(1) // Current step: 1=Email input, 2=OTP+Password input
  const [email, setEmail] = useState('') // User's email address
  const [otp, setOtp] = useState(['', '', '', '', '', '']) // Array for 6-digit OTP (each digit separate)
  const [newPassword, setNewPassword] = useState('') // New password user wants to set
  const [confirmPassword, setConfirmPassword] = useState('') // Password confirmation
  const [loading, setLoading] = useState(false) // Loading state for buttons
  const navigate = useNavigate() // Function to navigate to different pages
  
  // Get global app context (contains backend URL and other shared data)
  const context = useContext(AppContent)
  // Error handling: ensure component is wrapped in AppContentProvider
  if (!context) {
    throw new Error('ResetPassword must be used within AppContentProvider')
  }
  
  // Extract backend URL from context for API calls
  const { backendUrl } = context

  // Function to handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digits (0-9)
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp] // Create copy of current OTP array
      newOtp[index] = value // Update the specific digit
      setOtp(newOtp) // Update state with new OTP
      
      // Auto-focus next input box when user types a digit
      if (value && index < 5) {
        const nextInput = document.getElementById(`reset-otp-${index + 1}`)
        nextInput?.focus() // Move cursor to next input box
      }
    }
  }
  
  // Function to handle keyboard navigation in OTP inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // When user presses backspace on empty field, move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`)
      prevInput?.focus() // Move cursor to previous input box
    }
  }

  // Function to send reset OTP to user's email
  const sendResetOtp = async () => {
    // Validate email input
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    
    setLoading(true) // Show loading state
    try {
      // Make API call to send OTP
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-reset-otp',
        { email } // Send email in request body
      )
      
      // Handle API response
      if (data.success) {
        setStep(2) // Move to step 2 (OTP + password input)
        toast.success('OTP sent to your email') // Show success message
      } else {
        toast.error(data.message) // Show error from server
      }
    } catch (error) {
      // Handle network or other errors
      toast.error('Failed to send OTP')
    }
    setLoading(false) // Hide loading state
  }

  // Function to verify OTP and reset password
  const verifyOtpAndReset = async () => {
    // Convert OTP array to string (join all digits)
    const otpString = otp.join('')
    
    // Validation checks
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP')
      return
    }
    
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setLoading(true) // Show loading state
    try {
      // Make API call to reset password
      const { data } = await axios.post(
        backendUrl + '/api/auth/reset-password',
        { 
          email,           // User's email
          otp: otpString,  // 6-digit OTP
          newPassword      // New password
        }
      )
      
      // Handle API response
      if (data.success) {
        toast.success('Password reset successfully!') // Show success message
        navigate('/login') // Redirect to login page
      } else {
        toast.error(data.message) // Show error from server
      }
    } catch (error) {
      // Handle network or other errors
      toast.error('Password reset failed')
    }
    setLoading(false) // Hide loading state
  }

  // Render the component UI
  return (
    // Full screen container with background image
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg1})`, // Set background image
      }}
    >
      {/* Dark overlay on background image */}
      <div className="absolute inset-0 bg-gray-900/30" />
      
      {/* Main form container with glassmorphism effect */}
      <div className="relative z-20 bg-white/10 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-8 w-full sm:max-w-sm max-w-[300px] ">
        {/* Close button - navigates back to login */}
        <div
          className="absolute right-5 top-5 text-white cursor-pointer"
          onClick={() => navigate('/login')} // Go back to login page
        >
          <X /> {/* X icon */}
        </div>

        {/* Form title */}
        <h1 className="text-white text-3xl font-medium text-center mb-2">
          Reset Password
        </h1>
        
        {/* Dynamic subtitle based on current step */}
        <p className="text-white/80 text-sm text-center mb-6">
          {step === 1 && 'Enter your email to receive reset code'} {/* Step 1 message */}
          {step === 2 && 'Enter the OTP and your new password'} {/* Step 2 message */}
        </p>

        {/* Form content container */}
        <div className="space-y-4">
          {/* STEP 1: Email Input */}
          {step === 1 && (
            <>
              <div>
                {/* Email input field */}
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email} // Controlled input - value from state
                  onChange={(e) => setEmail(e.target.value)} // Update state when user types
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-300/60 text-white placeholder:text-white/60"
                />
              </div>
              
              {/* Send OTP button */}
              <Button 
                onClick={sendResetOtp} // Call function when clicked
                disabled={loading || !email} // Disable if loading or no email
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                {loading ? 'Sending...' : 'Send Reset Code'} {/* Dynamic button text */}
              </Button>
            </>
          )}

          {/* STEP 2: OTP and Password Input */}
          {step === 2 && (
            <>
              <div>
                <label className="text-white text-sm mb-2 block">Enter OTP</label>
                {/* Container for 6 OTP input boxes */}
                <div className="flex justify-center gap-2 mb-4">
                  {/* Create 6 input boxes using map */}
                  {otp.map((digit, index) => (
                    <input
                      key={index} // Unique key for React
                      id={`reset-otp-${index}`} // Unique ID for focusing
                      type="text"
                      value={digit} // Current digit value
                      onChange={(e) => handleOtpChange(index, e.target.value)} // Handle input change
                      onKeyDown={(e) => handleKeyDown(index, e)} // Handle keyboard navigation
                      className="w-12 h-12 bg-white/10 border border-gray-300/60 rounded-lg text-white text-center text-xl font-bold focus:border-rose-400 focus:outline-none"
                      maxLength={1} // Only allow 1 character
                    />
                  ))}
                </div>
              </div>
              
              {/* New password input */}
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword} // Controlled input
                  onChange={(e) => setNewPassword(e.target.value)} // Update state
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-300/60 text-white placeholder:text-white/60 mb-3"
                />
              </div>
              
              {/* Confirm password input */}
              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword} // Controlled input
                  onChange={(e) => setConfirmPassword(e.target.value)} // Update state
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-300/60 text-white placeholder:text-white/60"
                />
              </div>
              
              {/* Reset password button */}
              <Button 
                onClick={verifyOtpAndReset} // Call reset function
                disabled={loading || otp.join('').length !== 6 || !newPassword || !confirmPassword} // Disable if validation fails
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                {loading ? 'Resetting...' : 'Reset Password'} {/* Dynamic button text */}
              </Button>
              
              {/* Resend OTP button */}
              <Button 
                onClick={sendResetOtp} // Resend OTP
                disabled={loading} // Disable while loading
                variant="outline"
                className="w-full border-white/60 text-white hover:bg-transparent hover:border-white"
              >
                Resend OTP
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Export component so it can be imported and used in other files
export default ResetPassword