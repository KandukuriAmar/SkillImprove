import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import closeeye from '../assets/closeeye.png';
import openeye from '../assets/openeye.png';
import axios from "axios";

export default function ForgetPassword() {
  const [toggleeye, setToggleeye] = useState("closeeye");
  const [mode, setMode] = useState("light");
  const passwordRef = useRef();
  const emailRef = useRef();

  const navigate = useNavigate();
  const [newData, setNewData] = useState({
    email: "",
    password: ""
  });
  useEffect(() => {
    const detectModeChange = () => {
        const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setMode(mode);
        emailRef.current.focus();
    }
    const observer = new MutationObserver(() => detectModeChange());
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });
    
    detectModeChange();
    return () => observer.disconnect();
  }, []);

  const forgotResetPassword = async(e) => {
    e.preventDefault();

    const responce = await axios.put("http://localhost:9000/api/updatepassword", {
      emailorusername: newData.email,
      password: newData.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(responce.status === 200) {
      alert("Password updated successfully");
      setNewData({ email: "", password: "" });
      console.log("Password updated successfully");
      if (passwordRef.current) passwordRef.current.blur();
      if (emailRef.current) emailRef.current.blur();
      navigate("/login");
    } else if(responce.status === 401) {
      alert("Error updating password. Please try again.");
    } else {
      alert("An server error occurred. Please try again later.");
    }
  };

  const toggleEye = () => {
    setToggleeye(prev => (prev === "closeeye" ? "openeye" : "closeeye"));
    setTimeout(() => {
      if (passwordRef.current) {
        passwordRef.current.focus();
        passwordRef.current.setSelectionRange(newData.password.length, newData.password.length);
      }
    }, 0);
  };

  return (
    <>
      <div className={`flex flex-col items-center justify-center ${mode === "dark" ? "bg-[#817f7f]" : "bg-[#ffffff]"} text-white min-h-screen w-full border-6 rounded-md gap-2`}>
        <h1 className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-black'} text-center`}>Forget Password</h1>
        <div className={`flex flex-col items-center justify-center ${mode === "dark" ? "bg-[#1a1a1a] text-white" : "bg-white text-black"}  p-8 rounded-lg shadow-lg w-96`}>
          <form className="flex flex-col gap-4 p-6" onSubmit={forgotResetPassword}>
            <label className="font-bold">Username or Email</label>
            <input
              className="border border-gray-800 rounded-md p-2 w-full"
              required
              placeholder="Username or email"
              type="text"
              ref={emailRef}
              value={newData.email}
              onChange = {(e) => setNewData({...newData, email: e.target.value})}
            />

            <label className="font-bold">New Password</label>
            <div className="relative w-full">
              <input
                type={toggleeye === "closeeye" ? "password" : "text"}
                placeholder="password"
                value={newData.password}
                onChange={(e) => setNewData({...newData, password: e.target.value})}
                className="border border-gray-800 rounded-md p-2 w-full pr-10"
                required
                ref={passwordRef}
              />
              <img
                src={toggleeye === "closeeye" ? closeeye : openeye}
                onClick={toggleEye}
                className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                alt="Toggle visibility"
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
              Set Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
