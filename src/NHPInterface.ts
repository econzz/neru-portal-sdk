import { PLAYER } from "./types/NHPType";

export default interface NHPInterface{

    //gameId set
    gameId:string;
    player:PLAYER;

    initialize:()=>void;
    startGame:()=>void;

    addScore:(score:number,name?:string)=>void;
    sendScore:(score:number,name?:string)=>void;
    getAlltimeLeaderboard:(pageNumber:number)=>void;
    registerPlayerName:(name:string)=>void;
    retrievePlayer:()=>void;
}