import React, { useState, useEffect, useContext } from "react";
import Loader from "./Loader";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const Quiz = ({ quizData, setQuizData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { userData, loginUser } = useContext(AuthContext);
  useEffect(() => {
  if (quizData && quizData.questions) {
    loginUser({ ...userData, quizData }, true);
  } else {
    setQuizData(userData.quizData);
  }
}, [quizData]);

  useEffect(() => {
    localStorage.removeItem("quiz-userAnswers");
    localStorage.removeItem("quiz-submitted");
    localStorage.removeItem("quiz-score");

    setUserAnswers({});
    setSubmitted(false);
    setScore(0);


    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [quizData]);

  useEffect(() => {
    localStorage.setItem("quiz-userAnswers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    localStorage.setItem("quiz-submitted", submitted);
    localStorage.setItem("quiz-score", score);
  }, [submitted, score]);

  const handleOptionChange = (qIndex, selectedKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: selectedKey,
    }));
  };

  const handleSubmit = async () => {
    let newScore = 0;
    quizData.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) newScore++;
    });

    setScore(newScore);
    setSubmitted(true);

    try {
      await axios.post(
        "http://localhost:9000/api/quizscore",
        {
          score: newScore,
          topic: userData.goal,
          totalquestions: quizData.questions.length,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Score submitted");
    } catch (err) {
      console.error("Error submitting score:", err.response?.data || err);
    }
  };

  const handleRestart = async() => {
    try {
      const response = await axios.get("http://localhost:9000/api/quiz", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          goal: userData.goal,
        },
      });

      
      let newResp = {
        "questions": response.data.questions
      }

      if(!newResp || !newResp.questions) {
        alert("Quiz data is invalid");
        return;
      }
      setQuizData({questions: newResp.questions});
      
    } catch (err) {
      console.error("Quiz error:", err.message);
      alert("Error fetching or parsing quiz");
    }

    localStorage.removeItem("quiz-userAnswers");
    localStorage.removeItem("quiz-submitted");
    localStorage.removeItem("quiz-score");

    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-700 rounded-md">
      <h1 className="text-2xl font-bold mb-4">{userData.goal} Quiz</h1>

      {quizData.questions.map((q, index) => (
        <div
          key={index}
          className="mb-6 p-4 border rounded-md shadow-sm bg-white text-slate-900"
        >
          <h2 className="font-semibold">
            {index + 1}. {q.question}
          </h2>
          <div className="mt-2 space-y-1">
            {Object.entries(q.options).map(([key, value]) => (
              <label
                key={key}
                className={`block p-2 rounded cursor-pointer ${
                  submitted
                    ? key === q.correctAnswer
                      ? "bg-green-100"
                      : userAnswers[index] === key
                      ? "bg-red-100"
                      : ""
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={key}
                  disabled={submitted}
                  checked={userAnswers[index] === key}
                  onChange={() => handleOptionChange(index, key)}
                  className="mr-2"
                />
                {key}. {value}
              </label>
            ))}
          </div>
          {submitted && (
            <p className="mt-2 text-sm text-gray-600">
              <strong>Explanation:</strong> {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      ) : (
        <>
          <div className="mt-4 text-lg font-semibold text-green-700">
            You scored {score} out of {quizData.questions.length}
          </div>
          <button
            onClick={handleRestart}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Start Over
          </button>
        </>
      )}
    </div>
  );
};

export default Quiz;
