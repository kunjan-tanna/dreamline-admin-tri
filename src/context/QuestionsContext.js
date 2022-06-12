import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const QuestionsContext = React.createContext();
// var QuestionsDispatchContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_QUESTIONS":
      return {
        isLoaded: true,
        questions: action.payload,
      };
    case "EDIT_QUESTION":
      return {
        ...state,
        isLoaded: true
      };

    default:
      return {
        ...state
      };
  }
};

const QuestionsProvider = ({ children }) => {

  const [questions, setQuestions] = React.useReducer(rootReducer, {
    isLoaded: false,
    questions: []
  });
  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </QuestionsContext.Provider>
  );
};

const useQuestionsState = () => {
  const context = React.useContext(QuestionsContext);
  return context;
};

export async function getQuestionsRequest(dispatch) {
  let res = await apiCall('GET', '', '/admin/questions')
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_QUESTIONS", payload: res.data });
    }
  }
}

export async function updateQuestion(dispatch,reqData) {
  let res = await apiCall('PUT', '', '/admin/question',reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_QUESTION" });
    }
  }
}

// function useQuestionsDispatch() {
//   var context = React.useContext(QuestionsDispatchContext);
//   if (context === undefined) {
//     throw new Error("useQuestionsDispatch must be used within a QuestionsProvider");
//   }
//   return context;
// }


export { QuestionsProvider, QuestionsContext, useQuestionsState };
