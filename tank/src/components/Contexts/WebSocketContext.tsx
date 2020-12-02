import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentGame } from '../../store/game/selectors'
import { getUrlWithoutProtocol } from '../../helpers/authHeader'
import { connectGameSuccess, disconnectGameError, updateGameData } from '../../store/game/actions'

const WebSocketContext = createContext({})
export { WebSocketContext }

const WebSocketProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch()
    const game = useSelector(selectCurrentGame)
    
    const [socket, setSocket] = useState<WebSocket | null>(null)

    const sendMessage = useCallback((type: string, meta: any) => {
        if (socket) {
            socket.send(JSON.stringify({ type, meta }))
        }
    }, [socket])

    useEffect(() => {
        if (game) {
            const newSocket = new WebSocket(`ws://${getUrlWithoutProtocol()}/ws/games/${game.invitation_code}`)

            newSocket.onopen = () => {
                console.info('[socket]: WebSocket open')
                dispatch(connectGameSuccess())
            }

            newSocket.onmessage = (event: MessageEvent) => {
                console.info(`[socket] Message: ${event.data}`)
                dispatch(updateGameData(JSON.parse(event.data)))
            }

            newSocket.onclose = (event: CloseEvent) => {
                dispatch(disconnectGameError())
                // 4404 - не найдено, 4404 -ошибка
                if (event.wasClean) {
                    console.info(`[socket] Соединение закрыто, код: ${event.code}, причина: ${event.reason}`)
                } else {
                    console.error('[socket] Соединение прервано')
                }
            }

            newSocket.onerror = (error: Event) => {
                console.error(`[socket-error] ${error}`)
            }

            setSocket(newSocket)
        }
    }, [game, dispatch])

    useEffect(() => {
        if (!game && socket) {
            socket.close(1000)
            setSocket(null)
        }
    }, [game, socket])

    const ws = useMemo(() => ({
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