import $ from "jquery";
import { PLAYER, RANKING } from "../types/NHPType";
import NHPLogin from "./NHPLogin";
import NHPRanking from "./NHPRanking";
var styleCommon = require("../../assets/css/common.css");
export default class NHPSceneController{
  private static instance:NHPSceneController = null; 
  
  // static method to create instance of Singleton class 
  static getInstance():NHPSceneController
  { 
      if (this.instance == null) 
          this.instance = new NHPSceneController(); 

      return this.instance; 
  } 

  private sceneDiv:any;
  private overlayDiv:any;

  private loginClass:NHPLogin;
  private rankingClass:NHPRanking;
  constructor(){
    if($( "#nhp-scene" ).length){//if div exists
      this.sceneDiv = $( "#nhp-scene" ); //use it
      return;
    }

    //if it is not existed, create and append to body
    this.sceneDiv = $("<div id='nhp-scene'/>");

    this.constructOverlay();

    this.sceneDiv.appendTo('body');

    this.loginClass = new NHPLogin();
    this.loginClass.loginSceneDiv.appendTo(this.sceneDiv);

    this.rankingClass = new NHPRanking();
    this.rankingClass.rankingSceneDiv.appendTo(this.sceneDiv);
  }

  constructOverlay(){
    if($( "#nhp-overlay" ).length){//if div exists
        this.overlayDiv = $( "#nhp-overlay" );
        return;
    }

    //if it is not existed, create and append to scenediv
    this.overlayDiv = $("<div id='nhp-overlay' class='"+styleCommon.overlay+"'/>");
    this.overlayDiv.appendTo(this.sceneDiv);
    this.overlayDiv.hide();//default hide
  }


  showFirstPlay(player:PLAYER,onClose:(updatedPlayer:PLAYER)=>void){
    
    this.loginClass.setData(player);
    this.loginClass.showRegisterNickName(true);
    this.loginClass.registerCallBackOnUpdateName(function(nickname:string){
      player.name = nickname;
      onClose(player);
    });
  }

  processLogin(player:PLAYER,onClose:(updatedPlayer:PLAYER)=>void){
    this.loginClass.setData(player);
    this.loginClass.showLoginPopup();
    this.loginClass.registerCallBackOnUpdateName(function(nickname:string){
      player.name = nickname;
      onClose(player);
    });
  }

  registerScore(score:number,rankData:RANKING,onClose:()=>void){
    this.rankingClass.showRanking(score,rankData);
  }
}