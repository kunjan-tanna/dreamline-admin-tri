import React, { useEffect, useState } from "react";
import {
    Grid,
    CircularProgress,
    Box,
    TextField as Input,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from "@material-ui/core";

import { withRouter } from "react-router-dom";
import joi from 'joi-browser';

// Material UI icons
import {
    Edit as EditIcon,
    CreateOutlined as CreateIcon,

} from "@material-ui/icons";
import useStyles from "./styles";
import ErrorMessage from "../../components/ErrorMessage";

//context
import {
    QuestionsProvider,
    useQuestionsState,
    getQuestionsRequest,
    updateQuestion
} from "../../context/QuestionsContext";

// components
import Widget from "../../components/Widget";
import { Typography, Button } from "../../components/Wrappers";
import { validate } from "../../common/common";

function Questions({ history }) {
    const classes = useStyles();
    const context = useQuestionsState();
    const [questionToEdit, setQuestionToEdit] = useState({});
    const [questions, setBackQuestions] = useState(
        context.questions.questions
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorField, setErrorField] = useState(null);
    const [toggleInputModal, setToggleInputModal] = useState(false);

    useEffect(() => {
        getQuestionsRequest(context.setQuestions);
    }, []); // eslint-disable-line

    useEffect(() => {
        setBackQuestions(context.questions.questions);
    }, [context]);

    const manageModal = (questionToEdit) => {
        setError('')
        setErrorField('')
        setQuestionToEdit(questionToEdit)
        setToggleInputModal(true)
    }
    const setEditedValueOfQuestion = (value) => {
        setQuestionToEdit({ ...questionToEdit, question: value })

    }
    const editQuestionHandler = () => {
        let reqData = {
            question: questionToEdit.question,
        }
        validateFormData(reqData);
    }
    const validateFormData = (body) => {
        let schema = joi.object().keys({
            question: joi.string().trim().required(),
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
                let reqData = {
                    question: body.question,
                    question_id: questionToEdit.question_id
                }
                await updateQuestion(context.setQuestions, reqData)
                await getQuestionsRequest(context.setQuestions);
                setBackQuestions(context.questions.questions);

                setToggleInputModal(false)
                setIsLoading(false)
            }
        })
    }
    return (
        <>
            <Grid container spacing={3}>
                <span className={classes.mainPageTitle}>Question Management</span>
                {!context.questions.isLoaded ? (
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
                            {questions.data && questions.data.length > 0 && questions.data.map((q, index) => {
                                return (<Grid key={index} item xs={12} className={classes.questionItemGrid}>
                                    <Widget bodyClass={classes.questionContainer}>
                                        {/* <QuestionsProvider> */}
                                        <Box>
                                            <Typography
                                                color="text"
                                                colorBrightness={"secondary"}
                                                style={{ fontSize: '16px' }}
                                            >{q.question}</Typography>
                                        </Box>
                                        {/* </QuestionsProvider> */}
                                        <IconButton
                                            color={'primary'}
                                            onClick={() => manageModal(q)}
                                        >
                                            <CreateIcon />
                                        </IconButton>
                                    </Widget>
                                </Grid>)

                            })}
                        </>
                    )}
                <Dialog
                    open={toggleInputModal}
                    onClose={() => setToggleInputModal(false)}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Edit Question</DialogTitle>
                    <DialogContent>
                        <Input
                            label='Question'
                            placeholder={"Question"}
                            margin="normal"
                            variant="outlined"
                            onChange={e => setEditedValueOfQuestion(e.target.value.replace(/^\s+/, ""))}
                            InputProps={{
                                classes: {
                                    underline: classes.InputUnderline,
                                    input: classes.Input
                                }
                            }}
                            multiline
                            rows={3}
                            value={questionToEdit.question}
                            fullWidth
                        />
                        {errorField === 'question' && <ErrorMessage error={error} />}
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
                            onClick={editQuestionHandler}
                            disabled={isLoading}
                        >
                            Submit
                      </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>
    );
}


export default withRouter(Questions);
