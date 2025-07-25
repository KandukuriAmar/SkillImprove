import React, { useEffect } from 'react'
import { useNavigate } from "react-router";

export default function AdminPanal({ context, setContext }) {
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token") || !localStorage.getItem("isLoggedInAdmin")) {
      navigate("/adminlogin");
    } else {
      navigate("/adminpanel")
    }
  }, []);

  const handleCreateUser = (e) => {
    e.preventDefault();
      navigate("/adminadduser")
  }

  const handleDeleteUser = (e) => {
    e.preventDefault();
    localStorage.setItem("admincontext", "delete");
    navigate("/delandreaduser");
  }

  const handleReadUser = (e) => {
    e.preventDefault();
    localStorage.setItem("admincontext", "read");
    navigate("/delandreaduser");
  }

  const handleUpdateUser = (e) => {
    e.preventDefault();
    navigate("/updateuser");
  }

  const handleCreateRoadmap = (e) => {
    e.preventDefault();
    navigate("/addroadmap");
  }

  const handleReadRoadmap = (e) => {
    e.preventDefault();
    navigate("/readroadmap");
  }

  const handleDeleteRoadmap = (e) => {
    e.preventDefault();
    localStorage.setItem("admincontext","deleter")
    navigate("/deleteroadmap");
  }

  const handleUpdateRoadmap = async(e) => {
    e.preventDefault();
    localStorage.setItem("admincontext", "updater")
    navigate("/updateroadmap")
  }
  
  const handleGetAllUsers = (e) => {
    e.preventDefault();
    navigate("/getallusers")
  }

  const handleGetAllRoadMaps = (e) => {
    e.preventDefault();
    navigate("/getallroadmaps")
  }


  return (
    <>
      <div className='flex flex-wrap gap-2 mt-44'>
      <button onClick={(e) => handleCreateUser(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">CreateUser</button>
      <button onClick={(e) => handleDeleteUser(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">DeleteUser</button>
      <button onClick={(e) => handleUpdateUser(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">UpdateUser</button>
      <button onClick={(e) => handleReadUser(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">ReadUser</button>
      <button onClick={(e) => handleCreateRoadmap(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">AddRoadMap</button>
      <button onClick={(e) => handleDeleteRoadmap(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">RemoveRoadMap</button>
      <button onClick={(e)=> handleUpdateRoadmap(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">updateRoadMap</button>
      <button onClick={(e)=> handleReadRoadmap(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">ReadRoadMap</button>
      <button onClick={(e)=> handleGetAllUsers(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">GetAllUsers</button>
      <button onClick={(e) => handleGetAllRoadMaps(e)} className="p-5 text-slate-50 bg-slate-950 rounded-lg ml-1 transition delay-50 duration-200 ease-in hover:bg-slate-500 hover:text-gray-100">GetAllRoadMaps</button>
      </div>
    </>
  )
}