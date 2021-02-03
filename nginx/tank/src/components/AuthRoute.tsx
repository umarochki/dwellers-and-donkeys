import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { selectLoginState } from '../store/user/selectors'
import { AsyncState } from '../store/user/reducer'


const AuthRoute: React.FC<RouteProps> = ({ component: Component, ...rest  }: any) => {
    const authenticated = useSelector(selectLoginState)

    return (
        <Route {...rest} render={props => (
            authenticated === AsyncState.success
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }}/>
        )}/>
    )
}

export default AuthRoute