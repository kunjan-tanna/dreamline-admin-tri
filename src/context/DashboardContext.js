import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const DashboardContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_RECENT_USERS":
      return {
        isLoaded: true,
        users: action.payload,
      };
      case "GET_TOTAL_USERS":
        return {
          isLoaded: true,
          totalUsers: action.payload,
        };

    default:
      return {
        ...state
      };
  }
};

const DashboardProvider = ({ children }) => {

  const [users, setRecentUsers] = React.useReducer(rootReducer, {
    isLoaded: false,
    users: []
  });
  const [totalUsers, setTotalUsers] = React.useReducer(rootReducer, {
    isLoaded: false,
    totalUsers: []
  });
  return (
    <DashboardContext.Provider value={{ users, setRecentUsers, totalUsers, setTotalUsers }} >
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </DashboardContext.Provider>
  );
};

const useDashboardState = () => {
  const context = React.useContext(DashboardContext);
  return context;
};

export async function getRecentlyRegisteredUsersRequest(dispatch) {
  let res = await apiCall('GET', '', '/admin/recentlyRegistered')
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_RECENT_USERS", payload: res.data });
    }
  }
}


export async function getTotalUsersOnPlatform(dispatch) {
  let res = await apiCall('POST', '', '/admin/dashboard')
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_TOTAL_USERS", payload: res.data });
    }
  }
}


export { DashboardProvider, DashboardContext, useDashboardState };
