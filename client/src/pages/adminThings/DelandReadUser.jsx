import { React, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CreateUser from './CreateUser';

export default function DelandReadUser({ context, setContext }) {
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [clicked, setClicked] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setContext(localStorage.getItem("admincontext"));
    inputRef.current.focus();
  }, []);

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setClicked(true);
    setUserData(null); // Clear previous user data
    try {
      const response = await axios.delete("http://localhost:9000/admin/deleteuser", {
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        params: { email },
      });

      setEmail("");
      if (response.status === 201) {
        setMessage("User deleted successfully");
      } else {
        setMessage(response.data.message || "Unknown error");
      }
    } catch (err) {
      setMessage("User not found with this email");
    }
  };

  const handleReadUser = async (e) => {
    e.preventDefault();
    setClicked(true);
    setUserData(null);
    try {
      const response = await axios.get("http://localhost:9000/admin/readuser", {
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        params: { email },
      });

      setEmail("");
      if (response.status === 201) {
        setUserData(response.data.user);
        setMessage("");
      } else {
        setMessage(response.data.message || "No user found");
      }
    } catch (err) {
      setMessage("User not found with this email");
    }
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    <UpdateUser />
  }

  return (
    <>
      <center><h2>Admin {context} User</h2></center>
      <form onSubmit={(e) => {
        if(context == "update") handleUpdateUser(e); 
        else context === "delete" ? handleDeleteUser(e) : handleReadUser(e)
      }}>
        <label>Email: </label>
        <input
          type='text'
          placeholder='Email'
          ref={inputRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type='submit'>{context} User</button>
      </form>

      <div>
        {clicked && message && (
          <center><h1 className="text-red-600 font-bold">{message}</h1></center>
        )}

        {clicked && userData && (
          <center>
            <div className="text-lime-600">
              <h3>{`Fullname: ${userData.fullname}`}</h3>
              <h3>{`Email: ${userData.email}`}</h3>
              <h3>{`Username: ${userData.username}`}</h3>
              <h3>{`Phonenumber: ${userData.phone}`}</h3>
            </div>
          </center>
        )}
      </div>
    </>
  );
}
