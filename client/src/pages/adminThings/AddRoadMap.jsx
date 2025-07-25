import {React, useState, useRef} from 'react'
import axios from 'axios';

export default function AppRoadMap() {
    let inputRef = useRef();
    const [roadmap, setRoadmap] = useState({
        topic: '',
        content: ''
    });
    const [divContent, setDivContent] = useState("");

    const handleAddRoadMap = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9000/admin/addroadmap",
                {
                    topic: roadmap.topic,
                    content: roadmap.content
                }, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if(response.status === 200) {
                setDivContent(response.data.message);
            }
        } catch(err) {
            // console.log("error while adding roadmap", err);
            if(err.response) {
                setDivContent(err.response.data.message);
            } else {
                setDivContent("unexpected error occured");
            }
        }
    }
  return (
    <>
         <form onSubmit={(e) => {
            handleAddRoadMap(e)
         }}>
            <label>Topic: </label>
            <input type='text' placeholder='topicname' ref={inputRef} value={roadmap.topic} onChange={(e)=> setRoadmap({...roadmap, topic: e.target.value})}/><br/><br/>
            <label>Content: </label>
            <textarea type='text' placeholder='RoadmapContent' value={roadmap.content} onChange={(e)=> setRoadmap({...roadmap, content: e.target.value})}/><br/><br/>
            <button type='submit'>AddRoadmap</button>
         </form>

         {divContent !=="" && (
            <center>
                <h2 className="text-xl text-orange-400">{divContent}</h2>
            </center>
         )}
    </>
  )
}
