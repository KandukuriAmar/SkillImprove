import {React, useState, useEffect} from 'react'
import axios from 'axios';

export default function GetAllUsers() {
    const [allusers, setAllusers] = useState([]);
    useEffect(() => {
        const getAllUsers = async() => {
            try {

                const response = await axios.get("http://localhost:9000/admin/getallusers", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log("RESPONCE: ", response);
                if(response.status === 200) {
                    setAllusers(response.data.users);
                }
            } catch(err) {
                console.log("Error: ", err);
            }
        }
        getAllUsers();
    }, []);
    
  return (
    <> 
        <center><h1 className="font-serif font-semibold text-orange-400">All Users</h1></center>
        {allusers.length === 0 ? <center><p>No Users Found</p></center> : (
            allusers.map((user) => (
                <center>
                    <div key={user.email} className="border-2 border-red-400 p-4 m-4">
                        <ul>
                            <li>
                                <h2>Username: {user.username}</h2>
                                <h2>Email: {user.email}</h2>
                                <h2>Fullname: {user.fullname}</h2>
                                <h2>Phone: {user.phone}</h2>
                            </li>
                        </ul>
                    </div>
                </center>
            ))
        )}
    </>
  )
}
