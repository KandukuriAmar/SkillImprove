// import { React, useState, useEffect, useRef, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Loader from "./Loader";
// import { AuthContext } from "./AuthContext.jsx";


// export default function Home({ setRoadmapText, setProfileData, GradientButton }) {
//   const [goal, setGoal] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { userData, loginUser } = useContext(AuthContext);
//   const containsDark = userData.mode === 'dark';
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     if(userData.roadmap !== "") loginUser({...userData, roadmap: ""}, true);
//     const token = localStorage.getItem('token');
//     if(!token){
//       navigate("/login")
//     } else {
//       const decoded = JSON.parse(atob(token.split('.')[1]));
//       const expiryTime = decoded.exp * 1000;
//       const remainingTime = expiryTime - Date.now();
  
//       if (remainingTime > 0) {
//           setTimeout(() => {
//               localStorage.removeItem('token');

//               navigate("/login");
//           }, remainingTime);
//       } else {
//           localStorage.removeItem('token');
//           navigate("/login");
//       }
//     }
//   }, []);

//   const inputRef = useRef();

//   const handleGoal = async(e) => {
//       e.preventDefault();
//       setIsLoading(true);
//       loginUser({...userData, goal, roadmap: ""}, true)
//       console.log(`goal: ${goal}`);
//       try {
//         const response = await axios.post("http://localhost:9000/api/roadmap", { 
//             goal,
//           }, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         console.log(response);
//         if (response.status === 200) {
//           let roadmapText = response.data.roadmap;
//           console.log("response: ", response);
//           if(response.data.message.includes("exists")) {
//             console.log(`Roadmap already exists`);
//             roadmapText = response.data.roadmap;
//           } else {
//             console.log(`Roadmap successfully created`);
//           }
//           console.log("roadmap: ", roadmapText);
//           setRoadmapText(roadmapText);
//           setGoal("");
//           navigate("/roadmap");
//         }
//       } catch (error) {
//         alert("Something went wrong. Please try again.");
//         console.error("Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//   }

//   const handlePastGoal = async (e) => {
//     e.preventDefault();
//       const responce = await axios.get("http://localhost:9000/api/getprofiledata",
//         {
//             headers: {
//                 "Content-type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("token")}`
//             }
//         }
//     );

//     if(responce.status == 201) {
//         console.log("responce: ", responce);
//         console.log("data received at home: ", responce.data.profileData);
//         const profileDataGot = responce.data.profileData;
//         setProfileData(profileDataGot);
//         let fullname = responce.data.fullname;
//         console.log(fullname);
//         // localStorage.setItem("fullname", fullname);
//         loginUser({...userData, fullname: fullname})
//         navigate("/pastgoals")
//     } else {
//         console.log("data receiving error");
//     }
//   }
//   useEffect(() => {
//     inputRef.current.focus();
//   }, []);
//   return (
//     <div className={`home-container flex flex-col items-center justify-center h-screen ${containsDark ? 'bg-slate-950 text-white' : 'bg-white text-black'}`}>
//       <form
//         onSubmit={(e) => handleGoal(e)}
//       >
//         <label>What do you want to achieve? </label><br/>

//         <input
//           type="text"
//           placeholder="Enter your goal"
//           value={goal}
//           ref={inputRef}
//           onChange={(e) => setGoal(e.target.value)}
//           className={`goal border-2 border-gray-300 rounded-md p-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-slate-600 ${containsDark ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
//         /><br/>
//         <div className="button-container flex justify-center items-center gap-4 mt-4">
//         <GradientButton type="submit" variant="variant">Submit</GradientButton>
//           <GradientButton type="button" onClick={handlePastGoal}>
//                 Get My Past Learnings
//           </GradientButton>
//         </div>
//         {isLoading && <Loader />}
//       </form>
//     </div>
//   );
// }


import { React, useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { AuthContext } from "./AuthContext.jsx";
import StarsBackground from "./dotBackground";

export default function Home({ setRoadmapText, setProfileData, GradientButton }) {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userData, loginUser } = useContext(AuthContext);
  const containsDark = userData.mode === 'dark';
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    if (userData.roadmap !== "") loginUser({ ...userData, roadmap: "" }, true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
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

  const handleGoal = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    loginUser({ ...userData, goal, roadmap: "" }, true);
    try {
      const response = await axios.post("http://localhost:9000/api/roadmap",
        { goal },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response.status === 200) {
        let roadmapText = response.data.roadmap;
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

  const handlePastGoal = async (e) => {
    e.preventDefault();
    const response = await axios.get("http://localhost:9000/api/getprofiledata", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (response.status === 201) {
      const profileDataGot = response.data.profileData;
      setProfileData(profileDataGot);
      let fullname = response.data.fullname;
      loginUser({ ...userData, fullname: fullname });
      navigate("/pastgoals");
    } else {
      console.log("data receiving error");
    }
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

    return (
    <StarsBackground starColor={containsDark ? "white" : "black"}>
      <div className={`home-container flex flex-col items-center justify-center h-screen relative z-10 ${containsDark ? 'text-white' : 'text-black'}`}>
        {/* <div className="text-5xl mt-16 text-slate-50 flex flex-wrap justify-center w-screen h-fit">skill improve website </div> */}
        <form onSubmit={handleGoal} className={`text-center p-4 border-2 rounded-md ${containsDark ? 'bg-slate-800' : 'bg-indigo-200'}`}>
          <label className="text-lg font-semibold">What do you want to achieve?</label><br />
          <input
            type="text"
            placeholder="Enter your goal"
            value={goal}
            ref={inputRef}
            required
            onChange={(e) => setGoal(e.target.value)}
            className={`goal border-2 border-gray-300 rounded-md p-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-slate-600 mt-2 ${containsDark ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
          /><br />

          <div className="button-container flex justify-center items-center gap-4 mt-4">
            <GradientButton type="submit" variant="variant">Submit</GradientButton>
            <GradientButton type="button" onClick={handlePastGoal}>
              Get My Past Learnings
            </GradientButton>
          </div>
          {isLoading && <Loader />}
        </form>
      </div>
    </StarsBackground>
  );

}
