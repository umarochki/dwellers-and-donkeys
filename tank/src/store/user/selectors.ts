import { RootState } from '../reducers'

export const selectLoginState = (state: RootState) => state.auth.loginState
export const selectSignupState = (state: RootState) => state.auth.signupState