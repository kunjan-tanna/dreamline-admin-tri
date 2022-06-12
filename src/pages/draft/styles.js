import { makeStyles } from '@material-ui/styles'

export default makeStyles(theme => ({
    icon: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        '& .MuiSvgIcon-root': {
            marginRight: 5,
        },
    },
    stepCompleted: {
        root: {
            color: 'green'
        }
    },
    mainPageTitle: {
        marginTop: "18px",
        fontSize: "24px",
        marginLeft: "10px",
        fontWeight: 400,
    },
    questionContainer: {
        display: "inline-flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingRight: "40px"
    },
    editButton: {
        borderRadius: "50%",
        height: "60px",
        position: "absolute",
        top: "14px",
        right: "12px",
        '& .MuiButtonBase-root': {
            position: "absolute",
            top: "13px",
            right: "0px",
        },
    },
    questionItemGrid: {
        padding: "12px",
        position: "relative",
    },
    container: {
        // maxHeight: 440,
    },
    root: {
        width: '100%',

    },
    boxContainer: {
        width: '100%',
        padding: '8px',
    },
    iconContainer: {
        height: "100px",
        width: "100px",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        backgroundColor: theme.palette.primary.light,
    },
    totalContainer: {
        textAlign: "center",
        width: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    Input: {
        color: theme.palette.text.primary,
        fontSize: '13px'

    },
    group: {
        flexDirection: 'row'
    },
    radioLabels: {
        fontSize: '14px'
    },
    basicInfoContainer: {
        width: '100%',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'block',

        },
    },
    inputBox: {
        margin: '0px',
        width: '85%',
        [theme.breakpoints.up('md')]: {
            width: '90%',

        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',

        },
    },
    moreInfoContainer: {
        width: '100%',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'block',

        },
    },
    formLabels: {
        fontWeight: '500 !important',
        fontSize: '15px !important',
        marginTop: '12px'
    },
    profilePicture: {
        height: '100px',
        width: '100px',
        margin: '6px',
        borderRadius: '12px'
    }
    //   boxTitle:{
    //       color:theme.palette.primary.main
    //   }

}))
