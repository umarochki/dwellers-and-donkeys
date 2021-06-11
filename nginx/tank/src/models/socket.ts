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
    Delete = 'delete',

    draw_pencil_started = 'draw_pencil_started',
    draw_pencil_moved = 'draw_pencil_moved',
    draw_pencil_stopped = 'draw_pencil_stopped',

    draw_eraser_started = 'draw_eraser_started',
    draw_eraser_moved = 'draw_eraser_moved',
    draw_eraser_stopped = 'draw_eraser_stopped',

    draw_polygon_started = 'draw_polygon_started',
    draw_polygon_middle = 'draw_polygon_middle',
    draw_polygon_stopped = 'draw_polygon_stopped',
    draw_polygon_moved = 'draw_polygon_moved',
    draw_polygon_add = 'draw_polygon_add',
    region_obstacle_add = 'region_obstacle_add',

    toggle_night = 'toggle_night',
    toggle_rain = 'toggle_rain'
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
    | draw_pencil_startedMessage
    | draw_pencil_movedMessage
    | draw_pencil_stoppedMessage
    | draw_eraser_startedMessage
    | draw_eraser_movedMessage
    | draw_eraser_stoppedMessage
    | draw_polygon_startedMessage
    | draw_polygon_middleMessage
    | draw_polygon_stoppedMessage
    | draw_polygon_movedMessage
    | draw_polygon_addMessage
    | region_obstacle_addMessage
    | toggle_nightMessage
    | toggle_rainMessage

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

export interface draw_pencil_startedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_pencil_started
    meta: any
}
export interface draw_pencil_movedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_pencil_moved
    meta: any
}
export interface draw_pencil_stoppedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_pencil_stopped
    meta: any
}
export interface draw_eraser_startedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_eraser_started
    meta: any
}
export interface draw_eraser_movedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_eraser_moved
    meta: any
}
export interface draw_eraser_stoppedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_eraser_stopped
    meta: any
}
export interface draw_polygon_startedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_polygon_started
    meta: any
}
export interface draw_polygon_middleMessage extends SocketMessageBase {
    type: SocketMessageType.draw_polygon_middle
    meta: any
}
export interface draw_polygon_stoppedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_polygon_stopped
    meta: any
}
export interface draw_polygon_movedMessage extends SocketMessageBase {
    type: SocketMessageType.draw_polygon_moved
    meta: any
}
export interface draw_polygon_addMessage extends SocketMessageBase {
    type: SocketMessageType.draw_polygon_add
    meta: any
}
export interface region_obstacle_addMessage extends SocketMessageBase {
    type: SocketMessageType.region_obstacle_add
    meta: any
}

export interface toggle_nightMessage extends SocketMessageBase {
    type: SocketMessageType.toggle_night
    meta: any
}
export interface toggle_rainMessage extends SocketMessageBase {
    type: SocketMessageType.toggle_rain
    meta: any
}