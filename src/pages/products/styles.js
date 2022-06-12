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
        // [theme.breakpoints.up("md")]: {
        //     bottom: theme.spacing(2)
        //   }
    },
    questionItemGrid: {
        padding: "12px",
        position: "relative",
    },
    container:{
        // maxHeight: 440,
    },
    root:{
        width: '100%',
        

    },
    inputNumber : {
        root : {
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0
              },
        }
    },
   
}))
