import React from "react";
import { Fade } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

export default function ErrorMessage(props) {
    var classes = useStyles();

    return (
        <Fade
            in={props.error === '' ? false : true}
            style={
                !props.error ? { display: "none" } : { display: "inline-block" }
            }
        >
            <Typography color="danger" className={classes.errorMessage}>
                {props.error}
            </Typography>
        </Fade>
    );
}


