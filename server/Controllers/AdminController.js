const express = require("express");
const mongoose = require("mongoose")
const loginMiddleware = require("../Middlewares/loginMiddleware");
const userModel = require("../Models/Users");
const allRoadMapsModel = require("../Models/AllRoadMaps");
const adminModel = require("../Models/Admin")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const DeleterUserController = [loginMiddleware, async(req, res) => {
    const {email} = req.query;
   try {
    const isExcistedUser = await userModel.findOneAndDelete({ email });
    if(!isExcistedUser) {
        return res.status(404).json({message: "No user found"})
    } else {
        return res.status(201).json({message: "user deleted successfully"})
    }
} catch(err) {
    console.log("error: ", err);
    return res.status(504).json({message: "error while delete user"})    
   }
}]

const ReadUserController = [loginMiddleware, async(req, res) => {
   const {email} = req.query;
   try {
    const isExcistedUser = await userModel.findOne({ email });
    if(!isExcistedUser) {
        return res.status(404).json({message: "No user found"})
    } else {
        return res.status(201).json({message: "user data retrived successfully", user: isExcistedUser});
    }
} catch(err) {
    console.log("error: ", err);
    return res.status(504).json({message: "error while read user"})    
   }
}]

const UpdateUserController = [loginMiddleware, async (req, res) => {
      const { updateData } = req.body;
      console.log(updateData);
      const email = updateData.email;
      try {
        const updatedUser = await userModel.findOneAndUpdate(
          { email },          // Filter condition
          { $set: updateData }, // Update data
          { new: true }         // Return updated document
        );
  
        if (!updatedUser) {
          return res.status(404).json({ message: "No user found" });
        }
  
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
      } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Error while updating user" });
      }
    }
];  

const AddRoadMapController = [loginMiddleware, async(req, res) => {
    const { topic, content } = req.body;

    try {
        const isExcistedRoadMap = await allRoadMapsModel.findOne({ topic: topic.toLowerCase()});
    if(isExcistedRoadMap) {
        return res.status(409).json({message: "RoadMap already excisted admin"});
    }

    const newAllRoadMap = new allRoadMapsModel({
        topic,
        roadmap: content
    });

    await newAllRoadMap.save()
    .then(() => {
        return res.status(200).json({message: "RoadMap created successfully admin"});
    }).catch((err) => {
       return res.status(504).json({message: "creating RoadMap creating error", err});
    })
} catch(err) {
        console.log("error try catch: ", err);
        return res.status(504).json({message: "creating RoadMap creating error at try catch", err});
    }
}]

const GetRoadMapController = [loginMiddleware, async(req, res) => {
  const { topic } = req.query;
  await allRoadMapsModel.findOne({ topic: topic.toLowerCase()})
   .then((roadmap) => {
     if (!roadmap) {
        return res.status(401).json({ message: "Roadmap not found" });
      }
      res.status(200).json({ roadmap });
   }).catch((err) => {
      console.error("Error:", err.message);
      res.status(500).json({ message: "Internal server error" });
   })
}];

const DeleteRoadMapController = [loginMiddleware, async(req, res) => {
    const { topic } = req.query;
    try {
        const isExcistedRoadMap = await allRoadMapsModel.findOneAndDelete({ topic });
        if(!isExcistedRoadMap) {
            return res.status(403).json({message: "No RoadMap found"});
        }
        return res.status(200).json({message: "RoadMap deleted succesfully", roadmap: isExcistedRoadMap});
    } catch(err) {
        console.log("Error: ",err);
        return res.status(503).json({message: "Server error: ", err});
    }
}];

const UpdateRoadMapController = [loginMiddleware, async (req, res) => {
    const updateData = req.body;
    const topic = updateData.topic;

    try {
        const updatedRoadMap = await allRoadMapsModel.findOneAndUpdate(
            { topic },
            { $set: updateData },
            { new: true }
        );

        if (!updatedRoadMap) { 
            return res.status(403).json({ message: "No Roadmap with that name" });
        }
        console.log(updatedRoadMap);
        return res.status(200).json({ message: "Roadmap updated successfully", updateData: updatedRoadMap });
    } catch (err) {
        return res.status(503).json({ message: "Error occurred", error: err });
    }
}];

const GetAllUsersController = [loginMiddleware, async(req, res) => {
    try {
        const allUsers = await userModel.find();
        res.status(200).json({message: "allusersgot", users: allUsers});
    } catch(err) {
        res.status(503).json({message: "error: ", err});
    }
}]

const GetAllRoadMapsController = [loginMiddleware, async(req, res) => {
    try {
        const allRoadmaps = await allRoadMapsModel.find();
        res.status(200).json({message: "allroadmapsgot", roadmaps: allRoadmaps});
    } catch(err) {
        res.status(503).json({message: "error: ", err});
    }
}]

const AdminLoginController = [async(req, res) => {
    const { email, password } = req.body;
    try {
        const isExcistedAdmin = await adminModel.findOne({ email });
        console.log(isExcistedAdmin);
        console.log("email: ", email);
        console.log("password: ", password);
        
        if(!isExcistedAdmin) {
            res.status(409).json({message: "Incorrect username"});
        } else {
            const isPasswordCorrect = await bcrypt.compare(password, isExcistedAdmin.password);
            if(!isPasswordCorrect) {
                res.status(409).json({message: "Incorrect password"});
            } else {
                jwt.sign(
                    { user: isExcistedAdmin },
                    process.env.JWT_SECRET_KEY,
                    (err, token) => {
                        if(err) {
                            console.log("Error: ", err);
                            res.status(500).json({ message: "Internal server error" });
                        } else{
                            res.status(201).json({ token: token, message: "ok" });
                            console.log("Logged in successfully");
                        }
                    }
                )
            }
        }
    } catch(err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}]

module.exports = { AdminLoginController, DeleterUserController, ReadUserController, UpdateUserController, AddRoadMapController, GetRoadMapController, DeleteRoadMapController, UpdateRoadMapController, GetAllUsersController, GetAllRoadMapsController }