import React, { useEffect, useState, div } from 'react'
import { withRouter } from 'react-router-dom'

import {
    Grid,
    Box,
    TextField as Input,
    CircularProgress,
    Div,
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
    useDraftState,
    getOrderDetails
} from "../../context/DraftContext";
import {
    ArrowBack as ArrowBackIcon,
  } from "@material-ui/icons";
import { Typography } from '../../components/Wrappers/Wrappers'
import moment from 'moment';
// console.log("user details page")
const DraftDetails = props => {
    const classes = useStyles();
    const context = useDraftState();
    var [profile, setBackUserProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    // console.log("qqqqq")
    useEffect(() => {
        // console.log("if user",props.location.state)
        if (props.location.state && props.location.state.order_id) {
            getOrderDetails(context.setUserProfile, { order_id: props.location.state.order_id });
        }
    }, []); // eslint-disable-line

    useEffect(() => {
        setBackUserProfile(context.profile.profile)
        setIsLoading(false)
    }, [context]);
//  console.log(profile)
const redirectToOrder = async => {
    // console.log("redirectToDetails",user_id)
    props.history.push({
        pathname: process.env.PUBLIC_URL + '/app/draft',
    })
}
return (
    <Grid container spacing={3}>
        <span className={classes.mainPageTitle}>Order Details</span>
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
                    {/* <span className={classes.mainSpanTitle}>Basic Details</span> */}
                        <Box style={{ padding: '16px' }}>
                            <Typography
                                    variant={'subtitle1'}
                                    color={'primary'}
                                >
                                <ArrowBackIcon onClick={redirectToOrder}/>
                            </Typography>
                            <Typography
                                variant={'subtitle1'}
                                color={'primary'}
                            >Basic Info</Typography>
                            <Box className={classes.basicInfoContainer}>
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >User Name</Typography>
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
                                        //value={profile.data.first_name+" "+profile.data.last_name}
                                        value={profile.data.first_name != null && profile.data.last_name != null ? profile.data.first_name+" "+profile.data.last_name : ''}
                                    // fullWidth
                                    />
                                </Grid>
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Patient Name</Typography>
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
                                        value={profile.data.patient_name}
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
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
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
                                <Box className={classes.basicInfoContainer}>
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Order Code</Typography>
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
                                        value={profile.data.order_code}
                                    // fullWidth
                                    />
                                </Grid>
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Order Date</Typography>
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
                                        value={profile.data.order_date}
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
                                    >Therapist Name</Typography>
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
                                        value={profile.data.therapist_name}
                                    // fullWidth
                                    />
                                </Grid>
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Therapist Email</Typography>
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
                                        value={profile.data.therapist_email}
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
                                    >Therapist Account</Typography>
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
                                        value={profile.data.therapist_ac}
                                    // fullWidth
                                    />
                                </Grid>
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Therapist Mobile No.</Typography>
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
                                        value={profile.data.therapist_mobile}
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
                                    >Therapist Address</Typography>
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
                                        value={profile.data.therapist_address}
                                    // fullWidth
                                    />
                                </Grid>
                                </Box>
                        {profile.data.details.length > 0 ?
                        <div>
                        <Typography
                                variant={'subtitle1'}
                                color={'primary'}
                                style={{marginTop:"18px"}}
                            >Product Info</Typography>
                            <Box className={classes.basicInfoContainer}>
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Product Name</Typography>
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
                                        value={profile.data.details['0'].product_name}
                                    // fullWidth
                                    />
                                </Grid>
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Product Code</Typography>
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
                                        value={profile.data.details['0'].product_code}
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
                                    >Size</Typography>
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
                                        value={profile.data.details['0'].size}
                                    // fullWidth
                                    />
                                </Grid>
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Quantity</Typography>
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
                                        value={profile.data.details['0'].quantity}
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
                                    >Color</Typography>
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
                                        value={profile.data.details['0'].color}
                                    // fullWidth
                                    />
                                </Grid>
                                </Box>
                                {profile.data.details['0'].accessories_name ? // && profile.data.details['0'].accessories_name.map(c =>
                                <Typography
                                variant={'subtitle1'}
                                color={'primary'}
                                style={{marginTop:"18px"}}
                                    >Other Info</Typography> 
                                :
                                <>
                                </>
                                }
                                
                                { profile.data.details['0'].accessories_name /* && profile.data.details['0'].accessories_name.length > 0 */ && profile.data.details['0'].accessories_name.map(c => 
                                <Box className={classes.basicInfoContainer}>
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Accessories Name</Typography>
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
                                        value={c.name}
                                    // fullWidth
                                    />
                                </Grid>
                                {/* </Box>
                                <Box className={classes.basicInfoContainer}> */}
                                <Grid md={6} >
                                    <Typography
                                        variant={'subtitle1'}
                                        color={'black'}
                                        className={classes.formLabels}
                                    >Quantity</Typography>
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
                                        value={c.qty}
                                    // fullWidth
                                    />
                                </Grid>
                                </Box>
                                //</div>
                                )}
                                { profile.data.details['0'].modification_name && profile.data.details['0'].modification_name.map(c => 
                                    <Box className={classes.basicInfoContainer}>
                                    <Grid md={6} >
                                        <Typography
                                            variant={'subtitle1'}
                                            color={'black'}
                                            className={classes.formLabels}
                                        >Modification</Typography>
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
                                            value={c}
                                        // fullWidth
                                        />
                                    </Grid>
                                    </Box>
                                    //</div>
                                    )}
                                </div>
                                :
                                <>
                                </>
                                }
                        </Box>
                    </Widget>
                    
                </>

            )}
    </Grid>
)
}

export default withRouter(DraftDetails)
