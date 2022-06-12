import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  InputAdornment,
  TextField as Input,
  CircularProgress,
  Select,
  Divider,
  MenuItem,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Widget from "../../components/Widget/Widget";
import { Button } from "../../components/Wrappers/Wrappers";
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import FormControl from "@material-ui/core/FormControl";
import useStyles from "./styles";
import alertify from "alertifyjs";
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/alertify.min.css";
import joi from "joi-browser";

//context
import {
  useFaqState,
  getFaqRequest,
  updateFaq,
  deleteFaq,
  createFaq,
  updateFaqStatus,
} from "../../context/FaqContext";

import { Typography } from "../../components/Wrappers/Wrappers";

// Icons
import {
  Add as AddIcon,
  Search as SearchIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
import { validate } from "../../common/common";

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
    id: "question",
    numeric: true,
    disablePadding: false,
    label: "Question",
    sort: true,
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "STATUS",
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

const Faq = () => {
  const classes = useStyles();
  const context = useFaqState();
  var [educations, setBackEducations] = useState(context.educations.educations);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("question");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [educationRows, setEducationRows] = useState(
    context.educations.educations
  );
  const [formValues, setFormValues] = useState({});
  const [wantToEdit, setWantToEdit] = useState(false);
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [action, setAction] = useState("Action");

  useEffect(() => {
    getFaqRequest(context.setEducations);
    // getProductListRequest(context.setProductList);
  }, []); // eslint-disable-line

  useEffect(() => {
    setBackEducations(context.educations.educations);
    setEducationRows(context.educations.educations);
  }, [context]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeSelect = (e) => {
    // setAction(e.target.value);
    setFormValues({
      ...formValues,
      product_id: e.target.value,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* const fileSelectHandler = (e) => {
        var state = { ...this.state };
        if (e.target.files && e.target.files[0]) {
            let imageType = e.target.files[0].type;
            if (imageType === 'image/jpeg' || imageType === 'image/png' || imageType === 'image/jpg') {
                profilePic = e.target.files[0];
                let reader = new FileReader();
                reader.onload = (e) => {
                    state.ImageUrl = e.target.result;
                    state.base64Pic = e.target.result
                    this.setState(state);
                };
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = function (e) {

                    //Initiate the JavaScript Image object.
                    var image = new Image();

                    //Set the Base64 string return from FileReader as source.
                    image.src = e.target.result;

                    //Validate the File Height and Width.
                    image.onload = function () {
                        var height = this.height;
                        var width = this.width;
                        console.log('\n\n RTRTRTRTRTRTTRTRTRT-->', height, width);
                        if (height > 100 || width > 100) {
                            //   alert("Height and Width must not exceed 100px.");
                            return false;
                        }
                        alert("Uploaded image has valid Height and Width.");
                        return true;
                    };
                }
            }
            else {
                displayLog(0, 'Please select valid image!')
            }
        }
    } */

  const handleSearch = (e) => {
    let value = e.currentTarget.value.replace(/^\s+/, "");
    setSearchVal(value);
    setPage(0);

    const newArr = educationRows.data.filter((c) => {
      return c.education_degree.toLowerCase().includes(value.toLowerCase());
    });
    setBackEducations({ isLoaded: true, data: newArr });
  };

  const handleChange = async (event, id) => {
    await updateFaqStatus(context.setEducations, {
      status: event.target.checked ? 1 : 0,
      faq_id: id,
    });
    await getFaqRequest(context.setEducations);
  };
  const deleteEducationHandler = async (e, id) => {
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await deleteFaq(context.setEducations, {
            id: id,
          });
          await getFaqRequest(context.setEducations);
        }
      })
      .setHeader("<em>Dreamline</em> ")
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
      question: formValues.question,
      answer: formValues.answer,
      status: formValues.status,
    };
    validateFormData(reqData);
  };
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      question: joi.required(),
      answer: joi.required(),
      status: joi.required(),
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
        if (wantToEdit) {
          reqData = {
            question: formValues.question,
            answer: formValues.answer,
            status: formValues.status,
            faq_id: formValues._id,
          };
          console.log(reqData);
          await updateFaq(context.setEducations, reqData);
        } else {
          reqData = {
            question: formValues.question,
            answer: formValues.answer,
            status: formValues.status,
          };
          console.log(reqData);
          await createFaq(context.setEducations, reqData);
        }
        await getFaqRequest(context.setEducations);
        setToggleInputModal(false);
        setIsLoading(false);
      }
    });
  };
  // console.log("product data",context.products.products.data)
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Faq Management</span>
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
            >
              {/* <Input
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
                            /> */}
            </Box>
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
                {educations.data.faq.length > 0 ? (
                  <TableBody>
                    {stableSort(
                      educations.data.faq,
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
                                  {row.question}
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant={"body2"}>
                                <Switch
                                  checked={row.status === 1 ? true : false}
                                  onChange={(e) => handleChange(e, row._id)}
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
            {/* {console.log("PAGE", page)} */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={educations.data.faq.length}
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
          {wantToEdit ? "Edit" : "Add"} Faq
        </DialogTitle>
        <DialogContent>
          <Input
            label="Question"
            placeholder={"Question"}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                question: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.question}
            fullWidth
          />
          {errorField === "question" && <ErrorMessage error={error} />}
          <Input
            label="Answer"
            placeholder={"Answer"}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                answer: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.answer}
            fullWidth
          />
          {errorField === "answer" && <ErrorMessage error={error} />}
          {/* <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                <Select
                    className={classes.formControl}
                    id="demo-simple-select-outlined"
                    style={{ 'marginBottom': '20px' }}
                    value={formValues.status}
                    label='Status'
                    placeholder={"Status"}
                    // margin="normal"
                    variant="outlined"
                    type="number"
                    fullWidth
                    onChange={e => setFormValues({ ...formValues, status: e.target.value})}
                    inputProps={{
                      name: 'status',
                      id: 'status',
                    }}
                  >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Deactivated</MenuItem>
                  </Select>
                  {errorField === 'status' && <ErrorMessage error={error} />} */}

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
              label="Category"
              value={formValues.status}
              onChange={(e) =>
                setFormValues({ ...formValues, status: e.target.value })
              }
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Deactivated</MenuItem>
            </Select>
            {errorField === "status" && <ErrorMessage error={error} />}
          </FormControl>
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

export default Faq;
