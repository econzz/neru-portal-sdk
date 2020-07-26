import { SAVE_DATA_KEY, SAVE_VERSION } from "../const";
import { SAVE_DATA, PLAYER } from "../types/NHPType";

export default class NHPStorageController{

    private _currentLocalData:SAVE_DATA;

    get currentLocalData(): SAVE_DATA {
        return this._currentLocalData;
    }
    set currentLocalData(value: SAVE_DATA) {
        this._currentLocalData = value;
    }

    private static instance:NHPStorageController = null; 

    // static method to create instance of Singleton class 
    static getInstance():NHPStorageController
    { 
        if (this.instance == null) 
            this.instance = new NHPStorageController(); 
  
        return this.instance; 
    } 
    constructor(){
        this.currentLocalData = {
            version:SAVE_VERSION,
            playerId:"",
            playerName:"",
            isFirstPlay:true,
        };
    }

    setPlayerInfo(player:PLAYER,isFirstPlay:boolean){
        this.currentLocalData.playerId = player.id;
        this.currentLocalData.playerName = player.name;
        this.currentLocalData.isFirstPlay = isFirstPlay;
        this.setSaveData();
    }

    setSaveData(){
        if(typeof(Storage) === "undefined"){
            return;
        }
        
        // Code for localStorage
        localStorage.setItem(SAVE_DATA_KEY,JSON.stringify(this.currentLocalData));
        
    }

    loadSaveData():SAVE_DATA{
        if(typeof(Storage) === "undefined"){
            return this.currentLocalData;
        }
        
        let saveData:any = JSON.parse(localStorage.getItem(SAVE_DATA_KEY));

        if(!saveData){
            return this.currentLocalData;
        }

        if(saveData.version != SAVE_VERSION){
            return this.currentLocalData;
        }

        this.currentLocalData.playerId = saveData.playerId;
        this.currentLocalData.playerName = saveData.playerName;
        this.currentLocalData.version = saveData.version;
        this.currentLocalData.isFirstPlay = saveData.isFirstPlay;

        return this.currentLocalData;
        
    }
}