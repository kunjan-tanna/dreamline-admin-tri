import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  container: {
    width: "100%",
    padding: "5% 10%",
  },
  mainContainer: {
    width: "100%",
    overflow: "auto",
    textAlign: 'justify',
    lineHeight: 1.5,
    fontSize: '14px'
  },
  mainTitle: {
    fontSize: "20px",
    textAlign: "center",
    textTransform: 'uppercase',
    fontWeight: 500,
    marginBottom: '40px'
  },
  welcomeText: {
    fontWeight: 500,
    fontSize: '16px'
  },
  subTitle: {
    fontSize: "18px",
    textTransform: 'uppercase',
    marginTop: '50px',
    fontWeight: 500
  },
  subLinks: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    width: '100%'
  },
  normalBoldText: {
    fontWeight: 500
  },
  paragraphMargin: {
    margin: '5px 0px 0px 20px'
  },
  mainList: {
    padding: '0px 0px 0px 26px',
  },
  normalCapitalText: {
    textTransform: 'uppercase',
  }
}));
