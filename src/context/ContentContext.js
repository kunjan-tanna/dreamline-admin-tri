import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const ContentContext = React.createContext();
// var QuestionsDispatchContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_EDUCATIONS":
      return {
        isLoaded: true,
        educations: action.payload,
      };
    case "EDIT_EDUCATION_STATUS":
      return {
        ...state,
        isLoaded: true
      };
    case "DELETE_EDUCATION_STATUS":
      return {
        ...state,
        isLoaded: true
      };
    case "EDIT_EDUCATION":
      return {
        ...state,
        isLoaded: true
      };
    case "CREATE_EDUCATION":
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

const ContentProvider = ({ children }) => {

  const [educations, setEducations] = React.useReducer(rootReducer, {
    isLoaded: false,
    educations: []
  });
  
  return (
    <ContentContext.Provider value={{ educations, setEducations }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </ContentContext.Provider>
  );
};

const useContentState = () => {
  const context = React.useContext(ContentContext);
  return context;
};

export async function getContentRequest(dispatch) {
  
  let res = await apiCall('POST', '', '/admin/content/content-list', {}, {}, { search:"",sortby:1,sortorder:"asc" })
  if (res.data) {
    // console.log("check API",res.data)
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_EDUCATIONS", payload: res.data });
    }
  }
}

export async function updateFaqStatus(dispatch, reqData) {
  console.log(reqData)
  let res = await apiCall('POST', '', '/admin/faq/change-status', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_EDUCATION_STATUS" });
    }
  }
}

export async function deleteFaq(dispatch, reqData) {
  let res = await apiCall('GET', '', '/admin/faq/delete-faq/'+reqData.id, {}, {}, {})
  if (res.data) {
    console.log(res.data)
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "DELETE_EDUCATION_STATUS" });
    }
  }
}

export async function updateContent(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/content/update-content', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_EDUCATION" });
    }
  }
}

export async function createFaq(dispatch, reqData) {

  let res = await apiCall('POST', '', '/admin/faq/add-faq', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "CREATE_EDUCATION" });
    }
  }
}

// function useQuestionsDispatch() {
//   var context = React.useContext(QuestionsDispatchContext);
//   if (context === undefined) {
//     throw new Error("useQuestionsDispatch must be used within a EducationsProvider");
//   }
//   return context;
// }


export { ContentProvider, ContentContext, useContentState };
