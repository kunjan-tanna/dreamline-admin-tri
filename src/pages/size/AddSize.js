import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";

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
  Select,
  MenuItem,
  TextField as Input,
  CircularProgress,
  Stepper,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { makeStyles } from "@material-ui/styles";
import { apiCall, displayLog, confirmBox, validate } from "../../common/common";
// styles
import useStyles from "./styles";
import { Button } from "../../components/Wrappers/Wrappers";
import alertify from "alertifyjs";
import joi from "joi-browser";

// components
import Widget from "../../components/Widget/Widget";
import { Typography } from "../../components/Wrappers/Wrappers";
import { PeopleAlt as PeopleAltIcon } from "@material-ui/icons";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { lighten } from "@material-ui/core/styles";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// import Input from "@material-ui/core/Input";
import ErrorMessage from "../../components/ErrorMessage";

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

function AddSize(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [checkEnd, setChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const [nextFormData, setNextFormData] = useState({});
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [needCustom, setNeedCustom] = useState(false);
  const [accessories, setAccessoriesValue] = useState(false);
  const [modification, setModificationValue] = useState(false);
  const [disBtn, setDisBtn] = useState(false);

  const [AdddisBtn, setAddDisBtn] = useState(false);
  const [addValue, setAddValue] = useState(false);

  const [personName, setPersonName] = useState([]);
  const [sizeList, setsizeList] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [nextData, setNextData] = useState([]);
  const [size, setSize] = useState({});
  const [sizeData, setSizeData] = useState({});
  const [nextData, setNextData] = useState([]);
  const [listItem, setListItem] = useState([]);
  // const [firstData, setNeedCustom] = useState(0);
  let [sizeData1, setSizeData1] = useState([
    { l: "", w: "", h: "", wr: "", wf: "", hf: "", hr: "", lb: "", ct: "" },
  ]);
  let dataSize = [];

  const history = useHistory();

  //Open the add sub type modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };
  useEffect(() => {
    setLoading(true);

    getSizeList();
  }, []);
  useEffect(() => {
    if (needCustom == true) {
      listItem.map((item) => {
        console.log("ITEEDMMMD==", item);

        if (
          !item.code ||
          !item.parameters ||
          item.code == "" ||
          item.parameters == "" ||
          Object.keys(item).length == 0 ||
          item.code == item.parameters
        ) {
          setDisBtn(true);
        } else {
          setDisBtn(false);
        }
      });
    }
  }, [listItem]);

  //GET SIZE LIST
  const getSizeList = async () => {
    const reqBody = {
      adminSelectList: 1,
      sortby: "_id",
      sort: 0,
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/size/list",

      reqBody
    );

    console.log("check API===", res);

    if (res.data.status == true) {
      // setsizeList([
      //   {
      //     _id: "21",
      //     parameters: "WIDTH*HEIGHT*DEPTH",
      //   },
      // ]);
      setLoading(true);
      // setsizeList(res.data.data?.size);

      if (res.data.data?.size.length == 0) {
        setLoading(false);
        setNeedCustom(true);
        setDisBtn(true);
      } else {
        setLoading(false);
        setsizeList(res.data.data?.size);
      }

      // if (res.data.data?.size.length == 0) {
      //   console.log("3333333333333333333333");
      //   setLoading(false);
      //   setNeedCustom(true);
      // } else {
      //   setLoading(false);
      //   setNeedCustom(false);

      //   console.log("4444444444444444444");

      //   setsizeList(res.data.data?.size);
      // }
      // setsizeList(res.data.data?.size);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };

  //HANDLE THE ONCHANGE DATA
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("EVENT", e, "name", name);

    setFormData({
      ...formData,
      [name]: value.toUpperCase(),
    });
    setError("");
  };

  //HANDLE THE CHANGE SIZE
  const handleChangeSize = (sizeParms, index) => {
    setAddDisBtn(true);
    // setListItem([]);
    // console.log("dd", Object.keys(sizeData).length, "index", index);
    // if (Object.keys(sizeData).length !== index) {
    //   setDisBtn(false);
    // } else {
    //   setDisBtn(true);
    // }

    // setDisBtn(true);
    if (sizeParms.includes("*")) {
      const splitParms = sizeParms.split("*");
      let arr = [];
      splitParms.map((item, i) => {
        if (item.includes(" ")) {
          arr.push(item.replace(/ /g, ""));
        } else {
          arr.push(item);
        }
      });

      setNextData([...arr]);
    } else {
      setNextData([sizeParms]);
    }
  };

  //HANDLE THE SIZE
  const handleInputChange = (event, i) => {
    const { name, value } = event.target;
    console.log(name, value);

    setSizeData({
      ...sizeData,
      [name]: value.toUpperCase(),
    });
    setError("");
  };
  //NO CUSTOM SIZE INPUT
  const handleInputChangeNoCus = (e, i) => {
    const { name, value } = e.target;
    console.log("NAME", name, "VALUES", value);

    if (value == "") {
      setError(`Please enter valid ${name}!`);
      setErrorField(`${name}`);

      // setDisBtn(true);
    } else {
      // setDisBtn(false);
    }
    setSizeData({
      ...sizeData,
      [name]: value.toUpperCase(),
    });
  };

  //HANDLE THE SUBMIT BUTTON
  const handleSubmit = () => {
    console.log("SIZEDATA", sizeData, formData);
    if (
      Object.keys(sizeData).length !== 0 ||
      Object.keys(formData).length !== 0 ||
      needCustom !== false
    ) {
      let obj = formData;
      if (needCustom == false) {
        console.log("SIZEEE", sizeData);
        const splitSize = Object.values(sizeData).join("*");
        let reqData = {
          isCustom: 0,
          _id: +formData.size,
          code: splitSize,
        };

        submitAddSize(reqData);
      } else if (needCustom == true) {
        console.log("OBJJ", nextData);

        //ADD CUSTOM SIZE
        const cusCode = listItem.map((item) => item.code);
        // console.log("DATASIZXE", cusCode);
        obj.code = cusCode.join("*");
        const cusParams = listItem.map((item) => item.parameters);
        // console.log("cusParams", cusParams);
        obj.parameters = cusParams.join("*");
        obj.isCustom = 1;
        console.log("OBJECT", obj);
        // validateFormData(obj);
        submitAddSize(obj);
      }
    } else {
      displayLog(0, "Please click at least one box");
    }
  };
  const handleCusDataChange = (e, index) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toUpperCase(),
    });
    console.log("NAME", value);
    const listedit = [...nextData];

    listedit[index][name] = value.toUpperCase();
    console.log("LISTTT", listedit);

    setNextData(listedit);
  };
  //VALIDATE THE FORMDATA
  const validateFormData = (body) => {
    console.log("BODYYY", body);
    var schema = joi.object().keys({
      code: joi
        .string()
        .trim()
        .required(),

      parameters: joi
        .string()
        .trim()
        .required(),
    });
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        console.log("hhh", err);
        if (
          err.details[0].message !== error ||
          error.details[0].context.key !== errorField
        ) {
          let errorLog = validate(err);
          setError(errorLog.error);
          setErrorField(errorLog.errorField);
        }
      } else {
        console.log("VALIDATE", body);
        setError("");
        setErrorField("");

        let reqData = {
          isCustom: 1,
          code: body.code,
          parameters: body.parameters,
        };
        console.log("reqData", reqData);
        // obj._id = size.size;

        // submitAddSize(reqData);
        // addStyleBundle(reqData);
      }
    });
  };

  //CALL ADD CATEGORY API
  const submitAddSize = async (reqData) => {
    console.log("FINALLL", reqData);

    let res = await apiCall("POST", "", "/admin/size/add-edit", reqData);
    console.log("ADD RESPONSE", res);
    if (res.data.status == true) {
      setTimeout(() => {
        history.push("/app/sizes");
        props.ToggleInputModal(false);
        props.getSizes();
        // window.location.reload();
      }, 1000);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  //HANDLE THE ADD CLICK BUTTON IN SIZE ARRAY
  const handleAddClick = () => {
    console.log("sizedaa", sizeData);
    let list = [...listItem];
    list.push(sizeData);
    setListItem(list);
    setDisBtn(false);
    setSizeData({
      parameters: "",
      code: "",
    });
  };
  //HANDLE THE REMOVE CLICK BUTTON IN SIZE ARRAY
  const handleRemoveClick = (index) => {
    const list = [...listItem];
    console.log("LISTTT", list, index);

    list.splice(index, 1);

    setListItem(list);
  };
  //HANDLE THE CHANGE SIZE DATA IN ARRAY
  const handlelistData = (e, index) => {
    const { name, value } = e.target;

    const listedit = [...listItem];

    if (value == "") {
      setError(`Please enter valid ${name}!`);
      setErrorField(`${name}`);

      // setDisBtn(true);
    }
    listedit[index][name] = value.toUpperCase();
    setListItem(listedit);
  };
  const handleChecked = (e) => {
    console.log("SIZEDATA", sizeData, "LISTITEM", listItem);
    setNeedCustom(e.target.checked);
    if (e.target.checked == true) {
      setDisBtn(true);
      setNextData([]);
      setSizeData({});
    } else if (e.target.checked == false) {
      setListItem([]);
    }
  };
  const handleRemoveItemClick = () => {
    // setFormData({
    //   ...formData,
    //   ["code"]: "",
    //   ["parameters"]: "",
    // });
    setNextData([]);
  };

  return (
    <>
      {loading == true ? (
        <CircularProgress size={50} />
      ) : (
        <>
          {needCustom == false ? (
            <>
              {" "}
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%", marginTop: "20px" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Size
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Size"
                  name="size"
                  // onChange={(e) => handleChange(e)}
                  // value={formValues.category}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                >
                  {sizeList &&
                    sizeList.map((item, index) => {
                      return (
                        <MenuItem
                          value={item._id}
                          onClick={() =>
                            handleChangeSize(item.parameters, index)
                          }
                        >
                          {item.parameters}
                        </MenuItem>
                      );
                    })}
                </Select>
                {errorField === "size" && <ErrorMessage error={error} />}
              </FormControl>{" "}
              {/* Select the Size */}
              {/* Show the input Field Depend on Select Size */}
              {console.log("LOADING===", loading)}
              {/* {ID ==2 => Height * Width} */}
              {nextData.length > 0 && (
                <>
                  {nextData.map((item, i) => (
                    <>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                        style={{ width: "100%" }}
                      >
                        <Input
                          label={`Please enter ${item} latters`}
                          placeholder={`Please enter ${item} latters`}
                          margin="normal"
                          variant="outlined"
                          name={`${item}`}
                          InputProps={{
                            classes: {
                              underline: classes.InputUnderline,
                              input: classes.Input,
                            },
                          }}
                          // onChange={(e) => handleChange(e)}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                          value={sizeData && sizeData[item]}
                          onChange={(e) => handleInputChangeNoCus(e, i)}
                          // value={formData.order_in_app}
                          fullWidth
                        />
                        {nextData[i].item == "" ? (
                          <>
                            {errorField === `${item}` && (
                              <ErrorMessage error={error} />
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    </>
                  ))}{" "}
                </>
              )}
            </>
          ) : null}
          {/* Need Custome Size */}

          <Grid container spacing={2}>
            <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
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
                    checked={needCustom == true ? true : false}
                    onChange={(e) => handleChecked(e)}
                    disabled={AdddisBtn == true ? true : false}
                    // onClick={() => handleAddClick()}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Need Custom Size"
              />
            </Grid>
          </Grid>
          {needCustom == true ? (
            <>
              <Grid container spacing={2}>
                <Grid
                  item
                  md={6}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    style={{ width: "100%" }}
                  >
                    <Input
                      label="Enter a custom size slot"
                      placeholder={"Enter a custom size slot"}
                      margin="normal"
                      variant="outlined"
                      name="parameters"
                      // onBlur={(e) => handleOrder(e)}
                      // onChange={(e) => handleChange(e)}
                      onChange={(e) => handleInputChange(e)}
                      InputProps={{
                        classes: {
                          underline: classes.InputUnderline,
                          input: classes.Input,
                        },
                      }}
                      inputProps={{
                        style: { textTransform: "uppercase" },
                      }}
                      value={sizeData.parameters}
                      fullWidth
                    />
                    {/* {errorField === "parameters" && <ErrorMessage error={error} />} */}
                  </FormControl>
                </Grid>

                <Grid item md={6}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    style={{ width: "100%" }}
                  >
                    <Input
                      label="Letters"
                      placeholder={"Letters"}
                      margin="normal"
                      variant="outlined"
                      name="code"
                      onChange={(e) => handleInputChange(e)}
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
                      inputProps={{
                        style: { textTransform: "uppercase" },
                      }}
                      value={sizeData.code}
                      fullWidth
                    />
                    {/* {errorField === "code" && <ErrorMessage error={error} />} */}
                  </FormControl>
                </Grid>
                <Grid item md={6}>
                  <Button
                    onClick={() => handleAddClick()}
                    disabled={
                      nextData.length > 0 ||
                      !sizeData.code ||
                      !sizeData.parameters ||
                      sizeData.code == "" ||
                      sizeData.parameters == "" ||
                      Object.keys(sizeData).length == 0
                        ? true
                        : false
                    }
                  >
                    Add
                  </Button>
                  {/* <Button onClick={() => handleRemoveItemClick()}>Remove</Button> */}
                </Grid>
              </Grid>{" "}
              {listItem.length > 0 &&
                listItem.map((item, i) => (
                  <>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={6}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                          style={{ width: "100%" }}
                        >
                          <Input
                            label="Enter a custom size slot"
                            placeholder={"Enter a custom size slot"}
                            margin="normal"
                            variant="outlined"
                            required
                            name="parameters"
                            // onBlur={(e) => handleOrder(e)}
                            onChange={(e) => handlelistData(e, i)}
                            InputProps={{
                              classes: {
                                underline: classes.InputUnderline,
                                input: classes.Input,
                              },
                            }}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                            value={item.parameters}
                            fullWidth
                          />

                          {listItem[i].parameters == "" ? (
                            <>
                              {errorField === "parameters" && (
                                <ErrorMessage error={error} />
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item md={6}>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                          style={{ width: "100%" }}
                        >
                          <Input
                            label="Letters"
                            placeholder={"Letters"}
                            margin="normal"
                            variant="outlined"
                            required
                            name="code"
                            onChange={(e) => handlelistData(e, i)}
                            // onChange={(e) =>
                            //   setFormValues({
                            //     ...formValues,
                            //     product_name: e.target.value.replace(/^\s+/, ""),
                            //   })
                            // }
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                            InputProps={{
                              classes: {
                                underline: classes.InputUnderline,
                                input: classes.Input,
                              },
                            }}
                            value={item.code}
                            fullWidth
                          />
                          {listItem[i].code == "" ? (
                            <>
                              {errorField === "code" && (
                                <ErrorMessage error={error} />
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item md={6}>
                        <Button onClick={() => handleRemoveClick(i)}>
                          Remove
                        </Button>
                      </Grid>
                    </Grid>{" "}
                  </>
                ))}
            </>
          ) : null}
        </>
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

        {needCustom == true && (
          <>
            {" "}
            <Button
              variant={"contained"}
              color="primary"
              onClick={() => handleSubmit()}
              disabled={disBtn == true ? true : false}
            >
              Submit
            </Button>{" "}
          </>
        )}
        {needCustom == false && (
          <Button
            variant={"contained"}
            color="primary"
            onClick={() => handleSubmit()}
            disabled={
              Object.keys(sizeData).length !== nextData.length ? true : false
            }
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </>
  );
}

export default withRouter(AddSize);
