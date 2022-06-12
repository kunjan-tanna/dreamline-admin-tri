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
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

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

function UpdateCategory(props) {
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
  const [OrderApp, setOrderApp] = useState({});

  const history = useHistory();

  //Open the add sub type modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };
  useEffect(() => {
    getStyleBundle();
    getCategory();
  }, []);

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
  //GET THE CATEGORY LISTING
  const getCategory = async () => {
    const catId = props?.categoryId;
    // if (catId) {
    //   props.ToggleInputModal(true);
    // } else {
    //   props.ToggleInputModal(false);
    // }
    const reqParams = {
      category_id: +catId,
    };

    let res = await apiCall(
      "GET",
      "",
      "/admin/category/details",
      {},
      {},
      reqParams
    );
    console.log("GET CATEGORY", res);
    if (res.data.status == true) {
      if (res.data.data) {
        setFormData(res.data?.data);
        setOrderApp(res.data?.data?.order_in_app);
      }
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
    console.log("FORMMM", formData);

    setError("");
  };
  //HANDLE CHANGE ORDER
  const handleChangeOrder = (e) => {
    const { name, value } = e.target;
    // console.log("EVENT", e, "name", name);

    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");

    // setError("");
    // setTimeout(async () => {
    //   await handleOrder();
    // }, 5000);
  };
  //HANDLE THE SELECT ALLOW STYLEBUNDLES
  const handleStyleBundle = (e) => {
    const {
      target: { value },
    } = e;
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
    setDisBtn(false);
  };
  //HANDLE THE END WORD
  const handleChecked = (e) => {
    console.log("dddd", e.target.checked);
    if (formData?.style_bundles[0] == null || e.target.checked == true) {
      setDisBtn(true);
    }
    if (e.target.checked == false) {
      setDisBtn(false);
    }

    setStyleBundleValue(e.target.checked);
    setFormData({
      ...formData,
      ["allow_style_bundles"]: e.target.checked == 1 ? 1 : 0,
    });
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
  //HANDLE THE SUBMIT BUTTON
  const handleSubmit = () => {
    console.log("reqData", formData, "styleBundleValue", styleBundleValue);

    // const obj = formData;
    let reqData = {
      category_name: formData.category_name,
      status: formData.status,
      // style_bundles:
      //   formData?.allow_style_bundles == 1 && styleBundleValue == true
      //     ? formData.style_bundles
      //     : "",

      // order_in_app: formData.order_in_app,
      // style_bundle_before_product: formData.style_bundle_before_product,
      // image: formData.image,
    };
    if (formData?.allow_style_bundles == 1 || styleBundleValue == true) {
      reqData.style_bundles = formData.style_bundles;
    }

    console.log("HEELL", reqData);
    validateFormData(reqData);

    // const obj = formData;
  };
  //VALIDATE THE FORMDATA
  const validateFormData = (body) => {
    // console.log("HEELL", body.style_bundles[0]);

    let schema = joi.object().keys({
      category_name: joi
        .string()
        .trim()
        .required(),
      status: joi.required(),
      style_bundles:
        formData.allow_style_bundles == 1 || styleBundleValue == true
          ? joi.required()
          : "",

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
        console.log("FORMDATA=====", body);
        setError("");
        setErrorField("");
        console.log("FOMRMMM", formData.order_in_app, "BODYY", OrderApp);

        if (formData.order_in_app == OrderApp) {
          let reqData = {
            _id: formData._id,
            category_name: body.category_name,
            image: formData.image ? formData.image : "",
            style_bundles:
              formData.allow_style_bundles == 1 && body.style_bundles
                ? body.style_bundles
                : [],
            order_in_app: OrderApp,

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
        } else if (formData.order_in_app) {
          //IF ORDER_IN _APP THEN THIS ONE
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
              console.log("OKAYYY", response);
              //ARE YOU OVERWRITE ORDER IN APP THEN THIS ONE(RES==1)
              if (response == 1) {
                console.log("OKAYYY");

                setError("");
                let reqData = {
                  _id: formData._id,
                  category_name: body.category_name,
                  image: formData.image ? formData.image : "",
                  style_bundles:
                    formData.allow_style_bundles == 1 && body.style_bundles
                      ? body.style_bundles
                      : [],

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

                // reqData.style_bundles = body.style_bundles.shift()
                console.log("FINALLLL", reqData);
                // addStyleBundle(reqData);
                submitAddCategory(reqData);
              } else {
                console.log("cannn");
                // setFormData({
                //   ...formData,
                //   ["order_in_app"]: "",
                // });
                let reqData = {
                  _id: formData._id,
                  category_name: body.category_name,
                  image: formData.image ? formData.image : "",
                  style_bundles:
                    formData.allow_style_bundles == 1 && body.style_bundles
                      ? body.style_bundles
                      : [],

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
                // const abc = body.style_bundles;

                console.log("FINALLLL", reqData);
                // submitAddCategory(reqData);
              }
              //IF ORDER IN APP IS VALID i.e PASS SUCCESS THEN THIS ONE
            } else if (res.data.status == true) {
              let reqData = {
                _id: formData._id,
                category_name: body.category_name,
                image: formData.image ? formData.image : "",
                style_bundles:
                  formData.allow_style_bundles == 1 && body.style_bundles
                    ? body.style_bundles
                    : [],

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
              // addStyleBundle(reqData);
              // console.log("ADD DATA IN FORMDATA");
            }
          }
        } else {
          //IF ADMIN IS NOT ENTER THE ORDER IN APP THEN THIS ONE
          let reqData = {
            _id: formData._id,
            category_name: body.category_name,
            image: formData.image ? formData.image : "",
            style_bundles:
              formData.allow_style_bundles == 1 && body.style_bundles
                ? body.style_bundles
                : [],
            order_in_app: OrderApp,
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
  //CALL UPDATE CATEGORY API
  const submitAddCategory = async (reqData) => {
    if (formData?.style_bundles[0] == null) {
      reqData.style_bundles = reqData.style_bundles.splice(1);
    }

    console.log("FINALLL-RESS", reqData);

    let res = await apiCall("POST", "", "/admin/category/add-edit", reqData);
    console.log("UPDATE RESPONSE", res);
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

  // const abc =
  //   styleBundleList &&
  //   styleBundleList.map((item) => {
  //     console.log("ITEMM", item.name.split(","));
  //     console.log("formData?.style_bundles", formData?.style_bundles);

  //     if (item.name == formData?.style_bundles) {
  //       console.log("ABCCC", item.name);
  //     }
  //   });
  console.log("FORMSDATTTA", formData);

  return (
    <>
      <Input
        label="Question Category Name"
        placeholder={"Question Category Name"}
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
        value={formData?.category_name ? formData?.category_name : ""}
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
          value={formData?.status == 1 ? 1 : 0}
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
                checked={formData?.allow_style_bundles == 1 ? true : false}
                // onChange={(e) =>
                //   setFormData({
                //     ...formData,
                //     allow_style_bundles: e.target.checked == true ? 1 : 0,
                //   })
                // }
                onChange={(e) => handleChecked(e)}
                // onChange={(e) => setStyleBundleValue(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="Allow StyleBundle"
          />
        </Grid>
        {/* {console.log(
          "formData?.style_bundles",
          formData?.style_bundles.split(",")
        )} */}

        {formData?.allow_style_bundles == 1 ? (
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
                  // value={personName}

                  value={formData?.style_bundles}
                  // value={
                  //   styleBundleList &&
                  //   styleBundleList.filter(
                  //     (item) => item.name === formData?.style_bundles
                  //   )
                  // }
                  // value={
                  //   this.state.styleBundleList &&
                  //   this.state.styleBundleList.filter((item) =>
                  //     console.log("ITEMMM", item)
                  //   )
                  // }
                  // value={"Food Hub,benetton"}
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
                checked={formData?.allow_accessories == 1 ? true : false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allow_accessories: e.target.checked == true ? 1 : 0,
                  })
                }
                name="checkedB"
                color="primary"
              />
            }
            label="Allow Accessories"
          />
        </Grid>
        {formData?.allow_accessories == 1 ? (
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
                  value={formData?.accessories ? formData?.accessories : ""}
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
                checked={formData?.allow_modifications == 1 ? true : false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allow_modifications: e.target.checked == true ? 1 : 0,
                  })
                }
                name="checkedB"
                color="primary"
              />
            }
            label="Allow Modification"
          />
        </Grid>
        {formData?.allow_modifications == 1 ? (
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
                  value={formData?.modifications ? formData?.modifications : ""}
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
                checked={formData.extra_type == 1 ? true : false}
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
              label="Order In App"
              placeholder={"Order In App"}
              margin="normal"
              variant="outlined"
              name="order_in_app"
              type="number"
              // onBlur={(e) => handleOrder(e)}
              onChange={(e) => handleChangeOrder(e)}
              // onChange={(e) => handleOrder(e)}
              InputProps={{
                classes: {
                  underline: classes.InputUnderline,
                  input: classes.Input,
                },
              }}
              value={formData?.order_in_app ? formData?.order_in_app : ""}
              fullWidth
            />
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
                  formData.style_bundle_before_product == 1 ? true : false
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
      {formData?.image ? (
        <img
          src={formData?.image ? formData?.image : profile}
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

export default withRouter(UpdateCategory);
