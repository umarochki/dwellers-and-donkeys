import { SocketMessageBase, SocketMessageType } from './socket'

export interface ChatMessage extends SocketMessageBase {
    type: SocketMessageType.Chat
    meta: ChatMessagePayload
}

export enum ChatMessageType {
    Roll = 'roll',
    Message = 'message'
}

export interface ChatMessageBase {
    type: ChatMessageType
    time: string
    sender: string
}

interface ChatMessageMessage extends ChatMessageBase {
    type: ChatMessageType.Message
    message: string
}

interface ChatMessageRolls extends ChatMessageBase {
    type: ChatMessageType.Roll
    rolls: Dices
    total: number
}

export type ChatMessagePayload = ChatMessageMessage | ChatMessageRolls

enum RollType {
    D4 = 'd4',
    D6 = 'd6',
    D8 = 'd8',
    D10 = 'd10',
    D12 = 'd12',
    D20 = 'd20'
}

export type Dices = {
    [type in RollType]: number[]
}