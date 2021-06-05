import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentGame } from '../../store/game/selectors'
import { getUrlWithoutProtocol } from '../../helpers/url'
import { connectGameError, connectGameSuccess, updateGameData } from '../../store/game/actions'
import { AuthRoutes } from '../../routes'
import { useLocation } from 'react-router-dom'
import { showErrorNotification } from '../../store/notifications/actions'
import { selectLoginState, selectQuickStartState } from '../../store/user/selectors'
import { AsyncState } from '../../store/user/reducer'

const WebSocketContext = createContext<WebSocketContextType>({
    init: false,
    socket: null,
    sendMessage: () => {}
})

export { WebSocketContext }

export interface WebSocketContextType {
    init: boolean
    socket: WebSocket | null
    sendMessage: Function
}

const WebSocketProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch()
    const game = useSelector(selectCurrentGame)
    const loginState = useSelector(selectLoginState)
    const quickStartState = useSelector(selectQuickStartState)
    const location = useLocation()

    const [socket, setSocket] = useState<WebSocket | null>(null)

    const sendMessage = useCallback((type: string, meta: any) => {
        if (socket) {
            console.info('[socket] Send message:', type, meta)
            socket.send(JSON.stringify({ type, meta }))
        }
    }, [socket])

    useEffect(() => {
        const isAuthorized = loginState === AsyncState.success || quickStartState === AsyncState.success

        if (isAuthorized && game && location && location.pathname.startsWith(AuthRoutes.tabletop)) {
            const newSocket = new WebSocket(`ws://${getUrlWithoutProtocol()}/ws/games/${game.invitation_code}`)

            newSocket.onopen = () => {
                console.info('[socket] WebSocket open')
                dispatch(connectGameSuccess())
                setSocket(newSocket)
            }

            newSocket.onmessage = (event: MessageEvent) => {
                console.info(`[socket] Message: ${event.data}`)
                try {
                    const data = JSON.parse(event.data)
                    data.type === 'error'
                        ? dispatch(showErrorNotification(data.meta))
                        : dispatch(updateGameData(data))
                } catch (error) {
                    console.log('[socket] Parse error:', event.data)
                }
            }

            newSocket.onclose = (event: CloseEvent) => {
                dispatch(connectGameError())

                console.log('event.code', event.code)
                if (event.code === 1006) {
                    dispatch(showErrorNotification('Игра не найдена'))
                }

                if (event.wasClean) {
                    console.info(`[socket] Соединение закрыто, код: ${event.code}, причина: ${event.reason}`)
                } else {
                    console.error('[socket] Соединение прервано')
                }
            }

            newSocket.onerror = (error: Event) => {
                console.error(`[socket-error] ${error}`)
            }
        }
    }, [game, dispatch, location, loginState, quickStartState])

    useEffect(() => {
        if (!game && socket) {
            socket.close(1000)
            setSocket(null)
        }
    }, [game, socket])

    const ws = useMemo<WebSocketContextType>(() => ({
        init: !!socket,
        socket: socket,
        sendMessage: sendMessage
    }), [sendMessage, socket])

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider