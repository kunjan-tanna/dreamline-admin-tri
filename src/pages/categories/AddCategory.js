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
import profile from "../../static/images/default.png";

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

function AddCategory(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [checkEnd, setChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [styleBundleValue, setStyleBundleValue] = useState(false);
  const [accessories, setAccessoriesValue] = useState(false);
  const [modification, setModificationValue] = useState(false);
  const [disBtn, setDisBtn] = useState(false);
  const [exType, setExTypeValue] = useState(false);

  const [personName, setPersonName] = useState([]);
  const [styleBundleList, setstyleBundleList] = useState([]);

  const history = useHistory();

  //Open the add sub type modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };
  useEffect(() => {
    getStyleBundle();
  }, [error]);

  //GET STYLE BUNDLE LIST
  const getStyleBundle = async () => {
    const reqBody = {
      type: "forSelect",
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/stylebundle/list",

      reqBody
    );
    console.log("check API", res);

    if (res.data.status == true) {
      setstyleBundleList(res.data?.data);
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
      [name]: value,
    });
    setError("");
  };
  //HANDLE THE SELECT ALLOW STYLEBUNDLES
  const handleStyleBundle = (e) => {
    const {
      target: { value },
    } = e;
    console.log("VALUEEE", value);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    // console.log("VALUEE", value);
    // setStyleBundleValue(e.target.checked);
    setFormData({
      ...formData,
      ["style_bundles"]: typeof value === "string" ? value.split(",") : value,
    });
    setError("");
  };

  //HANDLE THE IMAGE
  const handleImage = async (e) => {
    displayLog(2, "Please wait for upload image");

    // setDisBtn(true);
    const Img = e.target.files[0];
    console.log("IMAGE", Img);
    var bodyFormData = new FormData();
    bodyFormData.append("image", Img);
    let reqParams = {
      type: "categories",
    };
    let res = await apiCall(
      "POST",
      "",
      "/admin/upload-image",
      bodyFormData,
      {},
      reqParams
    );
    console.log("RESPONSE IMAGE", res);
    if (res.data) {
      setFormData({
        ...formData,
        ["image"]: res.data.data?.image,
      });
      setDisBtn(false);
      setError("");
    } else {
      displayLog(0, res.data.message);
    }
  };
  console.log("FORMDATTA", formData);
  //HANDLE THE SUBMIT BUTTON
  const handleSubmit = () => {
    console.log("FORMM", formData);

    // const obj = formData;
    let reqData = {
      category_name: formData.category_name,
      status: formData.status,
      // style_bundles: styleBundleValue !== true ? [] : formData.style_bundles,

      // order_in_app: formData.order_in_app,
      // style_bundle_before_product: formData.style_bundle_before_product,
      // image: formData.image,
    };
    if (styleBundleValue == true) {
      reqData.style_bundles = formData.style_bundles;
    }
    console.log("REQDATA", reqData);

    validateFormData(reqData);
  };
  //VALIDATE THE FORMDATA
  const validateFormData = (body) => {
    console.log("styleBundleValue", styleBundleValue);
    let schema = joi.object().keys({
      category_name: joi
        .string()
        .trim()
        .required(),
      status: joi.required(),
      style_bundles: styleBundleValue == true ? joi.required() : "",
      // order_in_app: joi
      //   .string()
      //   .min(3)
      //   .max(3)
      //   .regex(/^[0]?\d{3,3}$/),
      // order_in_app: joi
      //   .number()

      //   .required(),
      // style_bundle_before_product: joi.required(),
      // image: joi.string().required(),
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
        console.log("FORMDATA=====ORDEE", formData);
        setError("");
        setErrorField("");

        //IF ORDER_IN _APP THEN THIS ONE
        if (formData.order_in_app) {
          const reqBody = {
            order_in_app: +formData.order_in_app,
          };

          let res = await apiCall(
            "POST",
            "",
            "/admin/category/check-order",

            reqBody
          );

          if (res.data.code == 200) {
            if (res.data.status == false) {
              //SHOW POPUP & ASK TO OVERWRITTE

              const response = await confirmBox(
                "<em>Dreamline</em> ",
                "Are you sure you want to overwrite Order In App?"
              );
              // console.log("OKAYYY", response);

              //ARE YOU OVERWRITE ORDER IN APP THEN THIS ONE(RES==1)
              if (response == 1) {
                console.log("OKAYYY");

                setError("");
                let reqData = {
                  category_name: body.category_name,
                  image: formData.image ? formData.image : "",
                  style_bundles: body.style_bundles ? body.style_bundles : [],

                  order_in_app: +formData.order_in_app,
                  status: body.status,
                  // style_bundle_before_product: 0,
                };
                if (formData.accessories) {
                  reqData.accessories = formData.accessories;
                }
                if (formData.modifications) {
                  reqData.modifications = formData.modifications;
                }
                if (formData.extra_type) {
                  reqData.extra_type = formData.extra_type;
                }
                console.log("FINALLLL", reqData);
                submitAddCategory(reqData);
              } else {
                console.log("cannn");
                // setFormData({
                //   ...formData,
                //   ["order_in_app"]: "",
                // });
                let reqData = {
                  category_name: body.category_name,
                  image: formData.image ? formData.image : "",
                  style_bundles: body.style_bundles ? body.style_bundles : [],

                  status: body.status,
                  // style_bundle_before_product: 0,
                };
                if (formData.accessories) {
                  reqData.accessories = formData.accessories;
                }
                if (formData.modifications) {
                  reqData.modifications = formData.modifications;
                }
                if (formData.extra_type) {
                  reqData.extra_type = formData.extra_type;
                }
                console.log("ABBBSSS", reqData);
              }
              //IF ORDER IN APP IS VALID i.e PASS SUCCESS THEN THIS ONE
            } else if (res.data.status == true) {
              let reqData = {
                category_name: body.category_name,
                image: formData.image ? formData.image : "",
                style_bundles: body.style_bundles ? body.style_bundles : [],

                order_in_app: +formData.order_in_app,
                status: body.status,
                // style_bundle_before_product: 0,
              };
              if (formData.accessories) {
                reqData.accessories = formData.accessories;
              }
              if (formData.modifications) {
                reqData.modifications = formData.modifications;
              }
              if (formData.extra_type) {
                reqData.extra_type = formData.extra_type;
              }
              console.log("FINALLLL", reqData);
              submitAddCategory(reqData);
            }
          }
        } else {
          //IF ADMIN IS NOT ENTER THE ORDER IN APP THEN THIS ONE
          let reqData = {
            category_name: body.category_name,
            image: formData.image ? formData.image : "",
            style_bundles: body.style_bundles ? body.style_bundles : [],

            status: body.status,
            // style_bundle_before_product: 0,
          };
          if (formData.accessories) {
            reqData.accessories = formData.accessories;
          }
          if (formData.modifications) {
            reqData.modifications = formData.modifications;
          }
          if (formData.extra_type) {
            reqData.extra_type = formData.extra_type;
          }
          console.log("FINALLLL", reqData);
          submitAddCategory(reqData);
        }
      }
    });
  };
  //CALL ADD CATEGORY API
  const submitAddCategory = async (reqData) => {
    console.log("FINALLL-RES", reqData);
    let res = await apiCall("POST", "", "/admin/category/add-edit", reqData);
    console.log("ADD RESPONSE", res);
    if (res.data.status == true) {
      setTimeout(() => {
        history.push("/app/categories");
        props.ToggleInputModal(false);
        props.getCategories();
        // window.location.reload();
      }, 1000);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  // console.log("formData.order_in_app", formData);
  return (
    <>
      <Input
        label="Category Name"
        placeholder={"Category Name"}
        margin="normal"
        variant="outlined"
        name="category_name"
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
      {errorField === "category_name" && <ErrorMessage error={error} />}
      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "20px" }}
      >
        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Category"
          onChange={(e) => handleChange(e)}
          name="status"
          value={formData.status}
          // onChange={(e) =>
          //   setFormValues({ ...formValues, status: e.target.value })
          // }
        >
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Deactivated</MenuItem>
        </Select>
        {errorField === "status" && <ErrorMessage error={error} />}
      </FormControl>
      {/* Allow style bundle */}
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
                checked={styleBundleValue == true ? true : false}
                onChange={(e) => setStyleBundleValue(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="Allow StyleBundle"
          />
        </Grid>
        {styleBundleValue == true ? (
          <>
            <Grid item md={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%", marginTop: "20px" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Select StyleBundle
                </InputLabel>

                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  label="Select StyleBundle"
                  onChange={(e) => handleStyleBundle(e)}
                  multiple
                  name="style_bundles"
                  value={personName}
                  // value={formValues.status}
                  // onChange={(e) =>
                  //   setFormValues({ ...formValues, status: e.target.value })
                  // }
                >
                  {styleBundleList &&
                    styleBundleList.map((item, index) => {
                      return <MenuItem value={item._id}>{item.name}</MenuItem>;
                    })}
                </Select>
                {errorField === "style_bundles" && (
                  <ErrorMessage error={error} />
                )}
              </FormControl>
            </Grid>{" "}
          </>
        ) : null}
      </Grid>

      {/* Allow Accessories */}
      <Grid container spacing={2}>
        <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
          {" "}
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
                checked={accessories == true ? true : false}
                onChange={(e) => setAccessoriesValue(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="Allow Accessories"
          />
        </Grid>
        {accessories == true ? (
          <>
            {" "}
            <Grid item md={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%" }}
              >
                <Input
                  label="Rename Accessories"
                  placeholder={"Rename Accessories"}
                  margin="normal"
                  variant="outlined"
                  name="accessories"
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
                {errorField === "accessories" && <ErrorMessage error={error} />}
              </FormControl>
            </Grid>
          </>
        ) : null}
      </Grid>
      {/* Allow Modification */}
      <Grid container spacing={2}>
        <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            className={classes.input}
            style={{ marginTop: "5px" }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            control={
              <Checkbox
                checked={modification == true ? true : false}
                onChange={(e) => setModificationValue(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="Allow Modification"
          />
        </Grid>
        {modification == true ? (
          <>
            {" "}
            <Grid item md={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%" }}
              >
                <Input
                  label="Rename Modification"
                  placeholder={"Rename Modification"}
                  margin="normal"
                  variant="outlined"
                  name="modifications"
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
                {errorField === "modifications" && (
                  <ErrorMessage error={error} />
                )}
                {/* <Input
                  label="Rename Modification"
                  placeholder={"Rename Modification"}
                  margin="normal"
                  variant="outlined"
                  name="modifications"
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
                {errorField === "modifications" && (
                  <ErrorMessage error={error} />
                )} */}
              </FormControl>
            </Grid>
          </>
        ) : null}
      </Grid>
      {/* Extra Type */}
      <Grid container spacing={2}>
        <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            className={classes.input}
            style={{ marginTop: "5px" }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            control={
              <Checkbox
                checked={formData.extra_type == true ? true : false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    extra_type: e.target.checked == true ? 1 : 0,
                  })
                }
                // name="checkedB"
                color="primary"
              />
            }
            label="Extra Type"
          />
          {errorField === "extra_type" && <ErrorMessage error={error} />}
        </Grid>
        <Grid item md={6}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%" }}
          >
            <Input
              id="outlined-number"
              label="Order In App"
              placeholder={"Order In App"}
              margin="normal"
              variant="outlined"
              name="order_in_app"
              onChange={(e) => handleChange(e)}
              value={formData.order_in_app}
              type="number"
              inputProps={{ max: 3 }} // sets the maximum length to 10
            ></Input>
            {/* <Input
              label="Order In App"
              placeholder={"Order In App"}
              margin="normal"
              variant="outlined"
              type="number"
              name="order_in_app"
              onBlur={(e) => handleOrder(e)}
              // InputProps={{
              //   classes: {
              //     underline: classes.InputUnderline,
              //     input: classes.Input,
              //   },
              // }}
              InputProps={{ inputProps: { min: 0, max: 10 } }}
              // inputProps={{ maxLength: 10 }}
              // value={formData.order_in_app}
              fullWidth
            /> */}
            {errorField === "order_in_app" && <ErrorMessage error={error} />}
          </FormControl>
        </Grid>{" "}
      </Grid>
      {/* <Grid container spacing={2}>
        <Grid item md={12}>
          <FormControlLabel
            className={classes.input}
            style={{ marginTop: "5px" }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            control={
              <Checkbox
                checked={
                  formData.style_bundle_before_product == true ? true : false
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    style_bundle_before_product:
                      e.target.checked == true ? 1 : 0,
                  })
                }
                // name="checkedB"
                color="primary"
              />
            }
            label="Required Style Bundle Before Product"
          />
          {errorField === "style_bundle_before_product" && (
            <ErrorMessage error={error} />
          )}
        </Grid>
      </Grid> */}
      <InputLabel
        id="demo-simple-select-outlined-label"
        style={{ marginTop: "20px", float: "left", marginRight: "5px" }}
      >
        Image
      </InputLabel>
      <input
        style={{ marginTop: "20px", marginLeft: "5px", float: "none" }}
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        type="file"
        name="image"
        onChange={(e) => handleImage(e)}
        // onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
        margin="normal"
        variant="outlined"
        InputProps={{
          classes: {
            underline: classes.InputUnderline,
            input: classes.Input,
          },
        }}
      />
      {errorField === "image" && <ErrorMessage error={error} />}
      <div></div>
      {formData.image ? (
        <img
          src={formData.image ? formData.image : profile}
          style={{
            height: "100px",
            width: "100px",
            marginTop: "20px",
            borderRadius: "20px",
          }}
        />
      ) : (
        <div></div>
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
          disabled={disBtn == true ? true : false}
        >
          Submit
        </Button>
      </DialogActions>
    </>
  );
}

export default withRouter(AddCategory);
