import { ChatMessage } from './chat'
import { GlobalMapMessage, MapMessage } from './map'
import {
    AddMessage,
    ClearMessage,
    DeleteMessage,
    RefreshMessage, UpdateAndSaveMessage,
    UpdateAndStartMessage,
    UpdateMessage
} from './tabletop'
import { ConnectedUser } from './user'

export enum SocketMessageType {
    Connect = 'connect',
    Disconnect = 'disconnect',
    Chat = 'chat',
    GlobalMap = 'global_map',
    Map = 'map',
    Clear = 'clear',
    Refresh = 'refresh',
    Add = 'add',
    Update = 'update',
    UpdateAndStart = 'update_and_start',
    UpdateAndSave = 'Update_and_save',
    Delete = 'delete'
}

export type SocketMessage =
    | ConnectMessage
    | DisconnectMessage
    | ChatMessage
    | GlobalMapMessage
    | MapMessage
    | ClearMessage
    | RefreshMessage
    | UpdateMessage
    | UpdateAndStartMessage
    | UpdateAndSaveMessage
    | DeleteMessage
    | AddMessage

export interface SocketMessageBase {
    type: SocketMessageType
    meta?: any
}

export interface DisconnectMessage extends SocketMessageBase {
    type: SocketMessageType.Disconnect
    meta: number
}

export interface ConnectMessage extends SocketMessageBase {
    type: SocketMessageType.Connect
    meta: ConnectedUser
}
