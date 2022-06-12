import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import {
  Grid,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  Toolbar,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// styles
import useStyles from "./styles";

// components
import Widget from "../../components/Widget";
import { Typography } from "../../components/Wrappers";
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
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
    width: "200px",
    sort: true,
  },
  {
    id: "profile_pic",
    numeric: true,
    center: true,
    disablePadding: false,
    label: "Profile Picture",
    sort: false,
  },
  {
    id: "gender",
    numeric: true,
    disablePadding: false,
    label: "Gender",
    sort: true,
  },
  {
    id: "date_of_birth",
    numeric: true,
    disablePadding: false,
    label: "Date of birth",
    sort: true,
  },
  {
    id: "created_date",
    numeric: true,
    disablePadding: false,
    label: "Registered At",
    sort: true,
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

function Dashboard(props) {
  var classes = useStyles();
  const context = useDashboardState();
  var [users, setBackUsers] = useState(context.users.users);

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("created_date");

  useEffect(() => {
    getTotalUsersOnPlatform(context.setTotalUsers);
    // getRecentlyRegisteredUsersRequest(context.setRecentUsers);
  }, []); // eslint-disable-line

  useEffect(() => {
    setBackUsers(context.users.users);
  }, [context]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  console.log("props-=in render-=-=", props);

  return (
    <Grid container spacing={3}>
      {/* {!context.users.isLoaded || !users.data ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100vw"}
          height={"calc(100vh - 200px)"}
        >
          <CircularProgress size={50} />
        </Box>
      ) : ( */}
      <>
        <Grid item lg={6} sm={6} xs={12}>
          <Widget
            bodyClass={classes.fullHeightBody}
            className={classes.card}
            disableWidgetMenu
            noBodyPadding
          >
            <Grid container spacing={12}>
              <Grid item xs={6} style={{ display: "flex" }}>
                <Box className={classes.iconContainer}>
                  <PeopleAltIcon
                    style={{ fontSize: "50px", color: "#ffffff" }}
                  />
                </Box>
                <Box className={classes.totalContainer}>
                  <Typography variant="h2" weight="medium">
                    {context.totalUsers.totalUsers.data
                      ? context.totalUsers.totalUsers.data.total_user
                      : 0}
                  </Typography>

                  <Typography color="text" variant={"caption"}>
                    Total Users
                  </Typography>
                </Box>
              </Grid>
              {/* <div xs={2}></div> */}
              <Grid item xs={6} style={{ display: "flex" }}>
                <Box className={classes.iconContainer}>
                  <BusinessCenterIcon
                    style={{ fontSize: "50px", color: "#ffffff" }}
                  />
                </Box>
                <Box className={classes.totalContainer}>
                  <Typography variant="h2" weight="medium">
                    {context.totalUsers.totalUsers.data
                      ? context.totalUsers.totalUsers.data.total_order
                      : 0}
                  </Typography>

                  <Typography color="text" variant={"caption"}>
                    Total Orders
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Widget>
        </Grid>
      </>
      {/* )} */}
    </Grid>
  );
}

export default withRouter(Dashboard);
