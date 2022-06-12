import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField as Input,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
} from "@material-ui/icons";
import classNames from "classnames";
import joi from 'joi-browser';

//images
import profile from "../../static/images/profile-icon.png";

// styles
import useStyles from "./styles";

// components
import { Typography, Avatar } from "../Wrappers/Wrappers";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar
} from "../../context/LayoutContext";
import { useUserAuthDispatch, signOut } from "../../context/UserAuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { apiCall, displayLog, validate } from "../../common/common";

import alertify from 'alertifyjs';
import 'alertifyjs/build/css/themes/default.min.css';
import 'alertifyjs/build/css/alertify.min.css';

export default function Header(props) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserAuthDispatch();

  // local
  var [profileMenu, setProfileMenu] = useState(null);
  const [isSmall, setSmall] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [formValues, setFormValues] = useState({});

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;
    setSmall(isSmallScreen);
  }
  const logoutHandler = (e, userDispatch, history) => {
    e.preventDefault();
    alertify.confirm("Are you sure you want to logout?", (status) => {
      if (status) {
        signOut(userDispatch, history)
      }
    }).setHeader('<em>Dreamline</em> ').set('labels', { ok: 'OK', cancel: 'CANCEL' });
  }

  const closeModal = () => {
    setError('')
    setErrorField('')
    setFormValues({})
    setProfileMenu(null)
    setToggleInputModal(false)
  }
  const submitChangePasswordHandler = () => {
    let reqData = {
      current_password: formValues.current_password,
      new_password: formValues.new_password,
      confirm_password: formValues.confirm_password,
    }
    validateFormData(reqData);
  }
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      current_password: joi.string().trim().min(8).required(),
      new_password: joi.string().trim().min(8).required(),
      confirm_password: joi.string().trim().valid(joi.ref('new_password')).required(),
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
        setIsLoading(true)
        let reqData = {
          old_password: formValues.current_password,
          password: formValues.new_password
        }
        let res = await apiCall('POST', '', '/admin/change-password', reqData)
        if (res.data) {
          if (res.data.status == false) {
            displayLog(0, res.data.message)
          } else {
            displayLog(1, res.data.message)
          }
        }
        closeModal()
        setIsLoading(false)
      }
    })
  }


  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse
          )}
        >
          {(!layoutState.isSidebarOpened && isSmall) ||
            (layoutState.isSidebarOpened && !isSmall) ? (
              <ArrowBackIcon
                classes={{
                  root: classNames(classes.headerIcon, classes.headerIconCollapse)
                }}
              />
            ) : (
              <MenuIcon
                classes={{
                  root: classNames(classes.headerIcon, classes.headerIconCollapse)
                }}
              />
            )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          Dreamline
        </Typography>
        <div className={classes.grow} />
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={e => setProfileMenu(e.currentTarget)}
        >
          <Avatar
            alt="Kulan Admin"
            src={profile}
            classes={{ root: classes.headerIcon }}
          />
        </IconButton>
        <Typography
          block
          variant="body2"
          style={{ display: "flex", alignItems: "center", marginLeft: 8 }}
        >
          Hi,&nbsp;
          <Typography variant="body2" weight={"bold"}>
            Admin
          </Typography>
        </Typography>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem
            )}
            onClick={() => setToggleInputModal(true)}
          >
            <LockIcon className={classes.profileMenuIcon} /> Change Password
          </MenuItem>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem
            )}
            onClick={(e) => logoutHandler(e, userDispatch, props.history)}
          >
            <ExitToAppIcon className={classes.profileMenuIcon} /> Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
      <Dialog
        open={toggleInputModal}
        onClose={closeModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
        <DialogContent>
          <Input
            label='Current Password'
            placeholder={"Current Password"}
            margin="normal"
            variant="outlined"
            onChange={e => setFormValues({ ...formValues, current_password: e.target.value.replace(/^\s+/, "") })}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input
              }
            }}
            type="password"
            value={formValues.current_password}
            fullWidth
          />
          {errorField === 'current_password' && <ErrorMessage error={error} />}

          <Input
            label='New Password'
            placeholder={"New Password"}
            margin="normal"
            variant="outlined"
            onChange={e => setFormValues({ ...formValues, new_password: e.target.value.replace(/^\s+/, "") })}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input
              }
            }}
            type="password"
            value={formValues.new_password}
            fullWidth
          />
          {errorField === 'new_password' && <ErrorMessage error={error} />}

          <Input
            label='Confirm Password'
            placeholder={"Confirm Password"}
            margin="normal"
            variant="outlined"
            onChange={e => setFormValues({ ...formValues, confirm_password: e.target.value.replace(/^\s+/, "") })}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input
              }
            }}
            type="password"
            value={formValues.confirm_password}
            fullWidth
          />
          {errorField === 'confirm_password' && <ErrorMessage error={error} />}
        </DialogContent>
        <DialogActions style={{ padding: "10px 24px 20px" }}>
          <Button
            variant={"outlined"}
            color="primary"
            onClick={closeModal}
            disabled={isLoading}
          >Cancel</Button>
          <Button
            variant={"contained"}
            color="primary"
            onClick={submitChangePasswordHandler}
            disabled={isLoading}
          >Submit</Button>
        </DialogActions>
      </Dialog>

    </AppBar>
  );
}
