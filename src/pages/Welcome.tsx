import React, { useContext, useEffect, useState } from "react";
import bg1 from "../assets/hero.jpg"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AppContent } from "@/context/AppContext";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Welcome: React.FC = () => {
    const navigate = useNavigate()
    const context = useContext(AppContent)
    
    if (!context) {
        throw new Error('Welcome must be used within AppContentProvider')
    }
    
    const { isLoggedin, userData, getUserData, setIsLoggedin, setUserData, backendUrl } = context
    const [showDropdown, setShowDropdown] = useState(false)
    
    const handleLogout = async () => {
        try {
            await axios.get(backendUrl + '/api/auth/logout', { withCredentials: true })
            setIsLoggedin(false)
            setUserData(null)
            toast.success('Logged out successfully')
        } catch (error) {
            toast.error('Logout failed')
        }
    }
    
    useEffect(() => {
        if (isLoggedin && !userData) {
            getUserData()
        }
    }, [isLoggedin])
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex    justify-center"
      style={{
        backgroundImage: `url(${bg1})`,
      }}
    >

        {isLoggedin ? (
            <div className="absolute top-10 right-10 z-20">
                <Button 
                    variant="ghost" 
                    className="hover:bg-white/10 bg-white/10 text-bold flex items-center gap-2 border-white"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold">
                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={16} />
                </Button>
                
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                        <button 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                            onClick={() => {
                                navigate('/email-verify')
                                setShowDropdown(false)
                            }}
                        >
                            <span>Verify Email</span>
                            {userData?.isAccountVerified ? (
                                <span className="text-green-500 text-xs">✓</span>
                            ) : (
                                <span className="text-red-500 text-xs">✗</span>
                            )}
                        </button>
                        <button 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                                handleLogout()
                                setShowDropdown(false)
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <Button variant="ghost" className="absolute top-10 right-10 hover:bg-white z-20 bg-white text-bold" onClick={() => navigate("/login")}>
                <h1 className="text-lg font-bold cursor-pointer">Log in</h1>
            </Button>
        )}
      
        <div className="absolute inset-0 bg-gray-900/30" />
      <div className="text-center z-20 pt-20">
        <h1 className="text-5xl font-bold text-white px-6">
          {isLoggedin && userData ? `Hey ${userData.name}!` : "Hey Developer!"}
        </h1>
        {isLoggedin && userData && !userData.isAccountVerified && (
          <p className="text-yellow-300 mt-4 text-lg">
            ⚠️ Please verify your email to secure your account
          </p>
        )}
      </div>
    </div>
  );
};

export default Welcome;
