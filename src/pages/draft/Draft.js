import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import {
  Grid,
  Box,
  InputAdornment,
  TextField as Input,
  CircularProgress,
} from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
import {
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
} from "@material-ui/core";

import useStyles from "./styles";
import alertify from "alertifyjs";
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/alertify.min.css";
import joi from "joi-browser";
import moment from "moment";
//context
import {
  useDraftState,
  getOrderRequest,
  updateUserStatus,
} from "../../context/DraftContext";

import { Typography } from "../../components/Wrappers/Wrappers";

// Icons
import { Add as AddIcon, Search as SearchIcon } from "@material-ui/icons";
import { validate } from "../../common/common";

function descendingComparator(a, b, orderBy) {
  if (orderBy == "order_date") {
    if (Date.parse(b["created_at"]) < Date.parse(a["created_at"])) {
      return -1;
    }
    if (Date.parse(b["created_at"]) > Date.parse(a["created_at"])) {
      return 1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
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
  { numeric: true, disablePadding: false, label: "#", sort: false },
  {
    id: "user_name",
    numeric: true,
    disablePadding: false,
    label: "USER NAME",
    sort: false,
  },
  {
    id: "patient_name",
    numeric: true,
    disablePadding: false,
    label: "PATIENT NAME",
    sort: true,
  },
  {
    id: "order_code",
    numeric: true,
    disablePadding: false,
    label: "ORDER CODE",
    sort: true,
  },
  {
    id: "order_date",
    numeric: true,
    disablePadding: false,
    label: "ORDER DATE",
    sort: true,
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "IS DELETED",
    sort: true,
  },
  // { id: "created_date", numeric: true, disablePadding: false, label: "REGISTERED AT", sort: true }
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

const Draft = (props) => {
  const classes = useStyles();
  const context = useDraftState();
  var [users, setBackUsers] = useState(context.users.users);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userRows, setUsersRows] = useState(context.users.users);
  const [formValues, setFormValues] = useState({});
  const [wantToEdit, setWantToEdit] = useState(false);
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    getOrderRequest(context.setUsers);
  }, []); // eslint-disable-line

  useEffect(() => {
    setBackUsers(context.users.users);
    setUsersRows(context.users.users);
  }, [context]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    let value = e.currentTarget.value.replace(/^\s+/, "");
    setSearchVal(value);
    setPage(0);
    const newArr = userRows.data.filter((c) => {
      return (
        c.first_name && c.first_name.toLowerCase().includes(value.toLowerCase())
      );
    });
    setBackUsers({ isLoaded: true, data: newArr });
  };

  const handleChange = async (event, user_id) => {
    await updateUserStatus(context.setUsers, {
      status: event.target.checked ? 1 : 0,
      userId: user_id,
    });
    await getOrderRequest(context.setUsers);
  };
  const deleteEducationHandler = async (e, education_id) => {
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          // await deleteEducation(context.setUsers, {
          //     education_id: education_id
          // });
          await getOrderRequest(context.setUsers);
        }
      })
      .setHeader("<em>Kulan</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };
  const manageModal = (wantToEdit, education) => {
    setError("");
    setErrorField("");
    setWantToEdit(wantToEdit);
    education
      ? setFormValues(education)
      : setFormValues({ education_degree: "" });
    setToggleInputModal(true);
  };
  const submitEducationHandler = () => {
    let reqData = {
      education_degree: formValues.education_degree,
    };
    validateFormData(reqData);
  };
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      education_degree: joi
        .string()
        .trim()
        .required(),
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
        setIsLoading(true);
        let reqData = {};
        if (wantToEdit) {
          reqData = {
            education_degree: body.education_degree,
            education_id: formValues.education_id,
          };
          // await updateEducation(context.setUsers, reqData)
        } else {
          reqData = {
            education_degree: body.education_degree,
          };
          // await createEducation(context.setUsers, reqData)
        }
        await getOrderRequest(context.setUsers);
        setToggleInputModal(false);
        setIsLoading(false);
      }
    });
  };
  const redirectToDetails = async (user_id) => {
    // console.log("redirectToDetails",user_id)
    props.history.push({
      pathname: process.env.PUBLIC_URL + "/app/draft/details",
      state: { order_id: user_id },
    });
  };
  // {console.log("users",users.data.users)}
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Draft Management</span>
      {/* <Grid item xs={12}>
                <Widget inheritHeight>
                    <Box
                        justifyContent={'space-between'}
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Box style={{ margin: "0 12px 0 0" }}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                onClick={() => manageModal(false)}
                            >
                                <Box mr={1} display={'flex'}>
                                    <AddIcon />
                                </Box>
                        Add
                    </Button>
                        </Box> 
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'flex-end'}
                        >
                             <Input
                                id="search-field"
                                label="Search"
                                margin="dense"
                                variant="outlined"
                                onChange={(e) => handleSearch(e)}
                                value={searchVal}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            /> 
                        </Box>
                    </Box>
                </Widget>
            </Grid> */}
      {!context.users.isLoaded || !users.data ? (
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
                  rowCount={users.data.length}
                />
                {users.data.order.length > 0 ? (
                  <TableBody>
                    {stableSort(users.data.order, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow hover tabIndex={-1} key={index}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="left"
                              onClick={() => redirectToDetails(row._id)}
                            >
                              <Typography variant={"body2"}>
                                {page * rowsPerPage + index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="left"
                              onClick={() => redirectToDetails(row._id)}
                            >
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row && row.user_name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              align="left"
                              onClick={() => redirectToDetails(row._id)}
                            >
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row && row.patient_name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              align="left"
                              onClick={() => redirectToDetails(row._id)}
                            >
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.order_code}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              align="left"
                              onClick={() => redirectToDetails(row._id)}
                            >
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {/* {row.order_date} */}
                                  {moment(new Date(row.order_date)).format(
                                    "DD-MM-YYYY"
                                  )}
                                </Typography>
                              </Box>
                            </TableCell>
                            {/* <TableCell
                                                                onClick={() => redirectToDetails(row._id)}>
                                                                <Box
                                                                    display={"flex"}
                                                                    flexWrap={"nowrap"}
                                                                    alignItems={"center"}
                                                                    style={{ height: '50px', width: '50px', margin: '0 auto' }}
                                                                >
                                                                    <img src={row.profile_pic} style={{ height: '100%', width: '100%', borderRadius: '50%' }} alt='profile-picture' />
                                                                </Box>
                                                            </TableCell> */}
                            {/* <TableCell
                                                                onClick={() => redirectToDetails(row.user_id)}>{row.gender}</TableCell>
                                                            <TableCell
                                                                onClick={() => redirectToDetails(row.user_id)}>{moment(row.date_of_birth).format("DD-MM-YYYY")}</TableCell> */}
                            <TableCell align="left">
                              <Typography variant={"body2"}>
                                {/* <Switch
                                                                        checked={row.status == 1 ? true : false}
                                                                        // onChange={(e) => handleChange(e, row._id)}
                                                                        color="primary"
                                                                        name="checkedB"
                                                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                                                    /> */}
                                {row.is_deleted == 0 ? (
                                  <span
                                    class="label success"
                                    style={{
                                      backgroundColor: "#d9534f",
                                      display: "inline",
                                      padding: ".2em .6em .3em",
                                      fontSize: "75%",
                                      fontWeight: "700",
                                      lineHeight: "1",
                                      color: "#fff",
                                      textAlign: "center",
                                      whiteSpace: "nowrap",
                                      verticalAlign: "baseline",
                                      borderRadius: ".25em",
                                    }}
                                  >
                                    No
                                  </span>
                                ) : row.is_deleted == 1 ? (
                                  <span
                                    class="label success"
                                    style={{
                                      backgroundColor: "#5bc0de",
                                      display: "inline",
                                      padding: ".2em .6em .3em",
                                      fontSize: "75%",
                                      fontWeight: "700",
                                      lineHeight: "1",
                                      color: "#fff",
                                      textAlign: "center",
                                      whiteSpace: "nowrap",
                                      verticalAlign: "baseline",
                                      borderRadius: ".25em",
                                    }}
                                  >
                                    Yes
                                  </span>
                                ) : (
                                  ""
                                )}
                              </Typography>
                            </TableCell>
                            {/* <TableCell
                                                                onClick={() => redirectToDetails(row._id)}>{row.created_at}
                                                            </TableCell> */}
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
              count={users.data.order.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default withRouter(Draft);
