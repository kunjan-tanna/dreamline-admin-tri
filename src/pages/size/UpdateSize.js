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
import ErrorMessage from "../../components/ErrorMessage";

const useToolbarStyles = makeStyles((theme) => ({
  title: {
    flex: "1 1 100%",
  },
}));

function UpdateSize(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [checkEnd, setChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const [rowData, setRowData] = useState({});
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [needCustom, setNeedCustom] = useState(false);
  const [accessories, setAccessoriesValue] = useState(false);
  const [modification, setModificationValue] = useState(false);
  const [disBtn, setDisBtn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [addValue, setAddValue] = useState(false);

  const [personName, setPersonName] = useState([]);
  const [sizeList, setsizeList] = useState([]);
  const [nextData, setNextData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [cusData, setCusData] = useState([]);
  const [cusSubmitData, setCusSubmitData] = useState([]);
  const [showCodeData, setShowCodeData] = useState([]);
  const [showParamsData, setShowParamsData] = useState([]);
  const [size, setSize] = useState({});
  const [sizeId, setSizeId] = useState(null);
  // const [firstData, setNeedCustom] = useState(0);

  const [sizeData, setSizeData] = useState({});

  const history = useHistory();

  //Open the add sub type modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };
  useEffect(() => {
    setLoading(true);
    getSizeList();
    getSize();
  }, [sizeData]);

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
      setsizeList(res.data.data?.size);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  //GET THE CATEGORY LISTING
  const getSize = async () => {
    const sizeId = props?.sizeId;

    const reqParams = {
      size_id: +sizeId,
    };

    let res = await apiCall(
      "GET",
      "",
      "/admin/size/details",
      {},
      {},
      reqParams
    );
    console.log("GET SIZE", res);
    if (res.data.status == true) {
      if (res.data.data) {
        setFormData(res.data?.data);
        setLoading(true);
        if (res.data.data?.is_custom == 0) {
          setLoading(false);
          const obj = res.data?.data && res.data?.data?.code;
          const parameters = res.data?.data && res.data?.data?.parameters;

          if (parameters.includes("*")) {
            const splitParms = parameters.split("*");
            const splitCode = obj.split("*");
            console.log("parameters", splitParms, "code", splitCode);
            let arr = [];

            splitParms.map((item, i) => {
              console.log("item", item);
              if (item.includes(" ")) {
                splitCode.map((code, index) => {
                  if (index == i) {
                    arr.push({
                      [item.replace(/ /g, "")]: code,
                    });
                  }
                });

                // arr.push(item.replace(/ /g, ""));
              } else {
                splitCode.map((code, index) => {
                  if (index == i) {
                    arr.push({
                      [item]: code,
                    });
                  }
                });
                // arr.push(item);
              }
            });

            setShowData([...arr]);
          } else {
            console.log("OBJJJ", obj);
            let showData = [];
            showData.push({
              [parameters]: obj,
            });
            setShowData([...showData]);
          }
        } else if (res.data.data?.is_custom == 1) {
          setLoading(false);
          const code = res.data?.data && res.data?.data?.code;
          const parameters = res.data?.data && res.data?.data?.parameters;

          const splitCode = code && code.split("*");
          const splitParms = parameters && parameters.split("*");

          let arr = cusData;
          console.log("splitCode", splitCode, "splitParms", splitParms);
          splitCode.map((item, index) => {
            console.log("ITEEM", item);
            splitParms.map((parms, i) => {
              if (index == i) {
                arr.push({
                  code: item,
                  parameters: parms,
                });
              }
            });
          });

          console.log("ARRR", arr);
          setCusData([...arr]);
          setShowCodeData(splitCode);
          setShowParamsData(splitParms);
        }
      }
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };

  //HANDLE THE ONCHANGE DATA NO CUSTOM SIZE
  const handleChange = (e, index, itemData) => {
    // const abc = Object.keys(itemData).map((item, val) => {
    //   console.log("itemm", item, "val", val);
    // });

    const { name, value } = e.target;

    const listedit = [...showData];

    if (value == "") {
      setError(`Please enter valid ${name}!`);
      setErrorField(`${name}`);

      // setDisBtn(true);
    } else {
      // setDisBtn(false);
    }
    listedit[index][name] = value.toUpperCase();
    console.log("LISTTT", listedit);
    setShowData(listedit);

    setError("");
  };
  useEffect(() => {
    // console.log("cusData", cusData);
    // console.log("showData", showData);
    let bool = {
      data: false,
    };
    //FOR NO CUSTOM SIZE
    showData.map((item, index) => {
      console.log("item+++", item, "INDEX", index);

      if (Object.values(item).toString() !== "") {
        setDisBtn(false);
      } else {
        bool.data = true;

        // console.log("DISTRUE", bool);
      }

      if (bool.data == true) {
        setDisBtn(true);
      }

      // console.log("ITEMMDFDF", aa, "INDEX", aa[index]);
    });
    //FOR CUSTOM SIZE
    cusData.map((item, index) => {
      console.log("ITEMMM", item.parameters, "INDEX", index);

      // console.log("ITEEDMMMD==", item);
      if (item.code !== "" && item.parameters !== "") {
        console.log("DISFALSE");
        setDisBtn(false);
      } else {
        bool.data = true;
        console.log("DISTRUE", bool);
      }
      if (bool.data == true) {
        setDisBtn(true);
      }
    });
  }, [cusData, showData]);

  //HANDLE ONCHANGE ON CUSTOM SIZE
  const handleCusDataChange = (e, index) => {
    const { name, value } = e.target;

    const listedit = [...cusData];
    // console.log("NAME", listedit[index].parameters);
    if (value == "") {
      setError(`Please enter valid ${name}!`);
      setErrorField(`${name}`);

      // setDisBtn(true);
    } else {
      // setDisBtn(false);
    }
    listedit[index][name] = value.toUpperCase();
    console.log("LISTTT", listedit);
    setCusData(listedit);
  };

  //HANDLE ADD BUTTON FOR CUSTOM SIZE
  const handleAddCusClick = (index) => {
    console.log("INDEX", index);

    var myObj = {
      code: "",
      parameters: "",
    }; // Empty Object

    let arr = cusData;

    arr.push(myObj);

    setCusData([...arr]);
  };

  //HANDLE THE SUBMIT BUTTON
  const handleSubmit = () => {
    //FOR NO CUSTOM SIZE SELECT
    if (formData?.is_custom == 0) {
      const sizeDataArr = [...showData];
      const joinSize = sizeDataArr.map((item1, index) => Object.values(item1));
      const splitSize = joinSize.join("*");
      let reqData = {
        isCustom: 0,

        code: splitSize,
      };
      submitAddCategory(reqData);
    } else if (formData.is_custom == 1) {
      let obj = {};
      //FOR CUSTOM SIZE SELECT

      console.log("cusData", cusData);
      const cusCode = cusData.map((item) => item.code);
      // console.log("DATASIZXE", abc.join("*"));
      obj.code = cusCode.join("*");
      const cusParams = cusData.map((item) => item.parameters);
      obj.parameters = cusParams.join("*");
      obj.isCustom = 1;
      submitAddCategory(obj);
    }
  };

  //CALL ADD CATEGORY API

  const submitAddCategory = async (reqData) => {
    const sizeId = props?.sizeId;

    let obj = reqData;
    obj._id = +sizeId;
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

  //HANDLE REMOVE DATA FOR CUSTOM SIZE
  const handleRemoveClick = (index) => {
    const list = [...cusData];
    // console.log("LISTTT", list);
    list.splice(index + 1, 1);
    setCusData(list);
    setCusSubmitData(list);
  };

  return (
    <>
      {loading == true ? (
        <CircularProgress size={50} />
      ) : (
        // <Box
        //   display={"flex"}
        //   justifyContent={"center"}
        //   alignItems={"center"}
        //   width={"100vw"}
        //   height={"calc(100vh - 200px)"}
        // >
        //   <CircularProgress size={50} />
        // </Box>
        <>
          {formData.is_custom == 0 ? (
            <>
              {" "}
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%" }}
              >
                <Input
                  label="Size"
                  placeholder={"Size"}
                  margin="normal"
                  variant="outlined"
                  name="h"
                  InputProps={{
                    classes: {
                      underline: classes.InputUnderline,
                      input: classes.Input,
                    },
                  }}
                  // readOnly={true}
                  disabled={true}
                  value={formData?.parameters}
                  // onChange={(e) => handleInputChange(e, i)}
                  // value={formData.order_in_app}
                  fullWidth
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
              </FormControl>
              {/* Show the input Field Depend on Select Size */}
              <div className="sizeDiv"></div>
              {showData.length > 0 &&
                showData.map((item, i) => (
                  <>
                    {" "}
                    {Object.keys(item).map((val) => {
                      console.log("val", val, "item", item);
                      return (
                        <>
                          <FormControl
                            variant="outlined"
                            className={classes.formControl}
                            style={{ width: "100%" }}
                          >
                            <Input
                              label={`${val}`}
                              placeholder={`${val}`}
                              margin="normal"
                              variant="outlined"
                              name={`${val}`}
                              InputProps={{
                                classes: {
                                  underline: classes.InputUnderline,
                                  input: classes.Input,
                                },
                              }}
                              value={[item[val]]}
                              onChange={(e) => handleChange(e, i, item)}
                              // value={sizeData && sizeData[item]}
                              // onChange={(e) => handleInputChange(e, i)}
                              // value={formData.order_in_app}
                              fullWidth
                              inputProps={{
                                style: { textTransform: "uppercase" },
                              }}
                            />
                            {showData[i][val] == "" ? (
                              <>
                                {errorField === `${val}` && (
                                  <ErrorMessage error={error} />
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </FormControl>
                        </>
                      );
                    })}
                  </>
                ))}
            </>
          ) : (
            ""
          )}
          {formData.is_custom == 1 ? (
            <>
              {cusData.length > 0 &&
                cusData.map((item, i) => (
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
                            onChange={(e) => handleCusDataChange(e, i)}
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
                          {cusData[i].parameters == "" ? (
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
                            name="code"
                            onChange={(e) => handleCusDataChange(e, i)}
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
                          {cusData[i].code == "" ? (
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
                        {/* {console.log("LASTINDEX", cusData.length, "INDEX", i + 1)} */}
                        {cusData.length - 1 == i ? (
                          <Button
                            onClick={() => handleAddCusClick(i + 1)}
                            disabled={
                              !item.code ||
                              !item.parameters ||
                              item.code == "" ||
                              item.parameters == "" ||
                              Object.keys(item).length == 0
                                ? true
                                : false
                            }
                          >
                            Add
                          </Button>
                        ) : (
                          <Button onClick={() => handleRemoveClick(i)}>
                            Remove
                          </Button>
                        )}

                        {/* <Button onClick={() => handleRemoveClick(i)}>Remove</Button> */}
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

export default withRouter(UpdateSize);
