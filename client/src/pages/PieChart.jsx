// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { useContext, useEffect, useState } from "react";
// import axios from 'axios';
// import Loader from "../components/Loader";
// import { AuthContext } from "../components/AuthContext";

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function PieChart({ profileData, setProfileData, fullname, setFullname }) {
//   const [load, setLoad] = useState(false);
//   const { userData, loginUser } = useContext(AuthContext);
  
//   useEffect(() => {
//       if(userData.roadmap !== "") loginUser({...userData, roadmap: ""}, true);
//     const fetchData = async(req, res) => {
//       const responce = await axios.get("http://localhost:9000/api/getprofiledata",
//         {
//             headers: {
//                 "Content-type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("token")}`
//             },
//         }
//       );
    
//       if(responce.status == 201) {
//           setTimeout(() => {
//           const profileDataGot = responce.data.profileData;
//           setLoad(true);
//           setProfileData(profileDataGot);
//           }, 2000);
//       } else {
//           console.log("data receiving error at piechart");
//       }
//         setFullname(userData.fullname);
//     }
//     fetchData();
//   }, []);

//   if (!profileData || profileData.length === 0) {
//     <p className="text-center">No profile data to show.</p>;
//   }

//   const chartData = {
//     labels: profileData.map((item) => item.topic),
//     datasets: [
//       {
//         label: "Accuracy (%)",
//         data: profileData.map((item) => item.accuracy),
//         backgroundColor: [
//           "#4CAF50",
//           "#F44336",
//           "#FF9800",
//           "#2196F3",
//           "#9C27B0",
//           "#00BCD4",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     !load ? <Loader /> : (
//       profileData.length == 0 ? <div className={`w-screen h-screen flex items-center justify-center text-xl ${userData.mode === 'dark' ? 'bg-zinc-900 text-slate-50' : 'bg-slate-50 text-slate-950'}`}><center><h1>No test skill participated</h1></center></div> : (
//         (
//           <div
//       className={`flex flex-col items-center justify-center w-full min-h-screen py-10 px-4
//         ${userData.mode === "dark" ? "bg-[#2B2B2B] text-white" : "bg-white text-black"}`}>
//       <h1 className="text-2xl font-bold mb-8">Accuracy by Topic</h1>
//       <div className="flex flex-col lg:flex-row items-start justify-center gap-10 w-full max-w-6xl">
//         <div className="flex flex-col items-center justify-between w-full lg:w-[480px] cursor-pointer">
//           <Pie data={chartData} />
//         </div>

//         <div className="w-full lg:w-[500px]">
//           <h2 className="font-bold text-center mb-2">
//             Fullname: {userData.fullname}
//           </h2>
//           <div className="overflow-x-auto">
//             <table
//               className={`w-full border text-sm rounded-lg overflow-hidden shadow-xl cursor-pointer
//               ${!userData.mode === "dark" ? "bg-white text-[#333]" : "bg-[#1f2937] text-white"}`}
//             >
//               <thead>
//                 <tr
//                   className={`${
//                     !userData.mode === "dark" ? "bg-[#f0f0f0]" : "bg-[#374151]"
//                   } border-b`}
//                 >
//                   <th className="py-2 px-4 text-left">Topic</th>
//                   <th className="py-2 px-4 text-left">Accuracy (%)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {profileData.map((item, index) => (
//                   <tr
//                     key={index}
//                     className={`${
//                       index % 2 === 0
//                         ? !userData.mode === "dark"
//                           ? "bg-[#fafafa]"
//                           : "bg-[#2c2f33]"
//                         : !userData.mode === "dark"
//                         ? "bg-white"
//                         : "bg-[#1e1f22]"
//                     } hover:bg-[#d3d3d3]/10 transition-all duration-200`}
//                   >
//                     <td className="py-2 px-4">{item.topic}</td>
//                     <td className="py-2 px-4">{item.accuracy}%</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//         )
//       )
//     )
//   );
// }


import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import Loader from "../components/Loader";
import { AuthContext } from "../components/AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ profileData, setProfileData, fullname, setFullname }) {
  const [load, setLoad] = useState(false);
  const { userData, loginUser } = useContext(AuthContext);

  useEffect(() => {
    if (userData.roadmap !== "") loginUser({ ...userData, roadmap: "" }, true);
    const fetchData = async () => {
      const response = await axios.get("http://localhost:9000/api/getprofiledata", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.status === 201) {
        setTimeout(() => {
          const profileDataGot = response.data.profileData;
          setLoad(true);
          setProfileData(profileDataGot);
        }, 2000);
      } else {
        console.log("data receiving error at piechart");
      }
      setFullname(userData.fullname);
    };
    fetchData();
  }, []);

  if (!load) return <Loader />;

  if (!profileData || profileData.length === 0) {
    return (
      <div className={`w-screen h-screen flex items-center justify-center text-xl ${userData.mode === 'dark' ? 'bg-zinc-900 text-slate-50' : 'bg-slate-50 text-slate-950'}`}>
        <center><h1>No test skill participated</h1></center>
      </div>
    );
  }

  const chartData = {
    labels: profileData.map((item) => item.topic),
    datasets: [
      {
        label: "Accuracy (%)",
        data: profileData.map((item) => item.accuracy),
        backgroundColor: [
          "#4CAF50", "#F44336", "#FF9800",
          "#2196F3", "#9C27B0", "#00BCD4",
          "#3F51B5", "#E91E63", "#8BC34A"
        ],
        borderWidth: 1,
      },
    ],
  };

  const isDark = userData.mode === "dark";

  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-screen py-10 px-4 cursor-pointer
      ${isDark ? "bg-gradient-to-br from-[#1a1a1a] via-[#2b2b2b] to-black text-white" : "bg-gradient-to-br from-white via-gray-100 to-slate-200 text-black"}`}>
      <h1 className="text-3xl font-bold mb-8 tracking-wide">📊 Accuracy by Topic</h1>
      <div className="flex flex-col lg:flex-row items-start justify-center gap-10 w-full max-w-6xl animate-fade-in">
        <div className="flex flex-col items-center justify-between w-full lg:w-[480px] bg-white/10 dark:bg-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-md border border-gray-300 dark:border-gray-600">
          <Pie data={chartData} className="text-zinc-50"/>
        </div>

        <div className="w-full lg:w-[500px]">
          <h2 className="font-bold text-xl mb-3 text-center">👤 Fullname: <span className="text-blue-600 dark:text-blue-400">{userData.fullname}</span></h2>

          <div className="overflow-x-auto bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-600">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className={`${isDark ? "bg-slate-800 text-white" : "bg-slate-200 text-black"} text-left uppercase`}>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Accuracy (%)</th>
                </tr>
              </thead>
              <tbody>
                {profileData.map((item, index) => (
                  <tr
                    key={index}
                    className={`transition-all duration-200 ${index % 2 === 0
                      ? isDark ? "bg-slate-900/40" : "bg-gray-100"
                      : isDark ? "bg-slate-800/50" : "bg-white"} hover:bg-blue-50 dark:hover:bg-slate-700`}
                  >
                    <td className="py-2 px-4">{item.topic}</td>
                    <td className="py-2 px-4">{item.accuracy.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
