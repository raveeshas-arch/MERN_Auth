import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from "react-toastify";
function App() {
  return (
<>
  <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/email-verify" element={<EmailVerify />} />
      </Routes>
</>
  );
}

export default App;
