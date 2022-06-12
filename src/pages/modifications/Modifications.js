import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField as Input,
  CircularProgress,
  Select,
  MenuItem,
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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import alertify from "alertifyjs";
import joi from "joi-browser";

import Widget from "../../components/Widget/Widget";
import { Button } from "../../components/Wrappers/Wrappers";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

import useStyles from "./styles";
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/alertify.min.css";
import "./styles.css";

//context
import {
  useModificationsState,
  getModificationsRequest,
  updateEducationStatus,
  deleteModifications,
  createModifications,
  updateModifications,
  getProductListRequest,
} from "../../context/ModificationsContext";

import { Typography } from "../../components/Wrappers/Wrappers";

// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
import { apiCall, displayLog, validate } from "../../common/common";
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
  // { id: 'product_name', numeric: true, disablePadding: false, label: 'PRODUCT NAME', sort: true },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "NAME",
    sort: true,
    width: "280px",
  },
  // { id: 'code', numeric: true, disablePadding: false, label: 'CODE', sort: true },
  {
    id: "size",
    numeric: true,
    disablePadding: false,
    label: "SIZE",
    sort: true,
    width: "160px",
  },
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

const Modifications = () => {
  const classes = useStyles();
  const context = useModificationsState();
  var [educations, setBackEducations] = useState(context.educations.educations);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formValues, setFormValues] = useState({
    product_id: [],
    size_type: "",
  });
  const [wantToEdit, setWantToEdit] = useState(false);
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_id: [],
    width: "",
    length: "",
    height: "",
    size_type: "",
    product_name: [],
  });

  // PARTH STATE - 04-05-2021
  const [commonCode, setCommonCode] = useState(false);
  //-----------------

  let placeholderSize = "";
  useEffect(() => {
    getModificationsRequest(context.setEducations);
    getProductListRequest(context.setProductList);
  }, []); // eslint-disable-line
  useEffect(() => {
    setBackEducations(context.educations.educations);
  }, [context]);
  useEffect(() => {
    console.log("NOOOEEE", newProduct);
    console.log(formValues.code);
    if (newProduct && newProduct.product_id && newProduct.size_type) {
      if (!wantToEdit || commonCode) {
        genCommonCode();
      }
    }
  }, [newProduct.product_id, newProduct.size_type]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeSelect = (e) => {
    setCommonCode(wantToEdit ? true : false);

    console.log(e.target.value);
    setNewProduct({
      ...newProduct,
      product_id: e.target.value,
    });
  };
  console.log(formValues.product_id);

  if (newProduct.product_id == 0 && formValues.product_id !== undefined) {
    if (formValues.product_id && formValues.product_id.length > 0) {
      newProduct.product_id = formValues.product_id.split(",");
    }
  }

  const handleChangeSize = (e) => {
    setCommonCode(wantToEdit ? true : false);

    setNewProduct({
      ...newProduct,
      size_type: e.target.value,
    });
  };

  if (newProduct.size_type !== undefined && newProduct.size_type.length == 0) {
    newProduct.size_type = formValues.size_type;
  }
  if (newProduct.size_type == 1 || formValues.size_type == 1) {
    placeholderSize = "(Width)";
  } else if (newProduct.size_type == 2 || formValues.size_type == 2) {
    placeholderSize = "(Height)";
  } else if (newProduct.size_type == 3 || formValues.size_type == 3) {
    placeholderSize = "(Length)";
  } else if (newProduct.size_type == 4 || formValues.size_type == 4) {
    placeholderSize = "(Width * Height)";
  } else if (newProduct.size_type == 5 || formValues.size_type == 5) {
    placeholderSize = "(Width * Length)";
  } else if (newProduct.size_type == 6 || formValues.size_type == 6) {
    placeholderSize = "(Height * Lenght)";
  } else if (newProduct.size_type == 7 || formValues.size_type == 7) {
    placeholderSize = "(Width * Height * Length)";
  } else {
    placeholderSize = "";
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = async (event, education_id) => {
    await updateEducationStatus(context.setEducations, {
      is_active: event.target.checked ? 1 : 0,
      education_id: education_id,
    });
    await getModificationsRequest(context.setEducations);
  };

  const deleteEducationHandler = async (e, id) => {
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await deleteModifications(context.setEducations, {
            id: id,
          });
          await getModificationsRequest(context.setEducations);
        }
      })
      .setHeader("<em>Dreamline</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };

  const manageModal = (wantToEdit, education) => {
    console.log(commonCode);
    setError("");
    setErrorField("");
    setWantToEdit(wantToEdit);
    education
      ? setFormValues(education)
      : setFormValues({ education_degree: "" });

    setNewProduct({ ...newProduct, product_id: [], size_type: [] });

    setToggleInputModal(true);
  };

  const submitEducationHandler = () => {
    let reqData = {
      product_id: newProduct.product_id,
      name: formValues.name,
      size_type: newProduct.size_type,
      size: formValues.size,
      // code: formValues.code,
    };
    validateFormData(reqData);
  };

  const validateFormData = (body) => {
    let schema = joi.object().keys({
      product_id: joi.array().items(joi.string().required()), //joi.required(),
      name: joi
        .string()
        .trim()
        .required(),
      size_type: joi.required(),
      size: joi.string().required(),
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
            "/admin/modification/upload-image",
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
            type: newProduct.size_type,
            size: formValues.size,
            // size: size,
            code: await genCode(formValues.common_code),
            product_id: newProduct.product_id, //.toString(),
            modification_id: formValues._id,
            common_code: formValues.common_code,
            // image: ImageLink
          };
          if (formValues.file && formValues.file != "") {
            reqData["image"] = ImageLink;
          } else {
            reqData["image"] = formValues.images;
          }
          console.log(reqData);
          await updateModifications(context.setEducations, reqData);
        } else {
          reqData = {
            name: formValues.name,
            type: newProduct.size_type,
            size: formValues.size,
            // size: size,
            code: await genCode(formValues.common_code),
            product_id: newProduct.product_id.join(","),
            image: ImageLink,
            common_code: formValues.common_code,
          };
          console.log(reqData);
          await createModifications(context.setEducations, reqData);
        }
        await getModificationsRequest(context.setEducations);
        setToggleInputModal(false);
        setIsLoading(false);
      }
    });
  };

  const genCommonCode = () => {
    if (
      newProduct &&
      newProduct.size_type &&
      newProduct.product_id &&
      formValues.name &&
      newProduct.product_id.length > 0
    ) {
      const products = context.products.products.data,
        proCodes = [];
      for (const product of products) {
        if (newProduct.product_id.includes(product._id)) {
          const SIZE_TYPES = [
              "WW",
              "HH",
              "LL",
              "WWHH",
              "WWLL",
              "HHLL",
              "WWHHLL",
            ],
            size_type = SIZE_TYPES[Number(newProduct.size_type) - 1];
          let matches = product.product_name.match(/\b(\w)/g);
          let acronym = matches.join("").toUpperCase();
          let cd = acronym + size_type;

          let nameAcro = formValues.name
            .match(/\b(\w)/g)
            .join("")
            .toUpperCase();

          let final = cd + nameAcro;
          proCodes.push(final);
          // proCodes.push(cd)
        }
      }
      setFormValues({ ...formValues, common_code: proCodes.toString() });
    }
  };

  const genCode = (code) => {
    const SIZE_TYPES = ["WW", "HH", "LL", "WWHH", "WWLL", "HHLL", "WWHHLL"],
      size_type = SIZE_TYPES[Number(newProduct.size_type) - 1],
      proCodes = [],
      codes = code.split(","),
      form_size = formValues.size;
    if (form_size) {
      for (const code of codes) {
        let size = form_size.split("*"),
          proC = "";
        console.log(size, form_size);
        if (code.search(size_type) >= 0) {
          proC = code.replace(
            size_type,
            size.reduce((a, s) => a + String(s).padStart(2, "0"), "")
          );
        } else {
          proC =
            code + size.reduce((a, s) => a + String(s).padStart(2, "0"), "");
        }
        proCodes.push(proC);
      }
    }
    return proCodes.toString();
  };
  console.log("product data", newProduct, formValues);
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>
        Product Modifications Management
      </span>
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
                {educations.data.modification.length > 0 ? (
                  <TableBody>
                    {stableSort(
                      educations.data.modification,
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
                            {/* <TableCell align="left">
                                                                <Box
                                                                    display={'flex'}
                                                                    alignItems={'center'}
                                                                >
                                                                    <Typography
                                                                        variant={'body2'}
                                                                    >
                                                                        {row.product_name}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell> */}
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
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.size}
                                </Typography>
                              </Box>
                            </TableCell>
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
              count={educations.data.modification.length}
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
          {wantToEdit ? "Edit" : "Add"} Product Modifictions
        </DialogTitle>
        <DialogContent>
          {wantToEdit
            ? console.log(
                "EDIT PRODUCT ID ==>>",
                formValues.product_id.toString()
              )
            : ""}
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "10px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Product
            </InputLabel>
            <Select
              multiple
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              MenuProps={MenuProps}
              label="Product"
              value={
                wantToEdit && newProduct.product_id == 0
                  ? formValues.product_id.split(",")
                  : newProduct.product_id
              }
              onChange={handleChangeSelect}
            >
              {context.products.products.data &&
                context.products.products.data.map((c) => (
                  <MenuItem value={c._id} key={c._id}>
                    {c.product_name}
                  </MenuItem>
                ))}
            </Select>
            {errorField === "product_id" && <ErrorMessage error={error} />}
          </FormControl>
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
              Size Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Category"
              value={
                formValues.size_type && !newProduct.size_type
                  ? formValues.size_type
                  : newProduct.size_type
              }
              onChange={(e) => handleChangeSize(e)}
            >
              <MenuItem value="1">Width</MenuItem>
              <MenuItem value="2">Height</MenuItem>
              <MenuItem value="3">Length</MenuItem>
              <MenuItem value="4">Width * Height</MenuItem>
              <MenuItem value="5">Width * Length</MenuItem>
              <MenuItem value="6">Height * Length</MenuItem>
              <MenuItem value="7">Width * Length * Height</MenuItem>
            </Select>
            {errorField === "size_type" && <ErrorMessage error={error} />}
          </FormControl>
          <Input
            label={"Size " + placeholderSize}
            placeholder={"Size " + placeholderSize}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                size: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.size}
            fullWidth
          />
          {errorField === "size" && <ErrorMessage error={error} />}
          {/* <InputLabel id="demo-simple-select-outlined-label">Size</InputLabel> */}
          {/* <div>
                        <div style={{ display: 'flex' }}>
                              <Input name="width" margin="normal" placeholder="Width" variant="outlined" type="tel" value={formValues.size ? (formValues.size).split('x')['0'] : newProduct.width} onChange={e => handleInputChangeWidth(e)} />
                              <Input name="lenth" margin="normal" placeholder="Length" variant="outlined" type="tel" value={formValues.size ? (formValues.size).split('x')['1'] : newProduct.length} onChange={e => handleInputChangeLength(e)} />
                              <Input name="height" margin="normal" placeholder="Height" variant="outlined" type="tel" value={formValues.size && (formValues.size).split('x')['2'] > 0 ? (formValues.size).split('x')['2'] : newProduct.height} onChange={e => handleInputChangeHeight(e)} />
                          </div>
                    </div> */}
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
            style={{ marginTop: "10px" }}
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

export default Modifications;
