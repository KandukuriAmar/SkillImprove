import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function UpdateUser() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    try {
      const response = await axios.get(`http://localhost:9000/admin/readuser`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
                email
            }
      });
      console.log(response);
      setUser(response.data.user);
      setNotFound(false);
    } catch (error) {
      setUser(null);
      setNotFound(true);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:9000/admin/updateuser', 
        { updateData: user },
        {
            headers: {
                "Content-type" : "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
      });
      alert('User updated successfully!');
    } catch (error) {
      alert('Failed to update user.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-center font-bold text-xl mb-4">Update User</h2>
      <form onSubmit={handleEmailSubmit} className="mb-4">
        <label className="block mb-1 font-medium">Enter Email to Search:</label>
        <input
          type="email"
          ref={inputRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
          placeholder="Enter user email"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search User
        </button>
        {notFound && (
          <p className="text-red-600 mt-2 font-semibold">User Not Found</p>
        )}
      </form>

      {user && (
        <form onSubmit={handleUpdateUser}>
          <label className="block mt-2 font-medium">Username:</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <label className="block mt-2 font-medium">Full Name:</label>
          <input
            type="text"
            value={user.fullname}
            onChange={(e) => setUser({ ...user, fullname: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <label className="block mt-2 font-medium">Phone:</label>
          <input
            type="text"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="border p-2 w-full mb-4"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update User
          </button>
        </form>
      )}
    </div>
  );
}