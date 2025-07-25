import Scene from "./HomeCube";
import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

export default function DemoOne({ setRoadmapText, setProfileData, GradientButton }) {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  const containsDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      navigate("/login")
    } else {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = decoded.exp * 1000;
      const remainingTime = expiryTime - Date.now();

      if (remainingTime > 0) {
          setTimeout(() => {
              localStorage.removeItem('token');
              navigate("/login");
          }, remainingTime);
      } else {
          localStorage.removeItem('token');
          navigate("/login");
      }
    }
  }, []);

  const handleGoal = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.setItem("goal", goal);
    try {
      const response = await axios.post(
        "http://localhost:9000/api/roadmap",
        JSON.stringify({ goal }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        let roadmapText = response.data.roadmap;
        if(response.data.message.includes("exists")) {
          roadmapText = response.data.roadmap;
        }
        setRoadmapText(roadmapText);
        setGoal("");
        navigate("/roadmap");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePastGoal = async () => {
    const response = await axios.get("http://localhost:9000/api/getprofiledata",
      {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if(response.status === 201) {
      const profileDataGot = response.data.profileData;
      setProfileData(profileDataGot);
      let fullname = response.data.fullname;
      localStorage.setItem("fullname", fullname);
      navigate("/pastgoals")
    } else {
      console.log("data receiving error");
    }
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="h-screen w-screen relative flex flex-col justify-center items-center">
      <div className="absolute inset-0">
        <Scene />
      </div>
      <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight text-white drop-shadow-xl">
        Solve the Complexity
      </h1>
      <p className="text-lg md:text-xl text-white max-w-2xl px-6 leading-relaxed">
        One twist at a time.
      </p>
      <form
        onSubmit={(e) => handleGoal(e)}
        className="z-10 mt-6"
      >
        <label className={`block mb-2 text-lg text-white`}>What do you want to become? </label>
        <input
          type="text"
          placeholder="Enter your goal"
          value={goal}
          ref={inputRef}
          onChange={(e) => setGoal(e.target.value)}
          className={`goal border-2 border-gray-300 rounded-md p-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-slate-600 ${containsDark ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
        /><br/>
        <div className="button-container flex justify-center items-center gap-4 mt-4">
          <GradientButton type="submit" variant="variant">Submit</GradientButton>
          <GradientButton type="button" onClick={handlePastGoal}>
            Get My Past Learnings
          </GradientButton>
        </div>
        {isLoading && <Loader />}
      </form>
    </div>
  );
}
