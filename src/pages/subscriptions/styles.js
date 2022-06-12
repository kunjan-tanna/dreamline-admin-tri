import { makeStyles } from '@material-ui/styles'

export default makeStyles(theme => ({
    icon: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        '& .MuiSvgIcon-root': {
            marginRight: 5,
        },
    },
    mainPageTitle: {
        marginTop: "18px",
        fontSize: "24px",
        marginLeft: "10px",
        fontWeight: 400,
    },
    container: {
        // maxHeight: 440,
    },
    root: {
        width: '100%',
        textAlign: 'center',
        padding: '20px'
    },
    calendarIcon: {
        color: "black",
        position: "absolute",
        top: "7px",
        left: "14px",
        zIndex: "9",
        width: "20px",
        margin: "0px",
    },
    closeIcon: {
        color: theme.palette.primary.main,
        position: "absolute",
        top: "7px",
        right: "4px",
        zIndex: "9",
        width: "20px",
        margin: "0px",
        cursor: "pointer"
    },
    datePickerWrapper: {
        display: 'flex',
        marginTop: '10px',
        marginBottom: '10px',
        position: 'relative'
    },
    filterWrapper: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'inline-block',
        },
    },
}))
