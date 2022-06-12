import React, { useState, useEffect } from "react";
import { withRouter, useHistory, useLocation } from "react-router-dom";

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
  CircularProgress,
  TextField as Input,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";
import FormControl from "@material-ui/core/FormControl";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import InputLabel from "@material-ui/core/InputLabel";
import joi from "joi-browser";
import alertify from "alertifyjs";

// styles
import useStyles from "./styles";
import { Button } from "../../components/Wrappers/Wrappers";

// components
import Widget from "../../components/Widget/Widget";
import { Typography } from "../../components/Wrappers/Wrappers";
import { PeopleAlt as PeopleAltIcon } from "@material-ui/icons";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { lighten } from "@material-ui/core/styles";
import moment from "moment";
// import Input from "@material-ui/core/Input";
import { apiCall, displayLog, validate } from "../../common/common";

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
import AddSubType from "./AddSubType";
import UpdateSubType from "./UpdateSubType";

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
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// function desc(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

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

function UpdateStyleBundle(props) {
  const { style_bundle_id, status } = useLocation().state;

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [sortby, setSortby] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subTypeId, setSubTypeId] = useState(null);
  const [showSubList, setShowSubList] = useState(false);
  const [subTypeModal, setSubTypeModal] = useState(false);
  const [bundleId, setBundleId] = useState(null);
  const [total, setTotal] = useState(0);
  const [addSubType, setAddSubTypes] = useState([]);
  const [addSubBtn, setAddSubBtn] = useState(false);

  const history = useHistory();

  console.log("style_bundle_id", style_bundle_id);
  useEffect(() => {
    setLoading(true);
    // getSty();
    getBundleById();
    // getCategories();
    getAddSubType();
  }, []);
  //Get Style Bundle Data
  const getBundleById = async () => {
    const reqparam = {
      style_bundle_id: style_bundle_id,
    };
    console.log("hello", reqparam);
    let res = await apiCall(
      "GET",
      "",
      "/admin/stylebundle/stylebundle-details",
      {},
      {},
      reqparam
    );
    console.log("check BUNDLLL", res);

    if (res.data.status == true) {
      setFormValues(res.data.data);
      setLoading(false);
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  //Get ALl the SUB Types
  const getAddSubType = async () => {
    const reqparam = {
      page: page !== 1 ? 1 : 1,
      limit: 1000000,
      sortby: "created_at",
      sortorder: "asc",
      sort: 0,
    };

    let res = await apiCall(
      "GET",
      "",
      "/admin/subtype_stylebundles/list",
      {},
      {},
      reqparam
    );
    console.log("subtype_stylebundles", res);

    if (res.data.status == true) {
      setLoading(false);
      if (res.data.data.style_bundles_sub_type.length > 0) {
        const abc = res.data.data?.style_bundles_sub_type.filter((item) => {
          if (+item.style_bundle_id == style_bundle_id) {
            return item;
          }
        });
        console.log("ABCCC", abc?.length);
        setAddSubTypes([...abc]);
        setTotal(abc?.length);
        setAddSubBtn(true);
      }
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };

  //HANDLE THE CHANGE REQUEST
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageCount(0);
  };
  //Open the add sub type modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };
  //HANDLE THE CHANGE PAGE
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageCount(newPage);
  };
  const manageEditSubTypeModal = (subId) => {
    console.log("SUBID", subId);
    setSubTypeId(subId);
    setSubTypeModal(true);
    // setLoading(true);
    // setTimeout(() => {
    //   if (catId) {
    //     setLoading(false);
    //     setCategoryId(catId);
    //     setToggleEditCatModal(true);
    //   }
    // }, 1000);
  };
  //Delete the particular record
  const deleteBundle = async (e, bundleId) => {
    // console.log("EDIII", catId);
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await delBundle(bundleId);
          // await window.location.reload();
          await getAddSubType();
        }
      })
      .setHeader("<em>Dreamline</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };
  //Del call API
  const delBundle = async (id) => {
    console.log("IDDD", id);
    const reqBody = {
      sub_type_id: id,
    };

    let res = await apiCall(
      "DELETE",
      "",
      "/admin/subtype_stylebundles/delete",

      reqBody
    );
    console.log("check API====", res);
  };

  const handleSubmit = (info) => {
    console.log("HELLO", info);
    setName(info);
  };
  const submitData = () => {
    console.log("SUBMIT", name);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value.replace(/^\s+/, ""),
    });
  };
  const handleAddSubmit = () => {
    let reqData = {
      name: formValues.name,
    };
    // console.log("FOMRDATA", reqData);
    validateFormData(reqData);
    //
  };
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      name: joi
        .string()
        .trim()
        .required(),
    });
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        // console.log(err)
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

        let reqData = {
          name: formValues.name,

          style_bundle_id: style_bundle_id,
          status: status == 1 ? 1 : 0,
        };
        addStyleBundle(reqData);
      }
    });
  };
  const addStyleBundle = async (reqData) => {
    console.log("REQDDD", reqData);
    let res = await apiCall(
      "PUT",
      "",
      "/admin/stylebundle/update",

      reqData
    );
    console.log("RESULT", res);

    if (res.data.status == 200) {
      history.push("/app/stylebundle");
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };

  // console.log("formValues", formValues?.categories);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Update Main Style Bundles</span>
      <Grid item xs={12}>
        <Widget inheritHeight>
          <Box
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"center"}
          >
            {/* <Box style={{ margin: "0 12px 0 0" }}></Box> */}
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  style={{ width: "100%", marginTop: "5px" }}
                >
                  {" "}
                  <Input
                    // label="Name"
                    placeholder={"Name"}
                    margin="normal"
                    variant="outlined"
                    name="name"
                    // onChange={(e) =>
                    //   setFormValues({
                    //     ...formValues,
                    //     product_name: e.target.value.replace(/^\s+/, ""),
                    //   })
                    // }
                    onChange={(e) => handleChange(e)}
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={formValues?.name}
                  />
                  {errorField === "name" && <ErrorMessage error={error} />}
                </FormControl>
              </Grid>

              {/* <Grid item md={6}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  style={{ width: "100%", marginTop: "20px" }}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Categories
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    label="Category"
                    name="categories"
                    onChange={(e) => handleChange(e)}
                    value={+formValues?.categories}
                    // onChange={(e) =>
                    //   setFormValues({ ...formValues, status: e.target.value })
                    // }
                  >
                    {categories &&
                      categories.map((item, index) => {
                        return (
                          <MenuItem value={item._id}>
                            {item.category_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {errorField === "categories" && (
                    <ErrorMessage error={error} />
                  )}
                </FormControl>
              </Grid> */}
            </Grid>
          </Box>
          <br /> <br />
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-end"}
          >
            <div className={"sizeDiv"}>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => handleAddSubmit()}
              >
                Update
              </Button>
            </div>
          </Box>
        </Widget>
      </Grid>{" "}
      {loading == true ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100vw"}
          height={"calc(100vh - 200px)"}
        >
          <CircularProgress size={50} />
        </Box>
      ) : null}
      <Grid item xs={12}>
        <Widget inheritHeight>
          <Box
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"center"}
          >
            <Box style={{ margin: "0 12px 0 0" }}>
              {console.log("addSubBtn", addSubBtn)}
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => manageModal()}
                disabled={style_bundle_id ? false : true}
              >
                <Box mr={1} display={"flex"}>
                  <AddIcon />
                </Box>
                Add sub type
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
      {/* LISTING ADD SUB TYPE */}
      <Grid item xs={12}>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table aria-labelledby="tableTitle" aria-label="enhanced table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={addSubType.length}
              />
              {style_bundle_id ? (
                <>
                  {" "}
                  {addSubType && addSubType.length > 0 ? (
                    <TableBody>
                      {stableSort(addSubType, getComparator(order, orderBy))
                        .slice(
                          pageCount * rowsPerPage,
                          pageCount * rowsPerPage + rowsPerPage
                        )
                        .map((item, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={index}>
                              <TableCell
                                component="th"
                                scope="row"
                                align="left"
                              >
                                <Typography variant={"body2"}>
                                  {pageCount * rowsPerPage + index + 1}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Box display={"flex"} alignItems={"center"}>
                                  <Typography variant={"body2"}>
                                    {item.sub_type}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant={"body2"}>
                                  {item.pattern}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant={"body2"}>
                                  {item.initial}
                                </Typography>
                              </TableCell>

                              <TableCell align="center">
                                <Typography variant={"body2"}>
                                  <Switch
                                    checked={
                                      item.also_end_word === 1 ? true : false
                                    }
                                    // onChange={(e) =>
                                    //   handleChangeSelect(e, item._id, item.status)
                                    // }
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{
                                      "aria-label": "primary checkbox",
                                    }}
                                  />
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography variant={"body2"}>
                                  {item.text_after_product_name}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Box display={"flex"} justifyContent={"center"}>
                                  <IconButton
                                    color={"primary"}
                                    onClick={() =>
                                      manageEditSubTypeModal(item._id)
                                    }
                                  >
                                    <CreateIcon />
                                  </IconButton>
                                  <IconButton
                                    color={"primary"}
                                    onClick={(e) => deleteBundle(e, item._id)}
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
                  )}{" "}
                </>
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
            count={total}
            rowsPerPage={rowsPerPage}
            page={pageCount}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      {/* ADD SUB TYPE MODAL */}
      <Dialog
        open={toggleInputModal}
        onClose={() => setToggleInputModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Sub Type</DialogTitle>
        <DialogContent>
          <AddSubType
            handleSubmit={handleSubmit}
            ToggleInputModal={setToggleInputModal}
            addSubType={getAddSubType}
            bundleId={style_bundle_id}
            showSubList={setShowSubList}
          />
        </DialogContent>
      </Dialog>
      {/* UPDATE SUB TYPE MODAL */}
      <Dialog
        open={subTypeModal}
        onClose={() => setSubTypeModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update Sub Type</DialogTitle>
        <DialogContent>
          <UpdateSubType
            handleSubmit={handleSubmit}
            ToggleInputModal={setSubTypeModal}
            addSubType={getAddSubType}
            subTypeId={subTypeId}
            // showSubList={setShowSubList}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default withRouter(UpdateStyleBundle);
