import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const ProfessionsContext = React.createContext();
// var QuestionsDispatchContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_PROFESSIONS":
      return {
        isLoaded: true,
        professions: action.payload,
      };
      case "GET_CATEGORY_LIST":
        return {
          isLoaded: true,
          categoryList: action.payload,
        };
    case "EDIT_PROFESSION_STATUS":
      return {
        ...state,
        isLoaded: true
      };
    case "DELETE_PROFESSION_STATUS":
      return {
        ...state,
        isLoaded: true
      };
    case "EDIT_PROFESSION":
      return {
        ...state,
        isLoaded: true
      };
    case "CREATE_PROFESSION":
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

const ProfessionsProvider = ({ children }) => {

  const [professions, setProfessions] = React.useReducer(rootReducer, {
    isLoaded: false,
    professions: []
  });
  const [categoryList, setCategoryList] = React.useReducer(rootReducer, {
    isLoaded: false,
    categoryList: []
  });
  return (
    <ProfessionsContext.Provider value={{ professions, setProfessions, categoryList, setCategoryList }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </ProfessionsContext.Provider>
  );
};

const useProfessionsState = () => {
  const context = React.useContext(ProfessionsContext);
  return context;
};

export async function getProfessionsRequest(dispatch, sortorder='asc') {
  // console.log("dispatch",dispatch)
  let res = await apiCall('POST', '', '/admin/product/product-list', {}, {}, { page:1,limit:10000,sortby:1,sortorder: sortorder } ) /* { page:1,limit:10000,sortby:1,sortorder:"asc" } */
  if (res.data) {
    // console.log(res.data)
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_PROFESSIONS", payload: res.data });
    }
  }
}

export async function getCategoryListRequest(dispatch) {
  let res = await apiCall('POST', '', '/admin/product/get-category')
  // console.log("rushabh",res.data)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_CATEGORY_LIST", payload: res.data });
    }
  }
}

export async function updateProfessionStatus(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/product/change-status', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_PROFESSION_STATUS" });
    }
  }
}

export async function deleteProfession(dispatch, reqData) {
  let res = await apiCall('GET', '', '/admin/product/delete-product/'+reqData.id, {}, {}, {})
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "DELETE_PROFESSION_STATUS" });
    }
  }
}

export async function updateProfession(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/product/update-product', reqData)
  if (res.data) {
    if (res.data.status == 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_PROFESSION" });
    }
  }
}

export async function createProfession(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/product/add-product', reqData)
  if (res.data) {
    if (res.data.status == 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "CREATE_PROFESSION" });
    }
  }
}

// function useQuestionsDispatch() {
//   var context = React.useContext(QuestionsDispatchContext);
//   if (context === undefined) {
//     throw new Error("useQuestionsDispatch must be used within a ProfessionsProvider");
//   }
//   return context;
// }


export { ProfessionsProvider, ProfessionsContext, useProfessionsState };
