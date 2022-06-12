import React from "react";
import { apiCall, displayLog } from "../common/common";

const ReportsContext = React.createContext();
// var QuestionsDispatchContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_REPORTS_OF_REGISTERED_USERS":
      return {
        isLoaded: true,
        reports: action.payload,
      };

    default:
      return {
        ...state
      };
  }
};

const ReportsProvider = ({ children }) => {

  const [reports, setReportsOfRegisteredUsers] = React.useReducer(rootReducer, {
    isLoaded: false,
    reports: []
  });
  return (
    <ReportsContext.Provider value={{ reports, setReportsOfRegisteredUsers }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </ReportsContext.Provider>
  );
};

const useReportsState = () => {
  const context = React.useContext(ReportsContext);
  return context;
};

export async function getReportsOfRegisteredUsersRequest(dispatch, reqData) {
  let res = await apiCall('GET', '', '/admin/reportedRegisteredUsers', {}, {}, reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_REPORTS_OF_REGISTERED_USERS", payload: res.data });
    }
  }
}

export { ReportsProvider, ReportsContext, useReportsState };
