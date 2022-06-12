import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

//components
import { Button, Typography } from "../../components/Wrappers";

// logo
import logo from "./logo.svg";
import { useUserAuthState } from "../../context/UserAuthContext";

export default function Error() {
  var classes = useStyles();
  var { isAuthenticated } = useUserAuthState();
  const isAuth = isAuthenticated()
  return (
    isAuth ?
      <Redirect to={process.env.PUBLIC_URL + '/'} />
      :
      <Redirect to={process.env.PUBLIC_URL + '/login'} />
  );
}
