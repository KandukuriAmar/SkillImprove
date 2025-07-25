import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import StarsBackground from "./dotBackground";
import Home from "./Home";


export default function MainDotBackground({ quizData, setQuizData }) {
  const { userData, loginUser } = useContext(AuthContext);
  const containsDark = userData.mode === 'dark';

  return (
    <div className="h-screen">
      <StarsBackground starColor={containsDark ? "white" : "black"}>
        <div className={`absolute inset-0 flex items-center justify-center text-xl ${containsDark ? "text-white" : "text-black"}`}>
          Welcome to the Stars ✨
          {/* <Home quizData={quizData} setQuizData={setQuizData} /> */}
        </div>
      </StarsBackground>
    </div>
  );
}
