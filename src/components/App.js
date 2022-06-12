import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

// components
import Layout from "./Layout";
import Documentation from "./Documentation/Documentation";

// pages
import Error from "../pages/error";
import Login from "../pages/login";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/resetPassword";
import PrivacyPolicy from "../pages/privacyPolicy";
import TermsAndConditions from "../pages/termsAndConditions";
import config from "../config";

// context
import { useUserAuthState } from "../context/UserAuthContext";

//Global css
import "../static/css/global.css";

export default function App() {
  // global

  axios.defaults.baseURL = config.apiBaseURL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  // axios.defaults.headers.common["language"] = config.language;
  const authorization = localStorage.getItem("authorization");
  // console.log("authorization",authorization)
  if (authorization) {
    axios.defaults.headers.common["auth"] = authorization;
  }

  var { isAuthenticated } = useUserAuthState();
  const isAuth = isAuthenticated();
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={process.env.PUBLIC_URL + "/verification/:token"}
          exact
          component={ResetPassword}
        />
        <Route
          path={process.env.PUBLIC_URL + "/reset-password"}
          exact
          component={ResetPassword}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + "/"}
          render={() => (
            <Redirect to={process.env.PUBLIC_URL + "/app/dashboard"} />
          )}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + "/app"}
          render={() => (
            <Redirect to={process.env.PUBLIC_URL + "/app/dashboard"} />
          )}
        />
        <PrivateRoute
          path={process.env.PUBLIC_URL + "/app"}
          component={Layout}
        />
        <PublicRoute
          path={process.env.PUBLIC_URL + "/login"}
          exact
          component={Login}
        />
        <PublicRoute
          path={process.env.PUBLIC_URL + "/forgot-password"}
          exact
          component={ForgotPassword}
        />
        <Route
          path={process.env.PUBLIC_URL + "/privacy"}
          exact
          component={PrivacyPolicy}
        />
        <Route
          path={process.env.PUBLIC_URL + "/terms"}
          exact
          component={TermsAndConditions}
        />
        <Route path={process.env.PUBLIC_URL + "/app/exportPDF"} exact></Route>
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuth ? (
            React.createElement(component, props)
          ) : (
            <Redirect to={process.env.PUBLIC_URL + "/login"} />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuth ? (
            <Redirect
              to={{
                pathname: process.env.PUBLIC_URL + "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
