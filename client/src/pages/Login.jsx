import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { LogIn, Lock, Mail } from "lucide-react";
import { AuthContext } from '../components/AuthContext.jsx';
import { jwtDecode } from "jwt-decode";


export default function Login() {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })
    
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { userData, loginUser } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        console.log("token at googleAuth: ", token);
        if (token) {
            localStorage.setItem('token', token);
            const decodedData = jwtDecode(token);
            console.log("decodedData at googleAuth: ", decodedData);
            loginUser({
                token,
                fullname: decodedData.fullname,
                isLoggedIn: true
            }, true);
            setTimeout(() => {
                window.location.replace('/');
            }, 50);
        }
    }, []);

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9000/api/login", JSON.stringify(loginData), {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if(response.status === 201) {
                alert("User logged in successfully");
                localStorage.setItem('token', response.data.token);
                console.log("User logged in successfully");
                // console.log("Token: ", response.data.token);
                // console.log("username: ", loginData.username);
                loginUser({
                    token: response.data.token,
                    fullname: loginData.username,
                    isLoggedIn: true
                }, true); 
                navigate('/home');
            } else if(response.status === 401) {
                alert("Incorrect username or password", response.data.message);
                console.log("Incorrect username or password", response.data.message);
                return;
            } else {
                alert("Error logging in user");
                console.error("Error while loginData:", response.data.message);
                return;
            }
        } catch(err) {
            console.log("Error: ", err);
            setError("Error logging in user");
            console.error("Error while loginData:", err);
            alert("Error logging in user");
            return;
        }
    }

    const handleGoogleLogin = async ()=>{
        window.location.href = "http://localhost:9000/auth/google";

    }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${ userData.mode === 'dark' ? 'bg-slate-800' : 'bg-slate-50' } z-1`}>
        <div className={`w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 ${ userData.mode === 'dark' ? 'bg-slate-650 text-slate-50' : 'bg-slate-50 text-slate-950'}`}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-opacity-5">
                <LogIn className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
            Login to Your Account<br/>
            </h2><br/>

            <form className="w-full flex flex-col gap-3 mb-2" onSubmit={handleLogin}>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
                </span>
                <input
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
                />
            </div>

            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
                </span>
                <input
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
                />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <div className="w-full flex justify-end">
                <button type="button" className="text-xs hover:underline font-medium text-black" onClick={() => navigate('/forgetpassword')}>
                Forgot password?
                </button>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2"
            >
                Login
            </button>
            </form>

            <div className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
                Register
            </a>
            </div>
            <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>

          
        </div>
        <div className="flex gap-3 w-full justify-center mt-2 relative">
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow" onClick={handleGoogleLogin}>
            <h3>SignIn with Google  </h3><img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6 absolute left-8"
            />
          </button>
          </div>
        </div>
        </div>
    
  )
}