import React from "react";
import axios from "axios";

import config from "../config";
import { apiCall, displayLog } from "../common/common";

const OrderContext = React.createContext();
// var QuestionsDispatchContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_USERS":
      return {
        isLoaded: true,
        users: action.payload,
      };
      case "GET_ORDER_LIST":
        return {
          isLoaded: true,
          orders: action.payload,
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

const OrderProvider = ({ children }) => {

  const [users, setUsers] = React.useReducer(rootReducer, {
    isLoaded: false,
    users: []
  });
  const [profile, setUserProfile] = React.useReducer(rootReducer, {
    isLoaded: false,
    profile: []
  });
  const [orders, setOrderList] = React.useReducer(rootReducer, {
    isLoaded: false,
    orders: []
  });
  return (
    <OrderContext.Provider value={{ users, setUsers, profile, setUserProfile, orders, setOrderList }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </OrderContext.Provider>
  );
};

const useOrderState = () => {
  const context = React.useContext(OrderContext);
  return context;
};

export async function getOrderRequest(dispatch) {
  let res = await apiCall('POST', '', '/admin/order/list-order',{'type':1},{},{search:'',page:1,limit:10000,sortby:1,sortorder:"asc"})
  if (res.data) {
    // console.log(res.data)
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_USERS", payload: res.data });
    }
  }
}

export async function getOrderListRequest(dispatch) {
  let res = await apiCall('POST', '', '/admin/order/list-order',{'type':1},{},{search:'',page:1,limit:100,sortby:1,sortorder:"desc"})
  if (res.data) {
    // console.log("100",res.data)
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_ORDER_LIST", payload: res.data });
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


export { OrderProvider, OrderContext, useOrderState };
