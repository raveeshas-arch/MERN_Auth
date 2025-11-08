import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import bg1 from '../assets/hero.jpg'

const EmailVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }
  
  const context = useContext(AppContent)
  if (!context) {
    throw new Error('EmailVerify must be used within AppContentProvider')
  }
  
  const { backendUrl, userData, getUserData } = context

  const sendVerifyOtp = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-verify-otp',
        {},
        { withCredentials: true }
      )
      
      if (data.success) {
        setIsOtpSent(true)
        toast.success('OTP sent to your email')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    }
    setLoading(false)
  }

  const verifyEmail = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP')
      return
    }
    
    setLoading(true)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp: otpString },
        { withCredentials: true }
      )
      
      if (data.success) {
        toast.success('Email verified successfully!')
        await getUserData() // Refresh user data
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Verification failed')
    }
    setLoading(false)
  }

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg1})`,
      }}
    >
      <div className="absolute inset-0 bg-gray-900/30" />
      
      <div className="relative z-20 bg-white/10 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-8 w-full md:max-w-sm max-w-[300px]">
        {/* Close button */}
        <div
          className="absolute right-5 top-5 text-white cursor-pointer"
          onClick={() => navigate('/')}
        >
          <X />
        </div>

        <h1 className="text-white text-3xl font-medium text-center mb-2">
          Verify Email
        </h1>
        
        <p className="text-white/80 text-sm text-center mb-6">
          {userData?.isAccountVerified 
            ? 'Your email is already verified!' 
            : 'Verify your email to secure your account'
          }
        </p>

        {userData?.isAccountVerified ? (
          <div className="text-center">
            <div className="text-green-400 text-lg mb-4">✓ Email Verified</div>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-rose-600 hover:bg-rose-700"
            >
              Go to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {!isOtpSent ? (
              <Button 
                onClick={sendVerifyOtp} 
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                {loading ? 'Sending...' : 'Send Verification OTP'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 bg-white/10 border border-gray-300/60 rounded-lg text-white text-center text-xl font-bold focus:border-rose-400 focus:outline-none"
                      maxLength={1}
                    />
                  ))}
                </div>
                
                <Button 
                  onClick={verifyEmail} 
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
                
                <Button 
                  onClick={sendVerifyOtp} 
                  disabled={loading}
                  variant="outline"
                  className="w-full border-white/60 text-white hover:bg-transparent hover:border-white"
                >
                  Resend OTP
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerify
