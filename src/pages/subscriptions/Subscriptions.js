import React, { useEffect, useState } from 'react'
import {
    Grid,
    Box,
    InputAdornment,
    TextField as Input,
    CircularProgress,
} from '@material-ui/core'
import { Button } from '../../components/Wrappers/Wrappers'
import {
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import ErrorMessage from "../../components/ErrorMessage";

import useStyles from "./styles";
//context
import {
    useSubscriptionsState,
    getSubscriptionPlansRequest,
    editSubscriptionPlanPriceRequest
} from "../../context/SubscriptionsContext";

import { Typography } from '../../components/Wrappers/Wrappers'

// Icons
import {
    AttachMoney as AttachMoneyIcon,
} from '@material-ui/icons'

import { validate } from '../../common/common';
import joi from 'joi-browser';

const Subscriptions = (props) => {
    const classes = useStyles();
    const context = useSubscriptionsState();
    var [plans, setBackSubscriptionPlans] = useState([]);
    const [toggleInputModal, setToggleInputModal] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [error, setError] = useState(null);
    const [errorField, setErrorField] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getSubscriptionPlansRequest(context.setSubscriptionPlans);
    }, []); // eslint-disable-line

    useEffect(() => {
        setBackSubscriptionPlans(context.plans.plans);
    }, [context]);

    const manageModal = (plans) => {
        setError('')
        setErrorField('')
        setFormValues(plans)
        setToggleInputModal(true)
    }
    const submitProfessionHandler = () => {
        let reqData = {
            price: formValues.price
        }
        validateFormData(reqData);
    }
    const validateFormData = (body) => {
        let schema = joi.object().keys({
            price: joi.string().trim().regex(/^\d{1,4}(?:\.\d{1,2})?$/).required(),
        })
        joi.validate(body, schema, async (err, value) => {
            if (err) {
                if (err.details[0].message !== error || error.details[0].context.key !== errorField) {
                    let errorLog = validate(err)
                    setError(errorLog.error)
                    setErrorField(errorLog.errorField)
                }
            }
            else {
                setError('')
                setErrorField('')
                setIsLoading(true)
                let reqData = {}
                reqData = {
                    price: body.price,
                    plan_id: formValues.plan_id
                }
                await editSubscriptionPlanPriceRequest(context.setSubscriptionPlans, reqData)
                await getSubscriptionPlansRequest(context.setSubscriptionPlans);
                setToggleInputModal(false)
                setIsLoading(false)
            }
        })
    }

    return (
        <Grid container spacing={3}>
            <span className={classes.mainPageTitle}>Subscription Plans</span>
            {!context.plans.isLoaded || !plans.data ? (
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
                    <Grid container spacing={2} style={{ margin: '0px 4px' }}>
                        {plans.data.map((plan, index) => (
                            <Grid item xs={4} key={index}>
                                <Paper className={classes.root}>
                                    <Typography color={'primary'} style={{ fontSize: '45px' }}>${plan.price}</Typography>
                                    <Typography style={{ fontSize: '30px', fontWeight: 100 }}>{plan.plan}</Typography>
                                    <Button variant={'contained'} color={'primary'} style={{ width: '100%', margin: '30px 0px 10px 0px', padding: '10px' }}
                                        onClick={() => manageModal(plan)}>
                                        Edit Price
                          </Button>
                                </Paper>
                            </Grid>
                        ))}

                        <Dialog
                            open={toggleInputModal}
                            onClose={() => setToggleInputModal(false)}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">Edit Price</DialogTitle>
                            <DialogContent>
                                <Input
                                    label='Plan'
                                    placeholder={"Plan"}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{
                                        classes: {
                                            underline: classes.InputUnderline,
                                            input: classes.Input
                                        },
                                        disabled: true
                                    }}
                                    value={formValues.plan}
                                    fullWidth
                                />
                                <Input
                                    label='Price'
                                    placeholder={"Price"}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={e => setFormValues({ ...formValues, price: e.target.value.replace(/[^0-9.]/g, "") })}
                                    InputProps={{
                                        classes: {
                                            underline: classes.InputUnderline,
                                            input: classes.Input
                                        },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon className={classes.searchIcon} />
                                            </InputAdornment>
                                        )
                                    }}
                                    value={formValues.price}
                                    fullWidth
                                />
                                {errorField === 'price' && <ErrorMessage error={error} />}
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
                                    onClick={submitProfessionHandler}
                                    disabled={isLoading}
                                >
                                    Submit
                      </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                )}

        </Grid>
    )
}

export default Subscriptions
