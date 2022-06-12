import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import {
  Grid,
  DialogActions,
  Select,
  Box,
  MenuItem,
  TextField as Input,
  ListItem,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { apiCall, displayLog, validate } from "../../common/common";

// styles
import useStyles from "./styles";
import { Button } from "../../components/Wrappers/Wrappers";
import joi from "joi-browser";

// components
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// import Input from "@material-ui/core/Input";
import ErrorMessage from "../../components/ErrorMessage";
import { ChromePicker } from "react-color";
import profile from "../../static/images/default.png";

function AddProductModification(props) {
  const classes = useStyles();

  //STATES
  const [productId, setProductId] = useState([]);
  const [productListing, setProductListing] = useState([]);
  const [name, setName] = useState("");
  const [accInitals, setInitals] = useState("");

  // SIZESSSS
  const [status, setStatus] = useState();
  const [type, setType] = useState();
  const [customSize, setCustomSize] = useState(false);
  const [isModificationRequired, setIsModificationRequired] = useState(false);
  const [customXLSize, setCustomXlSize] = useState(false);
  const [modificationAllow, setModificationAllow] = useState(false);
  const [acessoriesId, setAcessoriesId] = useState("");
  const [accessoriesListing, setAccessoriesListing] = useState([]);
  const [isColorRequired, setIsColorRequired] = useState(false);
  const [colours, setColours] = useState([]);
  const [code, setCode] = useState("");
  const [image, setImage] = useState("");
  const [errorSizeList, setErrorSizeList] = useState(null);

  const [sameAsPerProduct, setSameasPerProduct] = useState([]);
  const [
    sizeforSameAsProductListing,
    setSizeForSameAsProductListing,
  ] = useState([]);
  const [independentSize, setIndependentSize] = useState("");
  const [sizeforIndependentListing, setSizeForIndependentListing] = useState(
    []
  );

  const [nextData, setNextData] = useState([]);
  const [sizeData, setSizeData] = useState({});
  const [listItem, setListItem] = useState([]);
  const [addNewSize, setAddNewSize] = useState([]);

  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [disBtn, setDisBtn] = useState(false);
  const [sameAsPerProductName, setSameAsPerProductName] = useState([]);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      await getProductList();
      await getSizeforIndependent();
      await getAccessoriesList();
    })();
  }, [error]);

  const getProductList = async () => {
    let res = await apiCall(
      "GET",
      "",
      "/admin/product/get-all-product",
      undefined
    );
    if (res.data.status === true) {
      setProductListing(res.data?.data);
    } else if (res.data.status === false) {
      displayLog(0, res.data.message);
    }
  };

  const getSizeforIndependent = async () => {
    const reqBody = {
      adminSelectList: 2,
    };
    let res = await apiCall("POST", "", "/admin/size/list", reqBody);
    if (res.data.status === true) {
      setSizeForIndependentListing(res.data.data?.size);
    } else if (res.data.status === false) {
      displayLog(0, res.data.message);
    }
  };

  const handleChangeSize = (sizeParms) => {
    console.log("dd", sizeParms);
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

  const handleInputChange = (event, i) => {
    const { name, value } = event.target;
    console.log(name, value);
    setSizeData({
      ...sizeData,
      [name]: value,
    });
  };

  useEffect(() => {
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
  }, [listItem, sizeData]);

  const handleAddClick = () => {
    console.log("sizeData", sizeData);
    let list = [...listItem];
    list.push(sizeData);

    //REMOVE DUPLICATE ARRAY OBJECT
    const obj = [
      ...new Map(list.map((item) => [JSON.stringify(item), item])).values(),
    ];
    setListItem(obj);
    setDisBtn(false);
    setSizeData("");
  };

  const handleRemoveClick = (index) => {
    const list = [...listItem];
    console.log("LISTTT", list, index + 1);
    list.splice(index, 1);
    setListItem(list);
  };

  const handlelistData = (e, index) => {
    const { name, value } = e.target;
    const listedit = [...listItem];
    console.log("listedit", listedit);
    listedit[index][name] = value;
    setListItem(listedit);
  };

  //HANDLE THE IMAGE
  const handleImage = async (e) => {
    displayLog(2, "Please wait for upload image");
    const Img = e.target.files[0];
    console.log("IMAGE", Img);
    var bodyFormData = new FormData();
    bodyFormData.append("image", Img);
    let reqParams = {
      type: "accessories",
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
      setImage(res.data.data?.image);

      setError("");
    } else {
      displayLog(0, res.data.message);
    }
  };
  //HANDLE THE MODIFICATIION NAME
  const handleChange = (e) => {
    const { name, value } = e.target;
    setName(value);
    setTimeout(() => {
      let str = value;
      let matches = str.match(/\b(\w)/g);
      let acronym = matches.join("");
      setInitals(acronym);
    }, 500);
  };
  //HANDLE THE SUBMIT BUTTON
  const handleSubmit = () => {
    let reqData = {
      product: productId,
      name: name,
      type: type,
      status: status,

      code: code,
    };
    if (modificationAllow == true) {
      reqData.accessories = acessoriesId;
    }
    if (type == 1) {
      reqData.sameAsPerProduct = sameAsPerProduct;
    }
    if (type == 2) {
      reqData.independentSize = independentSize;
    }
    if (isColorRequired == true) {
      reqData.color = colours;
    }
    validateFormData(reqData);
    console.log("DATA", reqData);
  };

  //VALIDATE THE FORMDATA
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      product: joi
        .array()
        .min(1)
        .required(),
      name: joi
        .string()
        .trim()
        .required(),
      type: joi.required(),
      sameAsPerProduct:
        type == 1
          ? joi
              .array()
              .min(1)
              .required()
          : "",
      independentSize:
        type == 2
          ? joi
              .string()
              .trim()
              .required()
          : "",
      status: joi.required(),
      accessories:
        modificationAllow == true
          ? joi
              .string()
              .trim()
              .required()
          : "",
      color:
        isColorRequired == true
          ? joi
              .array()
              .min(1)
              .required()
          : "",
      code: joi
        .string()
        .trim()
        .required(),
    });
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        console.log("ERRR", err);
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
          product_id: productId,
          name: name,

          status: status,
          type: type,
          code: code.toUpperCase().replace(/ /g, ""),
          modification_initial: accInitals.toUpperCase().replace(/ /g, ""),
          image: image,

          is_color:
            isColorRequired == false ? 0 : isColorRequired == true ? 1 : 0,
          allow_accessories:
            modificationAllow == false ? 0 : modificationAllow == true ? 1 : 0,
          quantity:
            isModificationRequired == false
              ? 0
              : isModificationRequired == true
              ? 1
              : 0,
        };
        if (modificationAllow == true) {
          reqData.accessories_id = acessoriesId;
        }
        if (type !== 3) {
          reqData.iscustomsizexl =
            customXLSize == false ? 0 : customXLSize == true ? 1 : 0;
          reqData.iscustomsize =
            customSize == false ? 0 : customSize == true ? 1 : 0;
        }
        if (type == 1) {
          reqData.size = sameAsPerProduct;
        }
        if (type == 2) {
          reqData.size = joinSize;
        }
        if (type == 2) {
          reqData.size_type = independentSize;
        }
        if (isColorRequired == true) {
          reqData.color = colours;
        }
        console.log("FINALLL", reqData);
        if (type == 1 || type == 2) {
          if (
            reqData.size.length > 0 ||
            reqData.iscustomsize ||
            reqData.iscustomsizexl ||
            reqData.no_size
          ) {
            let res = await apiCall(
              "POST",
              "",
              "/admin/modification/add-modification",
              reqData
            );
            if (res.data.status === true) {
              props.ToggleInputModal(false);
              props.getModification();
              history.push("/app/modification");
              displayLog(1, res.data.message);
            } else if (res.data.status === false) {
              displayLog(0, res.data.message);
            }
          } else {
            displayLog(
              0,
              "Please enter at least one size value or select Custom size or CustomXL size option"
            );
          }
        } else if (type == 3) {
          let res = await apiCall(
            "POST",
            "",
            "/admin/modification/add-modification",
            reqData
          );
          if (res.data.status === true) {
            props.ToggleInputModal(false);
            props.getModification();
            history.push("/app/modification");
            displayLog(1, res.data.message);
          } else if (res.data.status === false) {
            displayLog(0, res.data.message);
          }
        }
      }
    });
  };

  const getSizeforSameAsProduct = async (item) => {
    console.log("HEJKKK", type);
    if (type == 1) {
      setType("");
      setSizeForSameAsProductListing([]);
    }
    if (productId.length == 1) {
      let reqData = {
        product_id: productId,
      };
      let res = await apiCall(
        "POST",
        "",
        "/admin/accessories/size-list",
        reqData
      );
      console.log("check ", res);
      //getProductCode(item._id);
      if (res.data.status === true) {
        setSizeForSameAsProductListing(res.data?.data);
      } else if (res.data.status === false) {
        setErrorSizeList(res.data.message);
        // displayLog(0, res.data.message);
      }
    }
    if (productId.length > 0) {
      getProductCode(productId);
    }
    // if (productId.length == 1) {
    //   let reqData = {
    //     product_id: productId,
    //   };
    //   let res = await apiCall(
    //     "POST",
    //     "",
    //     "/admin/accessories/size-list",
    //     reqData
    //   );
    //   console.log("check ", res);
    //   //getProductCode(item._id);
    //   if (res.data.status === true) {
    //     setSizeForSameAsProductListing(res.data?.data);
    //   } else if (res.data.status === false) {
    //     displayLog(0, res.data.message);
    //   }
    // }
    setError("");
    setErrorField("");
    //   let res = await apiCall(
    //     "GET",
    //     "",
    //     "/admin/accessories/size-list?product_id=" + item._id,
    //     ""
    //   );
    //   console.log("check ", res);
    //   if (res.data.status === true) {
    //     setSizeForSameAsProductListing(res.data?.data);
    //     setAccessoriesListing([]);
    //     getAccessoriesList(item);
    //   } else if (res.data.status === false) {
    //     displayLog(0, res.data.message);
    //   }
  };
  //GENERATE THE PRODUCT MODIFICATION CODE
  const getProductCode = async (proId) => {
    console.log("getProductCode", type, "ddd", independentSize);
    const req_data = {
      product_id: proId,
      size_id: type == 1 ? -1 : type == 2 ? +independentSize : 0,
    };
    console.log("req_data", req_data);
    let res = await apiCall(
      "POST",
      "",
      "/admin/modification/product-code",
      req_data
    );
    if (res.data.status == true) {
      setCode(res.data?.data.code);
    } else {
      displayLog(0, res.data.message);
    }
  };
  const getAccessoriesList = async () => {
    const reqBody = {
      type: "forSelect",
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/accessories/accessories-list",

      reqBody
    );
    console.log("check ", res);
    if (res.data.status === true) {
      setAccessoriesListing(res.data?.data);
    } else if (res.data.status === false) {
      displayLog(0, res.data.message);
    }
  };

  const handleSameAsProduct = (e) => {
    const {
      target: { value },
    } = e;
    setSameAsPerProductName(
      typeof value === "string" ? value.split(",") : value
    );
    setSameasPerProduct(typeof value === "string" ? value.split(",") : value);
    setError("");
  };

  const clearArrayData = async () => {
    if (productId.length > 0) {
      const req_data = {
        product_id: productId,
        size_id: -1,
      };
      console.log("req_data", req_data);
      let res = await apiCall(
        "POST",
        "",
        "/admin/modification/product-code",
        req_data
      );
      if (res.data.status == true) {
        setCode(res.data?.data.code);
      } else {
        displayLog(0, res.data.message);
      }
    } else {
      setError("Please Select the Product");
      setErrorField("product");
    }
    if (productId.length !== 1) {
      displayLog(0, "Please select at least one Product");
    }
    if (productId.length == 1 && sizeforSameAsProductListing.length == 0) {
      console.log("HELLO");
      displayLog(0, errorSizeList);
    }
    setNextData([]);
    setSizeData({});
    setListItem([]);
    setAddNewSize([]);
  };

  const clearArrayDataNoSize = async () => {
    if (productId.length > 0) {
      const req_data = {
        product_id: productId,
        size_id: 0,
      };
      console.log("req_data", req_data);
      let res = await apiCall(
        "POST",
        "",
        "/admin/modification/product-code",
        req_data
      );
      if (res.data.status == true) {
        setCode(res.data?.data.code);
      } else {
        displayLog(0, res.data.message);
      }
    } else {
      setError("Please Select the Product");
      setErrorField("product");
    }
    setSameasPerProduct("");
    setNextData([]);
    setSizeData({});
    setListItem([]);
    setAddNewSize([]);
  };

  const clearColorData = () => {
    if (isColorRequired == false) {
      setColours([]);
    }
  };

  const handleColorBox = (e) => {
    const {
      target: { value },
    } = e;
    setColours(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setError("");
  };
  //IF SELECT THE INDEPENDT OF SIZE
  const handleGenCode = async (e) => {
    console.log("fff", e.target.value, "fff", productId);
    if (productId.length > 0) {
      const req_data = {
        product_id: productId,
        size_id: +e.target.value,
      };
      console.log("req_data", req_data);
      let res = await apiCall(
        "POST",
        "",
        "/admin/modification/product-code",
        req_data
      );
      if (res.data.status == true) {
        setCode(res.data?.data.code);
      } else {
        displayLog(0, res.data.message);
      }
    } else {
      setError("Please Select the Product");
      setErrorField("product");
    }
  };

  return (
    <>
      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "16px" }}
      >
        <InputLabel id="demo-simple-select-outlined-label">
          Select Product
        </InputLabel>

        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Select Product"
          multiple
          onChange={(e) => setProductId(e.target.value)}
          onClose={() => getSizeforSameAsProduct()}
          name="product"
          value={productId}
        >
          {productListing &&
            productListing.map((item, index) => {
              return (
                <MenuItem
                  value={item._id}
                  // onClick={() => getSizeforSameAsProduct(item)}
                >
                  {item.product_name}
                </MenuItem>
              );
            })}
        </Select>
        {errorField === "product" && <ErrorMessage error={error} />}
      </FormControl>
      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "16px" }}
      >
        <Input
          label="Product Modification Name"
          placeholder={"Name"}
          margin="normal"
          variant="outlined"
          name="name"
          // onChange={(e) => setName(e.target.value)}
          onChange={(e) => handleChange(e)}
          InputProps={{
            classes: {
              underline: classes.InputUnderline,
              input: classes.Input,
            },
          }}
          fullWidth
        />
        {errorField === "name" && <ErrorMessage error={error} />}
      </FormControl>

      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "16px" }}
      >
        <InputLabel id="demo-simple-select-outlined-label">
          Select Type
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Select Type"
          onChange={(e) => setType(e.target.value)}
          name="type"
          value={type ? type : ""}
        >
          {/* {sizeforSameAsProductListing.length > 0 && (
            <MenuItem value={1} onClick={() => clearArrayData()}>
              Same as per product
            </MenuItem>
          )} */}
          <MenuItem value={1} onClick={() => clearArrayData()}>
            Same as per product
          </MenuItem>
          <MenuItem value={2}>Independent of size</MenuItem>
          <MenuItem value={3} onClick={() => clearArrayDataNoSize()}>
            No size
          </MenuItem>
        </Select>
        {errorField === "type" && <ErrorMessage error={error} />}
      </FormControl>

      {type === 1 && sizeforSameAsProductListing.length > 0 ? (
        <>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "16px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Select Size of Product
            </InputLabel>

            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              label="Select Size of Product"
              onChange={(e) => handleSameAsProduct(e)}
              multiple
              name="sameAsPerProduct"
              value={sameAsPerProductName}
            >
              {sizeforSameAsProductListing &&
                sizeforSameAsProductListing.map((item, index) => {
                  return <MenuItem value={item.size}>{item.size}</MenuItem>;
                })}
            </Select>
            {errorField === "sameAsPerProduct" && (
              <ErrorMessage error={error} />
            )}
          </FormControl>{" "}
        </>
      ) : (
        ""
      )}
      {type == 2 ? (
        <>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "16px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Select Size
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Select Size"
              onChange={(e) => setIndependentSize(e.target.value)}
              onClick={(e) => handleGenCode(e)}
              name="independentSize"
              value={independentSize ? independentSize : ""}
            >
              {sizeforIndependentListing &&
                sizeforIndependentListing.map((item, index) => {
                  return (
                    <MenuItem
                      value={item._id}
                      onClick={() => handleChangeSize(item.parameters)}
                    >
                      {item.parameters}
                    </MenuItem>
                  );
                })}
            </Select>
            {errorField === "independentSize" && <ErrorMessage error={error} />}
          </FormControl>{" "}
        </>
      ) : (
        ""
      )}

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
                      {errorField === "sizeData" && (
                        <ErrorMessage error={error} />
                      )}
                    </Box>
                  </div>
                </div>
              </>
            ))}{" "}
          </>
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

      {/* For Add New Size  */}
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
                    <Button onClick={() => handleRemoveClick(i)}>Remove</Button>
                  </div>
                </div>
              </>
            );
          })}
      </div>

      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "16px" }}
      >
        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Accessorie"
          name="status"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
        >
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Deactivated</MenuItem>
        </Select>
        {errorField === "status" && <ErrorMessage error={error} />}
      </FormControl>

      {type !== 3 ? (
        <>
          <Grid container spacing={2}>
            <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                className={classes.input}
                style={{ width: "100%", marginTop: "16px" }}
                InputProps={{
                  classes: {
                    underline: classes.InputUnderline,
                    input: classes.Input,
                  },
                }}
                control={
                  <Checkbox
                    name="iscustomsize"
                    color="primary"
                    checked={customSize == true ? true : false}
                    onChange={(e) => setCustomSize(e.target.checked)}
                  />
                }
                label="Allow Custom Size"
              />
            </Grid>
            <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                className={classes.input}
                style={{ width: "100%", marginTop: "16px" }}
                InputProps={{
                  classes: {
                    underline: classes.InputUnderline,
                    input: classes.Input,
                  },
                }}
                control={
                  <Checkbox
                    name="iscustomsizexl"
                    color="primary"
                    checked={customXLSize == true ? true : false}
                    onChange={(e) => setCustomXlSize(e.target.checked)}
                  />
                }
                label="Allow Custom XL size"
              />
            </Grid>
          </Grid>
        </>
      ) : (
        ""
      )}

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
                color="primary"
                checked={isModificationRequired == true ? true : false}
                onChange={(e) => setIsModificationRequired(e.target.checked)}
              />
            }
            label="Is modification required Qty.?"
          />
        </Grid>

        <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            className={classes.input}
            style={{ width: "100%", marginTop: "16px" }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            control={
              <Checkbox
                name="iscustomsizexl"
                color="primary"
                checked={modificationAllow == true ? true : false}
                onChange={(e) => setModificationAllow(e.target.checked)}
              />
            }
            label="Modification allow to accessories"
          />
        </Grid>
      </Grid>
      {modificationAllow == true ? (
        <>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "16px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Select accessories
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Select Product"
              onChange={(e) => setAcessoriesId(e.target.value)}
              name="accessories"
              value={acessoriesId}
            >
              {accessoriesListing &&
                accessoriesListing.map((item, index) => {
                  return <MenuItem value={item._id}>{item.name}</MenuItem>;
                })}
            </Select>
            {errorField === "accessories" && <ErrorMessage error={error} />}
          </FormControl>
        </>
      ) : (
        ""
      )}

      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "16px" }}
      >
        <Input
          label="Code"
          placeholder={"Code"}
          margin="normal"
          variant="outlined"
          name="code"
          InputProps={{
            classes: {
              underline: classes.InputUnderline,
              input: classes.Input,
            },
          }}
          onChange={(e) => setCode(e.target.value)}
          value={code ? code : ""}
          inputProps={{ style: { textTransform: "uppercase" } }}
          fullWidth
        />
        {errorField === "code" && <ErrorMessage error={error} />}
      </FormControl>
      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%" }}
      >
        <Input
          label="Modification Initals"
          placeholder={"Modification Initals"}
          margin="normal"
          variant="outlined"
          name="modification_initial"
          InputProps={{
            classes: {
              underline: classes.InputUnderline,
              input: classes.Input,
            },
          }}
          onChange={(e) => setInitals(e.target.value)}
          inputProps={{ style: { textTransform: "uppercase" } }}
          value={accInitals ? accInitals : ""}
          fullWidth
        />
        {errorField === "modification_initial" && (
          <ErrorMessage error={error} />
        )}
      </FormControl>

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
                color="primary"
                checked={isColorRequired == true ? true : false}
                onChange={(e) => setIsColorRequired(e.target.checked)}
                onClick={clearColorData}
              />
            }
            label="Is color required?"
          />
        </Grid>
      </Grid>

      {isColorRequired == true ? (
        <>
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
              value={colours || []}
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
        </>
      ) : (
        ""
      )}

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
      {image ? (
        <img
          src={image ? image : profile}
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

export default withRouter(AddProductModification);
