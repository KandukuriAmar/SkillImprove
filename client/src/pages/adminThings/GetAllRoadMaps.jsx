import {React, useState, useEffect} from 'react'
import axios from 'axios';

export default function GetAllRoadMaps() {
    const [allusers, setAllusers] = useState([]);
    useEffect(() => {
        const getAllRoadMaps = async() => {
            try {

                const response = await axios.get("http://localhost:9000/admin/getallroadmaps", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log("RESPONCE: ", response);
                if(response.status === 200) {
                    setAllusers(response.data.roadmaps);
                }
            } catch(err) {
                console.log("Error: ", err);
            }
        }
        getAllRoadMaps();
    }, []);
    
  return (
    <> 
        <center><h1 className="font-serif font-semibold text-orange-400">All Roadmaps</h1></center>
        {allusers.length === 0 ? <center><p>No Roadmaps Found</p></center> : (
            allusers.map((roadmap) => (
                <center>
                    <div key={roadmap.topic} className="border-2 border-red-400 p-4 m-4">
                        <ul>
                            <li>
                                <h2>Topic: {roadmap.topic}</h2>
                                <h2>Phone: {roadmap.roadmap}</h2>
                            </li>
                        </ul>
                    </div>
                </center>
            ))
        )}
    </>
  )
}