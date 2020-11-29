import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoginState } from '../store/user/selectors'
import { AsyncState } from '../store/user/reducer'
import { push } from 'connected-react-router'

export const useRedirect = () => {
    const loginState = useSelector(selectLoginState)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if (loginState === AsyncState.success) {
            dispatch(push('/'))
        }
    }, [loginState, dispatch])
}