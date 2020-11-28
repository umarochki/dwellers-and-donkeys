import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoginState } from '../store/user/selectors'
import { AsyncState } from '../store/user/reducer'
import { AuthRoutes } from '../routes'

export const useRedirect = () => {
    const loginState = useSelector(selectLoginState)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if (loginState === AsyncState.success) {
            window.location.href = AuthRoutes.dashboard
        }
    }, [loginState, dispatch])
}