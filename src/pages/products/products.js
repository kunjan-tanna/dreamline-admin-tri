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
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";

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
  { numeric: true, disablePadding: false, label: "#", sort: false },
  {
    id: "product_name",
    numeric: true,
    disablePadding: false,
    label: "Product Name",
    width: "200px",
    sort: true,
  },
  {
    id: "category",
    numeric: true,
    center: true,
    disablePadding: false,
    label: "Category",
    sort: false,
  },
  {
    id: "size_type",
    numeric: true,
    center: false,
    disablePadding: false,
    label: "Size Type",
    sort: false,
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
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

function Products(props) {
  const classes = useStyles();
  const history = useHistory();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortby, setSortby] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [toggleEditProductModal, setToggleEditProductModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [wantToEdit, setWantToEdit] = useState(false);

  // const [limit, setLimit] = useState(5);

  useEffect(() => {
    setLoading(true);
    getProducts();
  }, []);
  const getProducts = async () => {
    const reqparam = {
      // type: "forList",
      page: page !== 1 ? 1 : 1,
      limit: 1000000,
      sortby: 1,
      sortorder: "asc",
      // sort: 0,
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/product/product-list",
      {},
      {},

      reqparam
    );

    if (res.data.status == true) {
      console.log("check API", res.data);
      setLoading(false);
      if (res.data.data.product.length > 0) {
        setProducts(res.data.data.product);
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
  const manageEditProductModal = (productId) => {
    setLoading(true);
    setTimeout(() => {
      if (productId) {
        setLoading(false);
        setProductId(productId);
        setToggleEditProductModal(true);
      }
    }, 1000);
  };
  const handleSubmit = (info) => {
    console.log("HELLO", info);
    setName(info);
  };
  //Delete the particular record
  const deleteProducts = async (e, productId) => {
    console.log("EDIII", productId);
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await delProducts(productId);
          // await window.location.reload();
          await getProducts();
        }
      })
      .setHeader("<em>Dreamline</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };
  //Del call API
  const delProducts = async (id) => {
    console.log("IDDD", id);
    const reqParms = {
      product_id: id,
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/product/delete-product",
      {},
      {},

      reqParms
    );
    console.log("check API====", res);
  };

  //Change the status
  const handleChangeSelect = async (e, productId, status) => {
    e.preventDefault();
    await ChangeStatus(productId, status);
    // await window.location.reload();
    await getProducts();
  };
  //API CALL CHANGE STATUS
  const ChangeStatus = async (productId, status) => {
    const reqBody = {
      product_id: +productId,
      status: status == 0 ? 1 : 0,
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/product/change-status",
      reqBody
    );
    // console.log("UPDATESTATUS", res);
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

  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Products</span>
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
                    rowCount={products.length}
                  />

                  {products && products.length > 0 ? (
                    <TableBody>
                      {stableSort(products, getComparator(order, orderBy))
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
                                    {item.product_name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant={"body2"}>
                                  {item.category_name
                                    ? item.category_name
                                    : "-"}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography variant={"body2"}>
                                  {item.parameters ? item.parameters : "-"}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography variant={"body2"}>
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

                              <TableCell align="left">
                                <Box display={"flex"} justifyContent={"center"}>
                                  <IconButton
                                    color={"primary"}
                                    onClick={() =>
                                      manageEditProductModal(item._id)
                                    }
                                  >
                                    <CreateIcon />
                                  </IconButton>
                                  <IconButton
                                    color={"primary"}
                                    onClick={(e) => deleteProducts(e, item._id)}
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
            <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
            <DialogContent>
              <AddProduct
                handleSubmit={handleSubmit}
                ToggleInputModal={setToggleInputModal}
                getProducts={getProducts}
              />
            </DialogContent>
          </Dialog>
          {/* UPDATE CATEGORY MODAL */}
          <Dialog
            open={toggleEditProductModal}
            onClose={() => setToggleEditProductModal(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Update Product</DialogTitle>
            <DialogContent>
              <UpdateProduct
                productId={productId}
                handleSubmit={handleSubmit}
                ToggleInputModal={setToggleEditProductModal}
                getProducts={getProducts}
              />
            </DialogContent>
          </Dialog>{" "}
        </>
      )}
    </Grid>
  );
}

export default withRouter(Products);
