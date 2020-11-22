import React, { useState } from 'react'
import { Button, CircularProgress, Grid, Tab, Tabs, TextField, Typography } from '@material-ui/core'
import useStyles from './styles'
import clsx from 'clsx'
import google from '../../assets/google.svg'

const LoginPage = () => {
    const classes = useStyles()

    const [activeTabId, setActiveTabId] = useState(0)

    var [isLoading, setIsLoading] = useState(false)
    var [error, setError] = useState(undefined)
    var [nameValue, setNameValue] = useState('')
    var [loginValue, setLoginValue] = useState('')
    var [passwordValue, setPasswordValue] = useState('')

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
                            <Button size="large" className={classes.googleButton}>
                                <img src={google} alt="google" className={classes.googleIcon} />
                                &nbsp;Войти через Google
                            </Button>
                            <div className={classes.formDividerContainer}>
                                <div className={classes.formDivider} />
                                <Typography className={classes.formDividerWord}>или</Typography>
                                <div className={classes.formDivider} />
                            </div>
                            <TextField
                                id="email"
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={loginValue}
                                onChange={e => setLoginValue(e.target.value)}
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
                            <div className={classes.formButtons}>
                                {isLoading ? (
                                    <CircularProgress size={26} className={classes.loginLoader} />
                                ) : (
                                    <Button
                                        disabled={false
                                            // loginValue.length === 0 || passwordValue.length === 0
                                        }
                                        onClick={() => {}
                                            // loginUser(
                                            //     userDispatch,
                                            //     loginValue,
                                            //     passwordValue,
                                            //     props.history,
                                            //     setIsLoading,
                                            //     setError,
                                            // )
                                        }
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                    >
                                        Войти
                                    </Button>
                                )}
                                <Button
                                    color="primary"
                                    size="large"
                                    className={classes.forgetButton}
                                >
                                    Забыли пароль?
                                </Button>
                            </div>
                        </>
                    )}
                    {activeTabId === 1 && (
                        <>
                            {/*<Typography variant="h2" className={clsx(classes.greeting, classes.marginBottom)}>*/}
                            {/*    Добро пожаловать!*/}
                            {/*</Typography>*/}
                            {/*<Typography variant="h2" className={classes.subGreeting}>*/}
                            {/*    Создайте аккаунт*/}
                            {/*</Typography>*/}
                            <TextField
                                id="name"
                                className={classes.marginTop}
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={nameValue}
                                onChange={e => setNameValue(e.target.value)}
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
                                value={loginValue}
                                onChange={e => setLoginValue(e.target.value)}
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
                                        onClick={() => {}
                                            // loginUser(
                                            //     userDispatch,
                                            //     loginValue,
                                            //     passwordValue,
                                            //     props.history,
                                            //     setIsLoading,
                                            //     setError,
                                            // )
                                        }
                                        disabled={
                                            loginValue.length === 0 ||
                                            passwordValue.length === 0 ||
                                            nameValue.length === 0
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
                            <div className={clsx(classes.formDividerContainer, classes.marginBottom)}>
                                <div className={classes.formDivider} />
                                <Typography className={classes.formDividerWord}>или</Typography>
                                <div className={classes.formDivider} />
                            </div>
                            <Button
                                size="large"
                                className={clsx(
                                    classes.googleButton,
                                    classes.googleButtonCreating,
                                )}
                            >
                                <img src={google} alt="google" className={classes.googleIcon} />
                                &nbsp;Войти через Google
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Grid>
    )
}

export default LoginPage
