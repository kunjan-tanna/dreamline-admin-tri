import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const EducationsContext = React.createContext();
// var QuestionsDispatchContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_EDUCATIONS":
      return {
        isLoaded: true,
        educations: action.payload,
      };
    case "GET_PRODUCT_LIST":
      return {
        isLoaded: true,
        products: action.payload,
      };
    case "GET_PRODUCT_SIZE":
      return {
        isLoaded: true,
        productsSize: action.payload,
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

const EducationsProvider = ({ children }) => {

  const [educations, setEducations] = React.useReducer(rootReducer, {
    isLoaded: false,
    educations: []
  });
  const [products, setProductList] = React.useReducer(rootReducer, {
    isLoaded: false,
    products: []
  });
  const [productsSize, setproductsSize] = React.useReducer(rootReducer, {
    isLoaded: false,
    productsSize: []
  });
  return (
    <EducationsContext.Provider value={{ educations, setEducations, products, setProductList, productsSize, setproductsSize }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </EducationsContext.Provider>
  );
};

const useEducationsState = () => {
  const context = React.useContext(EducationsContext);
  return context;
};

export async function getEducationsRequest(dispatch) {
  
  let res = await apiCall('POST', '', '/admin/accessories/accessories-list', {}, {}, { page:1,limit:10000,sortby:1,sortorder:"asc" }) 
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

export async function getProductListRequest(dispatch) {
  let res = await apiCall('GET', '', '/admin/product/get-all-product')
  // console.log("rushabh",res.data)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_PRODUCT_LIST", payload: res.data });
    }
  }
}

export async function getProductSizeRequest(dispatch,reqData) {
  let res = await apiCall('POST', '', '/admin/product/product-by-id',reqData)
  // console.log(reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_PRODUCT_SIZE", payload: res.data });
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

export async function deleteEducation(dispatch, reqData) {
  let res = await apiCall('GET', '', '/admin/accessories/delete-accessories/'+reqData.id, {}, {}, {})
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "DELETE_EDUCATION_STATUS" });
    }
  }
}

export async function updateEducation(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/accessories/update-accessories', reqData)
  if (res.data) {
    if (res.data.status == 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_EDUCATION" });
    }
  }
}

export async function createEducation(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/accessories/add-accessories', reqData)
  if (res.data) {
    if (res.data.status == 0) {
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


export { EducationsProvider, EducationsContext, useEducationsState };
