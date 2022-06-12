import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const DraftContext = React.createContext();
// var QuestionsDispatchContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_USERS":
      return {
        isLoaded: true,
        users: action.payload,
      };
    case "EDIT_USER_STATUS":
      return {
        ...state,
        isLoaded: true
      };
    case "GET_USER_PROFILE":
      return {
        isLoaded: true,
        profile: action.payload,
      };
    default:
      return {
        ...state
      };
  }
};

const DraftProvider = ({ children }) => {

  const [users, setUsers] = React.useReducer(rootReducer, {
    isLoaded: false,
    users: []
  });
  const [profile, setUserProfile] = React.useReducer(rootReducer, {
    isLoaded: false,
    profile: []
  });
  return (
    <DraftContext.Provider value={{ users, setUsers, profile, setUserProfile }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </DraftContext.Provider>
  );
};

const useDraftState = () => {
  const context = React.useContext(DraftContext);
  return context;
};

export async function getOrderRequest(dispatch) {
  let res = await apiCall('POST', '', '/admin/order/list-order',{'type':0},{},{search:'',page:1,limit:10000,sortby:1,sortorder:"asc"})
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_USERS", payload: res.data });
    }
  }
}

export async function updateUserStatus(dispatch, reqData) {
  let res = await apiCall('POST', '', '/admin/users/change-status', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_USER_STATUS" });
    }
  }
}

export async function getOrderDetails(dispatch, reqData) {
  // console.log(reqData)
  dispatch({ type: "GET_USER_PROFILE", payload: {} });
  let res = await apiCall('POST', '', '/admin/order/order-details', reqData, {}, {})
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      // console.log(res.data)
      dispatch({ type: "GET_USER_PROFILE", payload: res.data });
    }
  }
}


export { DraftProvider, DraftContext, useDraftState };
