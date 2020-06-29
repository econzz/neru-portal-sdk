import { PLAYER } from "./types/NHPType";

export default interface NHPInterface{

    gameId:string;

    player:PLAYER;

    initialize:()=>void;
    startGame:()=>void;
    sendScore:(name:string,score:number)=>void;
    getAlltimeLeaderboard:(pageNumber:number,totalPage:number)=>void;
}