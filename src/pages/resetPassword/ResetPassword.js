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
import VerificationGraphic from "../../static/images/Verification-graphics.png";

// context
import { useUserAuthDispatch, resetPassword, resetPasswordForAppUser } from "../../context/UserAuthContext";

//components
import { Button } from "../../components/Wrappers/Wrappers";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { logout, validate } from "../../common/common";
import jwt from "jsonwebtoken";
import config from "../../config";
// import { decodeToken } from "../../../../api/utils/codeHelper";

// A polyfill for non supported browsers for joi-browser validations.
// This can overcome the problem of NORMALIZE STRING PROTOTYPE.
// This will add normalize to the String prototype.
// Usecase: Email validation not working in ipad without this pollyfill.
require('unorm');

function ResetPassword(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserAuthDispatch();

  useEffect(() => {
    // localStorage.clear();
    // if (props.match.params.token) {
      // let tokenData = jwt.decode(props.match.params.token)
      // props.history.push({
      //   pathname: process.env.PUBLIC_URL + '/reset-password',
      //   state: { tokenData: tokenData }
      // })
    // }
    // else if (props.location.state.tokenData) {
    //   console.log('props.location.state.tokenData-----', props.location.state.tokenData)
    // } 
    // else {
    //   console.log('Something goes wrong.')
    //   props.history.push(process.env.PUBLIC_URL + '/login')
    // }
  }, []); // eslint-disable-line

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [errorField, setErrorField] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [new_password, setNewPassword] = useState("");
  var [confirm_password, setConfirmPassword] = useState("");
  var [otp, setOtp] = useState("");
  const resetPasswordHandler = () => {
    let reqData = {
      otp: otp,
      new_password: new_password,
      confirm_password: confirm_password,
    }
    validateFormData(reqData);
  }
  const validateFormData = (body) => {
    let schema;
    // if (props.location.state.tokenData.is_admin === 1) {
      schema = joi.object().keys({
        otp: joi.string().trim().required(),
        new_password: joi.string().trim().min(8).required(),
        confirm_password: joi.string().trim().valid(joi.ref('new_password')).required(),
      })
    // } else {
    //   schema = joi.object().keys({
    //     otp: joi.string().trim().required(),
    //     new_password: joi.string().trim().regex(config.passwordRegex).max(18).required(),
    //     confirm_password: joi.string().trim().valid(joi.ref('new_password')).required(),
    //   })
    // }
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
        // if (props.location.state.tokenData.is_admin === 1) {
          await resetPassword(
            userDispatch,
            { otp: body.otp, password: body.new_password },
            props.history,
            setIsLoading,
            setError
          )
        // } else {
        //   await resetPasswordForAppUser(
        //     userDispatch,
        //     { email: props.location.state.tokenData.email, new_password: body.new_password },
        //     props.history,
        //     setIsLoading,
        //     setError
        //   )
        //   setNewPassword('')
        //   setConfirmPassword('')
        // }
        setIsLoading(false)
      }
    })
  }
  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      resetPasswordHandler()
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
            <Tab label="Reset Password" classes={{ root: classes.tab }} />
          </Tabs>
          {props.location.state && props.location.state.tokenData && props.location.state.tokenData.is_admin === 0 &&
            <p style={{ textAlign: 'center', fontSize: '13px' }}>Password with one capital alphabet, one small alphabet, and one digit and one special character.
          <br />Min 6 and Max 18 characters only</p>
          }
          <img src={VerificationGraphic} width="100%" style={{ margin: '16px 0px' }} />
          {props.match.params.token ?
            <div className={classes.verifyEmailLoaderContainer}>
              <CircularProgress size={26} />
            </div>
            :
            activeTabId === 0 && (
              <React.Fragment>
                <Input
                  label='Otp'
                  placeholder={"Otp"}
                  margin="normal"
                  variant="outlined"
                  onChange={e => setOtp(e.target.value)}
                  onKeyPress={(e) => enterPressed(e)}
                  type="text"
                  InputProps={{
                    classes: {
                      underline: classes.InputUnderline,
                      input: classes.Input
                    }
                  }}
                  value={otp}
                  fullWidth
                />
                {errorField === 'otp' && <ErrorMessage error={error} />}
                <Input
                  label='Password'
                  placeholder={"Password"}
                  margin="normal"
                  variant="outlined"
                  onChange={e => setNewPassword(e.target.value)}
                  onKeyPress={(e) => enterPressed(e)}
                  type="password"
                  InputProps={{
                    classes: {
                      underline: classes.InputUnderline,
                      input: classes.Input
                    }
                  }}
                  value={new_password}
                  fullWidth
                />
                {errorField === 'new_password' && <ErrorMessage error={error} />}
                <Input
                  label='Confirm Password'
                  placeholder={"Confirm Password"}
                  margin="normal"
                  variant="outlined"
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => enterPressed(e)}
                  type="password"
                  InputProps={{
                    classes: {
                      underline: classes.InputUnderline,
                      input: classes.Input
                    }
                  }}
                  value={confirm_password}
                  fullWidth
                />
                {errorField === 'confirm_password' && <ErrorMessage error={error} />}
                <div className={classes.formButtons}>
                  {isLoading ? (
                    <CircularProgress size={26} className={classes.buttonLoader} />
                  ) : (
                      <Button
                        style={{ width: '100%' }}
                        disabled={isLoading}
                        onClick={resetPasswordHandler}
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Reset Password
                      </Button>
                    )}
                </div>
                {props.location.state && props.location.state.tokenData && props.location.state.tokenData.is_admin === 1 &&
                  <Button
                    color="primary"
                    size="large"
                    className={classes.redirectToLoginLink}
                  >
                    {/* <Link className={classes.subLinks} to={process.env.PUBLIC_URL + '/login'}>Already have an account?</Link> */}
                    <Link className={classes.subLinks} to={process.env.PUBLIC_URL + '/login'}>Already have an account? Login</Link>
                  </Button>
                }
              </React.Fragment>
            )
          }

        </div>
      </div>
    </Grid>
  );
}

export default withRouter(ResetPassword);
