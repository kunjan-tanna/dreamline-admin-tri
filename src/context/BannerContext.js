import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const BannerContext = React.createContext();
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
    case "UPLOAD_IMAGE":
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

const BannerProvider = ({ children }) => {

  const [educations, setEducations] = React.useReducer(rootReducer, {
    isLoaded: false,
    educations: []
  });
  
  return (
    <BannerContext.Provider value={{ educations, setEducations }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </BannerContext.Provider>
  );
};

const useBannerState = () => {
  const context = React.useContext(BannerContext);
  return context;
};

export async function getBannerRequest(dispatch) {
  
  let res = await apiCall('POST', '', '/admin/banner/list-banner', {}, {}, { search:"",page:1,limit:10000,sortby:1,sortorder:"asc" })
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

export async function updateEducationStatus(dispatch, reqData) {
  let res = await apiCall('PUT', '', '/admin/educationStatus', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_EDUCATION_STATUS" });
    }
  }
}

export async function deleteBanner(dispatch, reqData) {
  let res = await apiCall('GET', '', '/admin/banner/delete-benner/'+reqData.id, {}, {}, {})
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "DELETE_EDUCATION_STATUS" });
    }
  }
}

export async function updateBanner(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/banner/update-banner', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_EDUCATION" });
    }
  }
}

export async function uploadImage(dispatch, reqImg) {
  let res = await apiCall('POST', '', '/admin/banner/upload-image', reqImg,  {}) 
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "UPLOAD_IMAGE" });
    }
  }
}

export async function createBanner(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/banner/add-banner', reqData)
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


export { BannerProvider, BannerContext, useBannerState };
