import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function ReadRoadmap() {
  const [topic, setTopic] = useState("");
  const [divcontent, setDivContent] = useState("");
  const inputRef = useRef();
  let [twoh, setTowh]=useState(false);

  const handleReadRoadmap = async (e) => {
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
      if (response.status === 401) {
        setDivContent("RoadMap not Found");
      } else if (response.status === 200) {
        setTowh(true);
        setDivContent(response.data.roadmap.roadmap);
      } else {
        setDivContent("Error while retrieving roadmap");
      }
    } catch (err) {
      console.log("Error at catch: ", err);
      setDivContent("RoadMap not Found");
    }
  };

  return (
    <>
      <form onSubmit={handleReadRoadmap}>
        <label>Topic Name: </label>
        <input
          type="text"
          placeholder="topic"
          value={topic}
          ref={inputRef}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form> 


      {divcontent && twoh && (
        <center>
          <div>
          <h2 className="text-orange-500">topic: {topic}</h2>
          <h2 className="text-orange-500">content: {divcontent}</h2>
          </div>
        </center>
      )}
      {divcontent &&  !twoh && (
        <center>
          <h2 className="text-orange-500">{divcontent}</h2>
        </center>
      )}
    </>
  );
}
