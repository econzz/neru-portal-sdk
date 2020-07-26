export enum METHOD{
    POST,
    GET
}
export enum ERROR_CODE{
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    FORBIDDEN = 403
}

export interface ERROR{
    code:ERROR_CODE,
    message:string
}

export interface PLAYER{
    id:string,
    name:string
}

export interface SAVE_DATA{
    version:number,
    playerId:string,
    playerName:string,
    isFirstPlay:boolean
}

export enum ENVIRONMENT{
    LOCAL,
    DEVELOPMENT,
    LIVE
}

export interface RANKING{
    ranks:RANKING_DATA[],
    myPlayer:PLAYER
}

export interface RANKING_DATA{
    rank:number,
    player:PLAYER,
    score:number
}