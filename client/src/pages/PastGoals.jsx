// import React, { useEffect, useContext } from 'react'
// import axios from 'axios';
// import { AuthContext } from '../components/AuthContext';

// export default function PastGoals({ profileData, setProfileData }) {
//   const { userData } = useContext(AuthContext);
//   useEffect(() => {
//     const fetchData = async(req, res) => {
//       const responce = await axios.get("http://localhost:9000/api/getprofiledata",
//         {
//             headers: {
//                 "Content-type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("token")}`
//             }
//         }
//       );
    
//       if(responce.status == 201) {
//         const profileDataGot = responce.data.profileData;
//         setProfileData(profileDataGot);
//       } else {
//           console.log("data receiving error at piechart");
//       }
//     }
//     fetchData();
//   }, [])
//   let leastacc = 101;
//   let topic = "";

//   if (profileData && profileData.length > 0) {
//     profileData.forEach((pd) => {
//       if (pd.accuracy < leastacc) {
//         leastacc = pd.accuracy;
//         topic = pd.topic;
//       }
//     });
//   }
//   return (
//     <div className={`flex items-center justify-center h-screen flex-col flex-wrap ${userData.mode === "dark" ? "bg-[#2f2f2f] text-slate-50" : "bg-[#ffffff] text-slate-800"}`}>
//      {profileData.length == 0 && <center>No past goals are made by you</center>}
//       {profileData && profileData.length > 0 && (
//         <table className="table-auto border-collapse border border-gray-300 min-w-fit mt-4">
//           <thead>
//             <tr className="bg-gray-200 text-black">
//               <th className="border border-gray-300 px-4 py-2">Topic</th>
//               <th className="border border-gray-300 px-4 py-2">Accuracy</th>
//             </tr>
//           </thead>
//           <tbody>
//             {profileData.map((pd, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-300 px-4 py-2">{pd.topic}</td>
//                 <td className="border border-gray-300 px-4 py-2">{pd.accuracy}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//        {topic && (
//         <div className="mt-4 text-red-600 font-medium">
//           <p>I think you have less knowledge in <strong>{topic}</strong>. You can prepare more on this.</p>
//         </div>
//       )}
//     </div>
//   )
// }


import React, { useEffect, useContext } from 'react'
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

export default function PastGoals({ profileData, setProfileData }) {
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:9000/api/getprofiledata", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.status === 201) {
        const profileDataGot = response.data.profileData;
        setProfileData(profileDataGot);
      } else {
        console.log("Data receiving error at piechart");
      }
    };

    fetchData();
  }, []);

  let leastacc = 101;
  let topic = "";

  if (profileData && profileData.length > 0) {
    profileData.forEach((pd) => {
      if (pd.accuracy < leastacc) {
        leastacc = pd.accuracy;
        topic = pd.topic;
      }
    });
  }

  const isDark = userData.mode === "dark";

  return (
    <div className={`flex items-center justify-center min-h-screen flex-col p-4 ${isDark ? "bg-[#1a1a1a] text-white" : "bg-[#f7f7f7] text-slate-800"} cursor-pointer`}>
      <h1 className="text-2xl font-bold mb-6">📊 Your Past Learning Performance</h1>

      {profileData.length === 0 ? (
        <p className="text-center text-lg">No past goals found.</p>
      ) : (
        <div className="w-full max-w-3xl overflow-x-auto shadow-xl rounded-xl backdrop-blur-md bg-white/10 border border-gray-300 dark:bg-white/5 dark:border-slate-700 animate-fade-in">
          <table className="table-auto w-full border-collapse text-left">
            <thead className={`${isDark ? "bg-slate-800 text-white" : "bg-slate-200 text-black"} uppercase text-sm`}>
              <tr>
                <th className="border-b px-6 py-3">Topic</th>
                <th className="border-b px-6 py-3">Accuracy (%)</th>
              </tr>
            </thead>
            <tbody>
              {profileData.map((pd, index) => (
                <tr
                  key={index}
                  className={`transition duration-200 ease-in-out hover:bg-slate-100 dark:hover:bg-slate-800 ${index % 2 === 0 ? 'bg-transparent' : isDark ? 'bg-slate-900/50' : 'bg-gray-100'}`}
                >
                  <td className="px-6 py-3 border-b">{pd.topic}</td>
                  <td className="px-6 py-3 border-b">{parseFloat(pd.accuracy.toFixed(1))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {topic && (
        <div className="mt-6 max-w-xl text-center p-4 border-l-4 border-red-500 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg shadow">
          <p>
            ⚠️ You seem to have lower accuracy in <strong className="underline">{topic}</strong>. Focus more on this topic for better performance!
          </p>
        </div>
      )}
    </div>
  );
}