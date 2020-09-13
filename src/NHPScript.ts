import NHPInterface from "./NHPInterface";
import { METHOD, PLAYER, ENVIRONMENT, ERROR_CODE, ERROR } from "./types/NHPType";
import {API_VERSION, CURRENT_ENV, LOCAL_SERVER_URL, DEV_SERVER_URL, LIVE_SERVER_URL, DEFAULT_PLAYER_NAME, SAVE_DATA_KEY, SAVE_DATA_KEY_LIVE } from "./const";
import NHPStorageController from "./LocalStorage/NHPStorageController";
import NHPLogin from "./Scene/NHPLogin";
import NHPSceneController from "./Scene/NHPSceneController";

var FingerPrint2 = require("fingerprintjs2");
export default class NHPScript implements NHPInterface{

    private currentUrl:string;

    private _gameId: string;
    get gameId(): string {
        return this._gameId;
    }
    set gameId(value: string) {
        this._gameId = value;
        window.NHPScript = this;
    }

    private _player: PLAYER;

    get player(): PLAYER {
        return this._player;
    }
    set player(value: PLAYER) {
        this._player = value;
        window.NHPScript = this;
    }

    constructor(){
        this.gameId="";
        this.player = {
            id:"",
            name:""
        }

        if(CURRENT_ENV == ENVIRONMENT.LOCAL){
            this.currentUrl = LOCAL_SERVER_URL;
        }
        else if(CURRENT_ENV == ENVIRONMENT.DEVELOPMENT){
            this.currentUrl = DEV_SERVER_URL;
        }
        else if(CURRENT_ENV == ENVIRONMENT.LIVE){
            this.currentUrl = LIVE_SERVER_URL;
            NHPStorageController.getInstance().saveKey = SAVE_DATA_KEY_LIVE;
        }
    }
    retrievePlayer: () => void;
    

    static log(toLog:any){
        console.log("%c ", "color: blue;",toLog); 
    }

    getGameIdFromElement(){
        var el: HTMLInputElement = <HTMLInputElement>parent.document.getElementById('game_id');//notsafe
        return el.value;
    }

    initialize(){
        return new Promise<any>((resolve,reject)=>{
            try{
                var self = this;
                
                this.gameId = this.getGameIdFromElement();
                NHPScript.log("INITIALIZE");
                NHPScript.log(this.gameId);

                NHPStorageController.getInstance().loadSaveData();

                //playerId is empty,not yet issued
                if(NHPStorageController.getInstance().currentLocalData.playerId === ""){
                    this.generatePlayerInfoFromBrowser(function(retrievedPlayerInfo:PLAYER){
                        self.player = retrievedPlayerInfo;
                        NHPScript.log("current local is not yet generated so make new one");
                        NHPScript.log(self.player);
                        NHPStorageController.getInstance().setPlayerInfo(self.player,true);
                        resolve({});
                    });
                    return;
                }


                //user player id and name from localstorage, if any
                this.player = this.getPlayer();
                resolve({});
                
            }
            catch(e){
                reject(e);
            }
            
            
        });
    }

    startGame(){
        return new Promise<any>((resolve,reject)=>{
            try{
                var self = this;
                NHPScript.log("STARTGAME");
                NHPScript.log(this.gameId);
                NHPScript.log(self.player);
                //first play
                if(NHPStorageController.getInstance().currentLocalData.isFirstPlay){
                    NHPScript.log("ISFIRSTPLAY");
                    NHPSceneController.getInstance().showFirstPlay(self.player,function(updatedPlayer:PLAYER){
                        self.registerPlayerName(updatedPlayer.name).then(function(){
                            
                            NHPStorageController.getInstance().setPlayerInfo(self.player,false);
                        }).catch(function(e){

                        });
                    });
                }
                else{
                    NHPScript.log("NOTFIRSTPLAY");
                    NHPSceneController.getInstance().processLogin(self.player,function(updatedPlayer:PLAYER){
                        self.registerPlayerName(updatedPlayer.name).then(function(){
                            NHPStorageController.getInstance().setPlayerInfo(self.player,false);
                        }).catch(function(e){
                            
                        });
                    });
                }

                

                resolve({});
                
            }
            catch(e){
                reject(e);
            }
            
        });
    }

    

    getPlayer(){
        //user player id and name from localstorage, if any
        this.player.id = NHPStorageController.getInstance().currentLocalData.playerId;
        this.player.name = NHPStorageController.getInstance().currentLocalData.playerName;

        return this.player;
    }

    addScore(score:number,name?:string){
        return new Promise<any>((resolve,reject)=>{
            
            if(!this.player.id)
                this.player = this.getPlayer();

            if(name)
                this.player.name = name;
            let requestParameter = {
                "player_id" : this.player.id,
                "player_name" : this.player.name,
                "score" : score
            };

            if(!this.gameId)
                this.getGameIdFromElement();

            var self = this;
            this.sendServer(METHOD.POST,this.gameId+"/add_score",requestParameter,function(isSucccess:boolean,responseData:any){
                if(isSucccess){
                    self.getAlltimeLeaderboard(1).then(function(responseData:any){
                        
                        NHPSceneController.getInstance().registerScore(score,{
                            ranks:responseData.ranks,
                            myPlayer:self.player
                        },function(){});
                    }).catch(function(e:ERROR){

                    });
                    resolve(responseData);
                }
                else{
                    reject(responseData);
                }
            });

            
        });
    }

    sendScore(score:number,name?:string){
        return new Promise<any>((resolve,reject)=>{
            NHPScript.log("sendScore");
            NHPScript.log(this.gameId);
            NHPScript.log(this.player);
            if(!this.player.id)
                this.player = this.getPlayer();

            if(!this.gameId)
                this.gameId = this.getGameIdFromElement();
            
            if(name)
                this.player.name = name;

            
            let requestParameter = {
                "player_id" : this.player.id,
                "player_name" : this.player.name,
                "score" : score
            };
            var self = this;
            this.sendServer(METHOD.POST,this.gameId+"/register_score",requestParameter,function(isSucccess:boolean,responseData:any){
                if(isSucccess){
                    self.getAlltimeLeaderboard(1).then(function(responseData:any){
                        
                        NHPSceneController.getInstance().registerScore(score,{
                            ranks:responseData.ranks,
                            myPlayer:self.player
                        },function(){});
                    }).catch(function(e:ERROR){

                    });
                    
                    resolve(responseData);
                }
                else{
                    reject(responseData);
                }
            });

            
        });
    }

    getAlltimeLeaderboard(pageNumber:number){
        return new Promise<any>((resolve,reject)=>{
            NHPScript.log("getAlltimeLeaderboard");
            NHPScript.log(this.gameId);
            NHPScript.log(this.player);
            if(!this.player.id)
                this.player = this.getPlayer();
            if(!this.gameId)
                this.gameId = this.getGameIdFromElement();

            this.sendServer(METHOD.GET,this.gameId+"/ranking_total/"+pageNumber,{},function(isSucccess:boolean,responseData:any){
                if(isSucccess){
                    resolve(responseData);
                }
                else{
                    reject(responseData);
                }
            });

            
        });
    }

    registerPlayerName(name:string){
        return new Promise<any>((resolve,reject)=>{
            NHPScript.log("registerPlayerName");
            NHPScript.log(this.gameId);
            NHPScript.log(this.player);

            if(!this.player.id)
                this.player = this.getPlayer();
            if(!this.gameId)
                this.gameId = this.getGameIdFromElement();

            let playerParameter = {
                player_name:name
            };
            var self = this;
            this.sendServer(METHOD.POST,"player/"+this.player.id,playerParameter,function(isSucccess:boolean,responseData:any){
                if(isSucccess){
                    self.player.name = name;
                    resolve(responseData);
                }
                else{
                    reject(responseData);
                }
            });

            
        });
    };

    sendServer(method:METHOD, path:string, parameter:any, onComplete:(isSucccess:boolean,responseData:any)=>void){
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            var msg;
            switch(xhr.readyState){
                // レスポンスボディを受信中（繰り返し実行される）
                case 3:
                    break; 
                    
                case 4:
                    var success = true;
                    var json:any = {};
                    // HTTP 200, 304（Not Modified)
                    if ((200 <= xhr.status && xhr.status < 300) || (xhr.status == 304)) {
                        json = JSON.parse(xhr.responseText);
                        if (typeof(json.errno) !== 'undefined') {
                            success = false;
                        }
                    }
                    // リクエスト失敗
                    else {
                        msg = "HTTP Error. Status Code:" + xhr.status; 
                        success = false;
                    }
                    
                    // HTTP Status
                    json.status = xhr.status;
                    
                    // 通知
                    onComplete(success, json);
                    break;
            }
        };
        let url:string = this.currentUrl+ "/api/"+ API_VERSION + "/" + path;
        if (method == METHOD.POST) {
            xhr.open('POST', url, true);
            // application/x-www-form-urlencoded; これをなくすと blocked by CORS policy エラーが出るので無くさない
            xhr.setRequestHeader( 'Content-Type', 'application/json;charset=utf-8');
            xhr.send(JSON.stringify(parameter));
            
        }
        else if(method == METHOD.GET){
            xhr.open('GET', url, true);
            xhr.send(null);
        }
    }

    generatePlayerInfoFromBrowser(onSuccess:(player:PLAYER)=>void){
        if (requestIdleCallback) {
            requestIdleCallback(function () {
                FingerPrint2.getV18(onSuccessRetrieval);
            })
        } else {
            setTimeout(function () {
                FingerPrint2.getV18(onSuccessRetrieval);
            }, 500)
        }

        function onSuccessRetrieval(result:any,components:any){
            onSuccess({
                id:result,
                name:DEFAULT_PLAYER_NAME
            });
        }
    }
    
    
}