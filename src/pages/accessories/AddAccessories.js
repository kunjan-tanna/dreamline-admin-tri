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
import profile from "../../static/images/default.png";

function AddAccessories(props) {
  const classes = useStyles();

  //STATES
  const [name, setName] = useState("");
  const [productId, setProductId] = useState([]);
  const [type, setType] = useState();
  const [sameAsPerProduct, setSameasPerProduct] = useState("");
  const [independentSize, setIndependentSize] = useState("");
  const [code, setCode] = useState("");
  const [accInitals, setInitals] = useState("");
  const [customXLSize, setCustomXlSize] = useState(false);
  const [customSize, setCustomSize] = useState(false);
  const [status, setStatus] = useState();
  const [isRequired, setIsRequired] = useState(false);
  const [image, setImage] = useState("");
  const [productListing, setProductListing] = useState([]);
  const [sizeforIndependentListing, setSizeForIndependentListing] = useState(
    []
  );
  const [
    sizeforSameAsProductListing,
    setSizeForSameAsProductListing,
  ] = useState([]);
  const [error, setError] = useState(null);
  const [errorSizeList, setErrorSizeList] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [disBtn, setDisBtn] = useState(false);
  const [nextData, setNextData] = useState([]);
  const [sizeData, setSizeData] = useState({});
  const [listItem, setListItem] = useState([]);
  const [addNewSize, setAddNewSize] = useState([]);
  const [sameAsPerProductName, setSameAsPerProductName] = useState([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await getProductList();
      await getSizeforIndependent();
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

  const handleInputChange = (event, i) => {
    const { name, value } = event.target;

    setSizeData({
      ...sizeData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log("LISTTEM", listItem);
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
  //HANDLE THE ACCESSORIES NAME
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
      name: name,
      product: productId,
      type: type,
      //  sameAsPerProduct: sameAsPerProduct,
      //  independentSize: independentSize,
      code: code,
      status: status,
    };
    if (type == 1) {
      reqData.sameAsPerProduct = sameAsPerProduct;
    }
    if (type == 2) {
      reqData.independentSize = independentSize;
    }
    validateFormData(reqData);
    console.log("DATA", reqData);
  };

  //VALIDATE THE FORMDATA
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      name: joi
        .string()
        .trim()
        .required(),
      product: joi
        .array()
        .min(1)
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
      code: joi
        .string()
        .trim()
        .required(),
      status: joi.required(),
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
        setError("");
        setErrorField("");
        const sizeData = [...listItem];

        const joinSize = sizeData.map((item, index) =>
          Object.values(item).join("*")
        );
        let reqData = {
          name: name,
          product_id: productId,
          type: type,
          code: code.toUpperCase().replace(/ /g, ""),
          accessory_initial: accInitals.toUpperCase().replace(/ /g, ""),
          status: status,
          image: image,

          quantity: isRequired == false ? 0 : isRequired == true ? 1 : 0,
        };
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
              "/admin/accessories/add-accessories",
              reqData
            );
            if (res.data.status === true) {
              props.ToggleInputModal(false);
              props.getAccessories();
              history.push("/app/accessories");
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
            "/admin/accessories/add-accessories",
            reqData
          );
          if (res.data.status === true) {
            props.ToggleInputModal(false);
            props.getAccessories();
            history.push("/app/accessories");
            displayLog(1, res.data.message);
          } else if (res.data.status === false) {
            displayLog(0, res.data.message);
          }
        }
      }
    });
  };

  const getSizeforSameAsProduct = async () => {
    console.log("HEJKKK", productId, "ddd", independentSize);
    if (type == 1) {
      setType("");
      setSizeForSameAsProductListing([]);
    }
    // if (productId.length > 0 && sizeforSameAsProductListing.length > 0) {
    //   setSizeForSameAsProductListing([]);
    // }
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

    // setType("");
    // setIndependentSize("");
    if (productId.length > 0) {
      getProductCode(productId);
    }

    setError("");
    setErrorField("");
  };

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
      "/admin/accessories/product-code",
      req_data
    );
    if (res.data.status == true) {
      setCode(res.data?.data.code);
    } else {
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

  const clearArrayData = async (e) => {
    console.log("sizeforSameAsProductListing", sizeforSameAsProductListing);
    if (productId.length > 0) {
      // await getSizeforSameAsProduct();
      const req_data = {
        product_id: productId,
        size_id: -1,
      };
      console.log("req_data", req_data);
      let res = await apiCall(
        "POST",
        "",
        "/admin/accessories/product-code",
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

  const clearArrayDataNoSize = async (e) => {
    if (productId.length > 0) {
      const req_data = {
        product_id: productId,
        size_id: 0,
      };
      console.log("req_data", req_data);
      let res = await apiCall(
        "POST",
        "",
        "/admin/accessories/product-code",
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
        "/admin/accessories/product-code",
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
      <Input
        label="Accessorie Name"
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
      <FormControl
        variant="outlined"
        className={classes.formControl}
        style={{ width: "100%", marginTop: "20px" }}
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
        style={{ width: "100%", marginTop: "20px" }}
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
            <MenuItem
              value={1}
              onClick={(e) => clearArrayData(1)} // onClose={() => getSizeforSameAsProduct()}
            >
              Same as per product
            </MenuItem>
          )} */}
          <MenuItem
            value={1}
            onClick={(e) => clearArrayData(1)} // onClose={() => getSizeforSameAsProduct()}
          >
            Same as per product
          </MenuItem>

          <MenuItem value={2}>Independent of size</MenuItem>
          <MenuItem value={3} onClick={() => clearArrayDataNoSize(3)}>
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
            style={{ width: "100%", marginTop: "20px" }}
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
      {type === 2 ? (
        <>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "20px" }}
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
        inputProps={{ style: { textTransform: "uppercase" } }}
        value={code ? code : ""}
        fullWidth
      />
      {errorField === "code" && <ErrorMessage error={error} />}
      <Input
        label="Accessories Initals"
        placeholder={"Accessories Initals"}
        margin="normal"
        variant="outlined"
        name="accessory_initial"
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
      {errorField === "accessory_initial" && <ErrorMessage error={error} />}

      {type !== 3 ? (
        <>
          <Grid container spacing={2}>
            <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                className={classes.input}
                style={{ width: "100%", marginTop: "20px" }}
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

            <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                className={classes.input}
                style={{ width: "100%", marginTop: "20px" }}
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
          </Grid>
        </>
      ) : (
        ""
      )}

      <Grid container spacing={2}>
        <Grid item md={6} style={{ display: "flex", alignItems: "center" }}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Status
            </InputLabel>
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
        </Grid>
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
                checked={isRequired == true ? true : false}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
            }
            label="Is accessories required Qty.?"
          />
          {errorField === "is_required" && <ErrorMessage error={error} />}
        </Grid>
      </Grid>

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

export default withRouter(AddAccessories);
