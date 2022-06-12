import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const UsersContext = React.createContext();
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

const UsersProvider = ({ children }) => {

  const [users, setUsers] = React.useReducer(rootReducer, {
    isLoaded: false,
    users: []
  });
  const [profile, setUserProfile] = React.useReducer(rootReducer, {
    isLoaded: false,
    profile: []
  });
  return (
    <UsersContext.Provider value={{ users, setUsers, profile, setUserProfile }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </UsersContext.Provider>
  );
};

const useUsersState = () => {
  const context = React.useContext(UsersContext);
  return context;
};

export async function getUsersRequest(dispatch,reqObj) {
  let res = await apiCall('POST', '', '/admin/users/user-list',{},{},{search:'',page:1,limit:10000,sortby:1,sortorder:"asc"}) // {search:'',page:1,limit:50,sortby:1,sortorder:"asc"}
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

export async function getUserProfile(dispatch, reqData) {
  console.log(reqData)
  dispatch({ type: "GET_USER_PROFILE", payload: {} });
  let res = await apiCall('POST', '', '/admin/users/user-details', reqData, {}, {})
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_USER_PROFILE", payload: res.data });
    }
  }
}


export { UsersProvider, UsersContext, useUsersState };
