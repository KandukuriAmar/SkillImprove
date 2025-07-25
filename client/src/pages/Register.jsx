"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import closeeye from '../assets/closeeye.png';
import openeye from '../assets/openeye.png';
import { Lock, Mail, Phone, User } from "lucide-react";
import axios from 'axios';

export default function Register() {
  const [toggleeye, setToggleeye] = useState("closeeye");
  const [conformtoggleeye, setConformtoggleeye] = useState("closeeye");
  const passwordRef = useRef();
  const conformpasswordRef = useRef();
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    fullname: '',
    phone: '',
    conformpassword: '',
  })

  const toggleEye = () => {
    if (toggleeye === "closeeye") {
      setToggleeye("openeye");
      passwordRef.current.focus();
    } else {
      setToggleeye("closeeye");
      passwordRef.current.focus();
    }
  }

  const conformtoggleEye = () => {
    if (conformtoggleeye === "closeeye") {
      setConformtoggleeye("openeye");
      conformpasswordRef.current.focus();
    } else {
      setConformtoggleeye("closeeye");
      conformpasswordRef.current.focus();
    }
  }
  const navigate = useNavigate();

  const handleRegister = async(e) => {
    e.preventDefault();
    if (registerData.password !== registerData.conformpassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(registerData);
    const responce = await axios.post("http://localhost:9000/api/register", registerData, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((responce) => {
      if (responce.status === 201) {
        alert("User registered successfully");
        console.log("User registered successfully");
        navigate('/');
      } else {
        alert("Error registering user");
        throw new Error(`HTTP error! status: ${responce.status}`);
      }
    })
    .catch((err) => {
      console.error("Error while registerData:", err);
    })
  }

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

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:9000/auth/google";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 z-1">
      <div className="w-full max-w-md bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg">
          <User className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">Create Your Account</h2>

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm"
            required
          />

          <div className="relative">
            <input
              type={toggleeye === "closeeye" ? "password" : "text"}
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              ref={passwordRef}
              className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm"
              required
            />
            <img
              src={toggleeye === "closeeye" ? closeeye : openeye}
              onClick={toggleEye}
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              alt="Toggle Password"
            />
          </div>

          <input
            type="text"
            placeholder="Full Name"
            value={registerData.fullname}
            onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm"
            required
          />

          <input
            type="text"
            placeholder="Phone"
            value={registerData.phone}
            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm"
            required
          />

          <div className="relative">
            <input
              type={conformtoggleeye === "closeeye" ? "password" : "text"}
              placeholder="Confirm Password"
              value={registerData.conformpassword}
              onChange={(e) => setRegisterData({ ...registerData, conformpassword: e.target.value })}
              ref={conformpasswordRef}
              className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm"
              required
            />
            <img
              src={conformtoggleeye === "closeeye" ? closeeye : openeye}
              onClick={conformtoggleEye}
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              alt="Toggle Confirm Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 transition mt-2"
          >
            Register
          </button>
        </form>

        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign up with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2 relative">
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow" onClick={handleGoogleRegister}>
            <h3>SignUp with Google  </h3><img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6 absolute left-8"
            />
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}