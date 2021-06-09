import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, Grid, Tab, Tabs, TextField, Typography } from '@material-ui/core'
import useStyles from './styles'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoginState, selectSignupState } from '../../store/user/selectors'
import { AsyncState } from '../../store/user/reducer'
import { googleAuth, login, quickstart, signup } from '../../store/user/actions'
import google from '../../assets/google.svg'

const LoginPage = () => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const signupState = useSelector(selectSignupState)
    const loginState = useSelector(selectLoginState)

    const [activeTabId, setActiveTabId] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [loginValue, setLoginValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')

    const handleGoogleSignUp = () => {
        dispatch(googleAuth())
    }

    useEffect(() => {
        if (signupState === AsyncState.inProcess || loginState === AsyncState.inProcess) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [signupState, loginState])

    return (
        <Grid container className={classes.container}>
            <div className={clsx(classes.logotypeContainer, classes.image)}>
                <Typography className={classes.logotypeText}>Dwellers & Donkeys</Typography>
            </div>
            <div className={classes.formContainer} onSubmit={e => e.preventDefault()}>
                <form className={classes.form}>
                    <Tabs
                        value={activeTabId}
                        onChange={(e, id) => setActiveTabId(id)}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Login" classes={{ root: classes.tab }} />
                        <Tab label="Sign up" classes={{ root: classes.tab }} />
                    </Tabs>
                    {activeTabId === 0 && (
                        <>
                            <TextField
                                id="login"
                                className={classes.marginTop}
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={loginValue}
                                onChange={e => setLoginValue(e.target.value)}
                                margin="normal"
                                label="Login"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                id="password"
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={passwordValue}
                                onChange={e => setPasswordValue(e.target.value)}
                                margin="normal"
                                label="Password"
                                type="password"
                                fullWidth
                            />
                            <div className={classes.creatingButtonContainer}>
                                {isLoading ? (
                                    <CircularProgress size={26} />
                                ) : (<>
                                    <Button
                                        type="submit"
                                        disabled={loginValue.length === 0 || passwordValue.length === 0}
                                        onClick={() => {
                                            dispatch(login(loginValue, passwordValue))
                                        }}
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        className={classes.createAccountButton}
                                        fullWidth
                                    >
                                        Sign in
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        className={classes.outLinedButton}
                                        onClick={() => {
                                            dispatch(quickstart())
                                        }}
                                        fullWidth
                                    >
                                        Continue as Guest
                                    </Button>
                                    <div className={clsx(classes.formDividerContainer, classes.marginBottom)}>
                                        <div className={classes.formDivider} />
                                        <Typography className={classes.formDividerWord}>or</Typography>
                                        <div className={classes.formDivider} />
                                    </div>
                                    <Button
                                        className={clsx(
                                            classes.googleButton,
                                            classes.googleButtonCreating
                                        )}
                                        onClick={handleGoogleSignUp}
                                        fullWidth
                                    >
                                        <img src={google} alt="google" className={classes.googleIcon} />
                                        &nbsp;Sign in with Google
                                    </Button>
                                </>)}
                                {/*<Button*/}
                                {/*    color="primary"*/}
                                {/*    size="large"*/}
                                {/*    className={classes.forgetButton}*/}
                                {/*>*/}
                                {/*    Forgot password?*/}
                                {/*</Button>*/}
                            </div>
                        </>
                    )}
                    {activeTabId === 1 && (
                        <>
                            <TextField
                                id="name"
                                className={classes.marginTop}
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={loginValue}
                                onChange={e => setLoginValue(e.target.value)}
                                margin="normal"
                                label="Login"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                id="email"
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={emailValue}
                                onChange={e => setEmailValue(e.target.value)}
                                margin="normal"
                                label="Email"
                                type="email"
                                fullWidth
                            />
                            <TextField
                                id="password"
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={passwordValue}
                                onChange={e => setPasswordValue(e.target.value)}
                                margin="normal"
                                label="Password"
                                type="password"
                                fullWidth
                            />
                            <div className={classes.creatingButtonContainer}>
                                {isLoading ? (
                                    <CircularProgress size={26} />
                                ) : (<>
                                    <Button
                                        type="submit"
                                        onClick={() => {
                                            dispatch(signup(loginValue, emailValue, passwordValue))
                                        }}
                                        disabled={
                                            loginValue.length === 0 ||
                                            passwordValue.length === 0 ||
                                            emailValue.length === 0
                                        }
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className={classes.createAccountButton}
                                    >
                                        Create
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        className={classes.outLinedButton}
                                        onClick={() => {
                                            dispatch(quickstart())
                                        }}
                                        fullWidth
                                    >
                                        Continue as Guest
                                    </Button>
                                </>)}
                            </div>
                            {!isLoading && <>
                                <div className={clsx(classes.formDividerContainer, classes.marginBottom)}>
                                    <div className={classes.formDivider} />
                                    <Typography className={classes.formDividerWord}>or</Typography>
                                    <div className={classes.formDivider} />
                                </div>
                                <Button
                                    className={clsx(
                                        classes.googleButton,
                                        classes.googleButtonCreating
                                    )}
                                    onClick={handleGoogleSignUp}
                                    fullWidth
                                >
                                    <img src={google} alt="google" className={classes.googleIcon} />
                                    &nbsp;Sign in with Google
                                </Button>
                            </>
                            }
                        </>
                    )}
                </form>
            </div>
        </Grid>
    )
}

export default LoginPage
