import {React, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function AdminLogin() {
    const [adminLoginData, setadminLoginData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            if(localStorage.getItem("isLoggedIn")) {
                console.log("You are an user logout first");
                alert("You are an user logout first")
                navigate("/")
            }
            const responce = await axios.post("http://localhost:9000/admin/adminlogin", JSON.stringify(adminLoginData), {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if(responce.status === 201) {
                alert("admin logged in successfully");
                console.log("admin logged in successfully");
                localStorage.setItem('token', responce.data.token);
                localStorage.setItem('isLoggedInAdmin', true);
                navigate('/adminpanel');
            } else if(responce.status === 401) {
                alert("Incorrect username or password", responce.data.message);
                console.log("Incorrect username or password", responce.data.message);
                return;
            } else {
                alert("Error logging in user");
                console.error("Error while adminLoginData:", responce.data.message);
                return;
            }
        } catch(err) {
            console.log("Error: ", err);
            alert("Error logging in admin");
            return;
        }
    }

  return (
    <>
        <form className="form text-black flex flex-row items-center justify-center h-screen" onSubmit={(e) => handleLogin(e)}>
            <label>Email : </label>
            <input type="text" placeholder="Enter your Email" className='email' value={adminLoginData.email} onChange={(e) => setadminLoginData({...adminLoginData, email : e.target.value})}/>
            <label>Password : </label>
            <input type="password" placeholder="Enter your password" className='password' value={adminLoginData.password} onChange={(e) => setadminLoginData({...adminLoginData, password : e.target.value})}/>
            <button type="submit">adminLogin</button>
        </form>  
    </>
  )
}
