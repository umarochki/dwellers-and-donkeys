import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
// import { WS_BASE } from './config'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentGame } from '../../store/game/selectors'
import { getUrl } from '../../helpers/authHeader'
// import { updateChatLog } from './actions'

const WebSocketContext = createContext({})

export { WebSocketContext }

const WebSocketProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch()
    const game = useSelector(selectCurrentGame)
    
    const [socket, setSocket] = useState<any>(null)

    const sendMessage = useCallback((roomId: string, message: any) => {
        if (socket) {
            const payload = {
                roomId: roomId,
                data: message
            }
            socket.send('{"type": "delete", "meta": null}')
            // dispatch(updateChatLog(payload))
        }
    }, [socket])

    useEffect(() => {
        if (!game) {
            if (socket) {
                socket.disconnect()
            }

            const newSocket = new WebSocket(`ws://localhost/ws/games/D14532A23785`) // ${game.invitation_code}`

            newSocket.onmessage = function(event) {
                alert(`[message] Data received from server: ${event.data}`)
            }

            setSocket(newSocket)
        }
    }, [game])

    const ws = useMemo(() => ({
        init: !!socket,
        socket: socket,
        sendMessage
    }), [sendMessage, socket])

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider