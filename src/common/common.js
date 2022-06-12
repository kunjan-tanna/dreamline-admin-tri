import alertify from "alertifyjs";
import "../../node_modules/alertifyjs/build/css/themes/default.min.css";
import "../../node_modules/alertifyjs/build/css/alertify.min.css";
import config from "../config";
// import * as crypto from 'crypto-js';
import axios from "axios";
import history from "./history";
// import store from './store';
// import Messages from './messages';
// const pointsVal = [1000000, 2000000, 3000000, 4000000]

var pendingRequests = [];
export const validate = (error) => {
  let msg = "";
  if (error.details[0].type.includes("empty")) {
    msg = error.details[0].context.key.replace(/_/g, " ") + " is required!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("min")) {
    msg =
      error.details[0].context.key.replace(/_/g, " ") +
      " length must be at least " +
      error.details[0].context.limit +
      " characters long!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("max")) {
    msg =
      error.details[0].context.key.replace(/_/g, " ") +
      " length must be less than or equal to " +
      error.details[0].context.limit +
      " characters long!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("allowOnly")) {
    msg = "Password and confirm password must be same!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else {
    msg =
      "Please enter a valid " +
      error.details[0].context.key.replace(/_/g, " ") +
      "!";
  }
  let result = { error: msg, errorField: error.details[0].context.key };
  return result;
};

export const displayLog = (code, message) => {
  alertify.dismissAll();
  alertify.set("notifier", "position", "top-right");
  // alertify.set('notifier','delay', 10);
  if (code == "1") {
    alertify.success(message);
  } else if (code == "0") {
    alertify.error(message);
  } else if (code == "2") {
    alertify.warning(message);
  } else {
    alertify.log(message);
  }
};

export const encrypt = (message) => {
  // encrypt message
  let cipherText = crypto.AES.encrypt(message, config.key).toString();
  return cipherText;
};
export const decrypt = (cipherText) => {
  // decrypt cipherText
  let message = crypto.AES.decrypt(cipherText, config.key).toString(
    crypto.enc.Utf8
  );
  return message;
};
export const logout = () => {
  localStorage.clear();
  history.push(process.env.PUBLIC_URL + "/login");
};

export const apiCall = (method, actionType, url, reqData, headers, params) => {
  // decrypt cipherText
  // axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
  // console.log(axios.defaults.headers.common["Content-Type"])
  var tokenExist;

  return axios({
    method: method,
    url: config.apiBaseURL + url,
    data: reqData,
    headers: headers,
    params: params,
  })
    .then((response) => {
      return response;
    })

    .catch((error) => {
      console.log("hhh", error.response.data);
      if (error.response.data.code == 401) {
        alertify.dismissAll();
        alertify.error("Session Expired, Please Login Again");
        // displayLog(
        //   error.response.data.code,
        //   "Session Expired, Please Login Again"
        // );
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // return alertify
        //   .alert()
        //   .setting({
        //     label: "OK",
        //     message: "Session expired, please login again!",
        //     closable: false,
        //     movable: false,
        //     onok: function() {
        //       logout();
        //       history.push(process.env.PUBLIC_URL + "/login");
        //     },
        //   })
        //   .setHeader("<em>  </em> ")
        //   .show();
      }
      if (
        typeof error != "undefined" &&
        typeof error.response != "undefined" &&
        error.response.data.code === 401
      ) {
        if (
          localStorage.getItem("refresh_token") &&
          localStorage.getItem("authorization")
        ) {
          tokenExist = false;
          var tokenData = {};
          tokenData.refresh_token = localStorage.getItem("refresh_token");
          var tokenHeader = {};
          tokenHeader.authorization = localStorage.getItem("authorization");
          tokenHeader.language = config.language;
          // console.log("rushabh",headers)
          if (!tokenExist) {
            pendingRequests.push({
              method: method,
              actionType: actionType,
              url: config.apiBaseURL + url,
              data: reqData,
              headers: headers,
              params: params,
            });
          }
          return axios({
            method: "POST",
            url: config.apiBaseURL + "refresh-token",
            data: tokenData,
            headers: tokenHeader,
          })
            .then((response) => {
              if (response.data.code == 1) {
                localStorage.setItem(
                  "authorization",
                  response.data.data.auth_token
                );
                localStorage.setItem(
                  "refresh_token",
                  response.data.data.refresh_token
                );
                tokenExist = true;
                if (
                  response.data.data.auth_token ==
                  localStorage.getItem("authorization")
                ) {
                  if (pendingRequests.length > 0) {
                    setTimeout(() => {
                      callPendingRequests(pendingRequests);
                    }, 1000);
                  }
                }
              } else if (response.data.code == 401) {
                alertify.dismissAll();
                return alertify
                  .alert()
                  .setting({
                    label: "OK",
                    message: "Session expired, please login again!",
                    closable: false,
                    movable: false,
                    onok: function() {
                      logout();
                      history.push(process.env.PUBLIC_URL + "/login");
                    },
                  })
                  .setHeader("<em>  </em> ")
                  .show();
              }
            })
            .catch((error) => {
              console.log("refreshToken error:::", error);
            });
        }
      } else if (error.response.data.status == false) {
        return error.response;
      } else {
        alertify.dismissAll();
        return alertify
          .alert()
          .setting({
            label: "OK",
            message: "The network connection is lost!",
            closable: false,
            movable: false,
            onok: function() {
              history.push(process.env.PUBLIC_URL + "/app");
            },
          })
          .setHeader("<em> </em> ")
          .show();
      }
    });
};

export const callPendingRequests = (allPendingRequests) => {
  let reqCnt;
  for (reqCnt = 0; reqCnt < allPendingRequests.length; reqCnt++) {
    // let actionType = allPendingRequests[reqCnt].actionType;
    allPendingRequests[reqCnt].headers["language"] = config.language;
    // allPendingRequests[reqCnt].headers['authorization'] = decrypt(localStorage.getItem('authorization'));
    // delete allPendingRequests[reqCnt].actionType;

    axios(allPendingRequests[reqCnt])
      .then((response) => {
        console.log("Response0-in pending request------", response);
        // store.dispatch({
        //     type: actionType,
        //     res: response
        // })
      })
      .catch((error) => {
        console.log("ERROR in pending request:::", error);
      });
  }
  pendingRequests = [];
};
export const confirmBox = (title, message) => {
  return new Promise((resolve, reject) => {
    alertify.confirm(
      title,
      message,
      () => {
        resolve(1);
      },
      () => {
        resolve(0);
      }
    );
  });
};
