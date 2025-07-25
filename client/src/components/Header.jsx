import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import goldLogo from '../assets/goldbrain.png';
import blackLogo from '../assets/blackbrain.png';
import { Link,useNavigate } from 'react-router-dom'

export default function Header({ setProfileData, setFullname, MdDarkMode, MdOutlineLightMode, toggledarkMode }) {

    const navigate = useNavigate();
    const { userData, logoutUser } = useContext(AuthContext);
    const containsDark = userData.mode === 'dark';

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem('token');
        if(userData.isLoggedInAdmin) {
            alert("admin logged out successfully");
            console.log("admin logged out successfully");
            localStorage.removeItem('isLoggedInAdmin');
        } else {
            alert("User logged out successfully");
            console.log("User logged out successfully");
        }
        navigate("/login")
    }

    const handleProfile = async(e) => {
        const responce = await axios.get("http://localhost:9000/api/getprofiledata",
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        if(responce.status == 201) {
            console.log("data received: ", responce.data.profileData);
            const profileDataGot = responce.data.profileData;
            setProfileData(profileDataGot);
            setFullname(responce.data.fullname);
            navigate("/profile")
        } else {
            console.log("data receiving error");
        }
    }

    const logo = containsDark ? blackLogo : goldLogo;

    return (
        <>
        <header
            className={`fixed top-0 left-0 right-0 z-50 flex flex-row h-16 justify-between items-center px-4 py-2 ${userData.mode === 'dark' ? 'text-zinc-400 bg-black ' : 'text-black bg-white '}`}>
            <div>
                <a href="/"><img src={logo} className="w-10 h-10 rounded-full" alt="Logo" /></a>
            </div>
            <div className='flex flex-wrap justify-center items-center'>
                <nav>
                <ul className='flex gap-4 items-center justify-center'>
                    <div>{localStorage.getItem("isLoggedInAdmin") ? null : <li><Link to='/home'>Home</Link></li>}</div>
                    
                    {!localStorage.getItem('token') && (
                        <>
                            <div><li><Link to='/login'>Login</Link></li></div>
                            <div><li><Link to='/register'>Register</Link></li></div>
                        </>
                    )}

                    {localStorage.getItem('token') && (
                        <>
                        <li><button type='button' onClick={handleLogout}>Logout</button></li>
                        {userData.isLoggedInAdmin ? null : (
                            <li><button type='button' onClick={handleProfile}>Profile</button></li>
                        )}
                        </>
                    )}


                    { containsDark? <MdDarkMode className="cursor-pointer h-5 w-5" onClick={toggledarkMode}/> : <MdOutlineLightMode className="cursor-pointer h-5 w-5" onClick={toggledarkMode}/> }

                    </ul>
                </nav>
            </div>
        </header>
    </>
  )
}
