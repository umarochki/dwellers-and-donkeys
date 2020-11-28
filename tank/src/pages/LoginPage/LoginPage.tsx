import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, Grid, Tab, Tabs, TextField, Typography } from '@material-ui/core'
import useStyles from './styles'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoginState, selectSignupState } from '../../store/user/selectors'
import { AsyncState } from '../../store/user/reducer'
import { login, signup } from '../../store/user/actions'
import { useRedirect } from '../../helpers/redirect'

const LoginPage = () => {
    useRedirect()

    const classes = useStyles()
    const dispatch = useDispatch()

    const signupState = useSelector(selectSignupState)
    const loginState = useSelector(selectLoginState)

    const [activeTabId, setActiveTabId] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [loginValue, setLoginValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')

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
            <div className={classes.formContainer}>
                <div className={classes.form}>
                    <Tabs
                        value={activeTabId}
                        onChange={(e, id) => setActiveTabId(id)}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Вход" classes={{ root: classes.tab }} />
                        <Tab label="Регистрация" classes={{ root: classes.tab }} />
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
                                label="Логин"
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
                                label="Пароль"
                                type="password"
                                fullWidth
                            />
                            <div className={classes.creatingButtonContainer}>
                                {isLoading ? (
                                    <CircularProgress size={26} className={classes.loginLoader} />
                                ) : (
                                    <Button
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
                                        Войти
                                    </Button>
                                )}
                                {/*<Button*/}
                                {/*    color="primary"*/}
                                {/*    size="large"*/}
                                {/*    className={classes.forgetButton}*/}
                                {/*>*/}
                                {/*    Забыли пароль?*/}
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
                                label="Имя"
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
                                label="Пароль"
                                type="password"
                                fullWidth
                            />
                            <div className={classes.creatingButtonContainer}>
                                {isLoading ? (
                                    <CircularProgress size={26} />
                                ) : (
                                    <Button
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
                                        Создать
                                    </Button>
                                )}
                            </div>
                            {/*<div className={clsx(classes.formDividerContainer, classes.marginBottom)}>*/}
                            {/*    <div className={classes.formDivider} />*/}
                            {/*    <Typography className={classes.formDividerWord}>или</Typography>*/}
                            {/*    <div className={classes.formDivider} />*/}
                            {/*</div>*/}
                            {/*<Button*/}
                            {/*    size="large"*/}
                            {/*    className={clsx(*/}
                            {/*        classes.googleButton,*/}
                            {/*        classes.googleButtonCreating,*/}
                            {/*    )}*/}
                            {/*>*/}
                            {/*    <img src={google} alt="google" className={classes.googleIcon} />*/}
                            {/*    &nbsp;Войти через Google*/}
                            {/*</Button>*/}
                        </>
                    )}
                </div>
            </div>
        </Grid>
    )
}

export default LoginPage
