// Importing necessary React libraries and components
import React, { FormEvent, useContext } from "react"
import { X } from "lucide-react" // X icon (close button)
import { useNavigate } from "react-router-dom" // for navigation between pages
import { AppContent } from "@/context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

// Define the Login component
const Login = () => {

  // State to toggle between "login" and "register" modes
  const [state, setState] = React.useState("login")
  const [name,setName] = React.useState('')
  const [email,setEmail] = React.useState('')
  const [password,setPassword] = React.useState('')



  // Hook to programmatically navigate between routes
  const navigate = useNavigate()

  const context = useContext(AppContent)
  
  if (!context) {
    throw new Error('Login must be used within AppContentProvider')
  }
  
  const {backendUrl, setIsLoggedin, getUserData} = context

  


  // Function triggered when form is submitted
 const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      axios.defaults.withCredentials = true

      if(state === "Sign up"){
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password}) 
        
        if(data.success){
          setIsLoggedin(true)
          await getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password}) 
        
        if(data.success){
          setIsLoggedin(true)
          await getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }



  return (
    // Main form container
    <form
      onSubmit={onSubmitHandler}
      className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-transparent text-white"
    >
      {/* Form title */}
      <h1 className="text-white text-3xl mt-10 font-medium">
        {state === "login" ? "Login" : "Sign up"}
      </h1>

      {/* Close button (navigates back to home) */}
      <div
        className="absolute right-5 top-5 text-white cursor-pointer"
        onClick={() => navigate("/")}
      >
        <X /> {/* icon */}
      </div>

      {/* Subtitle */}
      <p className="text-white text-sm mt-2">Please sign in to continue</p>

      {/* Name input — only shown in Sign up mode */}
      {state !== "login" && (
        <div className="flex items-center mt-6 w-full bg-white/5 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          {/* User icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
               viewBox="0 0 24 24" fill="none" stroke="white"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
          {/* Input field */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border-none outline-none ring-0 bg-transparent placeholder:text-white w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      {/* Email input */}
      <div className="flex items-center w-full mt-4 bg-white/5 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 text-white">
        {/* Mail icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             viewBox="0 0 24 24" fill="none" stroke="white"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          <rect x="2" y="4" width="20" height="16" rx="2" />
        </svg>
        {/* Input field */}
        <input
          type="email"
          name="email"
          placeholder="Email id"
          className="border-none outline-none ring-0 bg-transparent placeholder:text-white w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password input */}
      <div className="flex items-center mt-4 w-full bg-white/5 border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        {/* Lock icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             viewBox="0 0 24 24" fill="none" stroke="white"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {/* Input field */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-none outline-none ring-0 bg-transparent placeholder:text-white w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Forget password link */}
      <div className="mt-4 text-left text-white cursor-pointer">
        <button onClick={()=>navigate('/reset-password')} className="text-sm" type="reset">Forget password?</button>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="mt-2 w-full h-11 rounded-full cursor-pointer text-white bg-rose-800 hover:opacity-90 transition-opacity"
      >
        {state === "login" ? "Login" : "Sign up"}
      </button>

      {/* Switch between Login and Sign up */}
      <p
        onClick={() => setState(prev => prev === "login" ? "Sign up" : "login")}
        className="text-white cursor-pointer text-sm mt-3 mb-11"
      >
        {state === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <a href="#" className="text-rose-300 hover:underline "> click here</a>
      </p>
    </form>
  )
}

export default Login
