import NHPInterface from "./NHPInterface";
import { METHOD, PLAYER, ENVIRONMENT, ERROR_CODE, ERROR } from "./types/NHPType";
import {API_VERSION, CURRENT_ENV, LOCAL_SERVER_URL, DEV_SERVER_URL, LIVE_SERVER_URL, DEFAULT_PLAYER_NAME } from "./const";
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
        }
    }
    retrievePlayer: () => void;
    

    log(toLog:string){
        console.log("%c "+toLog, "color: blue;"); 
    }

    initialize(){
        return new Promise<any>((resolve,reject)=>{
            try{
                var self = this;
                

                
                var el: HTMLInputElement = <HTMLInputElement>parent.document.getElementById('game_id');//notsafe
                self.gameId = el.value;
                NHPStorageController.getInstance().loadSaveData();

                //playerId is empty,not yet issued
                if(NHPStorageController.getInstance().currentLocalData.playerId === ""){
                    this.generatePlayerInfoFromBrowser(function(retrievedPlayerInfo:PLAYER){
                        self.player = retrievedPlayerInfo;
                        NHPStorageController.getInstance().setPlayerInfo(self.player,true);
                        resolve({});
                    });
                    return;
                }


                //user player id and name from localstorage, if any
                self.player.id = NHPStorageController.getInstance().currentLocalData.playerId;
                self.player.name = NHPStorageController.getInstance().currentLocalData.playerName;
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
                
                //first play
                if(NHPStorageController.getInstance().currentLocalData.isFirstPlay){
                    NHPSceneController.getInstance().showFirstPlay(self.player,function(updatedPlayer:PLAYER){
                        self.registerPlayerName(updatedPlayer.name).then(function(){
                            NHPStorageController.getInstance().setPlayerInfo(self.player,false);
                        }).catch(function(e){

                        });
                    });
                }
                else{
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

    addScore(score:number,name?:string){
        return new Promise<any>((resolve,reject)=>{
            if(name)
                this.player.name = name;
            let requestParameter = {
                "player_id" : this.player.id,
                "player_name" : this.player.name,
                "score" : score
            };
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