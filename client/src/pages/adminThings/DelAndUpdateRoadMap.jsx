import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';

export default function DelAndUpdateRoadMap({ context, setContext }) {
  const inputRef = useRef();
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [divcontent, setDivContent] = useState("");
  const [twoh, setTowh] = useState(false);

  useEffect(() => {
    setContext(localStorage.getItem("admincontext"));
    inputRef.current.focus();
  }, []);

  const handleDeleteRoadMap = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete("http://localhost:9000/admin/deleteroadmap", {
        params: { topic },
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setTopic("");
      console.log(response);
      setMessage(response.data.message);
    } catch (err) {
      console.log("error: ", err);
      setMessage("Error occurred!");
    }
  };

  const handleUpdateRoadMap = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:9000/admin/getroadmap", {
        params: { topic },
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response);
      if (response.status === 200) {
        setTowh(true);
        setDivContent(response.data.roadmap.roadmap);
      } else if (response.status === 401) {
        setDivContent("RoadMap not Found");
      } else {
        setDivContent("Error while retrieving roadmap");
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const handleUpdateRoadMap1 = async (e) => {
    e.preventDefault();
    // console.log("topic: ", topic);
    // console.log("content: ", divcontent);

    try {
      const response = await axios.put(
        "http://localhost:9000/admin/updateroadmap",
        { topic: topic, roadmap: divcontent },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
        
      if (response.status === 200) {
        console.log(response.data.updateData);
        setMessage("Update Successful!");
      } else {
        console.log(response.data.message);
        setMessage(response.data.message);
      }
    } catch (err) {
      console.log("error: ", err);
      setMessage("Error while updating!");
    }
  };

  return (
    <>
      <center><h2>Admin {context} RoadMap</h2></center>
      <div>
        <form onSubmit={(e) => context === "deleter" ? handleDeleteRoadMap(e) : handleUpdateRoadMap(e)}>
          <label>Enter Topic: </label>
          <input
            type='text'
            placeholder='topic'
            value={topic}
            ref={inputRef}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button type='submit'>{context} roadmap</button>
        </form>
      </div>

      {message && <center className='text-red-400'><p>{message}</p></center>}

      {divcontent && twoh && (
        <form onSubmit={handleUpdateRoadMap1}>
          <label>Topic: </label>
          <input type='text' value={topic} readOnly />
          <label>Content: </label>
          <textarea
            value={divcontent}
            onChange={(e) => setDivContent(e.target.value)}
          />
          <button type='submit'>Update roadmap</button>
        </form>
      )}

      {divcontent && !twoh && (
        <center>
          <h2 className="text-orange-500">{divcontent}</h2>
        </center>
      )}
    </>
  );
}
