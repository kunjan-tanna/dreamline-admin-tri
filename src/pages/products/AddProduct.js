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
import { PeopleAlt as PeopleAltIcon, WidgetsSharp } from "@material-ui/icons";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { lighten } from "@material-ui/core/styles";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import profile from "../../static/images/default.png";

// import Input from "@material-ui/core/Input";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const useToolbarStyles = makeStyles((theme) => ({
  title: {
    flex: "1 1 100%",
  },
}));

function AddProduct(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [checkEnd, setChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [selColorBox, setSelColorBox] = useState(false);
  const [accessories, setAccessoriesValue] = useState(false);
  const [modification, setModificationValue] = useState(false);
  const [disBtn, setDisBtn] = useState(false);
  const [sizeValue, setSizeValue] = useState(false);
  const [noSizeValue, setNoSizeVal] = useState(false);

  const [personName, setPersonName] = useState({});
  const [genCodeForm, setGenCodeForm] = useState({});
  const [subStyleBundleId, setSubStyleBundleId] = useState([]);
  const [styleBundleList, setstyleBundleList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [styleBundle, setStyleBundle] = useState([]);
  const [subTypeBundle, setSubTypeBundle] = useState([]);
  const [extraType, setExtraType] = useState(null);
  const [sizeData, setSizeData] = useState({});
  const [nextData, setNextData] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [sizeList, setsizeList] = useState([]);
  const [colorList, setColorlist] = useState(undefined);
  const [extraTypeList, setExtraTypeList] = useState(undefined);
  const [noSize, setNoSize] = useState(false);

  const history = useHistory();

  //Open the add sub type modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };
  useEffect(() => {
    getSize();
    getCategories();
    const sizeData = [...listItem];

    // const joinSize = sizeData.map((item, index) => {
    //   const abc = Object.keys(item);

    //   if (abc.includes("WIDTH") || abc.includes("HEIGHT")) {
    //     console.log("ABC", abc);
    //   }
    // });
    // list.sort(function(a, b) {
    //   return a.WIDTH - b.WIDTH || a.HEIGHT - b.HEIGHT;
    // });

    // joinSize.sort(aa);

    let bool = {
      data: false,
    };
    listItem.map((item, index) => {
      Object.values(item).map((value) => {
        if (value !== "") {
          setDisBtn(false);
        } else {
          bool.data = true;
        }

        if (bool.data == true) {
          setDisBtn(true);
        }
      });

      // console.log("ITEMMDFDF", aa, "INDEX", aa[index]);
    });
  }, [error, personName, listItem, sizeData]);
  //GET CATEGORY LIST
  const getCategories = async () => {
    const reqBody = {
      type: "forSelect",
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/category/get",

      reqBody
    );

    if (res.data.status == true) {
      setCategories(res.data?.data);
      //   if (res.data?.data.length > 0) {
      //     setCategories(res.data?.data);
      //   }
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  //GET SIZE LIST
  const getSize = async () => {
    const reqBody = {
      adminSelectList: 2,
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/size/list",

      reqBody
    );

    if (res.data.status == true) {
      setsizeList(res.data.data?.size);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };

  //GET THE SUBTYPESTYLEBUNDLE API
  const getSubTypeStyleBundle = async (itemData) => {
    console.log("IDD", formData);
    if (Object.keys(personName).length > 0) {
      setPersonName({});
    }

    const exType = itemData?.extra_type;
    setExtraType(exType);

    const reqParms = {
      category_id: itemData._id,
    };

    let res = await apiCall(
      "GET",
      "",
      "/admin/subtype_stylebundles/listbycategory",
      {},
      {},
      reqParms
    );

    if (res.data.status == true) {
      console.log("stylee", res.data?.data, "sizeValue", sizeValue);
      setStyleBundle(res.data?.data);
      if (res.data?.data.length > 0) {
        setDisBtn(true);
        setSizeValue(true);
        setNoSizeVal(true);
      } else {
        setDisBtn(false);
        setSizeValue(false);
        setNoSizeVal(false);
      }
    } else if (res.data.status == false) {
      displayLog(2, res.data.message);
      let reqData = {
        name: formData ? formData?.product_name : undefined,
        total_style_bundle: 0,
        substyle_bundles: [],
        size_id: formData?.size_type ? formData?.size_type : 0,
      };
      if (reqData.name == undefined) {
        // console.log("CHECK MISS FIELD");
        // displayLog(2, "Please Enter Product Name");
        setError("Please Enter Product Name");
        setErrorField("product_name");
      } else {
        let str = reqData.name;
        let matches = str.match(/\b(\w)/g);
        let acronym = matches.join("");
        reqData.name = acronym;
        console.log("IDD", reqData);
        let response = await apiCall(
          "POST",
          "",
          "/admin/product/create-product-code",

          reqData
        );

        if (response.data.status == true) {
          console.log("PRODUCT_CODE", response.data?.data);
          setFormData({
            ...formData,
            ["category"]: itemData._id,
            ["product_code"]: response.data?.data?.code,
            ["sizeCode"]: response.data?.data?.sizeCode,
          });
        } else if (response.data.status == false) {
          displayLog(0, response.data.message);

          // setStyleBundle([]);
        }
      }

      // handleGenCode(reqData);
      setStyleBundle([]);
    }
  };

  //HANDLE THE ONCHANGE DATA
  const handleChange = (e) => {
    const { name, value } = e.target;

    let obj = formData;

    console.log("EVENT", noSize);
    if (name == "product_name") {
      let str = value;
      let matches = str.match(/\b(\w)/g);
      let acronym = matches.join("");
      obj.product_initial = acronym;
      obj.size_type = "";

      obj[name] = value;

      // obj.category = "";
      // setNoSize(noSize == true && false);
      // setStyleBundle([]);
      // setPersonName({});
    }
    setFormData({
      ...obj,
      [name]: value,
    });
    setError("");
  };
  //HANDLE CHANGE PRODUCT
  const handleChangeProduct = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log("EVENT", e, "name", value);

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
  };

  //HANDLE THE CHANGE SIZE
  const handleChangeSize = (itemData) => {
    console.log("dd", itemData, formData);
    let arrData = [];
    // setDisBtn(true);
    if (itemData.parameters.includes("*")) {
      const splitParms = itemData.parameters.split("*");
      let arr = [];

      splitParms.map((item, i) => {
        if (item.includes(" ")) {
          arr.push(item.replace(/ /g, ""));
        } else {
          arr.push(item);
        }
      });
      console.log("arr====", arr);
      setNextData([...arr]);
    } else {
      setNextData([itemData.parameters]);
    }
    //HANDLE THE GENERATE THE CODE
    const personData = personName;
    Object.values(personData).map((item, val) => {
      item.map((itemData1, valData) => {
        arrData.push(itemData1);
      });
    });
    console.log("personData", personData);
    setSubStyleBundleId([...arrData]);

    let obj = {
      total_style_bundle: styleBundle.length,
      size_id: itemData?._id,
    };

    if (Object.keys(personData).length > 0) {
      obj.substyle_bundles = arrData;
    }

    console.log("OBJJJJ", obj);
    setGenCodeForm(obj);
    handleGenCode(obj);
  };
  useEffect(() => {
    // console.log("LISTITEMMM", formData);
  }, [formData]);
  //GENERATE THE PRODUCT CODE
  const handleGenCode = async (objData) => {
    console.log("OBJJJ", objData);
    let reqData = {
      total_style_bundle: objData.total_style_bundle,
      substyle_bundles: objData.substyle_bundles
        ? objData.substyle_bundles
        : [],
      size_id: objData.size_id,
    };
    console.log("reqData", reqData);
    let res = await apiCall(
      "POST",
      "",
      "/admin/product/create-product-code",

      reqData
    );

    if (res.data.status == true) {
      console.log("PRODUCT_CODE", res.data?.data);
      setFormData({
        ...formData,
        ["size_type"]: objData.size_id,

        ["product_code"]: res.data?.data?.code,
        ["sizeCode"]: res.data?.data?.sizeCode,
      });
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);

      // setStyleBundle([]);
    }
  };
  //HANDLE THE CHANGE OR CHECKED
  const handleCheckNoSize = (e) => {
    console.log("e.target.checked", genCodeForm);
    let arrData = [];
    const personData = personName;
    Object.values(personData).map((item, val) => {
      item.map((itemData1, valData) => {
        arrData.push(itemData1);
      });
    });
    console.log("personData", personData);
    let obj = {
      total_style_bundle: styleBundle.length,
      size_id: 0,
    };

    if (Object.keys(personData).length > 0) {
      obj.substyle_bundles = arrData;
    }

    console.log("OBJJJJ", obj);
    setNoSize(e.target.checked);
    setFormData({
      ...formData,
      ["no_size"]: e.target.checked == true ? 1 : 0,
      ["size_type"]: e.target.checked !== true ? formData.size_type : "",
    });
    if (e.target.checked == true) {
      setNextData([]);
      setListItem([]);
      setDisBtn(false);

      handleGenCode(obj);
    }
  };
  //HANDLE THE SIZE
  const handleInputChange = (event, i) => {
    const { name, value } = event.target;
    console.log(name, value);

    setSizeData({
      ...sizeData,
      [name]: value,
    });
    setError("");
  };
  //HANDLE THE ADD CLICK BUTTON IN SIZE ARRAY
  const handleAddClick = () => {
    // const abc = nextData.map((item, index) => item);
    // console.log("ABCC", abc);
    let list = [...listItem];
    let arr = [];
    list.push(sizeData);
    // list.map((item, index) => {
    //   Object.keys(item).map((value, i) => {
    //     if (
    //       value.toUpperCase().includes("WIDTH") ||
    //       value.toUpperCase().includes("HEIGHT")
    //     ) {
    //       // console.log("DAS", value, "itemm", item[value]);
    //       nextData.sort(function(a, b) {
    //         // console.log("FLLL", a);
    //         // console.log("FLLL===", b);
    //         // return a.value.localeCompare(b.value);
    //       });
    //       // console.log("ITEMMM", value.item[value][i]);
    //       // return value.item[value][i] - value.item[value][i];
    //       // arr.push({
    //       //   [value]: item[value],
    //       // });
    //     } else {
    //       arr.push(item);
    //     }
    //   });
    // });
    // console.log("ARROROR", nextData);
    // const aa = list.sort(
    //   (a, b) => {
    //     return a;
    //   }

    //   // return a.WIDTH - b.WIDTH || a.HEIGHT - b.HEIGHT;
    // );

    // list.sort(function(a, b) {
    //   return a.WIDTH - b.WIDTH || a.HEIGHT - b.HEIGHT;
    // });
    //REMOVE DUPLICATE ARRAY OBJECT
    const obj = [
      ...new Map(list.map((item) => [JSON.stringify(item), item])).values(),
    ];
    // console.log(obj);
    // var newArray = [];
    // var newArray = list.filter(function(elem, pos) {
    //   return list.indexOf(elem) == pos;
    // });

    // console.log("LISTT SORT", list);
    setListItem(obj);
    setDisBtn(false);
    setSizeData("");
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
      console.log("true");
      // setError(`${name}!`);
      // setErrorField(`${name}`);
      // setDisBtn(true);
    } else {
      console.log("false");

      // setDisBtn(false);
    }

    listedit[index][name] = value;
    setListItem(listedit);
  };
  //HANDLE THE SELECT ALLOW STYLEBUNDLES
  const handleStyleBundle = (e, index) => {
    console.log("index", index + 1, "styleBundle", styleBundle.length);
    console.log("PERSONAMM", personName);
    const { name, value } = e.target;

    console.log("VALUEEE", value, "NAME", name);

    console.log("VALUESSSSSSSS", value);
    if (index + 1 == styleBundle.length) {
      setDisBtn(false);
      setSizeValue(false);
      setNoSizeVal(false);
    }

    setPersonName({
      ...personName,
      [name]: typeof value === "string" ? value.split(",") : value,
    });
    setError("");
  };
  //HANDLE THE handleColorBox
  const handleColorBox = (e) => {
    console.log("FORMDAA", formData);
    const {
      target: { value },
    } = e;
    setColorlist(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    console.log("NAMEEEE", colorList);

    // const { name, value } = e.target;
    // console.log("NAME", name, "value", value);

    // setColorlist({
    //   ...colorList,
    //   [name]: typeof value === "string" ? value.split(",") : value,
    // });
    setError("");
  };
  //HANDLE THE EXTRA TYPE
  const handleExtraType = (e) => {
    const {
      target: { value },
    } = e;
    setExtraTypeList(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    // const { name, value } = e.target;
    // console.log("NAME", name, "value", value);

    // setColorlist({
    //   ...colorList,
    //   [name]: typeof value === "string" ? value.split(",") : value,
    // });
    setError("");
  };

  //HANDLE THE IMAGE
  const handleImage = async (e) => {
    displayLog(2, "Please wait for upload image");
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

      setError("");
    } else {
      displayLog(0, res.data.message);
    }
  };

  //HANDLE THE SUBMIT BUTTON
  const handleSubmit = () => {
    let obj = {
      // color: selColorBox == true ? colorList : "",
      category: formData.category,

      product_code: formData.product_code,
      product_name: formData.product_name,
      // image: formData.image ? formData.image : "",
      status: formData.status,
    };

    if (noSize == false) {
      obj.size_type = formData.size_type;
    }
    if (selColorBox == true) {
      obj.color = colorList;
    }

    if (extraType == 1) {
      obj.extra_type = extraTypeList;
    }

    validateFormData(obj);
  };
  //VALIDATE THE FORMDATA
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      color: selColorBox == true ? joi.required() : "",
      product_name: joi
        .string()
        .trim()
        .required(),
      category: joi
        .string()
        .trim()
        .required(),

      status: joi.required(),

      size_type:
        noSize == false
          ? joi
              .string()
              .trim()
              .required()
          : "",
      extra_type: extraType == 1 ? joi.required() : "",

      product_code: joi
        .string()
        .trim()
        .required(),

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
        setError("");
        setErrorField("");
        const sizeData = [...listItem];

        const joinSize = sizeData.map((item, index) =>
          Object.values(item).join("*")
        );

        let reqData = {
          style_bundle: personName ? [personName] : [],
          extra_type: body.extra_type ? body.extra_type : [],
          color: body.color ? body.color : [],
          category: body.category,
          image: formData.image ? formData.image : "",
          product_code: body.product_code.toUpperCase().replace(/ /g, ""),
          product_name: body.product_name,
          product_initial: formData.product_initial
            .toUpperCase()
            .replace(/ /g, ""),

          status: body.status,
          size: joinSize,
        };
        if (noSize == false) {
          reqData.size_type = body.size_type;
          if (formData.iscustomsize == 1) {
            reqData.iscustomsize = formData.iscustomsize;
          }
          if (formData.iscustomsizexl == 1) {
            reqData.iscustomsizexl = formData.iscustomsizexl;
          }
        }

        if (noSize == true) {
          reqData.no_size = noSize == true ? 1 : 0;
        }
        if (formData.require_qty) {
          reqData.require_qty = formData.require_qty;
        }
        console.log("FINAL DATA", reqData);
        if (
          reqData.size.length > 0 ||
          reqData.iscustomsize ||
          reqData.iscustomsizexl ||
          reqData.no_size
        ) {
          submitAddProduct(reqData);
        } else {
          displayLog(
            0,
            "Please enter at least one size value or select Custom size or CustomXL size option"
          );
        }
      }
    });
  };
  //CALL ADD CATEGORY API
  const submitAddProduct = async (reqData) => {
    console.log("FINALLL", reqData);
    let res = await apiCall("POST", "", "/admin/product/add-product", reqData);
    console.log("ADD RESPONSE", res);
    if (res.data.status == true) {
      setTimeout(() => {
        history.push("/app/products");
        props.ToggleInputModal(false);
        props.getProducts();
        // window.location.reload();
      }, 1000);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  const handleOnClose = (e) => {
    console.log("FORMDATA", formData);
    if (Object.keys(personName).length == styleBundle.length) {
      console.log("PERAONEMM", personName);
      let arrData = [];
      Object.values(personName).map((item, val) => {
        item.map((itemData1, valData) => {
          arrData.push(itemData1);
        });
      });
      let reqData = {
        total_style_bundle: styleBundle.length,
        substyle_bundles: arrData ? arrData : [],
        size_id: formData?.size_type ? formData?.size_type : 0,
      };
      console.log("REQDATA", reqData);
      setGenCodeForm(reqData);
      handleGenCode(reqData);
    }
  };
  return (
    <>
      {/* PRODUCT NAME */}
      <Input
        label="Product Name"
        placeholder={"Product Name"}
        margin="normal"
        variant="outlined"
        name="product_name"
        onChange={(e) => handleChange(e)}
        // onChange={(e) =>
        //   setFormValues({
        //     ...formValues,
        //     product_name: e.target.value.replace(/^\s+/, ""),
        //   })
        // }
        // onBlur={(e) => handleFocusOut(e)}
        InputProps={{
          classes: {
            underline: classes.InputUnderline,
            input: classes.Input,
          },
        }}
        // value={formValues.product_name}
        fullWidth
      />
      {errorField === "product_name" && <ErrorMessage error={error} />}
      {/* SELECT THE CATEGORY */}
      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "16px" }}
      >
        <InputLabel id="demo-simple-select-outlined-label">
          Select Category
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Select Category"
          onChange={(e) => handleChange(e)}
          name="category"
          // onBlur={(e) => handleFocusOut(e)}
          value={formData.category ? formData.category : ""}
          // onChange={(e) =>
          //   setFormValues({ ...formValues, status: e.target.value })
          // }
        >
          {/* <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Deactivated</MenuItem> */}
          {categories &&
            categories.map((item, index) => {
              return (
                <MenuItem
                  value={item._id}
                  onClick={() => getSubTypeStyleBundle(item)}
                >
                  {item.category_name}
                </MenuItem>
              );
            })}
        </Select>
        {errorField === "category" && <ErrorMessage error={error} />}
      </FormControl>

      {/* Allow Color Box */}
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
                checked={selColorBox == true ? true : false}
                onChange={(e) => setSelColorBox(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="Allow ColorBox"
          />
        </Grid>
        {selColorBox == true ? (
          <>
            <Grid item md={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%", marginTop: "16px" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Color
                </InputLabel>

                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  label="Select Color"
                  onChange={(e) => handleColorBox(e)}
                  multiple
                  name="color"
                  value={colorList || []}

                  // value={formValues.status}
                  // onChange={(e) =>
                  //   setFormValues({ ...formValues, status: e.target.value })
                  // }
                >
                  <MenuItem value={"#000000"}>Black</MenuItem>
                  <MenuItem value={"#FFFFFF"}>White</MenuItem>
                  <MenuItem value={"#0066FA"}>Blue</MenuItem>
                  <MenuItem value={"#2CBF6D"}>Green</MenuItem>
                  <MenuItem value={"#EFC663"}>Yellow</MenuItem>
                  <MenuItem value={"#E16070"}>Red</MenuItem>
                  <MenuItem value={"#9677DF"}>Purple</MenuItem>
                  <MenuItem value={"#FFA500"}>Orange</MenuItem>
                  <MenuItem value={"#FFC0CB"}>Pink</MenuItem>
                </Select>
                {errorField === "color" && <ErrorMessage error={error} />}
              </FormControl>
            </Grid>{" "}
          </>
        ) : null}
      </Grid>
      {/* SELECT THE STATUS */}
      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "16px" }}
      >
        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Status"
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

      {/* ONCE CATEGORY SEL AND IF STYLE BUNDLE ALLOW THEN SHOW THIS BELOW BOX WITH SUBTYPE */}
      {styleBundle.length > 0 && (
        <>
          {styleBundle.map((item, index) => (
            <>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%", marginTop: "16px" }}
                key={index}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  {item.style_bundle}
                </InputLabel>

                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  label={item.style_bundle}
                  onChange={(e) => handleStyleBundle(e, index)}
                  multiple
                  // name="color"
                  value={personName[item.style_bundle_id] || []}
                  name={item.style_bundle_id}
                  onClose={(e) => handleOnClose(e)}
                  // value={formValues.status}
                  // onChange={(e) =>
                  //   setFormValues({ ...formValues, status: e.target.value })
                  // }
                >
                  {item.sub_style_bundle_array &&
                    item.sub_style_bundle_array.map((item, index) => {
                      return (
                        <MenuItem value={item.sub_type_id}>
                          {item.sub_type_name}
                        </MenuItem>
                      );
                    })}
                </Select>
                {errorField === "style_bundle" && (
                  <ErrorMessage error={error} />
                )}
              </FormControl>
            </>
          ))}
        </>
      )}

      {/* SELCT THE SIZE TYPE  */}
      <Grid container spacing={2} style={{ marginTop: "8px" }}>
        {noSize == false ? (
          <>
            {" "}
            <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Size Type
                </InputLabel>

                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Size Type"
                  onChange={(e) => handleChange(e)}
                  name="size_type"
                  disabled={sizeValue == true ? true : false}
                  value={formData.size_type ? formData.size_type : ""}
                  // onChange={(e) =>
                  //   setFormValues({ ...formValues, status: e.target.value })
                  // }
                >
                  {sizeList &&
                    sizeList.map((item, index) => {
                      return (
                        <MenuItem
                          value={item._id}
                          onClick={() => handleChangeSize(item)}
                        >
                          {item.parameters}
                        </MenuItem>
                      );
                    })}
                </Select>
                {errorField === "size_type" && <ErrorMessage error={error} />}
              </FormControl>{" "}
            </Grid>{" "}
          </>
        ) : null}

        {/* BASEC ON CATEGORY IF IS ALLOW THE EXTRA TYPE THEN SHOW THIS BOX */}
        {extraType == 1 && (
          <>
            <Grid item md={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Extra Type
                </InputLabel>

                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Extra Type"
                  onChange={(e) => handleExtraType(e)}
                  name="extra_type"
                  multiple
                  value={extraTypeList || []}
                  // onChange={(e) =>
                  //   setFormValues({ ...formValues, status: e.target.value })
                  // }
                >
                  <MenuItem value={1}>Left</MenuItem>
                  <MenuItem value={2}>Right</MenuItem>
                  <MenuItem value={3}>Pair</MenuItem>
                </Select>
                {errorField === "extra_type" && <ErrorMessage error={error} />}
              </FormControl>{" "}
            </Grid>
          </>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%" }}
          >
            <Input
              id="outlined-number"
              label="Product Initals"
              placeholder={"Product Initals"}
              margin="normal"
              variant="outlined"
              name="product_initial"
              // onChange={(e) => handleChange(e)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  product_initial: e.target.value,
                })
              }
              value={formData.product_initial ? formData.product_initial : ""}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              type="text"
            ></Input>

            {errorField === "product_initial" && <ErrorMessage error={error} />}
          </FormControl>
        </Grid>{" "}
      </Grid>

      {/* PRODUCT CODE */}
      <Input
        label="Product Code"
        placeholder={"Product Code"}
        margin="normal"
        variant="outlined"
        name="product_code"
        // value={formData.product_code ? formData.product_code : ""}
        value={formData.product_code ? formData.product_code : ""}
        onChange={(e) => handleChangeProduct(e)}
        // onChange={(e) =>
        //   setFormData({
        //     ...formData,
        //     product_code: e.target.value.toUpperCase(),
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
        // value={formValues.product_name}
        fullWidth
      />
      {errorField === "product_code" && <ErrorMessage error={error} />}

      {/* BASED ON SIZE SHOW THE POSSIBLE COMBINATION ADD LIKE WIDTH * HEIGHT VALUE */}
      <div style={{ width: "100%", display: "inline-block" }}>
        {nextData.length > 0 && (
          <>
            {nextData.map((item, i) => (
              <>
                <div
                  className={"sizeDivField"}
                  key={i}
                  style={{ marginRight: "10px", display: "inline-block" }}
                >
                  <div>
                    <Box width={100}>
                      <Input
                        name={`${item}`}
                        margin="normal"
                        className={classes.inputNumber}
                        min="1"
                        step="1"
                        placeholder={`${item}`}
                        variant="outlined"
                        type="number"
                        value={sizeData && sizeData[item]}
                        onChange={(e) => handleInputChange(e, i)}
                        required
                      />
                    </Box>
                  </div>
                </div>
              </>
            ))}{" "}
          </>
        )}
        {noSize == false ? (
          <>
            {" "}
            <div
              className={"sizeDivField"}
              style={{ float: "right", marginRight: "30px" }}
            >
              <div>
                <Box width={100}>
                  <Input
                    name="sizeCode"
                    margin="normal"
                    className={classes.inputNumber}
                    label={"Size Code"}
                    disabled
                    placeholder={"Size Code"}
                    variant="outlined"
                    value={formData.sizeCode ? formData.sizeCode : ""}
                    // onChange={(e) => handleInputChange(e, i)}
                  />
                </Box>
              </div>
            </div>{" "}
          </>
        ) : (
          ""
        )}

        {nextData.length > 0 && (
          <div>
            {" "}
            <Button
              onClick={() => handleAddClick()}
              disabled={
                Object.keys(sizeData).length !== nextData.length ? true : false
              }
            >
              Add
            </Button>
          </div>
        )}
      </div>
      {/* FOR ADDING THE NEW SIZE ARRAY */}
      <div>
        {listItem.length > 0 &&
          listItem.map((item, i) => {
            return (
              <>
                <div
                  style={{
                    marginBottom: "5px",
                  }}
                >
                  {Object.keys(item).map((val) => {
                    return (
                      <>
                        <>
                          <div
                            className={"sizeDivField"}
                            key={i}
                            style={{
                              marginRight: "10px",
                              display: "inline-block",
                            }}
                          >
                            <div>
                              <Box width={100}>
                                <Input
                                  name={`${val}`}
                                  margin="normal"
                                  className={classes.inputNumber}
                                  min="1"
                                  step="1"
                                  placeholder={`${val}`}
                                  variant="outlined"
                                  type="number"
                                  value={[item[val]]}
                                  onChange={(e) => handlelistData(e, i)}
                                  required
                                />
                              </Box>
                            </div>
                          </div>
                        </>
                        <>
                          {/* {listItem[i][val] == "" ? (
                            <>
                              {errorField === `${val}` && (
                                <ErrorMessage error={error} />
                              )}
                            </>
                          ) : (
                            ""
                          )}{" "} */}
                        </>
                      </>
                    );
                  })}

                  <div>
                    <Button onClick={() => handleRemoveClick(i)}>Remove</Button>
                  </div>
                </div>
              </>
            );
          })}
      </div>
      {/* CHECKED THE CUSTOM SIZE BOX */}
      <Grid container spacing={3}>
        {noSize == false && (
          <>
            <Grid item md={4} style={{ display: "flex", alignItems: "center" }}>
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
                    checked={formData.iscustomsize == true ? true : false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iscustomsize: e.target.checked == true ? 1 : 0,
                      })
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Allow Custom Size"
              />
            </Grid>
            {/* CHECKED THE CUSTOM SIZE  XL BOX */}
            <Grid item md={4}>
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
                    checked={formData.iscustomsizexl == true ? true : false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iscustomsizexl: e.target.checked == true ? 1 : 0,
                      })
                    }
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Allow Custom XL size"
              />
            </Grid>
          </>
        )}

        {/* CHECKED NO SIZE BOX */}
        <Grid item md={3}>
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
                checked={noSize == true ? true : false}
                onChange={(e) => handleCheckNoSize(e)}
                name="checkedB"
                disabled={noSizeValue == true ? true : false}
                color="primary"
              />
            }
            label="No Size"
          />
        </Grid>
      </Grid>
      {/* CHECKED THE Is Product required Qty. */}
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
                checked={formData.require_qty == true ? true : false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    require_qty: e.target.checked == true ? 1 : 0,
                  })
                }
                // name="checkedB"
                color="primary"
              />
            }
            label="Is product required Qty..?"
          />
          {errorField === "require_qty" && <ErrorMessage error={error} />}
        </Grid>
      </Grid>
      {/* SELECT THE IMAGE */}
      <InputLabel
        id="demo-simple-select-outlined-label"
        style={{ marginTop: "16px", float: "left", marginRight: "5px" }}
      >
        Image
      </InputLabel>
      <input
        style={{ marginTop: "16px", marginLeft: "5px", float: "none" }}
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

export default withRouter(AddProduct);
