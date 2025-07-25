import { Routes, Route } from 'react-router-dom'
import './App.css'
import { useContext, useState, useEffect } from 'react'
import Home from './components/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header'
import RoadMap from './components/RoadMap';
import Quiz from './components/Quiz';
import PieChart from './pages/PieChart';
import PastGoals from './pages/PastGoals'
import AdminPanal from './pages/adminThings/AdminPanal'
import CreateUser from './pages/adminThings/CreateUser'
import DelandReadUser from './pages/adminThings/DelandReadUser'
import UpdateUser from './pages/adminThings/UpdateUser'
import AddRoadMap from './pages/adminThings/AddRoadMap'
import ReadRoadmap from './pages/adminThings/ReadRoadmap'
import DelAndUpdateRoadMap from './pages/adminThings/DelAndUpdateRoadMap'
import GetAllUsers from './pages/adminThings/GetAllUsers'
import GetAllRoadMaps from './pages/adminThings/GetAllRoadMaps'
import AdminLogin from './pages/adminThings/AdminLogin'
import {GradientButton} from './components/goalSubmitBtn'
import DemoHeroGeometric from './components/LandingContant'
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import DemoOne  from './components/HomeCubeContent';
import MainDotBackground from './components/maindotBackground';
import ForgetPassword from './pages/ForgetPassword'
import { AuthContext } from './components/AuthContext'


function App() {
  const [roadmapText, setRoadmapText] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [fullname, setFullname] = useState("");
  const [context, setContext] = useState("");
  const [isDarkMode, setIsDarkMode] = useState();

  const { userData, loginUser, logoutUser } = useContext(AuthContext);

  const toggledarkMode = () => {
    loginUser({
      ...userData,
      mode: userData.mode === "dark" ? "light" : "dark"
    }, true);
  };


  return (
    <>
      <Header profileData={profileData} setProfileData={setProfileData} setFullname={setFullname} MdDarkMode={MdDarkMode} MdOutlineLightMode={MdOutlineLightMode} toggledarkMode={toggledarkMode} />
        <Routes>
          <Route path="/home" element={<Home setRoadmapText={setRoadmapText} setProfileData={setProfileData} setFullname={setFullname} GradientButton={GradientButton} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/roadmap" element={<RoadMap quizData={quizData} setQuizData={setQuizData}/>} />
          <Route path="/quiz" element={<Quiz quizData={quizData} setQuizData={setQuizData}/>} />
          <Route path="/profile" element={<PieChart profileData={profileData} fullname={fullname} setFullname={setFullname} setProfileData={setProfileData} />} />
          <Route path="/pastgoals" element={<PastGoals profileData={profileData} setProfileData={setProfileData}/>} />
          <Route path='/adminpanel' element={<AdminPanal context={context} setContext={setContext}/>} />
          <Route path='/adminadduser' element={<CreateUser />} />
          <Route path='/delandreaduser' element={<DelandReadUser context={context} setContext={setContext}/>} />
          <Route path="/updateuser" element={<UpdateUser  />} />
          <Route path="/addroadmap" element={<AddRoadMap />} />
          <Route path="/readroadmap" element={<ReadRoadmap />} />
          <Route path='/deleteroadmap' element={<DelAndUpdateRoadMap context={context} setContext={setContext} />} />
          <Route path='/updateroadmap' element={<DelAndUpdateRoadMap context={context} setContext={setContext} />} />
          <Route path='/getallusers' element={<GetAllUsers />} />
          <Route path='/getallroadmaps' element={<GetAllRoadMaps />} />
          <Route path="/" element={<DemoHeroGeometric GradientButton={GradientButton}/>} />
          <Route path="/demo" element={<DemoOne setRoadmapText={setRoadmapText} setProfileData={setProfileData} GradientButton={GradientButton} />} />
          <Route path="/dot" element={<MainDotBackground quizData={quizData} setQuizData={setQuizData}/>} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
        </Routes>
    </>
  );
}

export default App