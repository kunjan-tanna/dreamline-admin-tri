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

// styles
import useStyles from "./styles";
import { Button } from "../../components/Wrappers/Wrappers";
import alertify from "alertifyjs";
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
import AddProductModification from "./AddProductModification";
import UpdateProductModification from "./UpdateProductModification";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
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
    id: "size",
    numeric: true,
    disablePadding: false,
    label: "SIZE",
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

function ProductModification(props) {
  const classes = useStyles();
  const history = useHistory();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [name, setName] = useState("");
  const [modificationsList, setModificationList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [toggleEditCatModal, setToggleEditModiModal] = useState(false);
  const [modificationId, setModificationId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getModification();
  }, []);

  const getModification = async () => {
    const reqBody = {
      page: page !== 1 ? 1 : 1,
      limit: 1000000,
      sortby: 1,
      sortorder: "asc",
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/modification/modification-list",
      reqBody
    );

    if (res.data.status == true) {
      console.log("check API", res.data);
      setLoading(false);
      if (res.data.data.modification.length > 0) {
        setModificationList(res.data.data.modification);
        setTotal(res.data.data?.total);
      }
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageCount(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageCount(newPage);
  };
  //Open the add category modal dialog
  const manageModal = () => {
    setToggleInputModal(true);
  };
  //OPEN THE UPDATE CATEGORY MODAL
  const manageEditModiModal = (modId) => {
    console.log("modId", modId);
    setLoading(true);
    // setTimeout(() => {
    if (modId) {
      setLoading(false);
      setModificationId(modId);
      setToggleEditModiModal(true);
    }
    // }, 1000);
  };
  const handleSubmit = (info) => {
    console.log("HELLO", info);
    setName(info);
  };
  //Delete the particular record
  const deleteModification = async (e, modId) => {
    // console.log("EDIII", modId);
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await delModification(modId);
          // await window.location.reload();
          await getModification();
        }
      })
      .setHeader("<em>Dreamline</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };
  //Del call API
  const delModification = async (id) => {
    console.log("IDDD", id);
    const reqBody = {
      modification_id: id,
    };

    let res = await apiCall(
      "DELETE",
      "",
      "/admin/modification/delete-modification",

      reqBody
    );
    console.log("check API====", res);
  };

  //Change the status
  const handleChangeSelect = async (e, modId, status) => {
    e.preventDefault();
    await ChangeStatus(modId, status);
    await getModification();
    // await window.location.reload();
  };
  //API CALL CHANGE STATUS
  const ChangeStatus = async (modId, status) => {
    const reqBody = {
      modification_id: +modId,
      status: status == 0 ? 1 : 0,
    };

    let res = await apiCall(
      "PUT",
      "",
      "/admin/modification/update-status",
      reqBody
    );
    console.log("UPDATESTATUS", res);
    if (res.data.status == true) {
      if (res.data) {
        setTimeout(() => {
          displayLog(1, res.data.message);
        }, 500);
      }
    } else if (res.data.status == false) {
      displayLog(0, res.data.message);
    }
  };
  // const sizeData = [{ size: "12*11*22" }];
  // console.log("ssssss", sizeData.toString());
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Product Modifications</span>
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
                onClick={() => manageModal()}
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
      {console.log("LOADING", loading)}
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
      ) : (
        <>
          <Grid item xs={12}>
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table aria-labelledby="tableTitle" aria-label="enhanced table">
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={modificationsList.length}
                  />

                  {modificationsList && modificationsList.length > 0 ? (
                    <TableBody>
                      {stableSort(
                        modificationsList,
                        getComparator(order, orderBy)
                      )
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
                                    {item.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="left">
                                <Box display={"flex"} alignItems={"center"}>
                                  <Typography variant={"body2"}>
                                    {/* {item.size ? item.size : "-"} */}
                                    {item.size_array.length > 0
                                      ? item.size_array.toString()
                                      : "-"}
                                  </Typography>
                                </Box>
                              </TableCell>

                              <TableCell align="left">
                                <Typography
                                  variant={"body2"}
                                  alignItems={"center"}
                                >
                                  <Switch
                                    checked={item.status === 1 ? true : false}
                                    onChange={(e) =>
                                      handleChangeSelect(
                                        e,
                                        item._id,
                                        item.status
                                      )
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
                                    onClick={() =>
                                      manageEditModiModal(item._id)
                                    }
                                  >
                                    <CreateIcon />
                                  </IconButton>
                                  <IconButton
                                    color={"primary"}
                                    onClick={(e) =>
                                      deleteModification(e, item._id)
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
          {/* ADD CATEGORY MODAL */}
          <Dialog
            open={toggleInputModal}
            onClose={() => setToggleInputModal(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Add Product Modification
            </DialogTitle>
            <DialogContent>
              <AddProductModification
                handleSubmit={handleSubmit}
                ToggleInputModal={setToggleInputModal}
                getModification={getModification}
              />
            </DialogContent>
          </Dialog>
          {/* UPDATE SIZE MODAL */}
          <Dialog
            open={toggleEditCatModal}
            onClose={() => setToggleEditModiModal(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Update Product Modification
            </DialogTitle>
            <DialogContent>
              <UpdateProductModification
                modificationId={modificationId}
                handleSubmit={handleSubmit}
                ToggleInputModal={setToggleEditModiModal}
                getModification={getModification}
              />
            </DialogContent>
          </Dialog>{" "}
        </>
      )}
    </Grid>
  );
}

export default withRouter(ProductModification);
