import { RootState } from '../reducers'

export const selectLoginState = (state: RootState) => state.auth.loginState
export const selectSignupState = (state: RootState) => state.auth.signupState
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectQuickStartState = (state: RootState) => state.auth.quickStartState