import React, { useEffect, useState } from 'react'
import {
    Grid,
    Box,
    InputAdornment,
    TextField as Input,
    CircularProgress,
    Tabs,
    Tab
} from '@material-ui/core'
import Widget from '../../components/Widget'
import { Button } from '../../components/Wrappers'
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel
} from '@material-ui/core';

import useStyles from "./styles";
import moment from 'moment'
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'
import { CSVLink } from "react-csv";
//context
import {
    useReportsState,
    getReportsOfRegisteredUsersRequest,
} from "../../context/ReportsContext";

import { Typography } from '../../components/Wrappers'

// Icons
import {
    Search as SearchIcon,
    CalendarTodayOutlined as CalendarTodayOutlinedIcon,
    CancelOutlined as CancelOutlinedIcon,
    GetApp as DownloadIcon,
} from '@material-ui/icons'

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
}

const headCells = [
    { numeric: true, disablePadding: false, label: '#', sort: false },
    { id: "name", numeric: true, disablePadding: false, label: "NAME", width: '200px', sort: true },
    { id: "profile_pic", numeric: true, center: true, disablePadding: false, label: "PROFILE PICTURE", sort: false },
    { id: "gender", numeric: true, disablePadding: false, label: "GENDER", sort: true },
    { id: "date_of_birth", numeric: true, disablePadding: false, label: "DATE OF BIRTH", sort: true },
    { id: 'reason', numeric: true, disablePadding: false, label: 'REASON', sort: false },
    { id: 'created_date', numeric: true, disablePadding: false, label: 'REPORTED_AT', sort: false },
    { id: "registered_at", numeric: true, disablePadding: false, label: "REGISTERED AT", sort: true }
];
function EnhancedTableHead(props) {
    const {
        order,
        orderBy,
        onRequestSort,
    } = props
    const createSortHandler = property => event => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, index) => (
                    <TableCell
                        width={headCell.width}
                        key={index}
                        align={headCell.center ? 'center' : headCell.numeric ? 'left' : 'right'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sort ?
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                <Typography
                                    noWrap
                                    weight={'medium'}
                                    variant={'body2'}
                                >
                                    {headCell.label}
                                </Typography>
                            </TableSortLabel>
                            :
                            <Typography
                                noWrap
                                weight={'medium'}
                                variant={'body2'}
                            >
                                {headCell.label}
                            </Typography>
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}


const Reports = (props) => {
    const classes = useStyles();
    const context = useReportsState();
    var [reports, setBackReportsOfRegisteredUsers] = useState([]);
    const [order, setOrder] = useState('desc')
    const [orderBy, setOrderBy] = useState('created_date')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [ReportsOfRegisteredUsersRows, setReportsOfRegisteredUsersRows] = useState([])
    const [searchVal, setSearchVal] = useState('');
    const [fromDate, setFromDate] = useState('')
    const [csvData, setCSVData] = useState([])

    const [toDate, setToDate] = useState('')
    const [tab, setTab] = useState(0)



    useEffect(() => {
        getReportsOfRegisteredUsersRequest(context.setReportsOfRegisteredUsers);
    }, []); // eslint-disable-line

    useEffect(() => {
        setBackReportsOfRegisteredUsers(context.reports.reports);
        setReportsOfRegisteredUsersRows(context.reports.reports);
        let csvRecords = []
        context.reports.reports.data && context.reports.reports.data.map((report) => {
            csvRecords.push({
                "Name": report.name,
                "Gender": report.gender,
                "Date of Birth": moment(report.date_of_birth).format("DD-MM-YYYY"),
                "Profile Picture": report.profile_pic,
                "Reason": report.reason,
                "Registered At": moment(report.registered_at * 1000).format("DD-MM-YYYY hh:mm:ss A"),
                "Reported At": moment(report.created_date * 1000).format("DD-MM-YYYY hh:mm:ss A"),
            })
        })
        setCSVData(csvRecords)
    }, [context]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleSearch = e => {
        let value = e.currentTarget.value.replace(/^\s+/, "")
        setSearchVal(value)
        setPage(0)
        const newArr = ReportsOfRegisteredUsersRows.data.filter(c => {
            return c.name.toLowerCase().includes(value.toLowerCase())
        })
        setBackReportsOfRegisteredUsers({ isLoaded: true, data: newArr })
        let csvRecords = []
        newArr && newArr.map((report) => {
            csvRecords.push({
                "Name": report.name,
                "Gender": report.gender,
                "Date of Birth": moment(report.date_of_birth).format("DD-MM-YYYY"),
                "Profile Picture": report.profile_pic,
                "Reason": report.reason,
                "Registered At": moment(report.registered_at * 1000).format("DD-MM-YYYY hh:mm:ss A"),
                "Reported At": moment(report.created_date * 1000).format("DD-MM-YYYY hh:mm:ss A"),
            })
        })
        setCSVData(csvRecords)

    }

    const changeStartDate = async (e, wantToClear) => {
        if (!wantToClear) {
            setFromDate(moment(new Date(e)).format('DD-MM-YYYY'))
            setToDate('')
        } else {
            setFromDate('')
        }
    }

    const changeEndDate = async (e, wantToClear) => {
        if (!wantToClear) {
            setToDate(moment(new Date(e)).format('DD-MM-YYYY'))
            if (fromDate !== '') {
                let data = {
                    start_date: moment(fromDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    end_date: moment(new Date(e)).format('YYYY-MM-DD')
                }
                await getReportsOfRegisteredUsersRequest(context.setReportsOfRegisteredUsers, data);
                setSearchVal('')
                setPage(0)
            }
        } else {
            setToDate('')
            setSearchVal('')
            setPage(0)
            await getReportsOfRegisteredUsersRequest(context.setReportsOfRegisteredUsers);
        }
    }

    const startDateValidation = (currentDate) => {
        var today = moment(new Date());
        return currentDate.isBefore(today);
    }

    const endDateValidation = (currentDate) => {
        var today = moment(new Date());
        var yesterday = moment(new Date(fromDate)).subtract(1, 'day');
        return currentDate.isAfter(yesterday) && currentDate.isBefore(today);
        // return;
    }
    const handleChangeTab = (event, newValue) => {
        setTab(newValue)
    }

    return (
        <Grid container spacing={3}>
            <span className={classes.mainPageTitle}>Report Management</span>
            <Grid item xs={12}>
                <Widget>
                    <Box display={'flex'} justifyContent={'center'}>
                        <Tabs
                            value={0}
                            indicatorColor="primary"
                            textColor="primary"
                            value={tab}
                            onChange={handleChangeTab}
                            aria-label="full width tabs example"
                        >
                            <Tab label="USERS REGISTERED" />
                            <Tab label="USERS SUBSCRIBED" />
                        </Tabs>
                    </Box>
                </Widget>
            </Grid>
            {tab === 0 &&
                <Grid item xs={12}>
                    <Widget inheritHeight visibleOverflow>
                        <Box
                            justifyContent={'space-between'}
                            className={classes.filterWrapper}
                            alignItems={'center'}
                        >
                            <Box>
                                <div className={classes.datePickerWrapper}>
                                    <CalendarTodayOutlinedIcon
                                        className={classes.calendarIcon}
                                    />
                                    <Datetime
                                        className={['datePickerExtra']}
                                        timeFormat={false}
                                        isValidDate={(date) => startDateValidation(date)}
                                        onChange={changeStartDate}
                                        value={fromDate}
                                        dateFormat={'DD-MM-YYYY'}
                                        closeOnSelect={true}
                                        inputProps={{
                                            placeholder: 'From',
                                            readOnly: true,
                                            value: fromDate,
                                            style: {
                                                border: '1px solid rgb(196 196 196)',
                                                borderRadius: '16px',
                                                padding: '10.5px 30px 10.5px 40px',
                                                color: 'rgba(0, 0, 0, 0.85)',
                                                width: '100%',
                                            }
                                        }}
                                    />
                                    <CancelOutlinedIcon
                                        className={classes.closeIcon}
                                        onClick={(e) => changeStartDate(e, true)}
                                    />
                                </div>
                            </Box>
                            <Box>
                                <div className={classes.datePickerWrapper}>
                                    <CalendarTodayOutlinedIcon
                                        className={classes.calendarIcon}
                                    />
                                    <Datetime
                                        className={['datePickerExtra']}
                                        timeFormat={false}
                                        isValidDate={(date) => endDateValidation(date)}
                                        onChange={changeEndDate}
                                        value={toDate}
                                        dateFormat={'DD-MM-YYYY'}
                                        closeOnSelect={true}
                                        inputProps={{
                                            placeholder: 'To',
                                            readOnly: true,
                                            value: toDate,
                                            style: {
                                                border: '1px solid rgb(196 196 196)',
                                                borderRadius: '16px',
                                                padding: '10.5px 30px 10.5px 40px',
                                                color: 'rgba(0, 0, 0, 0.85)',
                                                width: '100%',
                                            }
                                        }}
                                    />
                                    <CancelOutlinedIcon
                                        className={classes.closeIcon}
                                        onClick={(e) => changeEndDate(e, true)}
                                    />
                                </div>
                            </Box>
                            <Box>
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
                            <Box>
                                {reports.data &&
                                    <CSVLink data={csvData} filename="reported-users.csv" style={{ textDecoration: 'none' }}>
                                        <Button variant={'outlined'} color={'primary'} disabled={reports.data && reports.data.length === 0}>
                                            <Box display={'flex'} mr={1}>
                                                <DownloadIcon />
                                            </Box>
                              Download
                          </Button></CSVLink>
                                }
                            </Box>
                        </Box>
                    </Widget>
                </Grid>

            }
            {!context.reports.isLoaded || !reports.data ? (
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
                        {tab === 0 ?
                            <Paper className={classes.root}>
                                <TableContainer className={classes.container}>
                                    <Table
                                        aria-labelledby="tableTitle"
                                        aria-label="enhanced table">

                                        <EnhancedTableHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                            rowCount={reports.data.length}
                                        />
                                        {reports.data.length > 0 ?
                                            <TableBody>
                                                {stableSort(reports.data, getComparator(order, orderBy))
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                tabIndex={-1}
                                                                key={index}
                                                            >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="left"
                                                                >
                                                                    <Typography
                                                                        variant={'body2'}
                                                                    >
                                                                        {(page * rowsPerPage) + index + 1}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    <Box
                                                                        display={'flex'}
                                                                        alignItems={'center'}
                                                                    >
                                                                        <Typography
                                                                            variant={'body2'}
                                                                        >
                                                                            {row.name}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box
                                                                        display={"flex"}
                                                                        flexWrap={"nowrap"}
                                                                        alignItems={"center"}
                                                                        style={{ height: '50px', width: '50px', margin: '0 auto' }}
                                                                    >
                                                                        <img src={row.profile_pic} style={{ height: '100%', width: '100%', borderRadius: '50%' }} alt='profile-picture' />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>{row.gender}</TableCell>
                                                                <TableCell>{moment(row.date_of_birth).format("DD-MM-YYYY")}</TableCell>
                                                                <TableCell>{row.reason}</TableCell>
                                                                <TableCell>{moment(row.created_date * 1000).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>
                                                                <TableCell>{moment(row.registered_at * 1000).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>
                                                            </TableRow>

                                                        );
                                                    })}
                                            </TableBody>
                                            :
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell colSpan={headCells.length}>
                                                        <Typography
                                                            style={{ textAlign: 'center', padding: '10px 0px' }}
                                                            noWrap
                                                            variant={'h4'}>No Records</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        }
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={reports.data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Paper>
                            :
                            <></>
                        }
                    </Grid>
                )}

        </Grid>
    )
}

export default Reports
