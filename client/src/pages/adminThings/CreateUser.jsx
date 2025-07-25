import {React, useState, useRef} from 'react'
import Register from '../Register'
import closeeye from "../../assets/closeeye.png";
import openeye from '../../assets/openeye.png';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function CreateUser() {
    const navigate = useNavigate();
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

    const handleRegister = async(e) => {
        e.preventDefault();
        if (registerData.password !== registerData.conformpassword) {
            alert("Passwords do not match");
            return;
        }

        console.log(registerData);
        const responce = await axios.post("http://localhost:9000/api/register", JSON.stringify(registerData), {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((responce) => {
            if (responce.status === 201) {
                alert("User registered successfully by admin");
                console.log("User registered successfully by admin");
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
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <form onSubmit={(e) => handleRegister(e)}>
            <label>Username: </label>
            <input type='text' placeholder='username' id="username" value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})}/>
            <label>Email: </label>
            <input type='email' placeholder='email' id="email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})}/>
            <label>Password: <button type="button" onClick={toggleEye}>{toggleeye === "closeeye" ? <img src={closeeye} className="w-4 h-4"/> : <img src={openeye} className="w-4 h-4"/>}</button></label>
            <input type={toggleeye === "closeeye"?"password":"text"} placeholder='password' id="password" ref = {passwordRef} value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} />
            <label>Full Name: </label>
            <input type='text' placeholder='full name' id="fullname" value={registerData.fullname} onChange={(e) => setRegisterData({...registerData, fullname: e.target.value})}/>
            <label>Phone: </label>
            <input type='text' placeholder='phone' value={registerData.phone} onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}/>
            <label>Confirm Password: <button type="button" onClick={conformtoggleEye}>{conformtoggleeye === "closeeye" ? <img src={closeeye} className="w-4 h-4"/> : <img src={openeye} className="w-4 h-4"/>}</button></label>
            <input type={conformtoggleeye === "closeeye"?"password":"text"} placeholder='confirm password' ref={conformpasswordRef}value={registerData.conformpassword} onChange={(e) => setRegisterData({...registerData, conformpassword: e.target.value})}/>
            <button type='submit'>Register</button>
        </form>
    </div>
  )
}