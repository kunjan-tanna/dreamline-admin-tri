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
import { PeopleAlt as PeopleAltIcon, WidgetsSharp } from "@material-ui/icons";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { lighten } from "@material-ui/core/styles";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// import Input from "@material-ui/core/Input";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import profile from "../../static/images/default.png";

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

const useToolbarStyles = makeStyles((theme) => ({
  title: {
    flex: "1 1 100%",
  },
}));

function UpdateProduct(props) {
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
  const [loading, setLoading] = useState(false);

  const [exType, setExTypeValue] = useState(false);

  const [personName, setPersonName] = useState({});
  const [genCodeForm, setGenCodeForm] = useState({});
  const [subStyleBundleId, setSubStyleBundleId] = useState([]);
  const [sizeValue, setSizeValue] = useState(false);
  const [noSizeValue, setNoSizeVal] = useState(false);
  const [styleBundleList, setstyleBundleList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [styleBundle, setStyleBundle] = useState([]);
  const [subTypeBundle, setSubTypeBundle] = useState([]);
  const [extraType, setExtraType] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
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
    setLoading(true);

    getSize();
    getCategories();
    getProductDetails();
  }, []);
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
    console.log("check ", res);

    if (res.data.status == true) {
      setsizeList(res.data.data?.size);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  //GET PRODUCT Details
  const getProductDetails = async () => {
    const reqBody = {
      product_id: props.productId,
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/product/product-by-id",

      reqBody
    );

    if (res.data.status == true) {
      setLoading(false);
      let obj = {
        product_name: res.data?.data?.product_name,
        product_initial: res.data?.data?.product_initial,
        category: res.data.data?.categories,
        product_code: res.data.data?.product_code,
        image: res.data?.data?.image,
        iscustomsize: res.data?.data?.iscustomsize,
        iscustomsizexl: res.data?.data?.iscustomsizexl,
        no_size: res.data?.data?.no_size,
        require_qty: res.data?.data?.require_qty,
        sizeCode: res.data?.data?.size_code,
        status: res.data?.data?.status,
      };
      let genFormCode = {
        name: res.data?.data?.product_name,
      };
      if (obj.no_size !== 1) {
        obj.size_type = res.data?.data?.size_type;
        genFormCode.size_id = res.data?.data?.size_type;
      }

      console.log("PRODTDETAIII", res.data?.data);
      //SET THE FORMDATA
      setFormData(obj);
      // if (obj.size_type == 0) {
      //   console.log("NO SIZE");
      //   setFormData({
      //     ...formData,
      //     size_type: "",
      //   });
      // }

      //SET THE COLOR LIST
      if (res.data?.data?.color.length > 0) {
        setSelColorBox(true);
        setDisBtn(false);
        setColorlist(res.data?.data?.color);
      } else if (selColorBox == true) {
        setDisBtn(true);
      }
      //SET THE EXTRA LIST
      if (res.data?.data?.extra_type.length > 0) {
        console.log("HELLO");
        setExtraType(1);
        setExtraTypeList(res.data?.data?.extra_type);
      }
      //SET THE STYLE BUNDLE LIST
      if (res.data?.data?.style_bundle.length > 0) {
        const reqParms = {
          category_id: +obj.category,
        };

        let response = await apiCall(
          "GET",
          "",
          "/admin/subtype_stylebundles/listbycategory",
          {},
          {},
          reqParms
        );

        if (response.data.status == true) {
          console.log("stylee", response.data?.data);
          genFormCode.total_style_bundle = response.data?.data.length;

          let arr = [];
          let ObjVal = [];
          let Objkey = [];
          let arrData = [];
          const styleBundleData = res.data?.data?.style_bundle[0];
          console.log("styleBundleData", styleBundleData);
          if (Object.keys(styleBundleData).length > 0) {
            Object.values(styleBundleData).map((item, val) => {
              item.map((itemData1, valData) => {
                arrData.push(itemData1);
              });
            });
            genFormCode.substyle_bundles = arrData;

            setPersonName(styleBundleData);

            const abc = res.data?.data?.style_bundle.map((item) => {
              // setPersonName(item);
              Objkey = Object.keys(item);
              ObjVal = Object.values(item).toString();
              const abc1 = ObjVal.split(",");
              console.log("arr", item);

              Object.keys(item).map((val) => {
                ObjVal = [...item[val]];
                console.log("OBVJJJJ", ObjVal);
                arr.push({
                  style_bundle_id: val,
                  sub_style_bundle_array: item[val],
                });
              });
            });
            console.log("arr=====", arr);
            setSubTypeBundle([...arr]);
            setStyleBundle(response.data?.data);
            console.log("RESPONSESTYLEE", res.data?.data);
            // if (res.data?.data.length > 0) {
            //   setDisBtn(true);
            // } else {
            //   setDisBtn(false);
            // }
          } else {
          }
        } else if (res.data.status == false) {
          displayLog(2, res.data.message);

          setStyleBundle([]);
        }
      }
      //SET THE SIZES
      if (res.data?.data?.size.length > 0 && obj.no_size == 0) {
        const reqBody = {
          adminSelectList: 2,
        };

        let response = await apiCall(
          "POST",
          "",
          "/admin/size/list",

          reqBody
        );

        if (response.data.status == true) {
          let arr = [];
          let arrData = [];
          var result = response.data.data?.size.map(function(o1) {
            if (o1._id == obj.size_type) {
              // console.log("ITEMMM", o1.parameters);
              if (o1.parameters && o1.parameters.includes("*")) {
                const splitParms = o1.parameters && o1.parameters.split("*");
                // const splitCode = res.data?.data?.size.split("*");
                const joinSize = res.data?.data?.size.map((item, indexDta) =>
                  item.split("*")
                );

                //STE THE KEYS WO PUSH THE DATA
                splitParms.map((item, i) => {
                  if (item.includes(" ")) {
                    arrData.push(item.replace(/ /g, ""));
                  } else {
                    arrData.push(item);
                  }
                });

                setNextData([...arrData]);
                //LISTITEM FOR KEY & VALUE PAIR
                joinSize.map((item) => {
                  let obj = {};
                  splitParms.map((parms, index) => {
                    obj[parms] = item[index];
                  });
                  arr.push(obj);
                });

                //REMOVE DUPLICATE ARRAY OBJECT
                const obj = [
                  ...new Map(
                    arr.map((item) => [JSON.stringify(item), item])
                  ).values(),
                ];
                setListItem([...obj]);
              } else {
                console.log("joinSize", res.data?.data?.size);
                const splitParms = o1.parameters && o1.parameters.split("*");
                console.log("splitParms", splitParms);
                const abc = res.data?.data?.size;
                abc.map((item) => {
                  let obj = {};
                  splitParms.map((parms, index) => {
                    obj[parms] = item;
                  });
                  arr.push(obj);
                });
                console.log("ARRR", arr);
                setNextData([o1.parameters]);
                setListItem([...arr]);

                console.log("NO SPLIT");
              }
            }
          });
        }
      }
      setGenCodeForm(genFormCode);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };

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

  // useEffect(() => {
  //   console.log("extraTypeList", extraTypeList);

  //   console.log("extraType=====", extraType);
  // }, [extraTypeList, sizeData]);
  useEffect(() => {
    console.log("LISTITEMMM", listItem);

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
  }, [personName, sizeData, listItem]);
  //GET THE SUBTYPESTYLEBUNDLE API
  const getSubTypeStyleBundle = async (itemData) => {
    console.log("IDD", formData);
    let obj = formData;

    // if (formData.no_size !== 1) {
    //   obj.size_type = "";
    //   setFormData(obj);
    // }
    setExtraTypeList([]);

    setPersonName({});
    // setListItem([]);
    // setNextData([]);
    // setExtraType(null);

    let arr = [];

    const exType = itemData?.extra_type;
    setExtraType(exType);
    setCategoryId(itemData._id);
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
      console.log("stylee", res.data?.data);
      // console.log("subTypeBundle", subTypeBundle);
      // var result = subTypeBundle.filter(function(o1) {
      //   console.log("MAIN", o1);
      //   return res.data?.data.some(function(o2) {
      //     console.log("SOME", o2);

      //     return o1.style_bundle_id == o2.style_bundle_id; // return the ones with equal id
      //   });
      // });
      // if (result.length > 0) {
      //   console.log("GELLO");
      //   setPersonName(personName);
      // } else {
      //   setPersonName({});
      // }
      let obj1 = {};
      // setPersonName(result)
      // const abc = result.map((item) => {
      //   obj1.size = { [item.style_bundle_id]: item.sub_style_bundle_array };
      //   // arr.push({
      //   //   size: { [item.style_bundle_id]: item.sub_style_bundle_array },
      //   // });

      //   // arr.ab = { [item.style_bundle_id]: item.sub_style_bundle_array };
      //   // Object.keys(item).map((val) => {
      //   //   console.log("vall", val, "ITEMDAA", item.style_bundle_id);
      //   //   // ObjVal = [...item[val]];
      //   //   arr.push({
      //   //     [val.style_bundle_id]: item[val.sub_style_bundle_array],
      //   //   });
      //   // });
      // });
      // console.log("RESULT", result);

      // console.log("abc==", arr);
      setStyleBundle(res.data?.data);
      if (res.data?.data.length > 0) {
        setDisBtn(true);
        // setNoSizeVal(true);
        // setSizeValue(true);
      } else {
        setDisBtn(false);

        // setSizeValue(false);

        // setNoSizeVal(false);
      }
    } else if (res.data.status == false) {
      displayLog(2, res.data.message);
      let reqData = {
        name: formData ? formData?.product_name : undefined,
        total_style_bundle: 0,
        substyle_bundles: [],
        size_id: formData?.size_type ? formData?.size_type : 0,
      };
      console.log("FFFF", reqData);
      if (reqData.name == "") {
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
      // setFormData({
      //   ...formData,
      //   ["size_type"]: "",
      // });
      setStyleBundle([]);
    }
  };

  //HANDLE THE ONCHANGE DATA
  const handleChange = (e) => {
    const { name, value } = e.target;
    let objGen = genCodeForm;

    // console.log("EVENT", e, "name", name);
    // if (name == "category") {
    //   setDisBtn(true);
    // }
    // if (name == "product_name") {
    //   objGen.name = value;

    //   handleGenCode(objGen);
    //   // obj.category = "";

    //   // setStyleBundle([]);
    //   // setPersonName({});
    // }

    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };
  //HANDLE CHANGE PRODUCT
  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    // console.log("EVENT", e, "name", name);

    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };
  // useEffect(() => {
  //   console.log("pgenCodeForm", formData);
  // }, [formData]);
  //HANDLE THE CHANGE OR CHECKED
  const handleCheckNoSize = async (e) => {
    setNoSize(e.target.checked);
    console.log("e.target.checked", genCodeForm);
    let obj = genCodeForm;
    setFormData({
      ...formData,
      ["no_size"]: e.target.checked == true ? 1 : 0,
      ["size_type"]: e.target.checked !== true ? formData.size_type : "",
    });
    if (e.target.checked == true) {
      setNextData([]);
      setListItem([]);
      setDisBtn(false);
      //GENERATE THE CODE

      let reqData = {
        total_style_bundle: genCodeForm.total_style_bundle,
        substyle_bundles: genCodeForm.substyle_bundles
          ? genCodeForm.substyle_bundles
          : [],
        size_id: 0,
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
          ["size_type"]: "",
          ["product_code"]: res.data?.data?.code,
          ["sizeCode"]: res.data?.data?.sizeCode,
          ["no_size"]: 1,
        });
      } else if (res.data.status == false) {
        displayLog(0, res.data.message);
      }

      // handleGenCode(obj);

      // setFormData({
      //   ...formData,
      //   ["size_type"]: "",
      // });
    }
  };

  //HANDLE THE CHANGE SIZE
  const handleChangeSize = (itemData) => {
    console.log("dd", itemData);
    setListItem([]);
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
  //GENERATE THE PRODUCT CODE
  const handleGenCode = async (objData) => {
    console.log("HHH", objData, "NOSIZE", noSize);
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
    // if (objData.name == undefined) {
    //   // console.log("CHECK MISS FIELD");
    //   displayLog(2, "Please Enter Product Name");
    // } else {

    // }
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
  const handleAddClick = (index) => {
    let list = [...listItem];
    console.log("list", list);
    list.push(sizeData);
    //REMOVE DUPLICATE ARRAY OBJECT
    const obj = [
      ...new Map(list.map((item) => [JSON.stringify(item), item])).values(),
    ];
    // console.log("PUSHHHlist", obj);
    setListItem(obj);
    setDisBtn(false);
    setSizeData("");
  };
  //HANDLE THE REMOVE CLICK BUTTON IN SIZE ARRAY
  const handleRemoveClick = (index) => {
    const list = [...listItem];
    console.log("LISTTT", list.length, index);
    // if (list.length == 1) {
    //   setDisBtn(true);
    // } else {
    //   setDisBtn(false);
    // }

    list.splice(index, 1);

    setListItem(list);
  };
  //HANDLE THE CHANGE SIZE DATA IN ARRAY
  const handlelistData = (e, index) => {
    const { name, value } = e.target;
    const listedit = [...listItem];
    console.log("listedit", listedit);
    listedit[index][name] = value;
    setListItem(listedit);
  };
  //HANDLE THE SELECT ALLOW STYLEBUNDLES
  const handleStyleBundle = (e, personname) => {
    console.log("GENFORM", genCodeForm);
    const { name, value } = e.target;

    console.log("VALUEEE", value, "NAME", name);

    console.log("VALUESSSSSSSS", value);
    console.log(
      "index",
      value.length,
      "styleBundle",
      Object.values(personName)
    );

    if (value.length > 0) {
      setDisBtn(false);
      setSizeValue(false);
      setNoSizeVal(false);
    } else {
      setDisBtn(true);
      setSizeValue(true);
      setNoSizeVal(true);
    }

    setPersonName({
      ...personName,
      [name]: typeof value === "string" ? value.split(",") : value,
    });
    setError("");
  };
  //HANDLE GENERATE THE CODE IF NO SIZE IS ON
  const handleFocusOut = async (e) => {
    console.log(
      "personName++",
      Object.keys(personName).length,
      "ss",
      styleBundle.length
    );
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
    // if (formData.no_size == 1) {
    //   let arrData = [];
    //   Object.values(personName).map((item, val) => {
    //     item.map((itemData1, valData) => {
    //       arrData.push(itemData1);
    //     });
    //   });
    //   let str = formData.product_name;
    //   let matches = str.match(/\b(\w)/g);
    //   let acronym = matches.join("");
    //   let reqData = {
    //     name: acronym,
    //     total_style_bundle: styleBundle.length,
    //     substyle_bundles: arrData ? arrData : [],
    //     size_id: 0,
    //   };
    //   console.log("reqData", reqData);
    //   let res = await apiCall(
    //     "POST",
    //     "",
    //     "/admin/product/create-product-code",

    //     reqData
    //   );

    //   if (res.data.status == true) {
    //     console.log("PRODUCT_CODE", res.data?.data);
    //     setFormData({
    //       ...formData,

    //       ["product_code"]: res.data?.data?.code,
    //       ["sizeCode"]: res.data?.data?.sizeCode,
    //     });
    //   } else if (res.data.status == false) {
    //     displayLog(0, res.data.message);
    //   }
    // }
  };
  //HANDLE THE handleColorBox
  const handleColorBox = (e) => {
    const {
      target: { value },
    } = e;
    if (value.length == 0) {
      // setDisBtn(false);
      setColorlist(undefined);
    } else {
      setColorlist(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    }

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
    console.log("VALUEE", value);
    if (value.length == 0) {
      setExtraTypeList(undefined);
    } else {
      setExtraTypeList(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    }

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
    console.log("colorList", colorList);
    console.log("noSize", selColorBox);
    console.log("personName", personName);
    console.log("formData", formData);
    console.log("sizeList", nextData);

    // let pro_init = patternArr && patternArr[0].toString();
    let obj = {
      // color: selColorBox == true ? colorList : "",
      category: formData.category,

      product_code: formData.product_code,
      product_name: formData.product_name,

      status: formData.status,
    };

    if (formData.no_size == 0) {
      obj.size_type = formData.size_type;
    }

    if (selColorBox == true) {
      obj.color = colorList;
    }

    if (extraType == 1) {
      obj.extra_type = extraTypeList;
    }
    console.log("OBJJJ1", obj);

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
        formData.no_size == 0
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
        if (formData.no_size == 0) {
          reqData.size_type = +body.size_type;
          if (formData.iscustomsize == 1) {
            reqData.iscustomsize = formData.iscustomsize;
          }
          if (formData.iscustomsizexl == 1) {
            reqData.iscustomsizexl = formData.iscustomsizexl;
          }
        }

        if (formData.no_size == 1) {
          reqData.no_size = formData.no_size == 1 ? 1 : 0;
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
          submitUpdateProduct(reqData);
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
  const submitUpdateProduct = async (reqData) => {
    console.log("FINALLL", reqData);
    let obj = reqData;
    obj.product_id = props.productId;
    let res = await apiCall("POST", "", "/admin/product/update-product", obj);
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
  //HANDLE THE COLOR BOX CHECK
  const handleCheckColorBox = (e) => {
    console.log("CHECKED", e.target.checked);
    // if (e.target.checked == true) {
    //   setDisBtn(true);
    // }

    // if (e.target.checked == false) {
    //   setDisBtn(false);
    // }
    setSelColorBox(e.target.checked);
  };
  //ON KEY UP SET THE PRODUCT INITAL
  const handleProData = (event) => {
    let str = event.target.value;
    let matches = str.match(/\b(\w)/g);
    let acronym = matches.join("");

    setFormData({
      ...formData,
      product_initial: acronym,
    });
  };
  const handleRemoveSpace = (event) => {
    console.log("HEKKK", event);
    var key = event.keyCode;
    if (key === 32) {
      event.preventDefault();
    }
  };

  return (
    <>
      {loading == true ? (
        <CircularProgress size={50} />
      ) : (
        <>
          {/* PRODUCT NAME */}
          <Input
            label="Product Name"
            placeholder={"Product Name"}
            margin="normal"
            variant="outlined"
            name="product_name"
            onKeyUp={(e) => handleProData(e)}
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
            value={formData.product_name ? formData.product_name : ""}
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
              value={+formData.category}
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
                    onChange={(e) => handleCheckColorBox(e)}
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
            <InputLabel id="demo-simple-select-outlined-label">
              Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Status"
              onChange={(e) => handleChange(e)}
              name="status"
              value={formData?.status == 1 ? 1 : 0}
              // onChange={(e) =>ss
              //   setFormValues({ ...formValues, status: e.target.value })
              // }
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Deactivated</MenuItem>
            </Select>
            {errorField === "status" && <ErrorMessage error={error} />}
          </FormControl>

          {/* ONCE CATEGORY SEL AND IF STYLE BUNDLE ALLOW THEN SHOW THIS BELOW BOX WITH SUBTYPE */}
          {styleBundle && styleBundle.length > 0 && (
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
                      {item.style_bundle ? item.style_bundle : ""}
                    </InputLabel>

                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      label={item.style_bundle}
                      onChange={(e) => handleStyleBundle(e, personName)}
                      onClose={(e) => handleFocusOut(e)}
                      multiple
                      // name="color"
                      value={
                        item.style_bundle_id
                          ? personName[item.style_bundle_id] || []
                          : ""
                      }
                      name={item.style_bundle_id}

                      // value={formValues.status}
                      // onChange={(e) =>
                      //   setFormValues({ ...formValues, status: e.target.value })
                      // }
                    >
                      {item.sub_style_bundle_array &&
                        item.sub_style_bundle_array.map((item, index) => {
                          return (
                            <MenuItem value={item.sub_type_id}>
                              {item.sub_type_name ? item.sub_type_name : ""}
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
            {formData.no_size == 0 ? (
              <>
                {" "}
                <Grid
                  item
                  md={6}
                  style={{ display: "flex", alignItems: "center" }}
                >
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
                    {errorField === "size_type" && (
                      <ErrorMessage error={error} />
                    )}
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
                      {/* {extraTypeList.length > 0 && extraTypeList.map((item)=>{
                     <MenuItem value={item}>Left</MenuItem>
                  })} */}
                      <MenuItem value={1}>Left</MenuItem>
                      <MenuItem value={2}>Right</MenuItem>
                      <MenuItem value={3}>Pair</MenuItem>
                    </Select>
                    {errorField === "extra_type" && (
                      <ErrorMessage error={error} />
                    )}
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
                  value={
                    formData.product_initial ? formData.product_initial : ""
                  }
                  inputProps={{
                    style: { textTransform: "uppercase" },
                  }}
                  type="text"
                ></Input>

                {errorField === "product_initial" && (
                  <ErrorMessage error={error} />
                )}
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
            // onKeyDown={(e) => handleRemoveSpace(e)}
            onChange={(e) => handleChangeProduct(e)}
            // onChange={(e) =>
            //   setFormValues({
            //     ...formValues,
            //     product_name: e.target.value.replace(/^\s+/, ""),
            //   })
            // }
            inputProps={{ style: { textTransform: "uppercase" } }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={
              formData.product_code
                ? formData.product_code.replace(/\s/g, "")
                : ""
            }
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
            {formData.no_size == 0 ? (
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
                    Object.keys(sizeData).length !== nextData.length
                      ? true
                      : false
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
                        );
                      })}

                      <div>
                        {/* {listItem.length - 1 == i ? (
                      <Button
                        onClick={() => handleAddClick(i)}
                        // disabled={
                        //   Object.keys(sizeData).length !== nextData.length
                        //     ? true
                        //     : false
                        // }
                      >
                        Add
                      </Button>
                    ) : (
                      <Button onClick={() => handleRemoveClick(i)}>
                        Remove
                      </Button>
                    )} */}
                        <Button onClick={() => handleRemoveClick(i)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
          {/* CHECKED THE CUSTOM SIZE BOX */}
          <Grid container spacing={3}>
            {formData.no_size == 0 && (
              <>
                <Grid
                  item
                  md={4}
                  style={{ display: "flex", alignItems: "center" }}
                >
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
                        checked={formData.iscustomsize == 1 ? true : false}
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
                        checked={formData.iscustomsizexl == 1 ? true : false}
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
                    checked={formData.no_size == 1 ? true : false}
                    disabled={noSizeValue == true ? true : false}
                    onChange={(e) => handleCheckNoSize(e)}
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     no_size: e.target.checked == true ? 1 : 0,
                    //   })
                    // }
                    name="no_size"
                    // disabled={formData.no_size == 1 ? true : false}
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
          {formData?.image ? (
            <img
              src={formData?.image ? formData?.image : profile}
              style={{
                height: "100px",
                width: "100px",
                marginTop: "16px",
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
      )}
    </>
  );
}

export default withRouter(UpdateProduct);
