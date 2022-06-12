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
  CircularProgress,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";
import alertify from "alertifyjs";

// styles
import useStyles from "./styles";
import { Button } from "../../components/Wrappers";

// components
import Widget from "../../components/Widget/Widget";
import { Typography } from "../../components/Wrappers/Wrappers";
import { PeopleAlt as PeopleAltIcon } from "@material-ui/icons";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import { lighten } from "@material-ui/core/styles";
import moment from "moment";

//context
import {
  useDashboardState,
  getRecentlyRegisteredUsersRequest,
  getTotalUsersOnPlatform,
} from "../../context/DashboardContext";
// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
import { apiCall, displayLog } from "../../common/common";

function descendingComparator(a, b, orderBy) {
  console.log("ORDERR", orderBy);
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
  console.log("stabilizedThis", stabilizedThis);
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
  {
    numeric: true,
    disablePadding: false,
    label: "ID",
    sort: false,
    width: "50px",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "NAME",
    sort: true,
    width: "200px",
  },

  {
    id: "is_active",
    numeric: true,
    disablePadding: false,
    label: "STATUS",
    sort: false,
    width: "100px",
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

function EnhancedTableHead(props) {
  console.log("PROPSS---", props);
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

function StyleBundle(props) {
  const classes = useStyles();
  const history = useHistory();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [styleBundle, setStyleBundle] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortby, setSortby] = useState(1);
  const [loading, setLoading] = useState(false);

  // const [limit, setLimit] = useState(5);

  useEffect(() => {
    setLoading(true);
    getStyleBundle();
  }, []);
  const getStyleBundle = async () => {
    const reqBody = {
      type: "forList",
      search: "",
      page: page !== 1 ? 1 : 1,
      limit: 1000000,
      sortby: "created_at",
      sort: 0,
      sortorder: "asc",
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/stylebundle/list",

      reqBody
    );
    console.log("PAGINATION", page);

    if (res.data.status == true) {
      console.log("check API", res.data);
      setLoading(false);
      if (res.data.data.style_bundles.length > 0) {
        setStyleBundle(res.data.data.style_bundles);
        setTotal(res.data.data?.total);
      }
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    console.log("PROPPP", isAsc);
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageCount(1);
  };
  const handleChangePage = (event, newPage) => {
    console.log("NEW PAGE", newPage);
    setPage(newPage);
    setPageCount(newPage);
  };

  // console.log("styleBundle", styleBundle);
  //Delete the particular record
  const deleteEducationHandler = async (e, styleBundle_id) => {
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await delStyleBundle(styleBundle_id);
          await getStyleBundle();
          // await window.location.reload();
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
          // window.location.reload();
        }
      })
      .setHeader("<em>Dreamline</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };
  //Del call API
  const delStyleBundle = async (id) => {
    console.log("IDDD", id);
    const reqBody = {
      style_bundle_id: id,
    };

    let res = await apiCall(
      "DELETE",
      "",
      "/admin/stylebundle/delete",

      reqBody
    );
    console.log("check API====", res);
  };
  //Change the status
  const handleChangeSelect = async (e, styleBundle_id, status) => {
    e.preventDefault();
    await ChangeStatus(styleBundle_id, status);
    await getStyleBundle();
    // await window.location.reload();
  };
  //API CALL CHANGE STATUS
  const ChangeStatus = async (styleBundle_id, status) => {
    const reqBody = {
      style_bundle_id: styleBundle_id,
      status: status == 0 ? 1 : 0,
    };

    let res = await apiCall(
      "PUT",
      "",
      "/admin/stylebundle/update-status",

      reqBody
    );
    if (res.data.status == true) {
      if (res.data.data) {
        setTimeout(() => {
          displayLog(1, res.data.message);
        }, 500);
      }
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
    console.log("UPDATESTATUS", res);
  };
  //Update the record
  const manageModal = async (wantToEdit, styleBundle) => {
    history.push({
      pathname: process.env.PUBLIC_URL + "/app/updatestylebundle/",
      state: { style_bundle_id: styleBundle._id, status: styleBundle.status },
    });
  };
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Style Bundles</span>
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
                onClick={() => history.push("/app/addstylebundle")}
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
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table aria-labelledby="tableTitle" aria-label="enhanced table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={styleBundle.length}
              />

              {styleBundle && styleBundle.length > 0 ? (
                <TableBody>
                  {console.log(
                    "enhanced",
                    pageCount * rowsPerPage,
                    "jgjgjgjgj",
                    page * rowsPerPage + rowsPerPage
                  )}
                  {stableSort(styleBundle, getComparator(order, orderBy))
                    .slice(
                      pageCount * rowsPerPage,
                      pageCount * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={index}>
                          <TableCell component="th" scope="row" align="left">
                            <Typography variant={"body2"}>
                              {pageCount * rowsPerPage + index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Box display={"flex"} alignItems={"center"}>
                              <Typography variant={"body2"}>
                                {row.name}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="left">
                            <Typography variant={"body2"}>
                              <Switch
                                checked={row.status === 1 ? true : false}
                                onChange={(e) =>
                                  handleChangeSelect(e, row._id, row.status)
                                }
                                color="primary"
                                name="checkedB"
                                inputProps={{
                                  "aria-label": "primary checkbox",
                                }}
                              />
                            </Typography>
                          </TableCell>
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
            count={total}
            rowsPerPage={rowsPerPage}
            page={pageCount}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default withRouter(StyleBundle);
