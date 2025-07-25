const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const roadMapModel = require("../Models/Roadmaps");
const UserModel = require("../Models/Users");
const loginMiddleware = require("../Middlewares/loginMiddleware");
const UserQuizesModel = require("../Models/UserRatings");
const allRoadMapsModel = require("../Models/AllRoadMaps");
// const genAI = require("../Middlewares/geminiaiConfig");
// const OpenAI = require("openai");
// const client = new OpenAI();
const dotenv = require("dotenv");
const base64 = require('base-64');
const { CohereClient } = require("cohere-ai");
dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

let isLoggedIn = false;
const app = express();
app.use(express.json());
app.use(cors());


const registerController = async (req, res) => {
  const { username, email, password, fullname, phone } = req.body;
  console.log(req.body);
  try {
    const isUserExcisted = await UserModel.findOne({ email });
    if (isUserExcisted) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        fullname,
        phone,
      });
      await newUser.save();
      console.log(newUser);
      res.status(201).json({ message: "User registered successfully" });
      jwt.sign(
        { user: newUser },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("Error:", err.message);
            res.status(500).json({ message: "Internal server error" });
          }
          isLoggedIn = true;
          return res
            .status(201)
            .json({ message: "User registered successfully", token });
        }
      );
    }
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginController = async(req, res) => {
  const { username, password } = req.body;
  try {
    const isExcistedUser = await UserModel.findOne({ username });
    if (!isExcistedUser) {
      return res.status(401).json({ message: "User does not exist" });
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        isExcistedUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect password" });
      } else {
        isLoggedIn = true;
        jwt.sign(
          { user: isExcistedUser },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '1h' },
          (err, token) => {
            if (err) {
              console.log("Error:", err.message);
              res.status(500).json({ message: "Internal server error" });
            }
            res.status(201).json({ token: token, message: "ok" });
            console.log("Logged in successfully");
          }
        );
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const roadmapController = [
  loginMiddleware,
  async (req, res) => {
    try {
      const {goal} = req.body;
      const userId = req.user._id;
      console.log("goal at back: ", goal);
      console.log("userId at back: ", userId);

      const pastRoadMap = await roadMapModel.findOne({ userId, goal:goal.toLowerCase() });
      if (pastRoadMap) {
        return res.status(200).json({
          message: "Roadmap already exists at userlevel",
          roadmap: pastRoadMap,
        });
      }

      const existingAllRoadMap = await allRoadMapsModel.findOne({ topic: goal });
      if (existingAllRoadMap) {
        const newRoadmap = new roadMapModel({
          userId,
          goal: goal.toLowerCase(),
          roadmap: existingAllRoadMap.roadmap,
        });

        await newRoadmap.save();
        return res.status(201).json({
          message: "Roadmap created from all roadmaps",
          roadmap: existingAllRoadMap.roadmap,
        });
      }

      const prompt = `Create a detailed step-by-step learning roadmap for achieving the goal: "${goal}". 
      Break it down into clear stages or milestones. 
      Include beginner to advanced level resources, skills to acquire at each stage, and estimated timeframes if possible. 
      Make sure it's structured, motivational, and practical for someone starting from scratch.`;

      // 3 lines for google gemini
      // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      // const result = await model.generateContent(prompt);
      // const roadmapText = result.response.text();

      // 4 lines for openai
      // const response = await client.responses.create({
      //   model: "gpt-4.1",
      //   input: prompt,
      // });
      // const roadmapText = response.output_text;

      const response = await cohere.generate({
        model: "command",
        prompt: prompt,
        max_tokens: 2048,
        temperature: 0.8,
      });

      const roadmapText = response.generations[0].text;
      console.log("✅ Generated Roadmap:", roadmapText);

      
      const newAllRoadMap = new allRoadMapsModel({
        topic: goal,
        roadmap: roadmapText,
      });
      await newAllRoadMap.save();

      const newUserRoadmap = new roadMapModel({
        userId,
        goal,
        roadmap: roadmapText,
      });
      await newUserRoadmap.save();

      res.status(200).json({
        message: "Roadmap generated and saved successfully",
        roadmap: roadmapText,
      });

    } catch (error) {
      console.error("Error at :", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
];


const deleteRoadMapController = [loginMiddleware,  (req, res) =>{
  const userId = req.user._id;
  const {goal} = req.query;

  roadMapModel.findOneAndDelete({ userId, goal })
   .then(() => {
      res.status(200).json({ message: "Roadmap deleted successfully" });
    })
   .catch((err) => {
      console.error("Error:", err.message);
      res.status(500).json({ message: "Internal server error" });
    });
}];

const getRoadMapController = [loginMiddleware, (req, res) => {
  const userId = req.user._id;
  const { goal } = req.query;
  roadMapModel.findOne({ userId, goal })
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

// const getQuizController = [loginMiddleware, async(req, res) => {
//   const { goal } = req.query;

//   try {
//     const prompt = `
//     Generate a JSON object for a quiz on ${goal} of 10 questions.
//     - The output must be a valid JSON object (not a string).
//     - The root should contain:
//       - "quizTitle" (string): the title of the quiz
//       - "questions" (array): a list of question objects
//     - Each question object should include:
//       - "question" (string): the question text
//       - "options" (object): keys "A", "B", "C", and "D" with answer choices
//       - "correctAnswer" (string): one of "A", "B", "C", or "D"
//       - "explanation" (string): a brief explanation of the correct answer
//       - "difficulty" (string): one of "easy", "medium", or "hard"
//     - Output the full JSON object directly without wrapping it in quotes or markdown.
//     - Ensure the JSON is properly formatted and valid for parsing.
//     `;

//     const response = await cohere.generate({
//         model: "command",
//         prompt: prompt,
//         max_tokens: 2048,
//         temperature: 0.8,
//     });

//       const quizText = response.generations[0].text;

//     // const quizai = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     // const result = await quizai.generateContent(prompt);
//     // const response = result.response;
//     // const quizText = response.text();

//     console.log("Quiz:", quizText);
//     res.status(200).json({ quiz: quizText });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }]

const getQuizController = [
  loginMiddleware,
  async (req, res) => {
    const { goal } = req.query;

    try {
      const prompt = `
      Generate a JSON object for a quiz on ${goal} with 10 questions.
      - Each question should include:
        - "question"
        - "options" with keys A, B, C, D
        - "correctAnswer" as one of A, B, C, D
        - "explanation"
        - "difficulty" as "easy", "medium", or "hard"
      - Output ONLY valid JSON (no markdown, no comments)
      `;

      const response = await cohere.generate({
        model: "command",
        prompt,
        max_tokens: 2048,
        temperature: 0.8,
      });

      let quizData;

      try {
        const rawText = response.generations[0].text;
        const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("Cleaned AI quiz text:", cleanText);

        quizData = JSON.parse(cleanText);

      } catch (parseErr) {
        console.error("❌ Failed to parse JSON from AI:", parseErr.message);
        return res.status(400).json({ message: "Invalid JSON returned from AI" });
      }

      if (!quizData || !Array.isArray(quizData)) {
        console.error("❌ Malformed quiz object:", quizData);
        return res.status(400).json({ message: "Malformed quiz object" });
      }

      // ✅ Send parsed object as JSON
      res.status(200).json({ questions: quizData });
    } catch (err) {
      console.error("❌ Quiz generation error:", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
];


const quizScoreController = [loginMiddleware, async(req, res) => {
  const userId = req.user._id;
  const { score, topic, totalquestions } = req.body;
  const accuracy = (score/totalquestions)*100;

  console.log("score: ", score, "accuracy: ", accuracy, "topic: ", topic, "totalquestions: ", totalquestions);

  try {
      const isExcistedUserQuiz = await UserQuizesModel.findOne({ userId, topic });
      if(!isExcistedUserQuiz) {
        const newQuizScore = new UserQuizesModel({
          userId,
          topic,
          accuracy
        });
    
        await newQuizScore.save()
        .then(() => {
          res.status(201).json({ message: "Quiz score saved successfully", score, accuracy });
        }).catch((err) =>{
          console.error("Error:", err.message);
          res.status(500).json({ message: "Internal server error" });
        })
      }
      isExcistedUserQuiz.accuracy = accuracy;
      await isExcistedUserQuiz.save();
      return res.status(200).json({ message: "Quiz score updated", score, accuracy });
    } catch(err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}]

const getProfileDataController = [loginMiddleware, async(req, res) => {
  const userId = req.user._id;
  try {
    const profileData = await UserQuizesModel.find({ userId });
    const userData = await UserModel.findOne({_id: userId});
    console.log("profileData: ", profileData);
    // console.log("fullname at back: ", userData.fullname);
    return res.status(201).json({message: "data gotted", profileData, fullname: userData.fullname})
  } catch(err) {
    console.log("internal server error: ", err);
    return res.status(500).json({message: "internal server error"})
  }
  
}]

const updatePasswordController = [async(req, res) => {
  // const userId = req.user._id;
  const { emailorusername, password } = req.body;
  console.log("emailorusername: ", emailorusername);
  console.log("password: ", password);

  try {
    const containsUserByEmail = await UserModel.findOne({ email: emailorusername });
    const containsUserByUsername = await UserModel.findOne({ username: emailorusername });
    if (!containsUserByEmail && !containsUserByUsername) {
      return res.status(401).json({ message: "User does not exist" });
    } else {
      const containsUser = containsUserByEmail || containsUserByUsername;
      const hashedPassword = await bcrypt.hash(password, 10);
      containsUser.password = hashedPassword;
      await containsUser.save();
      return res.status(200).json({ message: "Password updated successfully" });
    }
  } catch(err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}]
 
const getMeController = [loginMiddleware, async (req, res) => {
    try {
      const userData = req.body;
      console.log("userData back: ", userData);
      if (!userData || Object.keys(userData).length === 0) {
        return res.status(400).json({ message: "No user data received" });
      }

      const token = jwt.sign({ userData }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "ok", dataTokenFormat: token });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
];

const getCookie = [loginMiddleware, (req, res) => {
  let userData = req.body;
  console.log("user data that got to back: ", userData);
  try {
    let dataToken = jwt.sign({userData}, process.env.JWT_SECRET_KEY);
    dataToken = base64.encode(dataToken);
    console.log("dataToken base64: ", dataToken);
    res.status(200).json({message: "ok", dataToken});
  } catch(err) {
    console.log("error at changinging and sending token", err)
    res.status(500).json({ message: "Internal server error" });
  }
}]

module.exports = {
  registerController,
  loginController,
  roadmapController,
  deleteRoadMapController,
  getRoadMapController,
  getQuizController,
  quizScoreController,
  getProfileDataController,
  updatePasswordController,
  getMeController,
  getCookie
};