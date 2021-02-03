import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { selectLoginState } from '../store/user/selectors'
import { AsyncState } from '../store/user/reducer'
import { getMyself } from '../store/user/actions'

export const useUserHandling = (redirect: boolean) => {
    const dispatch = useDispatch()
    const loginState = useSelector(selectLoginState)
    useEffect(() => {
        loginState === AsyncState.success && dispatch(getMyself())
    }, [loginState, dispatch, redirect])
}
