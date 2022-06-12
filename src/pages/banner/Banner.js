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
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
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

import useStyles from "./styles";
import alertify from "alertifyjs";
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/alertify.min.css";
import joi from "joi-browser";

//context
import {
  useBannerState,
  getBannerRequest,
  updateEducationStatus,
  deleteBanner,
  createBanner,
  updateBanner,
  uploadImage,
} from "../../context/BannerContext";

import { Typography } from "../../components/Wrappers/Wrappers";
import moment from "moment";
// Icons
import {
  Add as AddIcon,
  Search as SearchIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
import { apiCall, displayLog, validate } from "../../common/common";
const FormData = require("form-data");
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
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "TITLE",
    sort: true,
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "DESCRIPTION",
    sort: true,
  },
  {
    id: "start_date",
    numeric: true,
    disablePadding: false,
    label: "START DATE",
    sort: true,
  },
  {
    id: "end_date",
    numeric: true,
    disablePadding: false,
    label: "END DATE",
    sort: true,
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

const Banner = () => {
  const classes = useStyles();
  const context = useBannerState();
  var [educations, setBackEducations] = useState(context.educations.educations);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("title");
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

  let stdate = JSON.stringify(formValues.start_date); //"2020-11-11";
  let [selectedDate, setSelectedDate] = useState(stdate);
  const handleDateChange = (date) => {
    console.log(moment(new Date(date)).format("YYYY-MM-DD"));
    let sdata = moment(new Date(date)).format("YYYY-MM-DD");
    setSelectedDate(sdata);
    /* setFormValues({
            ...formValues,
            start_date: sdata,
          }); */
  };
  let edate = JSON.stringify(formValues.end_date); //"2020-11-11";
  let [endSelectedDate, setEndSelectedDate] = useState(edate);
  const handleEndDateChange = (date) => {
    let eedata = moment(new Date(date)).format("YYYY-MM-DD");
    setEndSelectedDate(eedata);
  };

  // console.log(selectedDate,"end : ",endSelectedDate);

  const state = {
    file: "",
  };

  useEffect(() => {
    getBannerRequest(context.setEducations);
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
  const handleOnUploadFile = (e) => this.state({ file: e.target.files[0] });
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

  const handleSearch = (e) => {
    let value = e.currentTarget.value.replace(/^\s+/, "");
    setSearchVal(value);
    setPage(0);

    const newArr = educationRows.data.filter((c) => {
      return c.education_degree.toLowerCase().includes(value.toLowerCase());
    });
    setBackEducations({ isLoaded: true, data: newArr });
  };

  const handleChange = async (event, education_id) => {
    await updateEducationStatus(context.setEducations, {
      is_active: event.target.checked ? 1 : 0,
      education_id: education_id,
    });
    await getBannerRequest(context.setEducations);
  };
  const deleteEducationHandler = async (e, banner_id) => {
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await deleteBanner(context.setEducations, {
            id: banner_id,
          });
          await getBannerRequest(context.setEducations);
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
    if (wantToEdit) {
      setSelectedDate("");
      setEndSelectedDate("");
    } else {
      setSelectedDate(moment(new Date()).format("YYYY-MM-DD"));
      setEndSelectedDate(moment(new Date()).format("YYYY-MM-DD"));
    }
  };
  /* let images = ""
    // const fileSelectHandler = (e) => {
        // var formValues = formValues;
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files)
            let imageType = e.target.files[0].type;
            if (imageType === 'image/jpeg' || imageType === 'image/png' || imageType === 'image/jpg') {
                let reader = new FileReader();
                reader.onload = (e) => {
                    formValues.image = e.target.result
                    // this.setState({ formValues: formValues });
                };
                reader.readAsDataURL(e.target.files[0]);
                let images = e.target.files[0]
                console.log("formvaluessss", e.target.files[0])
            }
            else {
                displayLog(0, "invalid Image")
            }
        }
    // } */
  if (
    (selectedDate == "" || selectedDate == null) &&
    wantToEdit && formValues.start_date != ""
  ) {
    selectedDate = formValues.start_date;
    setSelectedDate(formValues.start_date);
  }
  if (
    (endSelectedDate == "" || endSelectedDate == null) &&
    wantToEdit && formValues.end_date != ""
  ) {
    endSelectedDate = formValues.end_date;
    setEndSelectedDate(formValues.end_date);
  }
  if (selectedDate && selectedDate.length > 10) {
    setSelectedDate(moment(new Date(selectedDate)).format("YYYY-MM-DD"));
    console.log("SelectedDate", selectedDate);
  }
  if (endSelectedDate && endSelectedDate.length > 10) {
    setEndSelectedDate(moment(new Date(endSelectedDate)).format("YYYY-MM-DD"));
    console.log("endSelectedDate", endSelectedDate);
  }
  const submitEducationHandler = () => {
    let reqData = {
      title: formValues.title,
      description: formValues.description,
      link: formValues.link,
      // start_date: formValues.start_date,
      // end_date: formValues.end_date,
      start_date: selectedDate,
      end_date: endSelectedDate,
    };
    console.log(reqData);
    validateFormData(reqData);
  };
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      title: joi.required(),
      description: joi.required(),
      link: joi.required(),
      start_date: joi.required(),
      end_date: joi.required(),
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
          // let reqImg = {
          //     image: formValues.file
          // }
          bodyFormData.append("image", formValues.file);
          // let Img = await uploadImage(context.setEducations, bodyFormData)
          // console.log(Img)
          let res = await apiCall(
            "POST",
            "",
            "/admin/banner/upload-image",
            bodyFormData
          ); // modification
          // console.log(res.data.data.image)
          if (res.data) {
            if (res.data.code === 0) {
              displayLog(0, res.data.message);
            } else {
              // displayLog(1, res.data.message)
              ImageLink = res.data.data.image;
            }
          }
        }
        if (wantToEdit) {
          reqData = {
            title: formValues.title,
            description: formValues.description,
            link: formValues.link,
            // start_date: formValues.start_date,
            // end_date: formValues.end_date,
            start_date: selectedDate,
            end_date: endSelectedDate,
            banner_id: formValues._id,
            // image: ImageLink,
          };
          if (formValues.file && formValues.file != "") {
            reqData["image"] = ImageLink;
          } else {
            reqData["image"] = formValues.image;
          }
          // console.log(reqData)
          await updateBanner(context.setEducations, reqData);
        } else {
          reqData = {
            title: formValues.title,
            description: formValues.description,
            link: formValues.link,
            // start_date: formValues.start_date,
            // end_date: formValues.end_date,
            start_date: selectedDate,
            end_date: endSelectedDate,
            image: ImageLink,
          };
          console.log(reqData);
          await createBanner(context.setEducations, reqData);
        }
        await getBannerRequest(context.setEducations);
        setToggleInputModal(false);
        setIsLoading(false);
      }
    });
  };
  // console.log("product data",context.products.products.data)
  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Banner Ads Management</span>
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
                {educations.data.banner.length > 0 ? (
                  <TableBody>
                    {stableSort(
                      educations.data.banner,
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
                                  {row.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.description}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.start_date}
                                  {/* {JSON.stringify(new Date(row.start_date)).slice(1,11)} */}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.end_date}
                                  {/* {JSON.stringify(new Date(row.end_date)).slice(1,11)} */}
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
              count={educations.data.banner.length}
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
          {wantToEdit ? "Edit" : "Add"} Banner Ads
        </DialogTitle>
        <DialogContent>
          <Input
            label="Title"
            placeholder={"Title"}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                title: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.title}
            fullWidth
          />
          {errorField === "title" && <ErrorMessage error={error} />}
          <Input
            label="Description"
            placeholder={"Description"}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                description: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.description}
            fullWidth
          />
          {errorField === "description" && <ErrorMessage error={error} />}
          <Input
            label="Link"
            placeholder={"Link"}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                link: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.link}
            fullWidth
          />
          {errorField === "link" && <ErrorMessage error={error} />}
          {/* <Input
                        label='Start Date'
                        placeholder={"Start Date (yyyy-mm-dd)"}
                        margin="normal"
                        variant="outlined"
                        onChange={e => setFormValues({ ...formValues, start_date: e.target.value })}
                        InputProps={{
                            classes: {
                                underline: classes.InputUnderline,
                                input: classes.Input
                            }
                        }}
                        value={formValues.start_date}
                        fullWidth
                    />
                    {errorField === 'start_date' && <ErrorMessage error={error} />}
                    <Input
                        label='End Date'
                        placeholder={"End Date (yyyy-mm-dd)"}
                        margin="normal"
                        variant="outlined"
                        onChange={e => setFormValues({ ...formValues, end_date: e.target.value })}
                        InputProps={{
                            classes: {
                                underline: classes.InputUnderline,
                                input: classes.Input
                            }
                        }}
                        value={formValues.end_date}
                        fullWidth
                    />
                    {errorField === 'end_date' && <ErrorMessage error={error} />} */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              variant="inline"
              id="date-picker-inline"
              label="Start Date"
              format="yyyy-MM-dd"
              fullWidth
              // value={JSON.stringify(formValues.start_date0)}
              // onChange={e => setFormValues({ ...formValues, start_date: JSON.stringify(e.target.value) })}
              value={
                wantToEdit && selectedDate == ""
                  ? JSON.stringify(formValues.start_date0)
                  : selectedDate
              }
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            {errorField === "start_date" && <ErrorMessage error={error} />}
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              variant="inline"
              id="date-picker-inline"
              label="End Date"
              format="yyyy-MM-dd"
              fullWidth
              // value={JSON.stringify(formValues.end_date)}
              // onChange={e => setFormValues({ ...formValues, end_date: e.target.value })}
              value={
                wantToEdit
                  ? JSON.stringify(formValues.end_date)
                  : endSelectedDate
              }
              onChange={handleEndDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            {errorField === "end_date" && <ErrorMessage error={error} />}
          </MuiPickersUtilsProvider>
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
            name="file"
            // onChange={e => handleOnUploadFile(e)}
            onChange={(e) =>
              setFormValues({ ...formValues, file: e.target.files[0] })
            }
            margin="normal"
            variant="outlined"
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
          />
          <div></div>

          {wantToEdit && formValues.image != "" ? (
            <img
              src={formValues.image}
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

export default Banner;
