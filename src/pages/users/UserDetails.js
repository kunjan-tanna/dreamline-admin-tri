import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import {
    Grid,
    Box,
    TextField as Input,
    CircularProgress,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup
} from '@material-ui/core'
import Widget from '../../components/Widget/Widget'
import useStyles from "./styles";
//context
import {
    useUsersState,
    getUserProfile
} from "../../context/UsersContext";
import {
    ArrowBack as ArrowBackIcon,
  } from "@material-ui/icons";
import { Typography } from '../../components/Wrappers/Wrappers'
import moment from 'moment';
console.log("user details page")
const UserDetails = props => {
    const classes = useStyles();
    const context = useUsersState();
    var [profile, setBackUserProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    console.log("qqqqq")
    useEffect(() => {
        // console.log("if user",props.location.state)
        if (props.location.state && props.location.state.userId) {
            getUserProfile(context.setUserProfile, { userId: props.location.state.userId });
        }
    }, []); // eslint-disable-line

    useEffect(() => {
        setBackUserProfile(context.profile.profile)
        setIsLoading(false)
    }, [context]);
//  console.log(profile)
    const redirectToUser = async => {
        // console.log("redirectToDetails",user_id)
        props.history.push({
            pathname: process.env.PUBLIC_URL + '/app/users',
        })
    }
    return (
        <Grid container spacing={3}>
            <span className={classes.mainPageTitle}>User Details</span>
            {(!context.profile.isLoaded || !profile.data || isLoading) ? (
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
                        {/* <Widget className={classes.boxContainer} noBodyPadding>
                            <Box style={{ padding: '16px' }}>
                                <Typography
                                    variant={'subtitle1'}
                                    color={'primary'}
                                >Photos</Typography>
                                {profile.data.pictures.length > 0 && profile.data.pictures.map((pic, index) => {
                                    return (
                                        <img src={pic.profile_pic} alt={`profile-${index}`} key={index} className={classes.profilePicture} />
                                    )
                                })}
                            </Box>
                        </Widget> */}
                        {/* <Grid md={7} style={{ width: '100%' }}>
                            <Widget className={classes.boxContainer} style={{ height: '565px' }} noBodyPadding>
                                <Box style={{ padding: '16px' }}>
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'primary'}
                                    >My Answers</Typography>
                                    {profile.data.questions.length > 0 && profile.data.questions.map((question, index) => {
                                        return (
                                            <Box key={index}>
                                                <Typography
                                                    variant={'subtitle1'}
                                                    color={'black'}
                                                    className={classes.formLabels}
                                                >{question.question}</Typography>
                                                <Input
                                                    margin="dense"
                                                    variant="outlined"
                                                    InputProps={{
                                                        // readOnly: true,
                                                        disabled: true,
                                                        classes: {
                                                            input: classes.Input
                                                        }
                                                    }}
                                                    multiline
                                                    rows={2}
                                                    style={{ margin: '0px' }}
                                                    value={question.answer}
                                                    fullWidth
                                                />
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </Widget>

                        </Grid> */}
                        {/* <Grid md={5} style={{ width: '100%' }}>
                            <Widget className={classes.boxContainer} style={{ height: '565px' }} noBodyPadding>
                                <Box style={{ padding: '16px' }}>
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'primary'}
                                        style={{ marginBottom: '16px' }}
                                    >About Me</Typography>
                                    <Input
                                        margin="dense"
                                        variant="outlined"
                                        InputProps={{
                                            // readOnly: true,
                                            disabled: true,
                                            classes: {
                                                input: classes.Input
                                            }
                                        }}
                                        style={{ margin: '0px' }}
                                        value={profile.data.first_name}                                        
                                        fullWidth
                                        rows={24}
                                    />
                                </Box>
                            </Widget>

                        </Grid> */}
                        {/* <Grid md={3} style={{ width: '100%' }}>
                            <Widget className={classes.boxContainer} style={{ height: '565px' }} noBodyPadding>
                                <Box style={{ padding: '16px' }}>
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'primary'}
                                        style={{ marginBottom: '16px' }}
                                    >Match Users</Typography>
                                    <Box>

                                        {profile.data.pictures.length > 0 && profile.data.pictures.map((pic, index) => {
                                            return (
                                                <Box display={'inline-flex'} marginBottom={'12px'}>
                                                    <img src={pic.profile_pic} alt={`profile-${index}`} style={{ height: '60px', width: '60px', borderRadius: '12px' }} />
                                                    <Box style={{
                                                        padding: '8px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Typography
                                                            variant={'subtitle2'}
                                                            color={'black'}
                                                            style={{ fontWeight: '500' }}
                                                        >Ajay Chauhan, 24</Typography>
                                                        <Typography
                                                            variant={'subtitle2'}
                                                            color={'black'}
                                                            style={{ fontWeight: '500', fontSize: '12px' }}

                                                        >Ahmedabad</Typography>
                                                    </Box>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                </Box>
                            </Widget>

                        </Grid> */}

                        <Widget className={classes.boxContainer} noBodyPadding>
                            <Box style={{ padding: '16px' }}>
                                {/* <Typography
                                    variant={'subtitle1'}
                                    color={'primary'}
                                >Basic Info</Typography> */}
                                <Typography
                                    variant={'subtitle1'}
                                    color={'primary'}
                                >
                                <ArrowBackIcon onClick={redirectToUser}/>
                                </Typography>
                                <Box className={classes.basicInfoContainer}>
                                    <Grid md={6} >
                                        <Typography
                                            variant={'subtitle1'}
                                            color={'black'}
                                            className={classes.formLabels}
                                        >First Name</Typography>
                                        <Input
                                            margin="dense"
                                            variant="outlined"
                                            InputProps={{
                                                // readOnly: true,
                                                disabled: true,
                                                classes: {
                                                    input: classes.Input
                                                }
                                            }}
                                            className={classes.inputBox}
                                            value={profile.data.first_name}
                                        // fullWidth
                                        />
                                    </Grid>
                                    </Box>
                                    <Box className={classes.basicInfoContainer}>

                                    
                                    <Grid md={6} >
                                        <Typography
                                            variant={'subtitle1'}
                                            color={'black'}
                                            className={classes.formLabels}
                                        >Last Name</Typography>
                                        <Input
                                            margin="dense"
                                            variant="outlined"
                                            InputProps={{
                                                // readOnly: true,
                                                disabled: true,
                                                classes: {
                                                    input: classes.Input
                                                }
                                            }}
                                            className={classes.inputBox}
                                            value={profile.data.last_name}
                                        // fullWidth
                                        />
                                    </Grid>
                                    </Box>
                                    <Box className={classes.basicInfoContainer}>
                                    <Grid md={6} >
                                        <Typography
                                            variant={'subtitle1'}
                                            color={'black'}
                                            className={classes.formLabels}
                                        >Email</Typography>
                                        <Input
                                            margin="dense"
                                            variant="outlined"
                                            InputProps={{
                                                // readOnly: true,
                                                disabled: true,
                                                classes: {
                                                    input: classes.Input
                                                }
                                            }}
                                            className={classes.inputBox}
                                            value={profile.data.email}
                                        // fullWidth
                                        />
                                        
                                    </Grid>
                                    
                                </Box>

                                    <Box className={classes.basicInfoContainer}>
                                    <Grid md={6} >   

                                    
                                        <Typography
                                            variant={'subtitle1'}
                                            color={'black'}
                                            className={classes.formLabels}
                                        >Country</Typography>
                                        <Input
                                            margin="dense"
                                            variant="outlined"
                                            InputProps={{
                                                // readOnly: true,
                                                disabled: true,
                                                classes: {
                                                    input: classes.Input
                                                }
                                            }}
                                            className={classes.inputBox}
                                            value={profile.data.country}
                                        // fullWidth
                                        />
                                    </Grid>
                                    </Box>
                                                                </Box>
                        </Widget>
                        
                    </>

                )}
        </Grid>
    )
}

export default withRouter(UserDetails)
