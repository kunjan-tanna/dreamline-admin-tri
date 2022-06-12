import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  TextField as Input
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import joi from 'joi-browser';

// styles
import useStyles from "./styles";

// logo
import logo from "../../static/images/iCon-1024-A.png";

// context
import { useUserAuthDispatch, forgotPassword, receiveToken } from "../../context/UserAuthContext";

//components
import { Button } from "../../components/Wrappers/Wrappers";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { validate } from "../../common/common";
import config from "../../config";

// A polyfill for non supported browsers for joi-browser validations.
// This can overcome the problem of NORMALIZE STRING PROTOTYPE.
// This will add normalize to the String prototype.
// Usecase: Email validation not working in ipad without this pollyfill.
require('unorm');

function ForgotPassword(props) {
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
  const forgotPasswordHandler = () => {
    let reqData = {
      email: email,
    }
    validateFormData(reqData);
  }
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      email: joi.string().trim().email({ minDomainAtoms: 2 }).regex(config.emailRegex).required(),
    })
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        if (err.details[0].message !== error || error.details[0].context.key !== errorField) {
          let errorLog = validate(err)
          setError(errorLog.error)
          setErrorField(errorLog.errorField)
        }
      }
      else {
        setError('')
        setErrorField('')
        setIsLoading(true)
        await forgotPassword(
          userDispatch,
          body,
          props.history,
          setIsLoading,
          setError
        )
        setEmail('')
        setIsLoading(false)
      }
    })
  }
  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      forgotPasswordHandler()
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
            <Tab label="Forgot Password" classes={{ root: classes.tab }} />
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
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.buttonLoader} />
                ) : (
                    <Button
                      style={{ width: '100%' }}
                      disabled={isLoading}
                      onClick={forgotPasswordHandler}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Forgot
                    </Button>
                  )}
              </div>
              <Button
                color="primary"
                size="large"
                className={classes.redirectToLoginLink}
                onClick={() => props.history.push(process.env.PUBLIC_URL + '/login')}
              >
                {/* <Link className={classes.subLinks} to={process.env.PUBLIC_URL + '/login'}>Already have an account?</Link> */}
                <Link className={classes.subLinks} to={process.env.PUBLIC_URL + '/login'}>Already have an account? Login</Link>
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    </Grid>
  ); 
}

export default withRouter(ForgotPassword);
