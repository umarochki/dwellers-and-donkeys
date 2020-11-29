import React, { createContext } from 'react'
import io from 'socket.io-client'
// import { WS_BASE } from './config'
import { useDispatch } from 'react-redux'
// import { updateChatLog } from './actions'

const WebSocketContext = createContext({})

export { WebSocketContext }

const WebSocketProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch()

    const sendMessage = (roomId: string, message: any) => {
        const payload = {
            roomId: roomId,
            data: message
        }
        socket.emit('event://send-message', JSON.stringify(payload))
        // dispatch(updateChatLog(payload))
    }

    const socket = io('ws://example.com/my-namespace', {
        reconnectionDelayMax: 10000,
    })

    socket.on('event://get-message', (msg: any) => {
        const payload = JSON.parse(msg)
        // dispatch(updateChatLog(payload))
    })

    const ws = {
        socket: socket,
        sendMessage
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider