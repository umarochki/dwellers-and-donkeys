import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
// import { WS_BASE } from './config'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentGame } from '../../store/game/selectors'
import { getUrl } from '../../helpers/authHeader'
import Socket = SocketIOClient.Socket;
// import { updateChatLog } from './actions'

const WebSocketContext = createContext({})

export { WebSocketContext }

const WebSocketProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch()
    const game = useSelector(selectCurrentGame)
    
    const [socket, setSocket] = useState<Socket | null>(null)

    const sendMessage = useCallback((roomId: string, message: any) => {
        if (socket) {
            const payload = {
                roomId: roomId,
                data: message
            }
            socket.emit('message', JSON.stringify(payload))
            // dispatch(updateChatLog(payload))
        }
    }, [socket])

    useEffect(() => {
        if (game) {
            if (socket) {
                socket.disconnect()
            }

            const newSocket = io(`ws://${getUrl()}/ws/games/${game.invitation_code}`, {
                reconnectionDelayMax: 10000,
            })

            newSocket.on('event://get-message', (msg: any) => {
                const payload = JSON.parse(msg)
                // dispatch(updateChatLog(payload))
            })

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