import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  TextField as Input
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import joi from 'joi-browser';

// styles
import useStyles from "./styles";

// logo
import logo from "../../static/images/iCon-1024-A.png";

// context
import { useUserAuthDispatch, loginUser, receiveToken } from "../../context/UserAuthContext";

//components
import { Button } from "../../components/Wrappers";
import ErrorMessage from "../../components/ErrorMessage";
import { validate } from "../../common/common";
import config from "../../config";

// A polyfill for non supported browsers for joi-browser validations.
// This can overcome the problem of NORMALIZE STRING PROTOTYPE.
// This will add normalize to the String prototype.
// Usecase: Email validation not working in ipad without this pollyfill.
require('unorm');

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserAuthDispatch();

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const authorization = params.get("authorization");
    if (authorization) {
      receiveToken(authorization, userDispatch);
    }
  }, []); // eslint-disable-line

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [errorField, setErrorField] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  const loginHandler = () => {
    let reqData = {
      email: email,
      password: password
    }
    validateFormData(reqData);
  }
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      email: joi.string().trim().email({ minDomainAtoms: 2 }).regex(config.emailRegex).required(),
      password: joi.string().trim().min(8).required(),
    })
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        if (err.details[0].message !== error || error.details[0].context.key !== errorField) {
          let errorLog = validate(err)
          setError(errorLog.error)
          setErrorField(errorLog.errorField)
          // this.setState({ err: errorLog.err, errorField: errorLog.errorField });
        }
      }
      else {
        setError('')
        setErrorField('')
        setIsLoading(true)
        await loginUser(
          userDispatch,
          body,
          props.history,
          setIsLoading,
          setError
        )
        setIsLoading(false)

        // this.props.registrationReq(this.state.formValues, headers);
      }
    })
  }
  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      loginHandler()
    }
  }
  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Dreamline</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>

          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Input
                label='Email'
                placeholder={"Email"}
                margin="normal"
                variant="outlined"
                onChange={e => setEmail(e.target.value)}
                onKeyPress={(e) => enterPressed(e)}
                type="email"
                InputProps={{
                  classes: {
                    underline: classes.InputUnderline,
                    input: classes.Input
                  }
                }}
                value={email}
                fullWidth
              />
              {errorField === 'email' && <ErrorMessage error={error} />}
              <Input
                label='Password'
                placeholder={"Password"}
                margin="normal"
                variant="outlined"
                onChange={e => setPassword(e.target.value)}
                onKeyPress={(e) => enterPressed(e)}
                type="password"
                InputProps={{
                  classes: {
                    underline: classes.InputUnderline,
                    input: classes.Input
                  }
                }}
                value={password}
                fullWidth
              />
              {errorField === 'password' && <ErrorMessage error={error} />}

              {/* <Input
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.InputUnderline,
                    input: classes.Input
                  }
                }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              /> */}
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                    <Button
                      disabled={isLoading}
                      onClick={loginHandler}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Login
                    </Button>
                  )}
               <Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                  onClick={() => props.history.push(process.env.PUBLIC_URL + '/forgot-password')}
                >
                  Forgot Password?
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
