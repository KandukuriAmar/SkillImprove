import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import Quiz from "./Quiz";
import {AuthContext} from "./AuthContext";
import { useContext } from "react";

export default function RoadMap({ quizData, setQuizData }) {
  const navigate = useNavigate();
  const { userData, loginUser } = useContext(AuthContext);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    const getRoadMap = async () => {
      try {
        if(userData.roadmap === "") {
            const response = await axios.post("http://localhost:9000/api/roadmap", {
              goal: userData.goal
            },{
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.status === 200) {
            loginUser({...userData, roadmap: response.data.roadmap.roadmap}, true);
          }
        }
      } catch(err) {
          if (err.response?.status === 401) {
            console.log("roadmap not found");
            alert("NO roadmap FOUND");
        } else {
          alert("Error getting roadmap");
          console.log("Error while getting roadmap:", err.response?.data || err);
        }
      }
    };

    getRoadMap();
  }, []);

  const handleRoadMapDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete("http://localhost:9000/api/deleteroadmap", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        params: {
          goal: userData.goal,
        },
      });

      if (response.status === 200) {
        console.log("Roadmap deleted successfully");
        navigate("/");
      }
    } catch (err) {
      alert("Error deleting roadmap");
      console.error("Error while deleting roadmap:", err.response?.data || err);
    }
  };

  const handleQuiz = async () => {
    setQuizLoading(true);
  
    try {
      const response = await axios.get("http://localhost:9000/api/quiz", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          goal: userData.goal,
        },
      });
  
      console.log("Response at roadmap.data:", response.data);
      let newResp = {
        "questions": response.data.questions
      }
      console.log("newResp: ", newResp);
  
      setQuizLoading(false);
  
      let data = newResp;
      console.log("data: ", data);

  
      if (!data || !data.questions) {
        alert("Quiz data is invalid");
        return;
      }
  
      setQuizData({ questions: data.questions });
      navigate("/quiz");
  
    } catch (err) {
      setQuizLoading(false);
      console.error("Quiz error:", err.message);
      alert("Error fetching or parsing quiz");
    }
  };
  
  return (
    <div className={`w-full h-fit ${userData.mode === 'dark' ? 'bg-zinc-900 text-slate-50' : 'bg-white text-slate-800'}`}>
      <div className="roadmap pt-16">
        <h1 className="text-2xl font-bold mb-4">Here is your Roadmap:</h1>
        <pre className="p-4 rounded-md whitespace-pre-wrap">{userData.roadmap}</pre>
      </div>

      <div className="flex flex-row  justify-around pb-2">
        <button
          onClick={() => navigate("/")}
          className="bg-[#474F7A] p-4 rounded-md text-white hover:bg-slate-300 hover:text-gray-900"
        >
          Home
        </button>
        <button
          onClick={handleRoadMapDelete}
          className="bg-[#474F7A] p-4 rounded-md text-white hover:bg-slate-300 hover:text-gray-900"
        >
          Delete
        </button>
        <button
          onClick={handleQuiz}
          className="bg-[#474F7A] p-4 rounded-md text-white hover:bg-slate-300 hover:text-gray-900"
        >
          Start Quiz
        </button>
        {quizLoading && <Loader />}
      </div>
    </div>
  );
}
