import React from "react";
import { apiCall, displayLog } from "../common/common";

const SubscriptionsContext = React.createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case "GET_SUBSCRIPTION_PLANS":
      return {
        isLoaded: true,
        plans: action.payload,
      };
    case "EDIT_SUBSCRIPTION_PLAN_PRICE":
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

const SubscriptionsProvider = ({ children }) => {

  const [plans, setSubscriptionPlans] = React.useReducer(rootReducer, {
    isLoaded: false,
    plans: []
  });
  return (
    <SubscriptionsContext.Provider value={{ plans, setSubscriptionPlans }}>
      {/* <QuestionsDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </QuestionsDispatchContext.Provider> */}
    </SubscriptionsContext.Provider>
  );
};

const useSubscriptionsState = () => {
  const context = React.useContext(SubscriptionsContext);
  return context;
};

export async function getSubscriptionPlansRequest(dispatch) {
  let res = await apiCall('GET', '', '/admin/plans')
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      // displayLog(1, res.data.message)
      dispatch({ type: "GET_SUBSCRIPTION_PLANS", payload: res.data });
    }
  }
}
export async function editSubscriptionPlanPriceRequest(dispatch, reqData) {
  let res = await apiCall('PUT', '', '/admin/planPrice', reqData)
  if (res.data) {
    if (res.data.code === 0) {
      displayLog(0, res.data.message)
    } else {
      displayLog(1, res.data.message)
      dispatch({ type: "EDIT_SUBSCRIPTION_PLAN_PRICE" });
    }
  }
}


export { SubscriptionsProvider, SubscriptionsContext, useSubscriptionsState };
