import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import {
  Grid,
  Box,
  Switch,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
  TextField as Input,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";

// styles
import useStyles from "./styles";
import { Button } from "../../components/Wrappers/Wrappers";

// components
import Widget from "../../components/Widget/Widget";
import { Typography } from "../../components/Wrappers/Wrappers";
import { PeopleAlt as PeopleAltIcon } from "@material-ui/icons";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { lighten } from "@material-ui/core/styles";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import joi from "joi-browser";
import ErrorMessage from "../../components/ErrorMessage";

// import Input from "@material-ui/core/Input";

// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
//context
import {
  useDashboardState,
  getRecentlyRegisteredUsersRequest,
  getTotalUsersOnPlatform,
} from "../../context/DashboardContext";
import { apiCall, displayLog, confirmBox, validate } from "../../common/common";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { numeric: true, disablePadding: false, label: "#", sort: false },
  {
    id: "subType",
    numeric: true,
    disablePadding: false,
    label: "Sub Type",
    width: "200px",
    sort: true,
  },
  {
    id: "pattern",
    numeric: true,
    center: true,
    disablePadding: false,
    label: "Pattern",
    sort: false,
  },
  {
    id: "inital",
    numeric: true,
    disablePadding: false,
    label: "Inital",
    sort: true,
  },
  {
    id: "end_word",
    numeric: true,
    disablePadding: false,
    label: "End Word",
    sort: true,
  },
  {
    id: "text",
    numeric: true,
    disablePadding: false,
    label: "Text After product Name",
    sort: true,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            width={headCell.width}
            key={index}
            align={
              headCell.center ? "center" : headCell.numeric ? "left" : "right"
            }
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography
                  noWrap
                  weight={"medium"}
                  variant={"body2"}
                  style={{ textTransform: "uppercase" }}
                >
                  {headCell.label}
                </Typography>
              </TableSortLabel>
            ) : (
              <Typography
                noWrap
                weight={"medium"}
                variant={"body2"}
                style={{ textTransform: "uppercase" }}
              >
                {headCell.label}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  console.log("props-=-=-=", props);
  const classes = useToolbarStyles();

  return (
    <Toolbar className={classes.root}>
      <Box
        justifyContent={"space-between"}
        display={"flex"}
        alignItems={"center"}
        width={"100%"}
      >
        <Box display={"flex"} className={classes.title}>
          <Typography
            variant="h6"
            color="text"
            colorBrightness={"secondary"}
            id="tableTitle"
            style={{ display: "flex" }}
            block
          >
            Recent Users---
          </Typography>
        </Box>
        <Box>
          <Button
            style={{ width: "120px" }}
            variant={"contained"}
            color={"primary"}
            onClick={() =>
              props.history.push(process.env.PUBLIC_URL + "/app/users")
            }
          >
            View More
          </Button>
        </Box>
      </Box>

      {/* <Box display={"flex"} className={classes.title}>
        <Typography
          variant="h6"
          color="text"
          colorBrightness={"secondary"}
          id="tableTitle"
          style={{ display: "flex" }}
          block
        >
          Recent Users
            </Typography>
            
      </Box> */}
    </Toolbar>
  );
};

function AddSubType(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [checkEnd, setChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [keyCode, setKeyCode] = useState(0);
  const [patternFlag, setPatternFlag] = useState(0);

  //Open the add sub type modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };

  useEffect(() => {
    const abc = "KUNJN";
    props.handleSubmit(abc);
    setFormData({
      pattern: "<PRODUCT_INITIAL><STYLE_BUNDLE_INITIAL>",
    }); //added
    // setPatternFlag(true);
  }, []);

  //HANDLE THE END WORD
  const handleChecked = async (e) => {
    setChecked(e.target.checked);
    await setFormData({
      ...formData,
      ["also_end_word"]: e.target.checked == true ? 1 : 0,
    });
  };

  useEffect(() => {
    if (checkEnd == true) {
      setFormData({
        ...formData,
        pattern: "<PRODUCT_INITIAL><STYLE_BUNDLE_INITIAL><END_WORD>",
      });
    } else {
      setFormData({
        ...formData,
        pattern: "<PRODUCT_INITIAL><STYLE_BUNDLE_INITIAL>",
      });
    }
  }, [checkEnd]);

  //HANDLE THE CHANGE VALUE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };
  //HANDLE CHANGE PATTERN
  const changePatternHandler = (e) => {
    let value = e.target.value;

    // console.log("ttttttttttttttt/ttttttttt", e.target.value);
    if (value[value.length - 1] == ">" && keyCode != 8) {
      value = value + " ";
    }
    // console.log("\n\n VALUUU", value);
    setFormData({ ...formData, pattern: value });
  };

  const onKeyDown = (event) => {
    // console.log("JJJJJ", event.keyCode, event.target.value);
    setKeyCode(event.keyCode);
  };
  //HANDLE THE SUBMIT BUTTON
  const handleSubmit = () => {
    // const obj = formData;

    let reqData = {
      sub_type: formData.sub_type,

      pattern: formData.pattern ? formData.pattern : "",
      initial: formData.initial,
      end_word: checkEnd == true ? formData.end_word : "",
      text_after_product_name: formData.text_after_product_name,
      // also_end_word: checkEnd == true ? formData.also_end_word : 0,
    };
    console.log("FORMDATA", reqData);
    validateFormData(reqData);
  };
  //VALID THE PATTERN
  const validatePattern = (pattern) => {
    // console.log("patternFlag", patternFlag);
    let patternArr = String(pattern).split(" ");
    console.log("\n\n patternArr", patternArr);
    patternArr.map((p) => {
      let firstChar = p[0];
      let lastChar = p[p.length - 1];

      if (firstChar !== "<" || lastChar !== ">") {
        console.log("ERROR");
        // setPatternFlag(1);

        setError("Please enter valid pattern!");
        setErrorField("pattern");
      }
    });
  };
  //VALIDATE THE FORMDATA
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      sub_type: joi
        .string()
        .trim()
        .required(),
      pattern: joi
        .string()
        .trim()
        .required(),
      initial: joi
        .string()
        .trim()
        .required(),
      end_word: joi.required(),
      text_after_product_name: joi
        .string()
        .trim()
        .required(),
    });
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        if (
          err.details[0].message !== error ||
          error.details[0].context.key !== errorField
        ) {
          let errorLog = validate(err);

          setError(errorLog.error);
          setErrorField(errorLog.errorField);
        }
      } else {
        console.log("hello", body.pattern);
        if (body.pattern.includes("<") || body.pattern.includes(">")) {
          console.log("YESS");
          setError("");
          setErrorField("");
          const bundleId = props.bundleId;
          let reqData = {
            sub_type: formData.sub_type,
            style_bundle_id: bundleId,
            pattern: body.pattern.toUpperCase().replace(/ /g, ""),
            initial: formData.initial,
            end_word: checkEnd == true ? formData.end_word : "",
            text_after_product_name: formData.text_after_product_name,
            also_end_word: checkEnd == true ? formData.also_end_word : 0,
          };
          console.log("FINALDATA", reqData);
          submitAddSubType(reqData);
        } else {
          validatePattern(body.pattern);
        }

        // if (error !== null && errorField !== null) {
        //   console.log("PASSS");
        // }
        // if (patternFlag == 0) {
        //   console.log("PASS");

        // }
        // if (error == "" && errorField == "") {
        //   console.log("HELLO");
        // setError("");
        // setErrorField("");
        // addStyleBundle(reqData);
      }
    });
  };
  // console.log("FLAGG", patternFlag);
  //ADD SUB TYPE API CALL
  const submitAddSubType = async (reqData) => {
    console.log("REQDDD", reqData);
    let res = await apiCall(
      "POST",
      "",
      "/admin/subtype_stylebundles/add",
      reqData
    );
    console.log("ADD RESULT", res);
    if (res.data.status == true) {
      if (res.data.data) {
        props.ToggleInputModal(false);
        props.addSubType();
        props.showSubList(false);
      }
      // history.push("/app/stylebundle");
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      pattern: e.target.value,
    });
  };

  // console.log("FOMRDATA", formData);
  return (
    <>
      <Input
        label="Sub Type"
        placeholder={"Sub Type"}
        margin="normal"
        variant="outlined"
        name="sub_type"
        onChange={(e) => handleChange(e)}
        // onChange={(e) =>
        //   setFormValues({
        //     ...formValues,
        //     product_name: e.target.value.replace(/^\s+/, ""),
        //   })
        // }
        InputProps={{
          classes: {
            underline: classes.InputUnderline,
            input: classes.Input,
          },
        }}
        value={formData.sub_type}
        fullWidth
      />
      {errorField === "sub_type" && <ErrorMessage error={error} />}
      <Input
        label="Pattern"
        placeholder={"Pattern"}
        margin="normal"
        variant="outlined"
        name="pattern"
        type="text"
        // onKeyDown={onKeyDown}
        onChange={(e) => handleOnChange(e)}
        // onChange={(e) => changePatternHandler(e)}
        // onChange={(e) => handleChange(e)}
        // onChange={(e) =>
        //   setFormData({
        //     ...formData,
        //     pattern: e.target.value,
        //   })
        // }
        InputProps={{
          classes: {
            underline: classes.InputUnderline,
            input: classes.Input,
          },
        }}
        value={formData.pattern ? formData.pattern : ""}
        inputProps={{ style: { textTransform: "uppercase" } }}
        fullWidth
      />
      {errorField === "pattern" && <ErrorMessage error={error} />}
      <Input
        label="Initals"
        placeholder={"Initals"}
        margin="normal"
        variant="outlined"
        name="initial"
        onChange={(e) => handleChange(e)}
        // onChange={(e) =>
        //   setFormValues({
        //     ...formValues,
        //     product_name: e.target.value.replace(/^\s+/, ""),
        //   })
        // }
        InputProps={{
          classes: {
            underline: classes.InputUnderline,
            input: classes.Input,
          },
        }}
        value={formData.initals}
        fullWidth
      />
      {errorField === "initial" && <ErrorMessage error={error} />}
      <br />
      <FormControlLabel
        className={classes.input}
        style={{ marginTop: "10px" }}
        InputProps={{
          classes: {
            underline: classes.InputUnderline,
            input: classes.Input,
          },
        }}
        control={
          <Checkbox
            checked={checkEnd}
            onChange={(e) => handleChecked(e)}
            name="also_end_word"
            // onChange={(e) =>
            //   setFormValues({
            //     ...formValues,
            //     iscustomsize: e.target.checked,
            //   })
            // }
            name="checkedB"
            color="primary"
          />
        }
        label="Also End Word"
      />
      {checkEnd == true ? (
        <>
          <Input
            label="End"
            placeholder={"End"}
            margin="normal"
            variant="outlined"
            name="end_word"
            onChange={(e) => handleChange(e)}
            // onChange={(e) =>
            //   setFormValues({
            //     ...formValues,
            //     product_name: e.target.value.replace(/^\s+/, ""),
            //   })
            // }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            // value={formValues.product_name}
            fullWidth
          />
          {errorField === "end_word" && <ErrorMessage error={error} />}
        </>
      ) : null}

      <Input
        label="Text to show after product name"
        placeholder={"Text to show after product name"}
        margin="normal"
        variant="outlined"
        name="text_after_product_name"
        onChange={(e) => handleChange(e)}
        // onChange={(e) =>
        //   setFormValues({
        //     ...formValues,
        //     product_name: e.target.value.replace(/^\s+/, ""),
        //   })
        // }
        InputProps={{
          classes: {
            underline: classes.InputUnderline,
            input: classes.Input,
          },
        }}
        // value={formValues.product_name}
        fullWidth
      />
      {errorField === "text_after_product_name" && (
        <ErrorMessage error={error} />
      )}
      <DialogActions style={{ padding: "10px 0 20px" }}>
        <Button
          variant={"outlined"}
          color="primary"
          onClick={() => props.ToggleInputModal(false)}
          // disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant={"contained"}
          color="primary"
          onClick={() => handleSubmit()}
          // disabled={disBtn == true ? true : false}
        >
          Submit
        </Button>
      </DialogActions>
    </>
  );
}

export default withRouter(AddSubType);
