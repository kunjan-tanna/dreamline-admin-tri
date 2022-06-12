import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

//config
import config from "../config";

import { apiCall, displayLog } from "../common/common";

var UserAuthStateContext = React.createContext();
var UserAuthDispatchContext = React.createContext();

function userAuthReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        ...action.payload,
      };
    case "RESET_PASSWORD_SUCCESS":
      return { ...state };
    case "SIGN_OUT_SUCCESS":
      return { ...state };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserAuthProvider({ children }) {
  var [state, dispatch] = React.useReducer(userAuthReducer, {
    isAuthenticated: () => {
      const authorization = localStorage.getItem("authorization");
      if (config.isBackend && authorization) {
        const date = new Date().getTime() / 1000;
        const data = jwt.decode(authorization);
        return date < data.exp;
      } else if (authorization) {
        return true;
      }
      return false;
    },
  });

  return (
    <UserAuthStateContext.Provider value={state}>
      <UserAuthDispatchContext.Provider value={dispatch}>
        {children}
      </UserAuthDispatchContext.Provider>
    </UserAuthStateContext.Provider>
  );
}

function useUserAuthState() {
  var context = React.useContext(UserAuthStateContext);
  if (context === undefined) {
    throw new Error("useUserAuthState must be used within a UserAuthProvider");
  }
  return context;
}

function useUserAuthDispatch() {
  var context = React.useContext(UserAuthDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useUserAuthDispatch must be used within a UserAuthProvider"
    );
  }
  return context;
}

export {
  UserAuthProvider,
  useUserAuthState,
  useUserAuthDispatch,
  loginUser,
  signOut,
  forgotPassword,
  resetPassword,
  resetPasswordForAppUser,
};

// ###########################################################

async function loginUser(dispatch, reqData, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log(reqData);
  let res = await apiCall("POST", "", "/admin/login", reqData, {
    // 'language': config.language,
    // 'auth_token': config.defaultAuthToken,
    // 'Content-Type': config.contentType
  });
  if (res.data) {
    if (res.data.status === false) {
      displayLog(0, res.data.message);
    } else {
      console.log(res.data.data.access_token);
      await localStorage.setItem("authorization", res.data.data.access_token);
      displayLog(1, res.data.message);
      if (localStorage.getItem("authorization")) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data.data,
        });
        history.push(process.env.PUBLIC_URL + "/app/dashboard");
      }
    }
  }
}
async function forgotPassword(
  dispatch,
  reqData,
  history,
  setIsLoading,
  setError
) {
  setError(false);
  setIsLoading(true);
  let res = await apiCall(
    "POST",
    "",
    "/admin/forgot-password",
    reqData,
    {},
    {},
    {}
  );
  if (res.data) {
    console.log(res.data);
    if (res.data.status === false) {
      displayLog(0, res.data.message);
    } else {
      await localStorage.setItem("authorization", res.data.data.access_token);
      displayLog(1, res.data.message);
      history.push(process.env.PUBLIC_URL + "/reset-password");
    }
  }
}
async function resetPassword(
  dispatch,
  reqData,
  history,
  setIsLoading,
  setError
) {
  setError(false);
  setIsLoading(true);
  let auth = localStorage.getItem("authorization");
  let res = await apiCall("POST", "", "/admin/reset-password", reqData, {
    // 'language': config.language,
    auth: auth,
    // 'Content-Type': config.contentType
  });
  if (res.data) {
    if (res.data.status == false) {
      displayLog(0, res.data.message);
    } else {
      displayLog(1, res.data.message);
      dispatch({
        type: "RESET_PASSWORD_SUCCESS",
      });
      signOut(dispatch, history);
    }
  }
}
async function resetPasswordForAppUser(
  dispatch,
  reqData,
  history,
  setIsLoading,
  setError
) {
  setError(false);
  setIsLoading(true);
  let res = await apiCall("POST", "", "/resetPassword", reqData, {
    language: config.language,
    auth_token: config.defaultAuthToken,
    "Content-Type": config.contentType,
  });
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message);
    } else {
      displayLog(1, res.data.message);
      dispatch({
        type: "RESET_PASSWORD_SUCCESS",
      });
      // signOut(dispatch, history)
    }
  }
}
function signOut(dispatch, history) {
  localStorage.removeItem("authorization");
  document.cookie = "authorization=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push(process.env.PUBLIC_URL + "/login");
}

export function receiveToken(authorization, dispatch) {
  let user = jwt.decode(authorization);
  localStorage.setItem("authorization", authorization);
  localStorage.setItem("theme", "default");
  dispatch({ type: "LOGIN_SUCCESS", payload: user });
}

export function doInit() {
  return async (dispatch) => {
    let currentUser = null;
    try {
      let authorization = localStorage.getItem("authorization");
      if (authorization) {
      }
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          currentUser,
        },
      });
    } catch (error) {
      console.log(error);

      dispatch({
        type: "AUTH_INIT_ERROR",
        payload: error,
      });
    }
  };
}
