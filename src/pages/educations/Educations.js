import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField as Input,
  CircularProgress,
  Select,
  MenuItem,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Widget from "../../components/Widget/Widget";
import { Button } from "../../components/Wrappers/Wrappers";
import Input2 from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import {
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
} from "@material-ui/core";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

import useStyles from "./styles";
import alertify from "alertifyjs";
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/alertify.min.css";
import joi from "joi-browser";
import "./styles.css";
//context
import {
  useEducationsState,
  getEducationsRequest,
  deleteEducation,
  createEducation,
  updateEducation,
  getProductListRequest,
  getProductSizeRequest,
} from "../../context/EducationsContext";
import { apiCall, displayLog, validate } from "../../common/common";
import { Typography } from "../../components/Wrappers/Wrappers";

// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
const FormData = require("form-data");
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function descendingComparator(a, b, orderBy) {
  if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
    return -1;
  }
  if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    numeric: true,
    disablePadding: false,
    label: "#",
    sort: false,
    width: "80px",
  },
  {
    id: "product_name",
    numeric: true,
    disablePadding: false,
    label: "PRODUCT NAME",
    sort: true,
    width: "280px",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "NAME",
    sort: true,
    width: "160px",
  },
  // { id: 'code', numeric: true, disablePadding: false, label: 'CODE', sort: true },
  // { id: 'size', numeric: true, disablePadding: false, label: 'SIZE', sort: true },
  // { id: 'status', numeric: true, disablePadding: false, label: 'STATUS', sort: false },
  {
    id: "actions",
    numeric: true,
    center: true,
    width: "180px",
    disablePadding: false,
    label: "ACTIONS",
    sort: false,
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
                <Typography noWrap weight={"medium"} variant={"body2"}>
                  {headCell.label}
                </Typography>
              </TableSortLabel>
            ) : (
              <Typography noWrap weight={"medium"} variant={"body2"}>
                {headCell.label}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Educations = () => {
  const classes = useStyles();
  const context = useEducationsState();
  var [educations, setBackEducations] = useState(context.educations.educations);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formValues, setFormValues] = useState({ size: [] });
  const [wantToEdit, setWantToEdit] = useState(false);
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    size: [],
    product_name: "",
    size_type: "",
  });

  // PARTH STATE - 04-05-2021
  const [commonCode, setCommonCode] = useState(false);
  //-----------------

  useEffect(() => {
    getEducationsRequest(context.setEducations);
    getProductListRequest(context.setProductList);
  }, []); // eslint-disable-line

  useEffect(() => {
    setBackEducations(context.educations.educations);
  }, [context]);

  useEffect(() => {
    console.log(formValues, newProduct);
    if (
      formValues &&
      formValues.name &&
      newProduct &&
      newProduct.product_name &&
      newProduct.size_type
    ) {
      if (!wantToEdit || commonCode) {
        genCommonCode();
      }
    }
  }, [newProduct.product_name, newProduct.size_type, formValues.name]);

  const handleRequestSort = (event, property) => {
    console.log("PROPPP", property);
    const isAsc = orderBy === property && order === "asc";
    console.log("PROPPP", isAsc);
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangesize = (e) => {
    setCommonCode(wantToEdit ? true : false);

    setNewProduct({
      ...newProduct,
      size: e.target.value,
    });
  };
  const handleChangeSelect = (e) => {
    setError("");
    setErrorField("");

    setCommonCode(wantToEdit ? true : false);

    // setAction(e.target.value);
    // var customAtrribute= e.target.options[selectedIndex].getAttribute('key');
    console.log("dropdown change ", e);
    setFormValues({
      ...formValues,
      product_id: e.target.value,
    });
    //   console.log('product_id =>',formValues.product_id)
    // let getId = {
    //     product_id : 58
    // }
    // getProductSizeRequest(context.setproductsSize,getId);
  };
  const getSize = (size, name, size_type) => {
    // alert(name);
    let getId = {
      product_id: size,
    };
    getProductSizeRequest(context.setproductsSize, getId);
    setNewProduct({
      ...newProduct,
      product_name: name,
      size_type: size_type === "1" ? "WWLL" : "WWLLHH",
    });
    // setFormValues({ ...formValues, size: '', });
    // setNewProduct({ ...newProduct, size: '', });
  };
  if (newProduct.size == 0 && formValues.size !== undefined) {
    if (formValues.size && formValues.size.length > 0) {
      newProduct.size = formValues.size.split(",");
    }
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const deleteEducationHandler = async (e, education_id) => {
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await deleteEducation(context.setEducations, {
            id: education_id,
          });
          await getEducationsRequest(context.setEducations);
        }
      })
      .setHeader("<em>Dreamline</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };
  const manageModal = async (wantToEdit, education) => {
    setError("");
    setErrorField("");
    setWantToEdit(wantToEdit);
    setNewProduct({ size: [] });
    education
      ? await setFormValues(education)
      : setFormValues({ education_degree: "" });
    if (wantToEdit) {
      let getId = {
        product_id: education.product_id,
      };
      getProductSizeRequest(context.setproductsSize, getId);
      const product = context.products.products.data.find(
        (product) => product._id == education.product_id
      );
      console.log(product);
      await setNewProduct({
        ...newProduct,
        size_type: product.size_type === "1" ? "WWLL" : "WWLLHH",
        product_name: product.product_name,
      });
    }
    setToggleInputModal(true);

    console.log("Here");
  };

  const submitEducationHandler = () => {
    let reqData = {
      name: formValues.name,
      product_id: formValues.product_id,
      size: newProduct.size,
      // code: formValues.code,
    };
    // console.log(reqData)
    validateFormData(reqData);
  };
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      name: joi
        .string()
        .trim()
        .required(),
      product_id: joi.required(),
      size: joi.array().items(joi.required()),
      // code: joi.string().trim().required(),
    });
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        console.log(err);
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
        setIsLoading(true);
        let reqData = {};
        let ImageLink = "";
        if (formValues.file && formValues.file != "") {
          var bodyFormData = new FormData();
          bodyFormData.append("image", formValues.file);
          let res = await apiCall(
            "POST",
            "",
            "/admin/accessories/upload-image",
            bodyFormData
          ); // modification
          if (res.data) {
            if (res.data.code === 0) {
              displayLog(0, res.data.message);
            } else {
              ImageLink = res.data.data.image;
            }
          }
        }
        if (wantToEdit) {
          reqData = {
            name: formValues.name,
            size: newProduct.size.toString(),
            code: genCode(formValues.common_code.toString()),
            common_code: formValues.common_code,
            product_id: formValues.product_id,
            accessories_id: formValues._id,
          };
          if (formValues.file && formValues.file != "") {
            reqData["image"] = ImageLink;
          } else {
            reqData["image"] = formValues.images;
          }
          console.log("Update Data:");
          console.log(reqData);
          await updateEducation(context.setEducations, reqData);
        } else {
          reqData = {
            name: formValues.name,
            size: newProduct.size.toString(),
            code: await genCode(formValues.common_code),
            common_code: formValues.common_code,
            product_id: formValues.product_id,
            image: ImageLink,
          };
          console.log(reqData);
          await createEducation(context.setEducations, reqData);
        }
        await getEducationsRequest(context.setEducations);
        setToggleInputModal(false);
        setIsLoading(false);
        // setSizeData([{ l: '', w: '', h: '' }])
        setNewProduct({ ...newProduct, size: [] });
      }
    });
  };
  const genCommonCode = () => {
    const str = newProduct.product_name,
      size_type = newProduct.size_type;
    if (str && size_type && formValues.name) {
      let matches = str.match(/\b(\w)/g);
      let acronym = matches.join("").toUpperCase();
      let acronym2 = formValues.name
        .match(/\b(\w)/g)
        .join("")
        .toUpperCase();
      let cd = acronym + size_type + acronym2;
      setFormValues({ ...formValues, common_code: cd });
    }
  };
  const genCode = (code) => {
    const size_type = newProduct.size_type;
    let data = newProduct.size;
    let proCode = [];
    for (let c of data) {
      let size = c.split("*"),
        proC = "";
      console.log(c, size);
      if (code.search(size_type) >= 0) {
        proC = code.replace(
          size_type,
          size.reduce((a, s) => a + String(s).padStart(2, "0"), "")
        );
      } else {
        proC = code + size.reduce((a, s) => a + String(s).padStart(2, "0"), "");
      }
      proCode.push(proC);
    }
    return proCode.toString();
  };
  console.log("product data", newProduct, formValues);
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Accessories Management</span>
      <Grid item xs={12}>
        <Widget inheritHeight>
          <Box
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"center"}
          >
            <Box style={{ margin: "0 12px 0 0" }}>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => manageModal(false)}
              >
                <Box mr={1} display={"flex"}>
                  <AddIcon />
                </Box>
                Add
              </Button>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"flex-end"}
            ></Box>
          </Box>
        </Widget>
      </Grid>
      {!context.educations.isLoaded || !educations.data ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100vw"}
          height={"calc(100vh - 200px)"}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table aria-labelledby="tableTitle" aria-label="enhanced table">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={educations.data.length}
                />
                {console.log("enhanced", page)}
                {educations.data.accessories.length > 0 ? (
                  <TableBody>
                    {stableSort(
                      educations.data.accessories,
                      getComparator(order, orderBy)
                    )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow hover tabIndex={-1} key={index}>
                            <TableCell component="th" scope="row" align="left">
                              <Typography variant={"body2"}>
                                {page * rowsPerPage + index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.product_name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            {/* <TableCell align="left">
                                                                <Box
                                                                    display={'flex'}
                                                                    alignItems={'center'}
                                                                >
                                                                    <Typography
                                                                        variant={'body2'}
                                                                    >
                                                                        {row.code}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell> */}
                            {/* <TableCell align="left">
                                                                <Box
                                                                    display={'flex'}
                                                                    alignItems={'center'}
                                                                >
                                                                    <Typography
                                                                        variant={'body2'}
                                                                    >
                                                                        {row.size}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell> */}
                            {/* <TableCell align="left">
                                                                <Typography
                                                                    variant={'body2'}
                                                                >
                                                                    <Switch
                                                                        checked={row.status === 1 ? true : false}
                                                                        onChange={(e) => handleChange(e, row.id)}
                                                                        color="primary"
                                                                        name="checkedB"
                                                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                                                    />
                                                                </Typography>
                                                            </TableCell> */}
                            <TableCell align="center">
                              <Box display={"flex"} justifyContent={"center"}>
                                <IconButton
                                  color={"primary"}
                                  onClick={() => manageModal(true, row)}
                                >
                                  <CreateIcon />
                                </IconButton>
                                <IconButton
                                  color={"primary"}
                                  onClick={(e) =>
                                    deleteEducationHandler(e, row._id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={headCells.length}>
                        <Typography
                          style={{ textAlign: "center", padding: "10px 0px" }}
                          noWrap
                          variant={"h4"}
                        >
                          No Records
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={educations.data.accessories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      )}
      <Dialog
        open={toggleInputModal}
        onClose={() => setToggleInputModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {wantToEdit ? "Edit" : "Add"} Accessories
        </DialogTitle>
        <DialogContent className="">
          <Input
            label="Name"
            placeholder={"Name"}
            margin="normal"
            variant="outlined"
            onChange={(e) => {
              setCommonCode(wantToEdit ? true : false);
              setFormValues({
                ...formValues,
                name: e.target.value.replace(/^\s+/, ""),
              });
            }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.name}
            fullWidth
          />
          {errorField === "name" && <ErrorMessage error={error} />}
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "10px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Product
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              MenuProps={MenuProps}
              label="Product"
              value={formValues.product_id}
              onChange={handleChangeSelect}
            >
              {context.products.products.data &&
                context.products.products.data.map((c) => (
                  <MenuItem
                    value={c._id}
                    key={c._id}
                    name={c.product_name}
                    onClick={() => getSize(c._id, c.product_name, c.size_type)}
                  >
                    {c.product_name}
                  </MenuItem>
                ))}
            </Select>
            {errorField === "product_id" && <ErrorMessage error={error} />}
          </FormControl>
          <FormControl
            className={classes.formControl}
            style={{ width: "100%", marginTop: "10px", marginLeft: "5px" }}
          >
            <InputLabel id="demo-mutiple-name-label">Size</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              multiple
              value={
                wantToEdit && newProduct.size.length == 0
                  ? formValues.size.split(",")
                  : newProduct.size
              }
              onChange={handleChangesize}
              input={<Input2 />}
              MenuProps={MenuProps}
            >
              {context.productsSize.productsSize.data &&
                context.productsSize.productsSize.data.size.map((size) => (
                  <MenuItem value={size} key={size}>
                    {size}
                  </MenuItem>
                ))}
            </Select>
            {errorField === "size" && <ErrorMessage error={error} />}
          </FormControl>
          <Input
            label="Code"
            placeholder={"Code"}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                common_code: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={
              formValues.common_code
                ? formValues.common_code
                    .toString()
                    .replace(/ /g, "")
                    .replaceAll(",", ", ")
                : ""
            }
            fullWidth
          />
          {wantToEdit && errorField === "code" && (
            <ErrorMessage error={error} />
          )}
          <div></div>
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
            multiple
            type="file"
            name="file"
            onChange={(e) =>
              setFormValues({ ...formValues, file: e.target.files[0] })
            }
          />
          <div></div>
          {wantToEdit && formValues.images != "" ? (
            <img
              src={formValues.images}
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
        </DialogContent>
        <DialogActions style={{ padding: "10px 24px 20px" }}>
          <Button
            variant={"outlined"}
            color="primary"
            onClick={() => setToggleInputModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={"contained"}
            color="primary"
            onClick={submitEducationHandler}
            disabled={isLoading}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Educations;
