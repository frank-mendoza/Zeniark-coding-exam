import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import QuestionsPage from "./pages/Questions";
import Results from "./pages/Results";

import "./styles/main.scss";

function App() {
  const [data, setData] = useState([]);
  const [singleQuestion, setSingleQuestion] = useState({});
  const [pageNumber, setpageNumber] = useState(0);
  const [question, setQuestion] = useState("");
  const [getAnswer, setGetAnswer] = useState([]);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        const sliceData = data.slice(0, 10)
        const newArray = sliceData.map((ind, id) => ({
          ...ind,
          id: id,
        }));
        setData(newArray);
        filteredList(newArray);
      });
  }, [pageNumber]);

  const submitAnswer = (answer, record) => {
    if (pageNumber === data.length) {
      return setpageNumber(data.length);
    }
    setGetAnswer((res) => [
      ...res,
      {
        ...record,
        user_answer: answer,
        correct_answer: record.correct_answer.toLowerCase(),
        id: record.id,
      },
    ]);
    setpageNumber(pageNumber + 1);
  };

  const filteredList = (newArray) =>
    newArray
      .filter((ind) => ind.id === pageNumber)
      .map((evt) => {
        let newText = evt.question;
        newText = newText
          .replaceAll("&#039;", "'")
          .replaceAll("&quot;", '"')
          .replaceAll("&eacute;", '"')
          .replaceAll("&rsquo;", "'");

        setSingleQuestion(evt);
        return setQuestion(newText);
      });

  const resetQuestions = () => {
    setSingleQuestion({});
    setpageNumber(0);
    setQuestion("");
    setGetAnswer([]);
  };
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route
            element={
              <QuestionsPage
                submitAnswer={submitAnswer}
                data={data}
                question={question}
                pageNumber={pageNumber}
                singleQuestion={singleQuestion}
              />
            }
            path="/quiz"
          />
          <Route
            element={
              <Results resetQuestions={resetQuestions} answers={getAnswer} />
            }
            path="/results"
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
