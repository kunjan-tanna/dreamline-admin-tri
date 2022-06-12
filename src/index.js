import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { ThemeProvider } from "@material-ui/styles";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { LayoutProvider } from "./context/LayoutContext";
import { UserAuthProvider } from "./context/UserAuthContext";
import {
  ThemeProvider as ThemeChangeProvider,
  ThemeStateContext
} from "./context/ThemeContext";
import { CssBaseline } from "@material-ui/core";
import config from "../src/config";

ReactDOM.render(
  <LayoutProvider>
    <UserAuthProvider>
      <ThemeChangeProvider>
        <ThemeStateContext.Consumer>
          {theme => (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          )}
        </ThemeStateContext.Consumer>
      </ThemeChangeProvider>
    </UserAuthProvider>
  </LayoutProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
